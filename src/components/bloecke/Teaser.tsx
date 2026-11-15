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

/** Überschrift der Einträge: eine Stufe unter dem Blocktitel, ohne Blocktitel direkt h2. */
type Kopf = 'h2' | 'h3'
const kopfUnter = (titel?: string | null): Kopf => (titel ? 'h3' : 'h2')

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
  const Kopf: Kopf = titel ? 'h3' : 'h2'

  return (
    <section>
      {titel && <h2>{titel}</h2>}
      <div className="karten">
        {bulletin && (
          <article className="karte">
            <p className="marke">Neustes Bulletin</p>
            <Kopf>{bulletin.titel}</Kopf>
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
            <Kopf>{protokoll.titel}</Kopf>
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
            <Kopf>{galerie.titel}</Kopf>
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
  const kopf = kopfUnter(titel)

  return (
    <section>
      {titel && <h2>{titel}</h2>}
      {quelle === 'arbeitsgruppen' ? (
        <AgListe block={block} anzahl={anzahl} karten={karten} kopf={kopf} />
      ) : quelle === 'galerien' ? (
        <GalerieListe anzahl={anzahl} karten={karten} kopf={kopf} />
      ) : (
        <DateiListe
          quelle={quelle}
          anzahl={anzahl}
          darstellung={darstellung ?? 'karten'}
          kopf={kopf}
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
  kopf: Kopf,
}: {
  quelle: 'protokolle' | 'bulletins'
  anzahl?: number
  darstellung: Darstellung
  kopf: Kopf
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
          <Kopf>{d.titel}</Kopf>
          <Download datei={d} titel="Herunterladen" />
        </article>
      ))}
    </div>
  )
}

async function GalerieListe({
  anzahl,
  karten,
  kopf: Kopf,
}: {
  anzahl?: number
  karten: boolean
  kopf: Kopf
}) {
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
            <Kopf>{g.titel}</Kopf>
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
  kopf: Kopf,
}: {
  block: ListeBlock
  anzahl?: number
  karten: boolean
  kopf: Kopf
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
          <Kopf>{ag.name}</Kopf>
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
  const Kopf: Kopf = titel ? 'h3' : 'h2'
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
