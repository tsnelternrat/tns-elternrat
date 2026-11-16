/**
 * Texte gesammelt anpassen. Nach scripts/_texte-anpassen.ts kopieren und füllen.
 *   lokal: pnpm payload run scripts/_texte-anpassen.ts
 *   prod:  DATABASE_URL="<prod>" pnpm payload run scripts/_texte-anpassen.ts -- --prod
 */
import { getPayload } from 'payload'

import { absatz } from '../src/lib/lexical'
import config from '../src/payload.config'

process.env.PAYLOAD_SKIP_REVALIDATE = 'true'
const lokal = /@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL ?? '')
if (!lokal && !process.argv.includes('--prod')) throw new Error('Nicht lokal: --prod angeben.')

type Teil = Parameters<typeof absatz>[number]
/** Mehrere Absätze zu einem Lexical-Dokument; Teile { text, url } werden Links. */
const absaetze = (...a: Teil[][]) => {
  const r = absatz()
  r.root.children = a.map((t) => absatz(...t).root.children[0])
  return r
}

/** AG-Beschreibungen ganz neu schreiben: AG-ID → Absätze. */
const neu: Record<number, Teil[][]> = {
  // 4: [['Die AG Sommerabend …', { text: 'Elternbox', url: '/elternbox' }, '.']],
}

/** Ersetzungen in allen Textknoten von Startseite, Seiten und AG-Feldern. */
const ersetzungen: [string | RegExp, string][] = [
  // ['alter Satz', 'neuer Satz'],
  // [/(\w)Innen\b/g, '$1*innen'],
]

let treffer = 0
const ersetze = (o: any): any => {
  if (Array.isArray(o)) return o.map(ersetze)
  if (!o || typeof o !== 'object') return o
  const n: any = {}
  for (const [k, v] of Object.entries(o)) {
    if (k === 'text' && typeof v === 'string') {
      let t = v
      for (const [a, b] of ersetzungen) t = t.replace(a as any, b)
      if (t !== v) {
        treffer++
        console.log(`  «${v.slice(0, 80)}» → «${t.slice(0, 80)}»`)
      }
      n[k] = t
    } else n[k] = ersetze(v)
  }
  return n
}
/** Speichert nur, wenn sich etwas geändert hat. */
const geaendert = async (f: () => any, speichern: (d: any) => Promise<unknown>) => {
  const vorher = treffer
  const d = f()
  if (treffer > vorher) await speichern(d)
}

const payload = await getPayload({ config })

for (const [id, text] of Object.entries(neu)) {
  await payload.update({ collection: 'arbeitsgruppen', id: Number(id), data: { beschreibung: absaetze(...text) } as any })
  console.log(`AG ${id} neu geschrieben`)
}
for (const a of (await payload.find({ collection: 'arbeitsgruppen', limit: 100, depth: 0 })).docs)
  await geaendert(
    () => ({ beschreibung: ersetze(a.beschreibung), details: ersetze(a.details) }),
    (data) => payload.update({ collection: 'arbeitsgruppen', id: a.id, data }),
  )
const start = await payload.findGlobal({ slug: 'startseite', depth: 0 })
await geaendert(
  () => ({ inhalt: ersetze(start.inhalt) }),
  (data) => payload.updateGlobal({ slug: 'startseite', data }),
)
for (const s of (await payload.find({ collection: 'seiten', limit: 100, depth: 0 })).docs)
  await geaendert(
    () => ({ inhalt: ersetze(s.inhalt) }),
    (data) => payload.update({ collection: 'seiten', id: s.id, data }),
  )

console.log(`${treffer} Textstellen ersetzt`)
process.exit(0)
