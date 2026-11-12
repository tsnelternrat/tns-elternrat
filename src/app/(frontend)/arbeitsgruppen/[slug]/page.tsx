import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { DownloadListe } from '@/components/Download'
import { Text } from '@/components/Text'
import { alsListe, payloadClient, youtubeId } from '@/lib/data'
import type { Dokumente } from '@/payload-types'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const ladeAg = cache(async (slug: string) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'arbeitsgruppen', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return docs[0] ?? null
})

export async function generateStaticParams() {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'arbeitsgruppen', limit: 100, depth: 0 })
  return docs.filter((d) => d.slug).map((d) => ({ slug: d.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ag = await ladeAg((await params).slug)
  return { title: ag?.name ?? 'Arbeitsgruppe' }
}

export default async function ArbeitsgruppeSeite({ params }: Props) {
  const ag = await ladeAg((await params).slug)
  if (!ag) notFound()
  const dokumente = alsListe<Dokumente>(ag.dokumente)
  const videos = (ag.videos ?? []).map((v) => ({ ...v, yt: youtubeId(v.url) })).filter((v) => v.yt)

  return (
    <article className="schmal">
      <p className="pfad">
        <Link href="/arbeitsgruppen">← Alle Arbeitsgruppen</Link>
      </p>
      <h1>{ag.name}</h1>
      <Text inhalt={ag.beschreibung} className="gross" />
      <Text inhalt={ag.details} />
      {dokumente.length > 0 && (
        <>
          <h2>Dokumente</h2>
          <DownloadListe dateien={dokumente} />
        </>
      )}
      {videos.length > 0 && (
        <>
          <h2>Videos</h2>
          <div className="videos">
            {videos.map((v) => (
              <iframe
                key={v.id}
                src={`https://www.youtube-nocookie.com/embed/${v.yt}`}
                title={v.titel || 'Video'}
                loading="lazy"
                allow="encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ))}
          </div>
        </>
      )}
    </article>
  )
}
