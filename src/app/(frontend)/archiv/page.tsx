import type { Metadata } from 'next'
import Link from 'next/link'

import { payloadClient } from '@/lib/data'
import { Seite } from '@/components/Seite'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Archiv' }

export default async function ArchivSeite() {
  const payload = await payloadClient()
  const [protokolle, bulletins, galerien] = await Promise.all([
    payload.count({ collection: 'protokolle' }),
    payload.count({ collection: 'bulletins' }),
    payload.count({ collection: 'galerien' }),
  ])
  const bereiche = [
    {
      href: '/archiv/protokolle',
      titel: 'Protokolle',
      text: 'Was an den Sitzungen des Elternrats besprochen wurde.',
      anzahl: `${protokolle.totalDocs} Protokolle`,
    },
    {
      href: '/archiv/bulletins',
      titel: 'Bulletins',
      text: 'Das Heft des Elternrats mit Berichten und Bildern aus dem Schuljahr.',
      anzahl: `${bulletins.totalDocs} Ausgaben`,
    },
    {
      href: '/archiv/fotos',
      titel: 'Fotos',
      text: 'Eindrücke von Sommerfesten und anderen Anlässen.',
      anzahl: `${galerien.totalDocs} Galerien`,
    },
  ]
  return (
    <Seite>
      <h1>Archiv</h1>
      <div className="karten">
        {bereiche.map((b) => (
          <Link href={b.href} className="karte karte-link" key={b.href} transitionTypes={['vor']}>
            <p className="marke">{b.anzahl}</p>
            <h2>{b.titel}</h2>
            <p>{b.text}</p>
          </Link>
        ))}
      </div>
    </Seite>
  )
}
