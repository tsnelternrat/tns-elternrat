import type { Metadata } from 'next'
import Link from 'next/link'

import { alsDokument, bildUrl, datum, payloadClient } from '@/lib/data'
import type { Media } from '@/payload-types'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Fotos' }

export default async function FotosSeite() {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'galerien', sort: '-datum', limit: 200, depth: 1 })

  return (
    <>
      <p className="pfad">
        <Link href="/archiv">← Archiv</Link>
      </p>
      <h1>Fotos</h1>
      <div className="karten">
        {docs.map((g) => {
          const titelbild = bildUrl(alsDokument<Media>(g.bilder?.[0]), 'thumb')
          return (
            <Link href={`/archiv/fotos/${g.slug}`} className="karte karte-link" key={g.id}>
              {titelbild && <img className="karte-bild" src={titelbild} alt="" loading="lazy" />}
              <h2>{g.titel}</h2>
              <p className="marke">
                {datum(g.datum, 'monat')} · {g.bilder?.length ?? 0} Bilder
              </p>
            </Link>
          )
        })}
      </div>
    </>
  )
}
