import Link from 'next/link'

import { DownloadListe } from '@/components/Download'
import { Galerie } from '@/components/Galerie'
import { Text } from '@/components/Text'
import { alsDokument, alsListe, bildUrl, youtubeId } from '@/lib/data'
import type {
  BildTextBlock,
  BuehneBlock,
  Dokumente,
  DownloadsBlock,
  GalerieBlock,
  Galerien,
  KartenBlock,
  Media,
  Seiten,
  TextBlock,
  VideoBlock,
} from '@/payload-types'

import { AktuellTeaser, ArchivTeaser, ListeTeaser } from './Teaser'

export type Block = NonNullable<Seiten['inhalt']>[number]

/**
 * Rendert eine Blockliste. Beziehungen (Bilder, Dokumente, Galerien) müssen mit depth ≥ 2 geladen sein,
 * damit z. B. die Bilder einer gewählten Galerie mitkommen.
 */
export function Bloecke({ bloecke }: { bloecke?: Block[] | null }) {
  if (!bloecke?.length) return null
  return (
    <>
      {bloecke.map((block, i) => (
        <EinBlock block={block} key={block.id ?? i} />
      ))}
    </>
  )
}

function EinBlock({ block }: { block: Block }) {
  switch (block.blockType) {
    case 'buehne':
      return <Buehne {...block} />
    case 'text':
      return <TextAbschnitt {...block} />
    case 'bildText':
      return <BildText {...block} />
    case 'karten':
      return <Karten {...block} />
    case 'downloads':
      return <Downloads {...block} />
    case 'video':
      return <Video {...block} />
    case 'galerie':
      return <GalerieAbschnitt {...block} />
    case 'aktuell':
      return <AktuellTeaser {...block} />
    case 'liste':
      return <ListeTeaser {...block} />
    case 'archiv':
      return <ArchivTeaser {...block} />
    default:
      return null
  }
}

export function Ueberschrift({ titel }: { titel?: string | null }) {
  return titel ? <h2>{titel}</h2> : null
}

export function Knopf({ label, ziel, hell }: { label: string; ziel: string; hell?: boolean }) {
  const klasse = hell ? 'knopf knopf-hell' : 'knopf'
  return /^https?:|^mailto:/.test(ziel) ? (
    <a href={ziel} className={klasse}>
      {label}
    </a>
  ) : (
    <Link href={ziel} className={klasse}>
      {label}
    </Link>
  )
}

function Buehne({ titel, text, bild, knoepfe }: BuehneBlock) {
  const b = alsDokument<Media>(bild)
  const url = bildUrl(b, 'mittel')
  return (
    <section className="buehne">
      <div>
        <h1>{titel}</h1>
        <Text inhalt={text} className="gross" />
        {Boolean(knoepfe?.length) && (
          <p className="knoepfe">
            {knoepfe!.map((k, i) => (
              <Knopf key={k.id ?? i} label={k.label} ziel={k.ziel} hell={k.stil === 'hell'} />
            ))}
          </p>
        )}
      </div>
      {url && <img className="rahmen" src={url} alt={b?.alt ?? ''} />}
    </section>
  )
}

function TextAbschnitt({ titel, text, breite, gross }: TextBlock) {
  return (
    <section className={breite === 'voll' ? undefined : 'schmal'}>
      <Ueberschrift titel={titel} />
      <Text inhalt={text} className={gross ? 'gross' : undefined} />
    </section>
  )
}

function BildText({ titel, text, bild, bildPosition, legende }: BildTextBlock) {
  const b = alsDokument<Media>(bild)
  const url = bildUrl(b, 'mittel')
  return (
    <section className={bildPosition === 'links' ? 'spalten spalten-bild-links' : 'spalten'}>
      <div>
        <Ueberschrift titel={titel} />
        <Text inhalt={text} />
      </div>
      {url && (
        <figure>
          <img className="rahmen" src={url} alt={b?.alt ?? ''} loading="lazy" />
          {legende && <figcaption>{legende}</figcaption>}
        </figure>
      )}
    </section>
  )
}

function Karten({ titel, spalten, karten }: KartenBlock) {
  return (
    <section>
      <Ueberschrift titel={titel} />
      <div className={spalten === '3' ? 'karten' : 'karten karten-zwei'}>
        {(karten ?? []).map((k, i) => {
          const Kopf = titel ? 'h3' : 'h2'
          return (
            <article className={k.farbig ? 'karte karte-farbig' : 'karte'} key={k.id ?? i}>
              <Kopf>{k.titel}</Kopf>
              {k.text && <p>{k.text}</p>}
              {k.linkLabel && k.linkZiel && (
                <Knopf label={k.linkLabel} ziel={k.linkZiel} hell={Boolean(k.farbig)} />
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

function Downloads({ titel, dokumente }: DownloadsBlock) {
  const liste = alsListe<Dokumente>(dokumente)
  if (!liste.length) return null
  return (
    <section className="schmal">
      <Ueberschrift titel={titel} />
      <DownloadListe dateien={liste} />
    </section>
  )
}

function Video({ titel, url }: VideoBlock) {
  const yt = youtubeId(url)
  if (!yt) return null
  return (
    <section className="schmal">
      <Ueberschrift titel={titel} />
      <div className="videos">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${yt}`}
          title={titel || 'Video'}
          loading="lazy"
          allow="encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  )
}

function GalerieAbschnitt({ titel, galerie }: GalerieBlock) {
  const g = alsDokument<Galerien>(galerie)
  if (!g) return null
  const bilder = alsListe<Media>(g.bilder).flatMap((b) => {
    const thumb = bildUrl(b, 'thumb')
    const gross = bildUrl(b)
    return thumb && gross ? [{ thumb, gross, alt: b.alt ?? '' }] : []
  })
  return (
    <section>
      <h2>{titel || g.titel}</h2>
      <Galerie bilder={bilder} />
      {g.slug && <Link href={`/archiv/fotos/${g.slug}`}>Zur Galerie im Archiv</Link>}
    </section>
  )
}
