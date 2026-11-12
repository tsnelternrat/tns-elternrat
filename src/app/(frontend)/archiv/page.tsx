import type { Metadata } from 'next'
import Link from 'next/link'

import { Icon } from '@/components/Icon'
import { payloadClient } from '@/lib/data'
import type { IconName } from '@/lib/icons'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Archiv' }

export default async function ArchivSeite() {
  const payload = await payloadClient()
  const [protokolle, bulletins, galerien] = await Promise.all([
    payload.count({ collection: 'protokolle' }),
    payload.count({ collection: 'bulletins' }),
    payload.count({ collection: 'galerien' }),
  ])
  const bereiche: { href: string; titel: string; icon: IconName; text: string; anzahl: string }[] = [
    {
      href: '/archiv/protokolle',
      titel: 'Protokolle',
      icon: 'dokument',
      text: 'Was an den Sitzungen des Elternrats besprochen wurde.',
      anzahl: `${protokolle.totalDocs} Protokolle`,
    },
    {
      href: '/archiv/bulletins',
      titel: 'Bulletins',
      icon: 'heft',
      text: 'Das Heft des Elternrats mit Berichten und Bildern aus dem Schuljahr.',
      anzahl: `${bulletins.totalDocs} Ausgaben`,
    },
    {
      href: '/archiv/fotos',
      titel: 'Fotos',
      icon: 'foto',
      text: 'Eindrücke von Sommerfesten und anderen Anlässen.',
      anzahl: `${galerien.totalDocs} Galerien`,
    },
  ]
  return (
    <>
      <h1>Archiv</h1>
      <div className="karten">
        {bereiche.map((b) => (
          <Link href={b.href} className="karte karte-link" key={b.href}>
            <Icon name={b.icon} />
            <p className="marke">{b.anzahl}</p>
            <h2>{b.titel}</h2>
            <p>{b.text}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
