/**
 * Überführt die bisherige feste Startseite in Blöcke (Global «Startseite», Feld «Inhalt»).
 * Danach lässt sich die Startseite im Admin frei umbauen.
 *
 *   pnpm bloecke:startseite              füllt die Blöcke, falls noch keine da sind
 *   pnpm bloecke:startseite --beispiel   legt zusätzlich die Seite /beispiel mit allen Blocktypen an
 *
 * Läuft nur gegen die lokale Datenbank, ausser mit --prod.
 */
import { getPayload } from 'payload'

import { standardStartseite } from '../src/lib/standardStartseite'
import config from '../src/payload.config'

process.env.PAYLOAD_SKIP_REVALIDATE = 'true'

const args = new Set(process.argv.slice(2))
const lokal = /@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL ?? '')

/** Ein Absatz Fliesstext im Lexical-Format. */
const absatz = (text: string) => ({
  root: {
    type: 'root',
    version: 1,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    children: [
      {
        type: 'paragraph',
        version: 1,
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        children: [
          { type: 'text', version: 1, text, format: 0, style: '', mode: 'normal', detail: 0 },
        ],
      },
    ],
  },
})

async function main() {
  if (!lokal && !args.has('--prod')) {
    console.error(
      'DATABASE_URL zeigt nicht auf die lokale Datenbank. Für Prod ausdrücklich --prod angeben.',
    )
    process.exit(1)
  }
  const payload = await getPayload({ config })

  const start = await payload.findGlobal({ slug: 'startseite', depth: 0 })
  if (start.inhalt?.length) {
    console.log('Startseite hat schon Blöcke, bleibt unverändert.')
  } else {
    await payload.updateGlobal({ slug: 'startseite', data: { inhalt: standardStartseite(start) } })
    console.log('Startseite in Blöcke überführt.')
  }

  if (args.has('--beispiel')) {
    const [bild, dokumente, galerie, ag] = await Promise.all([
      payload.find({ collection: 'media', limit: 1, depth: 0 }),
      payload.find({ collection: 'dokumente', limit: 2, depth: 0 }),
      payload.find({ collection: 'galerien', sort: '-datum', limit: 1, depth: 0 }),
      payload.find({ collection: 'arbeitsgruppen', limit: 100, depth: 0 }),
    ])
    const bildId = bild.docs[0]?.id
    const video = ag.docs.flatMap((a) => a.videos ?? [])[0]
    const daten = {
      titel: 'Beispielseite',
      slug: 'beispiel',
      titelZeigen: false,
      inNavigation: false,
      beschreibung: 'Zeigt alle verfügbaren Blöcke.',
      inhalt: [
        {
          blockType: 'buehne' as const,
          titel: 'Alle Blöcke auf einer Seite',
          text: absatz(
            'Diese Seite ist aus Blöcken gebaut. Jeder Abschnitt unten ist ein eigener Block.',
          ),
          bild: bildId,
          knoepfe: [
            { label: 'Zur Elternbox', ziel: '/elternbox', stil: 'voll' as const },
            { label: 'Archiv', ziel: '/archiv', stil: 'hell' as const },
          ],
        },
        {
          blockType: 'text' as const,
          titel: 'Text',
          text: absatz('Ein einfacher Textblock in Lesebreite, optional mit grösserer Schrift.'),
          breite: 'schmal' as const,
          gross: true,
        },
        ...(bildId
          ? [
              {
                blockType: 'bildText' as const,
                titel: 'Bild mit Text',
                text: absatz('Das Bild steht wahlweise links oder rechts.'),
                bild: bildId,
                bildPosition: 'links' as const,
                legende: 'Eine Bildlegende',
              },
            ]
          : []),
        {
          blockType: 'karten' as const,
          titel: 'Karten',
          spalten: '3' as const,
          karten: [
            { titel: 'Erste Karte', text: 'Mit Knopf.', linkLabel: 'Mehr', linkZiel: '/elternrat' },
            { titel: 'Zweite Karte', text: 'Farbig hervorgehoben.', farbig: true },
            { titel: 'Dritte Karte', text: 'Ohne Knopf.' },
          ],
        },
        {
          blockType: 'aktuell' as const,
          titel: 'Aktuell',
          zeigen: ['bulletin' as const, 'protokoll' as const, 'galerie' as const],
        },
        {
          blockType: 'liste' as const,
          titel: 'Die letzten Protokolle',
          quelle: 'protokolle' as const,
          anzahl: 5,
          darstellung: 'liste' as const,
          linkAlle: true,
        },
        {
          blockType: 'liste' as const,
          titel: 'Bulletins',
          quelle: 'bulletins' as const,
          anzahl: 3,
          darstellung: 'karten' as const,
          linkAlle: true,
        },
        {
          blockType: 'liste' as const,
          titel: 'Fotogalerien',
          quelle: 'galerien' as const,
          anzahl: 3,
          darstellung: 'karten' as const,
          linkAlle: true,
        },
        {
          blockType: 'liste' as const,
          titel: 'Arbeitsgruppen',
          quelle: 'arbeitsgruppen' as const,
          anzahl: 4,
          darstellung: 'karten' as const,
          arbeitsgruppen: ag.docs.slice(0, 4).map((a) => a.id),
          linkAlle: true,
        },
        { blockType: 'archiv' as const, titel: 'Archiv-Übersicht' },
        ...(dokumente.docs.length
          ? [
              {
                blockType: 'downloads' as const,
                titel: 'Dokumente',
                dokumente: dokumente.docs.map((d) => d.id),
              },
            ]
          : []),
        ...(galerie.docs[0]
          ? [{ blockType: 'galerie' as const, titel: 'Eine Galerie', galerie: galerie.docs[0].id }]
          : []),
        ...(video
          ? [{ blockType: 'video' as const, titel: video.titel || 'Video', url: video.url }]
          : []),
      ],
    }
    const { docs } = await payload.find({
      collection: 'seiten',
      where: { slug: { equals: 'beispiel' } },
      limit: 1,
    })
    if (docs[0]) await payload.update({ collection: 'seiten', id: docs[0].id, data: daten })
    else await payload.create({ collection: 'seiten', data: daten })
    console.log('Beispielseite unter /beispiel angelegt.')
  }
  process.exit(0)
}

// Top-Level-await: `payload run` beendet den Prozess, sobald das Modul geladen ist.
try {
  await main()
} catch (fehler) {
  console.error(fehler)
  process.exit(1)
}
