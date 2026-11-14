/**
 * Rechnet die Bildgrössen «thumb» und «mittel» bestehender Bilder in WebP um, mit denselben
 * Einstellungen wie Payload bei neuen Uploads (src/collections/Media.ts). Die Originale bleiben.
 *
 *   pnpm webp --probe <ordner>       nur ansehen: erste 5 Bilder lokal nach <ordner> schreiben
 *   pnpm webp [--prod]               umrechnen, in den Blob-Store laden, Datenbank anpassen
 *   pnpm webp --aufraeumen [--prod]  danach: alte JPEG-Grössen aus dem Blob-Store löschen
 *
 * Braucht ein gültiges BLOB_READ_WRITE_TOKEN. Die Liste der alten Dateien steht in
 * backups/webp-alte-dateien.txt. Danach die Website neu erzeugen (Deploy), die Seiten sind statisch.
 */
import { del, put } from '@vercel/blob'
import fs from 'fs/promises'
import path from 'path'
import { getPayload } from 'payload'
import sharp from 'sharp'

import { webp } from '../src/collections/Media'
import config from '../src/payload.config'

process.env.PAYLOAD_SKIP_REVALIDATE = 'true'

const args = process.argv.slice(2)
const datenbank = process.env.DATABASE_URL ?? ''
const lokal = /@(localhost|127\.0\.0\.1)[:/]/.test(datenbank)
const token = process.env.BLOB_READ_WRITE_TOKEN
const ALTE_DATEIEN = path.resolve('backups/webp-alte-dateien.txt')
const probe = args.includes('--probe') ? args[args.indexOf('--probe') + 1] : null

type Groesse = { filename: string; filesize: number; width: number; height: number }

/** Wie Payload: EXIF-Drehung anwenden, thumb mittig auf 480×480 zuschneiden, mittel auf 1200 breit. */
async function groessen(original: Buffer, name: string) {
  const basis = name.replace(/\.[^.]+$/, '')
  const bild = () => sharp(original).rotate()
  const erzeugt = await Promise.all([
    bild()
      .resize(480, 480, { fit: 'cover' })
      .webp(webp.options)
      .toBuffer({ resolveWithObject: true }),
    bild()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp(webp.options)
      .toBuffer({ resolveWithObject: true }),
  ])
  return erzeugt.map(({ data, info }) => ({
    data,
    groesse: {
      filename: `${basis}-${info.width}x${info.height}.webp`,
      filesize: data.length,
      width: info.width,
      height: info.height,
    } satisfies Groesse,
  }))
}

async function main() {
  if (!lokal && !args.includes('--prod')) {
    console.error(
      'DATABASE_URL zeigt nicht auf die lokale Datenbank. Für Prod ausdrücklich --prod angeben.',
    )
    process.exit(1)
  }

  if (args.includes('--aufraeumen')) {
    const urls = (await fs.readFile(ALTE_DATEIEN, 'utf8')).split('\n').filter(Boolean)
    for (let i = 0; i < urls.length; i += 100) await del(urls.slice(i, i + 100), { token })
    console.log(`${urls.length} alte Dateien gelöscht.`)
    process.exit(0)
  }

  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'media', pagination: false, depth: 0 })
  const offen = docs.filter((d) => d.sizes?.thumb?.mimeType !== 'image/webp' && d.url && d.filename)
  console.log(`${offen.length} von ${docs.length} Bildern umzurechnen.`)

  if (probe) {
    await fs.mkdir(probe, { recursive: true })
    for (const d of offen.slice(0, 5)) {
      const original = Buffer.from(await (await fetch(d.url!)).arrayBuffer())
      for (const { data, groesse } of await groessen(original, d.filename!)) {
        await fs.writeFile(path.join(probe, groesse.filename), data)
        const alt = groesse.width === 480 ? d.sizes?.thumb : d.sizes?.mittel
        console.log(
          `${groesse.filename}: ${Math.round(groesse.filesize / 1024)} kB (vorher ${Math.round((alt?.filesize ?? 0) / 1024)} kB, ${alt?.width}×${alt?.height})`,
        )
      }
    }
    process.exit(0)
  }

  if (!token?.match(/^vercel_blob_rw_[a-z\d]+_[a-z\d]+$/i) || token.endsWith('_nurlesen')) {
    console.error('Kein gültiges BLOB_READ_WRITE_TOKEN.')
    process.exit(1)
  }

  await fs.mkdir(path.dirname(ALTE_DATEIEN), { recursive: true })
  let vorher = 0
  let nachher = 0
  for (const d of offen) {
    const original = Buffer.from(await (await fetch(d.url!)).arrayBuffer())
    const [thumb, mittel] = await groessen(original, d.filename!)
    for (const { data, groesse } of [thumb, mittel]) {
      await put(groesse.filename, data, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 60 * 60 * 24 * 365,
        contentType: 'image/webp',
        token,
      })
    }
    const eintrag = ({ groesse }: { groesse: Groesse }) => ({
      ...groesse,
      mimeType: 'image/webp',
      url: `/api/media/file/${groesse.filename}`,
    })
    await payload.db.updateOne({
      collection: 'media',
      id: d.id,
      data: { sizes: { thumb: eintrag(thumb), mittel: eintrag(mittel) } },
    })
    // Alte Dateien erst nach erfolgreicher Umstellung vormerken; gelöscht wird mit --aufraeumen.
    const alt = [d.sizes?.thumb, d.sizes?.mittel].filter((s) => s?.url && s.filename)
    await fs.appendFile(ALTE_DATEIEN, alt.map((s) => `${s!.url}\n`).join(''))
    vorher += (d.sizes?.thumb?.filesize ?? 0) + (d.sizes?.mittel?.filesize ?? 0)
    nachher += thumb.groesse.filesize + mittel.groesse.filesize
    console.log(`${d.filename}: ${thumb.groesse.filename}, ${mittel.groesse.filename}`)
  }
  const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`
  console.log(
    `Fertig: ${offen.length} Bilder, Grössen vorher ${mb(vorher)}, nachher ${mb(nachher)}.`,
  )
  process.exit(0)
}

// Top-Level-await: `payload run` beendet den Prozess, sobald das Modul geladen ist.
try {
  await main()
} catch (fehler) {
  console.error(fehler)
  process.exit(1)
}
