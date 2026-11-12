import type { Metadata } from 'next'
import Link from 'next/link'

import { payloadClient } from '@/lib/data'
import { Seite } from '@/components/Seite'

export const revalidate = false
export const metadata: Metadata = { title: 'Archiv' }

export default async function ArchivSeite() {
  const payload = await payloadClient()
  const [texte, protokolle, bulletins, galerien] = await Promise.all([
    payload.findGlobal({ slug: 'texte', depth: 0 }),
    payload.count({ collection: 'protokolle' }),
    payload.count({ collection: 'bulletins' }),
    payload.count({ collection: 'galerien' }),
  ])
  const bereiche = [
    {
      href: '/archiv/protokolle',
      titel: 'Protokolle',
      text: texte.protokolleEinleitung,
      anzahl: `${protokolle.totalDocs} Protokolle`,
    },
    {
      href: '/archiv/bulletins',
      titel: 'Bulletins',
      text: texte.bulletinsEinleitung,
      anzahl: `${bulletins.totalDocs} Ausgaben`,
    },
    {
      href: '/archiv/fotos',
      titel: 'Fotos',
      text: texte.fotosEinleitung,
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
            {b.text && <p>{b.text}</p>}
          </Link>
        ))}
      </div>
    </Seite>
  )
}
