import type { Metadata } from 'next'
import Link from 'next/link'
import { ViewTransition } from 'react'

import { alsDokument, bildUrl, datum, payloadClient } from '@/lib/data'
import type { Media } from '@/payload-types'
import { Seite } from '@/components/Seite'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Fotos' }

export default async function FotosSeite() {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'galerien', sort: '-datum', limit: 200, depth: 1 })

  return (
    <Seite>
      <p className="pfad">
        <Link href="/archiv" transitionTypes={['zurueck']}>
          ← Archiv
        </Link>
      </p>
      <h1>Fotos</h1>
      <div className="karten">
        {docs.map((g) => {
          const titelbild = bildUrl(alsDokument<Media>(g.bilder?.[0]), 'thumb')
          return (
            <Link
              href={`/archiv/fotos/${g.slug}`}
              className="karte karte-link"
              key={g.id}
              transitionTypes={['vor']}
            >
              {titelbild && (
                <ViewTransition name={`galerie-${g.slug}`} share="morph" default="none">
                  <img className="karte-bild" src={titelbild} alt="" loading="lazy" />
                </ViewTransition>
              )}
              <h2>{g.titel}</h2>
              <p className="marke">
                {datum(g.datum, 'monat')} · {g.bilder?.length ?? 0} Bilder
              </p>
            </Link>
          )
        })}
      </div>
    </Seite>
  )
}
