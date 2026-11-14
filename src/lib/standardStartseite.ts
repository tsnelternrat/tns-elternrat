import type { Startseite } from '@/payload-types'

/**
 * Standard-Startseite in Blöcken. Dient als Ersatz, solange im Global «Startseite» keine Blöcke
 * stehen, und als Vorlage für scripts/bloecke-ueberfuehren.ts.
 */
export function standardStartseite(): NonNullable<Startseite['inhalt']> {
  return [
    {
      blockType: 'buehne',
      titel: 'Willkommen beim Elternrat',
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
