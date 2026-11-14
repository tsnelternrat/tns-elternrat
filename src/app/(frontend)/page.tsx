import { Bloecke } from '@/components/bloecke/Bloecke'
import { Seite } from '@/components/Seite'
import { payloadClient } from '@/lib/data'
import { standardStartseite } from '@/lib/standardStartseite'

export const revalidate = false

export default async function Startseite() {
  const payload = await payloadClient()
  const seite = await payload.findGlobal({ slug: 'startseite', depth: 2 })
  const bloecke = seite.inhalt?.length ? seite.inhalt : standardStartseite(seite)

  return (
    <Seite>
      <Bloecke bloecke={bloecke} />
    </Seite>
  )
}
