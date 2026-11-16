/** Alle Texte als Klartext ausgeben. Nach scripts/_texte-lesen.ts kopieren: pnpm payload run scripts/_texte-lesen.ts */
import { getPayload } from 'payload'

import config from '../src/payload.config'

const txt = (n: any): string =>
  !n || typeof n !== 'object'
    ? (n ?? '')
    : n.type === 'link'
      ? `[${n.children.map(txt).join('')}](${n.fields?.url ?? n.fields?.doc?.value})`
      : n.type === 'linebreak'
        ? '\n'
        : (n.text ?? (n.children ?? (n.root ? [n.root] : [])).map(txt).join(n.type === 'root' ? '\n\n' : ''))

const walk = (o: any, pfad: string) => {
  if (!o || typeof o !== 'object') {
    if (typeof o === 'string' && o.length > 25 && /\s/.test(o)) console.log(`${pfad}: ${o}`)
    return
  }
  if (o.root) return console.log(`${pfad}:\n${txt(o)}\n`)
  for (const [k, v] of Object.entries(o)) walk(v, `${pfad}.${k}`)
}

const p = await getPayload({ config })
for (const a of (await p.find({ collection: 'arbeitsgruppen', limit: 100, depth: 0, sort: 'reihenfolge' })).docs)
  walk({ name: a.name, beschreibung: a.beschreibung, details: a.details }, `ag[${a.id}]`)
walk(await p.findGlobal({ slug: 'startseite', depth: 0 }), 'startseite')
for (const s of (await p.find({ collection: 'seiten', limit: 100, depth: 0 })).docs) walk(s.inhalt, `seite[${s.slug}]`)
walk(await p.findGlobal({ slug: 'elternrat', depth: 0 }), 'elternrat')
process.exit(0)
