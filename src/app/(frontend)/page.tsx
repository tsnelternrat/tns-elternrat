import Link from 'next/link'

import { Download } from '@/components/Download'
import { Text } from '@/components/Text'
import { alsDokument, bildUrl, datum, payloadClient } from '@/lib/data'
import type { Media } from '@/payload-types'

export const revalidate = 3600

export default async function Startseite() {
  const payload = await payloadClient()
  const [seite, protokolle, bulletins, galerien] = await Promise.all([
    payload.findGlobal({ slug: 'startseite', depth: 1 }),
    payload.find({ collection: 'protokolle', sort: '-datum', limit: 1 }),
    payload.find({ collection: 'bulletins', sort: '-datum', limit: 1, depth: 1 }),
    payload.find({ collection: 'galerien', sort: '-datum', limit: 1, depth: 1 }),
  ])
  const protokoll = protokolle.docs[0]
  const bulletin = bulletins.docs[0]
  const galerie = galerien.docs[0]
  const bild = bildUrl(alsDokument<Media>(seite.bild), 'mittel')
  const galerieBild = galerie ? bildUrl(alsDokument<Media>(galerie.bilder?.[0]), 'thumb') : null

  return (
    <>
      <section className="buehne">
        <div>
          <h1>{seite.titel}</h1>
          <Text inhalt={seite.einleitung} className="gross" />
          <p className="knoepfe">
            <Link href="/elternbox" className="knopf">
              Schreiben Sie uns
            </Link>
            <Link href="/elternrat" className="knopf knopf-hell">
              Wer wir sind
            </Link>
          </p>
        </div>
        {bild && <img className="rahmen" src={bild} alt={alsDokument<Media>(seite.bild)?.alt ?? ''} />}
      </section>

      <section aria-labelledby="aktuell">
        <h2 id="aktuell">Aktuell</h2>
        <div className="karten">
          {bulletin && (
            <article className="karte">
              <p className="marke">Neustes Bulletin</p>
              <h3>{bulletin.titel}</h3>
              <Download datei={bulletin} titel="Herunterladen" zusatz={datum(bulletin.datum, 'monat')} />
              <Link href="/archiv/bulletins">Alle Bulletins</Link>
            </article>
          )}
          {protokoll && (
            <article className="karte">
              <p className="marke">Letzte Sitzung</p>
              <h3>{protokoll.titel}</h3>
              <Download datei={protokoll} titel="Herunterladen" zusatz={`Schuljahr ${protokoll.schuljahr}`} />
              <Link href="/archiv/protokolle">Alle Protokolle</Link>
            </article>
          )}
          {galerie && (
            <article className="karte">
              <p className="marke">Fotos</p>
              <h3>{galerie.titel}</h3>
              {galerieBild && <img className="karte-bild" src={galerieBild} alt="" loading="lazy" />}
              <Link href={`/archiv/fotos/${galerie.slug}`}>Galerie ansehen</Link>
            </article>
          )}
        </div>
      </section>

      <section className="karten karten-zwei">
        <article className="karte karte-farbig">
          <h2>Mitmachen</h2>
          <p>
            In den Arbeitsgruppen packen Eltern gemeinsam an, vom Sommerabend bis zum sicheren Schulweg. Neue Gesichter
            sind willkommen.
          </p>
          <Link href="/arbeitsgruppen" className="knopf knopf-hell">
            Arbeitsgruppen entdecken
          </Link>
        </article>
        <article className="karte">
          <h2>Elternbox</h2>
          <p>Eine Frage, eine Idee oder etwas, das Sie beschäftigt? Die Elternbox ist der direkte Draht zum Elternrat.</p>
          <Link href="/elternbox" className="knopf">
            Nachricht schreiben
          </Link>
        </article>
      </section>
    </>
  )
}
