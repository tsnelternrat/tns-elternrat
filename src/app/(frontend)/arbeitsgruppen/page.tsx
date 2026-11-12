import type { Metadata } from 'next'
import Link from 'next/link'

import { Text } from '@/components/Text'
import { hatDetailseite, payloadClient } from '@/lib/data'
import { Seite } from '@/components/Seite'

export const revalidate = false
export const metadata: Metadata = { title: 'Arbeitsgruppen' }

export default async function ArbeitsgruppenSeite() {
  const payload = await payloadClient()
  const [texte, ags] = await Promise.all([
    payload.findGlobal({ slug: 'texte', depth: 0 }),
    payload.find({ collection: 'arbeitsgruppen', sort: 'reihenfolge', limit: 100, depth: 0 }),
  ])

  return (
    <Seite>
      <h1>Arbeitsgruppen</h1>
      <Text inhalt={texte.arbeitsgruppenEinleitung} className="gross schmal" />
      <div className="karten karten-zwei">
        {ags.docs.map((ag) => (
          <article className="karte" key={ag.id} id={ag.slug ?? undefined}>
            {ag.ruhend && <p className="marke">Zurzeit ruhend</p>}
            <h2>{ag.name}</h2>
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
      <p className="hinweis">
        Möchten Sie in einer Arbeitsgruppe mitmachen? <Link href="/elternbox">Schreiben Sie uns in die Elternbox.</Link>
      </p>
    </Seite>
  )
}
