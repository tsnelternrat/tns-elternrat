import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { Bloecke } from '@/components/bloecke/Bloecke'
import { Seite } from '@/components/Seite'
import { payloadClient } from '@/lib/data'
import { standardAdressen, standardSeite } from '@/lib/standardSeiten'

/**
 * Alle aus Blöcken gebauten Seiten (Collection «Seiten»), auch Unterseiten wie /archiv/protokolle.
 * Fehlt für eine Standardseite der Eintrag, wird die Vorlage aus standardSeiten.ts gezeigt.
 * Alles andere ergibt die eigene «Nicht gefunden»-Seite.
 *
 * Bekannte Seiten werden beim Build erzeugt. Neu angelegte entstehen beim ersten Aufruf und bleiben
 * dann statisch, bis im Admin etwas geändert wird (src/hooks/revalidate.ts). Unbekannte Adressen
 * kosten einmal eine Datenbankabfrage; das Ergebnis «nicht gefunden» wird ebenfalls zwischengespeichert.
 */
export const revalidate = false
export const dynamicParams = true

type Props = { params: Promise<{ rest: string[] }> }

const ladeSeite = cache(async (slug: string) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'seiten',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? standardSeite(slug)
})

const slugAus = (rest: string[]) => rest.map(decodeURIComponent).join('/')

export async function generateStaticParams() {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'seiten',
    limit: 200,
    depth: 0,
    select: { slug: true },
  })
  const slugs = new Set<string>([
    ...standardAdressen,
    ...docs.flatMap((d) => (d.slug ? [d.slug] : [])),
  ])
  return [...slugs].map((slug) => ({ rest: slug.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seite = await ladeSeite(slugAus((await params).rest))
  return seite
    ? {
        title: seite.navigationsTitel || seite.titel,
        // Nur mit Text setzen: auch «description: undefined» verdrängt die Standardbeschreibung aus dem Layout.
        ...(seite.beschreibung ? { description: seite.beschreibung } : {}),
      }
    : {}
}

export default async function FreieSeite({ params }: Props) {
  const slug = slugAus((await params).rest)
  const seite = await ladeSeite(slug)
  if (!seite) notFound()
  // Unterseiten verlinken zurück auf die übergeordnete Seite, z. B. /archiv/protokolle → /archiv.
  const elternSlug = slug.includes('/') ? slug.slice(0, slug.lastIndexOf('/')) : null
  const eltern = elternSlug ? await ladeSeite(elternSlug) : null

  return (
    <Seite>
      {eltern && (
        <p className="pfad">
          <Link href={`/${elternSlug}`} transitionTypes={['zurueck']}>
            ← {eltern.navigationsTitel || eltern.titel}
          </Link>
        </p>
      )}
      {seite.titelZeigen !== false && <h1>{seite.titel}</h1>}
      <Bloecke bloecke={seite.inhalt} />
    </Seite>
  )
}
