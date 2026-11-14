import type { Elternrat, Seiten, Texte } from '@/payload-types'

import { absatz } from './lexical'

/**
 * Die bisherigen festen Seiten, ausgedrückt in Blöcken. Solange es in der Collection «Seiten» keinen
 * Eintrag mit dieser Adresse gibt, wird die Vorlage angezeigt; scripts/bloecke-ueberfuehren.ts legt
 * aus ihr die Einträge an. Danach gilt nur noch, was im Admin steht.
 */
export type Vorlage = Required<
  Pick<Seiten, 'titel' | 'slug' | 'titelZeigen' | 'inhalt' | 'inNavigation' | 'reihenfolge'>
> &
  Pick<Seiten, 'beschreibung' | 'navigationsTitel'>

type Block = NonNullable<Seiten['inhalt']>[number]
type Quellen = { elternrat: Elternrat; texte: Texte }

export const standardAdressen = ['elternrat', 'arbeitsgruppen', 'archiv', 'elternbox'] as const

export function standardSeite(slug: string, { elternrat: er, texte }: Quellen): Vorlage | null {
  switch (slug) {
    case 'elternrat': {
      const inhalt: Block[] = []
      if (er.foto) {
        inhalt.push({
          blockType: 'bildText',
          text: er.einleitung,
          gross: true,
          bild: er.foto,
          bildPosition: 'rechts',
          legende: er.fotoLegende,
        })
      } else if (er.einleitung) {
        inhalt.push({ blockType: 'text', text: er.einleitung, gross: true, breite: 'schmal' })
      }
      if (er.dokumente?.length)
        inhalt.push({ blockType: 'downloads', titel: 'Zum Nachlesen', dokumente: er.dokumente })
      inhalt.push(
        { blockType: 'personen', titel: 'Wer im Schuljahr {schuljahr} dabei ist' },
        {
          blockType: 'hinweis',
          text: absatz(
            'Mit Fragen und Wünschen wenden Sie sich am besten an die Delegierten Ihrer Klasse.',
          ),
        },
      )
      return {
        titel: 'Der Elternrat',
        navigationsTitel: 'Elternrat',
        slug,
        titelZeigen: true,
        inNavigation: true,
        reihenfolge: 10,
        inhalt,
      }
    }
    case 'arbeitsgruppen':
      return {
        titel: 'Arbeitsgruppen',
        slug,
        titelZeigen: true,
        inNavigation: true,
        reihenfolge: 20,
        inhalt: [
          ...(texte.arbeitsgruppenEinleitung
            ? [
                {
                  blockType: 'text' as const,
                  text: texte.arbeitsgruppenEinleitung,
                  gross: true,
                  breite: 'schmal' as const,
                },
              ]
            : []),
          { blockType: 'arbeitsgruppen' },
          {
            blockType: 'hinweis',
            text: absatz('Möchten Sie in einer Arbeitsgruppe mitmachen? ', {
              text: 'Schreiben Sie uns in die Elternbox.',
              url: '/elternbox',
            }),
          },
        ],
      }
    case 'archiv':
      return {
        titel: 'Archiv',
        slug,
        titelZeigen: true,
        inNavigation: true,
        reihenfolge: 30,
        inhalt: [{ blockType: 'archiv' }],
      }
    case 'elternbox':
      return {
        titel: 'Elternbox',
        slug,
        titelZeigen: true,
        inNavigation: false,
        reihenfolge: 40,
        beschreibung:
          'Schreiben Sie dem Elternrat der Tagesschule Nordstrasse direkt, auf Wunsch auch anonym.',
        inhalt: [
          ...(texte.elternboxEinleitung
            ? [
                {
                  blockType: 'text' as const,
                  text: texte.elternboxEinleitung,
                  gross: true,
                  breite: 'schmal' as const,
                },
              ]
            : []),
          { blockType: 'elternbox' },
          {
            blockType: 'hinweis',
            text: absatz(
              'Ihre Nachricht lesen nur die Mitglieder des Elternrats. Name und E-Mail-Adresse sind freiwillig; ohne E-Mail können wir Ihnen allerdings nicht antworten.',
            ),
          },
        ],
      }
    default:
      return null
  }
}
