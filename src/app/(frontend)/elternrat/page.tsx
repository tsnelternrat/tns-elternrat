import type { Metadata } from 'next'

import { DownloadListe } from '@/components/Download'
import { Text } from '@/components/Text'
import { alsDokument, alsListe, bildUrl, payloadClient } from '@/lib/data'
import type { Dokumente, Media } from '@/payload-types'
import { Seite } from '@/components/Seite'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Elternrat' }

const stufen = [
  { wert: 'kg', titel: 'Kindergarten' },
  { wert: 'unterstufe', titel: '1.–3. Klasse' },
  { wert: 'mittelstufe', titel: '4.–6. Klasse' },
] as const

export default async function ElternratSeite() {
  const payload = await payloadClient()
  const er = await payload.findGlobal({ slug: 'elternrat', depth: 1 })
  const foto = alsDokument<Media>(er.foto)
  const fotoUrl = bildUrl(foto, 'mittel')
  const dokumente = alsListe<Dokumente>(er.dokumente)

  return (
    <Seite>
      <h1>Der Elternrat</h1>
      <div className="spalten">
        <div>
          <Text inhalt={er.einleitung} className="gross" />
          {dokumente.length > 0 && (
            <>
              <h2>Zum Nachlesen</h2>
              <DownloadListe dateien={dokumente} />
            </>
          )}
        </div>
        {fotoUrl && (
          <figure>
            <img className="rahmen" src={fotoUrl} alt={foto?.alt ?? ''} />
            {er.fotoLegende && <figcaption>{er.fotoLegende}</figcaption>}
          </figure>
        )}
      </div>

      <section aria-labelledby="personen">
        <h2 id="personen">Wer im Schuljahr {er.schuljahr} dabei ist</h2>

        {Boolean(er.vorstand?.length) && (
          <>
            <h3>Vorstand</h3>
            <dl className="personen">
              {er.vorstand!.map((v) => (
                <div key={v.id}>
                  <dt>{v.rolle}</dt>
                  <dd>{v.personen}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        {stufen.map((stufe) => {
          const klassen = (er.klassen ?? []).filter((k) => k.stufe === stufe.wert)
          if (!klassen.length) return null
          return (
            <div key={stufe.wert}>
              <h3>Delegierte {stufe.titel}</h3>
              <dl className="personen">
                {klassen.map((k) => (
                  <div key={k.id}>
                    <dt>{k.klasse}</dt>
                    <dd>{k.delegierte}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )
        })}

        {Boolean(er.weitere?.length) && (
          <>
            <h3>Weitere Aufgaben</h3>
            <dl className="personen">
              {er.weitere!.map((w) => (
                <div key={w.id}>
                  <dt>{w.rolle}</dt>
                  <dd>{w.personen}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
        <p className="hinweis">Mit Fragen und Wünschen wenden Sie sich am besten an die Delegierten Ihrer Klasse.</p>
      </section>
    </Seite>
  )
}
