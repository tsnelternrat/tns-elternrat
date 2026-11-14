/**
 * Führt die Datenbank-Migrationen aus (src/migrations), ohne interaktive Rückfrage.
 *
 *   pnpm migrate                    offene Migrationen ausführen (nur lokale DB)
 *   pnpm migrate --prod             dasselbe gegen eine andere DB, z. B. Prod (läuft im Vercel-Build automatisch)
 *   pnpm migrate --baseline [--prod]
 *       Einmalig für eine Datenbank, deren Schema bisher per «push» entstanden ist (so wie Prod bis Nov. 2026):
 *       markiert die Baseline-Migration als ausgeführt, ohne sie laufen zu lassen, und entfernt den «dev»-Eintrag.
 *
 * Neue Migration nach einer Feldänderung: pnpm payload migrate:create <name>
 */
import { getPayload, type Migration } from 'payload'

import { migrations } from '../src/migrations'
import config from '../src/payload.config'

process.env.PAYLOAD_SKIP_REVALIDATE = 'true'

const args = new Set(process.argv.slice(2))
const datenbank = process.env.DATABASE_URL ?? ''
const lokal = /@(localhost|127\.0\.0\.1)[:/]/.test(datenbank)
const host = datenbank.match(/@([^:/]+)/)?.[1] ?? 'unbekannt'
const BASELINE = migrations[0].name

async function main() {
  if (!lokal && !args.has('--prod')) {
    console.error(
      `DATABASE_URL zeigt auf ${host}, nicht auf die lokale Datenbank. Für Prod ausdrücklich --prod angeben.`,
    )
    process.exit(1)
  }
  const payload = await getPayload({ config })
  const { docs: gelaufen } = await payload.find({
    collection: 'payload-migrations',
    limit: 0,
    depth: 0,
  })
  const devEintraege = gelaufen.filter((m) => m.batch === -1)

  if (args.has('--baseline')) {
    if (gelaufen.some((m) => m.name === BASELINE)) {
      console.log(`Baseline ${BASELINE} ist auf ${host} schon eingetragen.`)
    } else {
      // Die Baseline beschreibt das Schema vor den Blöcken. Fehlt die Tabelle «users», ist die DB leer
      // und die Baseline muss richtig laufen: dann ohne --baseline aufrufen.
      const { totalDocs } = await payload
        .count({ collection: 'users' })
        .catch(() => ({ totalDocs: -1 }))
      if (totalDocs < 0) {
        console.error('Die Datenbank hat noch kein Schema. Ohne --baseline aufrufen.')
        process.exit(1)
      }
      for (const m of devEintraege)
        await payload.delete({ collection: 'payload-migrations', id: m.id })
      await payload.create({ collection: 'payload-migrations', data: { name: BASELINE, batch: 1 } })
      console.log(`Baseline ${BASELINE} auf ${host} als ausgeführt markiert.`)
    }
    process.exit(0)
  }

  if (devEintraege.length) {
    console.error(
      `Auf ${host} wurde das Schema per «push» angepasst (Eintrag «dev» in payload_migrations).\n` +
        'Migrationen würden dann auf ein unbekanntes Schema treffen. Einmalig mit --baseline markieren, falls\n' +
        'das Schema dem Stand der Baseline entspricht; sonst die lokale DB mit pnpm db:kopie neu aufsetzen.',
    )
    process.exit(1)
  }

  const offen = migrations.filter((m) => !gelaufen.some((g) => g.name === m.name))
  if (!offen.length) {
    console.log(`Keine offenen Migrationen auf ${host}.`)
    process.exit(0)
  }
  console.log(`Migrationen auf ${host}: ${offen.map((m) => m.name).join(', ')}`)
  // Die generierten Migrationen sind enger typisiert als die allgemeine Signatur von migrate().
  await payload.db.migrate({ migrations: offen as unknown as Migration[] })
  process.exit(0)
}

// Top-Level-await: `payload run` beendet den Prozess, sobald das Modul geladen ist.
try {
  await main()
} catch (fehler) {
  console.error(fehler)
  process.exit(1)
}
