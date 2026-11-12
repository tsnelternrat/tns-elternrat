import type { Metadata } from 'next'
import Link from 'next/link'

import { Download } from '@/components/Download'
import { datum, nachSchuljahr, payloadClient } from '@/lib/data'
import { Seite } from '@/components/Seite'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Bulletins' }

export default async function BulletinsSeite() {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'bulletins', sort: '-datum', limit: 1000, depth: 0 })

  return (
    <Seite>
      <div className="schmal">
        <p className="pfad">
          <Link href="/archiv" transitionTypes={['zurueck']}>
            ← Archiv
          </Link>
        </p>
        <h1>Bulletins</h1>
        <p className="gross">Im Bulletin gibt der Elternrat Einblick in seine Tätigkeiten.</p>
        {nachSchuljahr(docs).map(([schuljahr, eintraege]) => (
          <section key={schuljahr} className="jahrgang">
            <h2>Schuljahr {schuljahr}</h2>
            <ul className="downloads">
              {eintraege.map((e) => (
                <li key={e.id}>
                  <Download datei={e} zusatz={datum(e.datum, 'monat')} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Seite>
  )
}
