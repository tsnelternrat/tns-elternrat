import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { Bloecke } from '@/components/bloecke/Bloecke'
import { Seite } from '@/components/Seite'
import { payloadClient } from '@/lib/data'
import { standardAdressen, standardSeite } from '@/lib/standardSeiten'

/**
 * Alle aus Blöcken gebauten Seiten (Collection «Seiten») unter /adresse, auch Elternrat, Arbeitsgruppen,
 * Archiv und Elternbox. Fehlt für eine dieser vier der Eintrag, wird die Vorlage aus standardSeiten.ts
 * gezeigt. Alles andere ergibt die eigene «Nicht gefunden»-Seite.
 *
 * Bekannte Seiten werden beim Build erzeugt. Neu angelegte entstehen beim ersten Aufruf und bleiben
 * dann statisch, bis im Admin etwas geändert wird (src/hooks/revalidate.ts). Unbekannte Adressen
 * kosten einmal eine Datenbankabfrage; das Ergebnis «nicht gefunden» wird ebenfalls zwischengespeichert.
 */
export const revalidate = false
export const dynamicParams = true

type Props = { params: Promise<{ rest: string[] }> }

const ladeSeite = cache(async (pfad: string[]) => {
  if (pfad.length !== 1) return null
  const slug = decodeURIComponent(pfad[0])
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'seiten',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  if (docs[0]) return docs[0]
  if (!(standardAdressen as readonly string[]).includes(slug)) return null
  const [elternrat, texte] = await Promise.all([
    payload.findGlobal({ slug: 'elternrat', depth: 2 }),
    payload.findGlobal({ slug: 'texte', depth: 2 }),
  ])
  return standardSeite(slug, { elternrat, texte })
})

export async function generateStaticParams() {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'seiten',
    limit: 200,
    depth: 0,
    select: { slug: true },
  })
  const slugs = new Set([...standardAdressen, ...docs.flatMap((d) => (d.slug ? [d.slug] : []))])
  return [...slugs].map((slug) => ({ rest: [slug] }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seite = await ladeSeite((await params).rest)
  return seite
    ? { title: seite.navigationsTitel || seite.titel, description: seite.beschreibung ?? undefined }
    : {}
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
