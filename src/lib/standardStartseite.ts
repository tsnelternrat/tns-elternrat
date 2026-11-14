import type { Startseite } from '@/payload-types'

/**
 * Die bisherige feste Startseite, ausgedrückt in Blöcken. Dient als Ersatz, solange im Global
 * «Startseite» noch keine Blöcke stehen, und als Vorlage für scripts/bloecke-ueberfuehren.ts.
 */
export function standardStartseite(
  seite: Pick<Startseite, 'titel' | 'einleitung' | 'bild'>,
): NonNullable<Startseite['inhalt']> {
  return [
    {
      blockType: 'buehne',
      titel: seite.titel,
      text: seite.einleitung,
      bild: seite.bild,
      knoepfe: [
        { label: 'Schreiben Sie uns', ziel: '/elternbox', stil: 'voll' },
        { label: 'Wer wir sind', ziel: '/elternrat', stil: 'hell' },
      ],
    },
    { blockType: 'aktuell', titel: 'Aktuell', zeigen: ['bulletin', 'protokoll', 'galerie'] },
    {
      blockType: 'karten',
      spalten: '2',
      karten: [
        {
          titel: 'Mitmachen',
          text: 'In den Arbeitsgruppen packen Eltern gemeinsam an, vom Sommerabend bis zum sicheren Schulweg. Neue Gesichter sind willkommen.',
          linkLabel: 'Arbeitsgruppen entdecken',
          linkZiel: '/arbeitsgruppen',
          farbig: true,
        },
        {
          titel: 'Elternbox',
          text: 'Eine Frage, eine Idee oder etwas, das Sie beschäftigt? Die Elternbox ist der direkte Draht zum Elternrat.',
          linkLabel: 'Nachricht schreiben',
          linkZiel: '/elternbox',
        },
      ],
    },
  ]
}
