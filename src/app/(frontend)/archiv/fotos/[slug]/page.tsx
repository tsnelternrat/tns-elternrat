import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { Galerie } from '@/components/Galerie'
import { alsListe, bildUrl, datum, payloadClient } from '@/lib/data'
import type { Media } from '@/payload-types'
import { Seite } from '@/components/Seite'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const ladeGalerie = cache(async (slug: string) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'galerien', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return docs[0] ?? null
})

export async function generateStaticParams() {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'galerien', limit: 200, depth: 0 })
  return docs.filter((d) => d.slug).map((d) => ({ slug: d.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const galerie = await ladeGalerie((await params).slug)
  return { title: galerie?.titel ?? 'Fotos' }
}

export default async function GalerieSeite({ params }: Props) {
  const galerie = await ladeGalerie((await params).slug)
  if (!galerie) notFound()
  const bilder = alsListe<Media>(galerie.bilder).flatMap((b) => {
    const gross = bildUrl(b, 'mittel')
    const thumb = bildUrl(b, 'thumb')
    return gross && thumb ? [{ gross, thumb, alt: b.alt ?? '' }] : []
  })

  return (
    <Seite>
      <p className="pfad">
        <Link href="/archiv/fotos" transitionTypes={['zurueck']}>
          ← Alle Fotos
        </Link>
      </p>
      <h1>{galerie.titel}</h1>
      <p className="marke">
        {datum(galerie.datum, 'monat')} · {bilder.length} Bilder
      </p>
      <Galerie bilder={bilder} uebergang={`galerie-${galerie.slug}`} />
    </Seite>
  )
}
