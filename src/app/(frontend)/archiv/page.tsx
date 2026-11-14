import type { Metadata } from 'next'

import { Bloecke } from '@/components/bloecke/Bloecke'
import { ArchivTeaser } from '@/components/bloecke/Teaser'
import { Seite } from '@/components/Seite'
import { payloadClient } from '@/lib/data'

export const revalidate = false
export const metadata: Metadata = { title: 'Archiv' }

export default async function ArchivSeite() {
  const payload = await payloadClient()
  const texte = await payload.findGlobal({ slug: 'texte', depth: 2 })
  return (
    <Seite>
      <h1>Archiv</h1>
      <ArchivTeaser blockType="archiv" />
      <Bloecke bloecke={texte.archivZusatz} />
    </Seite>
  )
}
