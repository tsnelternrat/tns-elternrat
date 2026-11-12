import type { Metadata } from 'next'
import Link from 'next/link'

import { Download } from '@/components/Download'
import { datum, nachSchuljahr, payloadClient } from '@/lib/data'
import { Seite } from '@/components/Seite'

export const revalidate = false
export const metadata: Metadata = { title: 'Protokolle' }

export default async function ProtokolleSeite() {
  const payload = await payloadClient()
  const texte = await payload.findGlobal({ slug: 'texte', depth: 0 })
  const { docs } = await payload.find({ collection: 'protokolle', sort: '-datum', limit: 1000, depth: 0 })

  return (
    <Seite>
      <div className="schmal">
        <p className="pfad">
          <Link href="/archiv" transitionTypes={['zurueck']}>
            ← Archiv
          </Link>
        </p>
        <h1>Protokolle</h1>
        {texte.protokolleEinleitung && <p className="gross">{texte.protokolleEinleitung}</p>}
        {nachSchuljahr(docs).map(([schuljahr, eintraege]) => (
          <section key={schuljahr} className="jahrgang">
            <h2>Schuljahr {schuljahr}</h2>
            <ul className="downloads">
              {eintraege.map((e) => (
                <li key={e.id}>
                  <Download datei={e} zusatz={datum(e.datum, 'lang')} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Seite>
  )
}
