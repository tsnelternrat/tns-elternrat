import Link from 'next/link'

import { Formular } from '@/app/(frontend)/elternbox/Formular'
import { Text } from '@/components/Text'
import { hatDetailseite, payloadClient } from '@/lib/data'
import type { ArbeitsgruppenBlock, ElternboxBlock, PersonenBlock } from '@/payload-types'

/** Blöcke, deren Inhalt strukturiert in Globals oder Collections gepflegt wird. */

const stufen = [
  { wert: 'kg', titel: 'Kindergarten' },
  { wert: 'unterstufe', titel: '1.–3. Klasse' },
  { wert: 'mittelstufe', titel: '4.–6. Klasse' },
] as const

function Liste({
  eintraege,
}: {
  eintraege: { id?: string | null; links: string; rechts: string }[]
}) {
  return (
    <dl className="personen">
      {eintraege.map((e, i) => (
        <div key={e.id ?? i}>
          <dt>{e.links}</dt>
          <dd>{e.rechts}</dd>
        </div>
      ))}
    </dl>
  )
}

export async function Personen({ titel }: PersonenBlock) {
  const payload = await payloadClient()
  const er = await payload.findGlobal({ slug: 'elternrat', depth: 0 })
  const ueberschrift = (titel ?? '').replace('{schuljahr}', er.schuljahr)

  return (
    <section>
      {ueberschrift && <h2>{ueberschrift}</h2>}
      {Boolean(er.vorstand?.length) && (
        <>
          <h3>Vorstand</h3>
          <Liste
            eintraege={er.vorstand!.map((v) => ({ id: v.id, links: v.rolle, rechts: v.personen }))}
          />
        </>
      )}
      {stufen.map((stufe) => {
        const klassen = (er.klassen ?? []).filter((k) => k.stufe === stufe.wert)
        if (!klassen.length) return null
        return (
          <div key={stufe.wert}>
            <h3>Delegierte {stufe.titel}</h3>
            <Liste
              eintraege={klassen.map((k) => ({ id: k.id, links: k.klasse, rechts: k.delegierte }))}
            />
          </div>
        )
      })}
      {Boolean(er.weitere?.length) && (
        <>
          <h3>Weitere Aufgaben</h3>
          <Liste
            eintraege={er.weitere!.map((w) => ({ id: w.id, links: w.rolle, rechts: w.personen }))}
          />
        </>
      )}
    </section>
  )
}

export async function AlleArbeitsgruppen({ titel }: ArbeitsgruppenBlock) {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'arbeitsgruppen',
    sort: 'reihenfolge',
    limit: 100,
    depth: 0,
  })
  const Kopf = titel ? 'h3' : 'h2'
  return (
    <section>
      {titel && <h2>{titel}</h2>}
      <div className="karten karten-zwei">
        {docs.map((ag) => (
          <article className="karte" key={ag.id} id={ag.slug ?? undefined}>
            {ag.ruhend && <p className="marke">Zurzeit ruhend</p>}
            <Kopf>{ag.name}</Kopf>
            <Text inhalt={ag.beschreibung} />
            {ag.beteiligte && (
              <p className="beteiligte">
                <strong>Dabei:</strong> {ag.beteiligte}
              </p>
            )}
            {hatDetailseite(ag) && (
              <Link href={`/arbeitsgruppen/${ag.slug}`} transitionTypes={['vor']}>
                Mehr erfahren
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export function ElternboxFormular({ titel }: ElternboxBlock) {
  return (
    <section className="schmal">
      {titel && <h2>{titel}</h2>}
      <Formular />
    </section>
  )
}
