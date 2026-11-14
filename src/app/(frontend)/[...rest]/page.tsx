import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { Bloecke } from '@/components/bloecke/Bloecke'
import { Seite } from '@/components/Seite'
import { payloadClient } from '@/lib/data'

/**
 * Frei aus Blöcken gebaute Seiten (Collection «Seiten») unter /adresse. Alles andere ergibt die
 * eigene «Nicht gefunden»-Seite mit Kopf und Fuss.
 *
 * Bestehende Seiten werden beim Build erzeugt. Neu angelegte entstehen beim ersten Aufruf und bleiben
 * dann statisch, bis im Admin etwas geändert wird (src/hooks/revalidate.ts). Unbekannte Adressen
 * kosten einmal eine Datenbankabfrage; das Ergebnis «nicht gefunden» wird ebenfalls zwischengespeichert.
 */
export const revalidate = false
export const dynamicParams = true

type Props = { params: Promise<{ rest: string[] }> }

const ladeSeite = cache(async (pfad: string[]) => {
  if (pfad.length !== 1) return null
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'seiten',
    where: { slug: { equals: decodeURIComponent(pfad[0]) } },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})

export async function generateStaticParams() {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'seiten',
    limit: 200,
    depth: 0,
    select: { slug: true },
  })
  return docs.filter((d) => d.slug).map((d) => ({ rest: [d.slug!] }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seite = await ladeSeite((await params).rest)
  return seite ? { title: seite.titel, description: seite.beschreibung ?? undefined } : {}
}

export default async function FreieSeite({ params }: Props) {
  const seite = await ladeSeite((await params).rest)
  if (!seite) notFound()
  return (
    <Seite>
      {seite.titelZeigen !== false && <h1>{seite.titel}</h1>}
      <Bloecke bloecke={seite.inhalt} />
    </Seite>
  )
}
