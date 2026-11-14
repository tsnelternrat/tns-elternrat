import type { Seiten } from '@/payload-types'

import { absatz } from './lexical'

/**
 * Die Standardseiten in Blöcken. Solange es in der Collection «Seiten» keinen Eintrag mit dieser
 * Adresse gibt, wird die Vorlage angezeigt; scripts/bloecke-ueberfuehren.ts legt aus ihr die
 * Einträge an. Danach gilt nur noch, was im Admin steht.
 */
export type Vorlage = Required<
  Pick<Seiten, 'titel' | 'slug' | 'titelZeigen' | 'inhalt' | 'inNavigation' | 'reihenfolge'>
> &
  Pick<Seiten, 'beschreibung' | 'navigationsTitel'>

export const standardAdressen = [
  'elternrat',
  'arbeitsgruppen',
  'archiv',
  'archiv/protokolle',
  'archiv/bulletins',
  'archiv/fotos',
  'elternbox',
] as const

const kurztexte = {
  protokolle: 'Was an den Sitzungen des Elternrats besprochen wurde.',
  bulletins: 'Das Heft des Elternrats.',
  fotos: 'Eindrücke von Sommerfesten und anderen Anlässen.',
}

const basis = { titelZeigen: true, inNavigation: false, reihenfolge: 100 }

const vorlagen: Record<(typeof standardAdressen)[number], Omit<Vorlage, 'slug'>> = {
  elternrat: {
    ...basis,
    titel: 'Der Elternrat',
    navigationsTitel: 'Elternrat',
    inNavigation: true,
    reihenfolge: 10,
    inhalt: [
      { blockType: 'personen', titel: 'Wer im Schuljahr {schuljahr} dabei ist' },
      {
        blockType: 'hinweis',
        text: absatz(
          'Mit Fragen und Wünschen wenden Sie sich am besten an die Delegierten Ihrer Klasse.',
        ),
      },
    ],
  },
  arbeitsgruppen: {
    ...basis,
    titel: 'Arbeitsgruppen',
    inNavigation: true,
    reihenfolge: 20,
    inhalt: [
      { blockType: 'arbeitsgruppen' },
      {
        blockType: 'hinweis',
        text: absatz('Möchten Sie in einer Arbeitsgruppe mitmachen? ', {
          text: 'Schreiben Sie uns in die Elternbox.',
          url: '/elternbox',
        }),
      },
    ],
  },
  archiv: {
    ...basis,
    titel: 'Archiv',
    inNavigation: true,
    reihenfolge: 30,
    inhalt: [
      {
        blockType: 'archiv',
        protokolleText: kurztexte.protokolle,
        bulletinsText: kurztexte.bulletins,
        fotosText: kurztexte.fotos,
      },
    ],
  },
  'archiv/protokolle': {
    ...basis,
    titel: 'Protokolle',
    inhalt: [
      { blockType: 'text', text: absatz(kurztexte.protokolle), gross: true, breite: 'schmal' },
      {
        blockType: 'liste',
        quelle: 'protokolle',
        darstellung: 'schuljahr',
        anzahl: null,
        linkAlle: false,
      },
    ],
  },
  'archiv/bulletins': {
    ...basis,
    titel: 'Bulletins',
    inhalt: [
      { blockType: 'text', text: absatz(kurztexte.bulletins), gross: true, breite: 'schmal' },
      {
        blockType: 'liste',
        quelle: 'bulletins',
        darstellung: 'schuljahr',
        anzahl: null,
        linkAlle: false,
      },
    ],
  },
  'archiv/fotos': {
    ...basis,
    titel: 'Fotos',
    inhalt: [
      { blockType: 'text', text: absatz(kurztexte.fotos), gross: true, breite: 'schmal' },
      {
        blockType: 'liste',
        quelle: 'galerien',
        darstellung: 'karten',
        anzahl: null,
        linkAlle: false,
      },
    ],
  },
  elternbox: {
    ...basis,
    titel: 'Elternbox',
    reihenfolge: 40,
    beschreibung:
      'Schreiben Sie dem Elternrat der Tagesschule Nordstrasse direkt, auf Wunsch auch anonym.',
    inhalt: [
      { blockType: 'elternbox' },
      {
        blockType: 'hinweis',
        text: absatz(
          'Ihre Nachricht lesen nur die Mitglieder des Elternrats. Name und E-Mail-Adresse sind freiwillig; ohne E-Mail können wir Ihnen allerdings nicht antworten.',
        ),
      },
    ],
  },
}

export function standardSeite(slug: string): Vorlage | null {
  const vorlage = vorlagen[slug as keyof typeof vorlagen]
  return vorlage ? { ...vorlage, slug } : null
}
