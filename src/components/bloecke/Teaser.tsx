import Link from 'next/link'
import { ViewTransition } from 'react'

import { Download } from '@/components/Download'
import { Text } from '@/components/Text'
import {
  alsDokument,
  bildUrl,
  datum,
  hatDetailseite,
  nachSchuljahr,
  payloadClient,
} from '@/lib/data'
import type { AktuellBlock, ArchivBlock, Arbeitsgruppen, ListeBlock, Media } from '@/payload-types'

/** Anzahl aus dem Block; leer heisst alle. */
const begrenzung = (anzahl?: number) =>
  anzahl ? { limit: anzahl } : { limit: 0, pagination: false as const }

type Darstellung = NonNullable<ListeBlock['darstellung']>

/**
 * Blöcke, die ihren Inhalt selbst aus den Collections holen und so immer aktuell sind.
 * Nach jeder Änderung im Admin wird die ganze Website neu erzeugt (src/hooks/revalidate.ts).
 */

const ueberall = {
  protokolle: { href: '/archiv/protokolle', alle: 'Alle Protokolle' },
  bulletins: { href: '/archiv/bulletins', alle: 'Alle Bulletins' },
  galerien: { href: '/archiv/fotos', alle: 'Alle Fotogalerien' },
  arbeitsgruppen: { href: '/arbeitsgruppen', alle: 'Alle Arbeitsgruppen' },
} as const

export async function AktuellTeaser({ titel, zeigen }: AktuellBlock) {
  const payload = await payloadClient()
  const soll = new Set(zeigen ?? [])
  const leer = { docs: [] }
  const [protokolle, bulletins, galerien] = await Promise.all([
    soll.has('protokoll')
      ? payload.find({ collection: 'protokolle', sort: '-datum', limit: 1, depth: 0 })
      : leer,
    soll.has('bulletin')
      ? payload.find({ collection: 'bulletins', sort: '-datum', limit: 1, depth: 0 })
      : leer,
    soll.has('galerie')
      ? payload.find({ collection: 'galerien', sort: '-datum', limit: 1, depth: 1 })
      : leer,
  ])
  const protokoll = protokolle.docs[0]
  const bulletin = bulletins.docs[0]
  const galerie = galerien.docs[0]
  const galerieBild = galerie ? bildUrl(alsDokument<Media>(galerie.bilder?.[0]), 'thumb') : null

  return (
    <section>
      {titel && <h2>{titel}</h2>}
      <div className="karten">
        {bulletin && (
          <article className="karte">
            <p className="marke">Neustes Bulletin</p>
            <h3>{bulletin.titel}</h3>
            <Download
              datei={bulletin}
              titel="Herunterladen"
              zusatz={datum(bulletin.datum, 'monat')}
            />
            <Link href="/archiv/bulletins">Alle Bulletins</Link>
          </article>
        )}
        {protokoll && (
          <article className="karte">
            <p className="marke">Letzte Sitzung</p>
            <h3>{protokoll.titel}</h3>
            <Download
              datei={protokoll}
              titel="Herunterladen"
              zusatz={`Schuljahr ${protokoll.schuljahr}`}
            />
            <Link href="/archiv/protokolle">Alle Protokolle</Link>
          </article>
        )}
        {galerie && (
          <article className="karte">
            <p className="marke">Fotos</p>
            <h3>{galerie.titel}</h3>
            {galerieBild && (
              <ViewTransition name={`galerie-${galerie.slug}`} share="morph" default="none">
                <img className="karte-bild" src={galerieBild} alt="" loading="lazy" />
              </ViewTransition>
            )}
            <Link href={`/archiv/fotos/${galerie.slug}`} transitionTypes={['vor']}>
              Galerie ansehen
            </Link>
          </article>
        )}
      </div>
    </section>
  )
}

export async function ListeTeaser(block: ListeBlock) {
  const { titel, quelle, darstellung, linkAlle } = block
  const anzahl = block.anzahl || undefined
  const karten = darstellung !== 'liste' && darstellung !== 'schuljahr'
  const ziel = ueberall[quelle]

  return (
    <section>
      {titel && <h2>{titel}</h2>}
      {quelle === 'arbeitsgruppen' ? (
        <AgListe block={block} anzahl={anzahl} karten={karten} />
      ) : quelle === 'galerien' ? (
        <GalerieListe anzahl={anzahl} karten={karten} />
      ) : (
        <DateiListe
          quelle={quelle}
          anzahl={anzahl}
          darstellung={darstellung ?? 'karten'}
          unterTitel={Boolean(titel)}
        />
      )}
      {linkAlle && (
        <p className="mehr">
          <Link href={ziel.href} transitionTypes={['vor']}>
            {ziel.alle} →
          </Link>
        </p>
      )}
    </section>
  )
}

async function DateiListe({
  quelle,
  anzahl,
  darstellung,
  unterTitel,
}: {
  quelle: 'protokolle' | 'bulletins'
  anzahl?: number
  darstellung: Darstellung
  /** Der Block hat eine eigene Überschrift; die Schuljahre werden dann eine Stufe tiefer gesetzt. */
  unterTitel: boolean
}) {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: quelle,
    sort: '-datum',
    depth: 0,
    ...begrenzung(anzahl),
  })
  const zusatz = (d: (typeof docs)[number]) =>
    datum(d.datum, quelle === 'bulletins' ? 'monat' : 'lang')
  if (darstellung === 'schuljahr') {
    const Kopf = unterTitel ? 'h3' : 'h2'
    return (
      <div className="schmal">
        {nachSchuljahr(docs).map(([schuljahr, eintraege]) => (
          <div key={schuljahr} className="jahrgang">
            <Kopf>Schuljahr {schuljahr}</Kopf>
            <ul className="downloads">
              {eintraege.map((e) => (
                <li key={e.id}>
                  <Download datei={e} zusatz={zusatz(e)} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }
  if (darstellung === 'liste') {
    return (
      <ul className="downloads schmal">
        {docs.map((d) => (
          <li key={d.id}>
            <Download datei={d} zusatz={zusatz(d)} />
          </li>
        ))}
      </ul>
    )
  }
  return (
    <div className="karten">
      {docs.map((d) => (
        <article className="karte" key={d.id}>
          <p className="marke">{zusatz(d)}</p>
          <h3>{d.titel}</h3>
          <Download datei={d} titel="Herunterladen" />
        </article>
      ))}
    </div>
  )
}

async function GalerieListe({ anzahl, karten }: { anzahl?: number; karten: boolean }) {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'galerien',
    sort: '-datum',
    depth: 1,
    ...begrenzung(anzahl),
  })
  if (!karten) {
    return (
      <ul className="linkliste schmal">
        {docs.map((g) => (
          <li key={g.id}>
            <Link href={`/archiv/fotos/${g.slug}`} transitionTypes={['vor']}>
              {g.titel}
            </Link>{' '}
            <span className="leise">{datum(g.datum, 'monat')}</span>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <div className="karten">
      {docs.map((g) => {
        const titelbild = bildUrl(alsDokument<Media>(g.bilder?.[0]), 'thumb')
        return (
          <Link
            href={`/archiv/fotos/${g.slug}`}
            className="karte karte-link"
            key={g.id}
            transitionTypes={['vor']}
          >
            {titelbild && (
              <ViewTransition name={`galerie-${g.slug}`} share="morph" default="none">
                <img className="karte-bild" src={titelbild} alt="" loading="lazy" />
              </ViewTransition>
            )}
            <h3>{g.titel}</h3>
            <p className="marke">
              {datum(g.datum, 'monat')} · {g.bilder?.length ?? 0} Bilder
            </p>
          </Link>
        )
      })}
    </div>
  )
}

async function AgListe({
  block,
  anzahl,
  karten,
}: {
  block: ListeBlock
  anzahl?: number
  karten: boolean
}) {
  const payload = await payloadClient()
  const gewaehlt = (block.arbeitsgruppen ?? []).map((a) => (typeof a === 'object' ? a.id : a))
  const { docs } = await payload.find({
    collection: 'arbeitsgruppen',
    sort: 'reihenfolge',
    ...begrenzung(gewaehlt.length || anzahl),
    depth: 0,
    where: gewaehlt.length ? { id: { in: gewaehlt } } : { ruhend: { not_equals: true } },
  })
  const href = (ag: Arbeitsgruppen) =>
    hatDetailseite(ag) ? `/arbeitsgruppen/${ag.slug}` : `/arbeitsgruppen#${ag.slug}`
  if (!karten) {
    return (
      <ul className="linkliste schmal">
        {docs.map((ag) => (
          <li key={ag.id}>
            <Link href={href(ag)}>{ag.name}</Link>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <div className="karten karten-zwei">
      {docs.map((ag) => (
        <article className="karte" key={ag.id}>
          {ag.ruhend && <p className="marke">Zurzeit ruhend</p>}
          <h3>{ag.name}</h3>
          <Text inhalt={ag.beschreibung} />
          <Link href={href(ag)} transitionTypes={['vor']}>
            Mehr erfahren
          </Link>
        </article>
      ))}
    </div>
  )
}

export async function ArchivTeaser({
  titel,
  protokolleText,
  bulletinsText,
  fotosText,
}: ArchivBlock) {
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
      text: protokolleText,
      anzahl: `${protokolle.totalDocs} Protokolle`,
    },
    {
      href: '/archiv/bulletins',
      titel: 'Bulletins',
      text: bulletinsText,
      anzahl: `${bulletins.totalDocs} Ausgaben`,
    },
    {
      href: '/archiv/fotos',
      titel: 'Fotos',
      text: fotosText,
      anzahl: `${galerien.totalDocs} Galerien`,
    },
  ]
  const Kopf = titel ? 'h3' : 'h2'
  return (
    <section>
      {titel && <h2>{titel}</h2>}
      <div className="karten">
        {bereiche.map((b) => (
          <Link href={b.href} className="karte karte-link" key={b.href} transitionTypes={['vor']}>
            <p className="marke">{b.anzahl}</p>
            <Kopf>{b.titel}</Kopf>
            {b.text && <p>{b.text}</p>}
          </Link>
        ))}
      </div>
    </section>
  )
}
