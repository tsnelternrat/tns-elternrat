import type { Block, Field } from 'payload'

/**
 * Bausteine, aus denen sich jede Seite zusammensetzen lässt.
 * Die Darstellung steht in src/components/bloecke/, die Zuordnung slug → Komponente in Bloecke.tsx.
 * Neue Blöcke hier definieren, in `alleBloecke` aufnehmen und in Bloecke.tsx rendern.
 */

const titel: Field = { name: 'titel', type: 'text', label: 'Überschrift' }

const istLink = (wert: unknown) =>
  !wert ||
  (typeof wert === 'string' && /^(\/|#|https?:\/\/|mailto:)/.test(wert)) ||
  'Bitte eine Adresse wie «/elternbox», «https://…» oder «mailto:…» angeben.'

const knoepfe: Field = {
  name: 'knoepfe',
  type: 'array',
  label: 'Knöpfe',
  labels: { singular: 'Knopf', plural: 'Knöpfe' },
  maxRows: 3,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', label: 'Beschriftung', required: true },
        {
          name: 'ziel',
          type: 'text',
          label: 'Ziel',
          required: true,
          validate: istLink,
          admin: { description: 'Zum Beispiel /elternbox oder https://…' },
        },
        {
          name: 'stil',
          type: 'select',
          label: 'Stil',
          defaultValue: 'voll',
          options: [
            { label: 'Dunkel', value: 'voll' },
            { label: 'Hell', value: 'hell' },
          ],
          admin: { width: '20%' },
        },
      ],
    },
  ],
}

export const Buehne: Block = {
  slug: 'buehne',
  interfaceName: 'BuehneBlock',
  labels: { singular: 'Bühne (grosser Einstieg)', plural: 'Bühnen' },
  fields: [
    { name: 'titel', type: 'text', label: 'Titel', required: true },
    { name: 'text', type: 'richText', label: 'Text' },
    { name: 'bild', type: 'upload', relationTo: 'media', label: 'Bild' },
    knoepfe,
  ],
}

export const TextBlock: Block = {
  slug: 'text',
  interfaceName: 'TextBlock',
  labels: { singular: 'Text', plural: 'Texte' },
  fields: [
    titel,
    { name: 'text', type: 'richText', label: 'Text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'breite',
          type: 'select',
          label: 'Breite',
          defaultValue: 'schmal',
          options: [
            { label: 'Lesebreite', value: 'schmal' },
            { label: 'Ganze Breite', value: 'voll' },
          ],
        },
        { name: 'gross', type: 'checkbox', label: 'Grössere Schrift (Einleitung)' },
      ],
    },
  ],
}

export const BildText: Block = {
  slug: 'bildText',
  interfaceName: 'BildTextBlock',
  labels: { singular: 'Bild mit Text', plural: 'Bilder mit Text' },
  fields: [
    titel,
    { name: 'text', type: 'richText', label: 'Text' },
    {
      type: 'row',
      fields: [
        { name: 'bild', type: 'upload', relationTo: 'media', label: 'Bild', required: true },
        {
          name: 'bildPosition',
          type: 'select',
          label: 'Bild',
          defaultValue: 'rechts',
          options: [
            { label: 'Rechts', value: 'rechts' },
            { label: 'Links', value: 'links' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'legende', type: 'text', label: 'Bildlegende' },
        { name: 'gross', type: 'checkbox', label: 'Grössere Schrift (Einleitung)' },
      ],
    },
  ],
}

export const Karten: Block = {
  slug: 'karten',
  interfaceName: 'KartenBlock',
  labels: { singular: 'Karten', plural: 'Karten' },
  fields: [
    titel,
    {
      name: 'spalten',
      type: 'select',
      label: 'Spalten',
      defaultValue: '2',
      options: [
        { label: 'Zwei', value: '2' },
        { label: 'Drei', value: '3' },
      ],
    },
    {
      name: 'karten',
      type: 'array',
      label: 'Karten',
      labels: { singular: 'Karte', plural: 'Karten' },
      minRows: 1,
      fields: [
        { name: 'titel', type: 'text', label: 'Titel', required: true },
        { name: 'text', type: 'textarea', label: 'Text' },
        {
          type: 'row',
          fields: [
            { name: 'linkLabel', type: 'text', label: 'Knopf-Beschriftung' },
            { name: 'linkZiel', type: 'text', label: 'Knopf-Ziel', validate: istLink },
            {
              name: 'farbig',
              type: 'checkbox',
              label: 'Farbig hervorheben',
              admin: { width: '20%' },
            },
          ],
        },
      ],
    },
  ],
}

export const Downloads: Block = {
  slug: 'downloads',
  interfaceName: 'DownloadsBlock',
  labels: { singular: 'Dokumente', plural: 'Dokumente' },
  fields: [
    titel,
    {
      name: 'dokumente',
      type: 'relationship',
      relationTo: 'dokumente',
      hasMany: true,
      label: 'Dokumente',
      required: true,
    },
  ],
}

export const Video: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    titel,
    {
      name: 'url',
      type: 'text',
      label: 'YouTube-Link',
      required: true,
      validate: (wert: unknown) =>
        (typeof wert === 'string' && /youtu\.?be/.test(wert)) ||
        'Bitte einen YouTube-Link angeben.',
    },
  ],
}

export const GalerieBlock: Block = {
  slug: 'galerie',
  interfaceName: 'GalerieBlock',
  labels: { singular: 'Fotogalerie', plural: 'Fotogalerien' },
  fields: [
    titel,
    {
      name: 'galerie',
      type: 'relationship',
      relationTo: 'galerien',
      label: 'Galerie',
      required: true,
    },
  ],
}

/* ── Teaser auf die Collections ─────────────────────────────────────────── */

export const Aktuell: Block = {
  slug: 'aktuell',
  interfaceName: 'AktuellBlock',
  labels: { singular: 'Aktuell (je das Neuste)', plural: 'Aktuell' },
  fields: [
    { ...titel, defaultValue: 'Aktuell' },
    {
      name: 'zeigen',
      type: 'select',
      label: 'Zeigen',
      hasMany: true,
      required: true,
      defaultValue: ['bulletin', 'protokoll', 'galerie'],
      options: [
        { label: 'Neustes Bulletin', value: 'bulletin' },
        { label: 'Letztes Protokoll', value: 'protokoll' },
        { label: 'Neuste Fotogalerie', value: 'galerie' },
      ],
      admin: { description: 'Wird automatisch aktuell gehalten.' },
    },
  ],
}

export const Liste: Block = {
  slug: 'liste',
  interfaceName: 'ListeBlock',
  labels: { singular: 'Liste aus dem Archiv', plural: 'Listen aus dem Archiv' },
  fields: [
    titel,
    {
      type: 'row',
      fields: [
        {
          name: 'quelle',
          type: 'select',
          label: 'Was',
          required: true,
          defaultValue: 'protokolle',
          options: [
            { label: 'Protokolle', value: 'protokolle' },
            { label: 'Bulletins', value: 'bulletins' },
            { label: 'Fotogalerien', value: 'galerien' },
            { label: 'Arbeitsgruppen', value: 'arbeitsgruppen' },
          ],
        },
        {
          name: 'anzahl',
          type: 'number',
          label: 'Wie viele',
          defaultValue: 3,
          min: 1,
          admin: { width: '20%', description: 'Leer lassen für alle.' },
        },
        {
          name: 'darstellung',
          type: 'select',
          label: 'Darstellung',
          defaultValue: 'karten',
          options: [
            { label: 'Karten', value: 'karten' },
            { label: 'Liste', value: 'liste' },
            { label: 'Liste nach Schuljahr', value: 'schuljahr' },
          ],
          admin: { description: '«Nach Schuljahr» gilt für Protokolle und Bulletins.' },
        },
      ],
    },
    {
      name: 'arbeitsgruppen',
      type: 'relationship',
      relationTo: 'arbeitsgruppen',
      hasMany: true,
      label: 'Nur diese Arbeitsgruppen',
      admin: {
        condition: (_, block) => block?.quelle === 'arbeitsgruppen',
        description: 'Leer lassen für alle aktiven Arbeitsgruppen.',
      },
    },
    {
      name: 'linkAlle',
      type: 'checkbox',
      label: 'Link «Alle anzeigen» darunter',
      defaultValue: true,
    },
  ],
}

export const ArchivUebersicht: Block = {
  slug: 'archiv',
  interfaceName: 'ArchivBlock',
  labels: { singular: 'Archiv-Übersicht', plural: 'Archiv-Übersichten' },
  // Drei Karten zu Protokollen, Bulletins und Fotos mit Anzahl und je einem Kurztext.
  fields: [
    titel,
    { name: 'protokolleText', type: 'textarea', label: 'Kurztext Protokolle' },
    { name: 'bulletinsText', type: 'textarea', label: 'Kurztext Bulletins' },
    { name: 'fotosText', type: 'textarea', label: 'Kurztext Fotos' },
  ],
}

export const Hinweis: Block = {
  slug: 'hinweis',
  interfaceName: 'HinweisBlock',
  labels: { singular: 'Hinweis (farbige Box)', plural: 'Hinweise' },
  fields: [{ name: 'text', type: 'richText', label: 'Text', required: true }],
}

/* ── Blöcke mit festem Inhalt aus Globals und Collections ───────────────── */

export const Personen: Block = {
  slug: 'personen',
  interfaceName: 'PersonenBlock',
  labels: { singular: 'Vorstand und Delegierte', plural: 'Vorstand und Delegierte' },
  // Die Personen selbst werden im Global «Elternrat» gepflegt.
  fields: [
    {
      ...titel,
      defaultValue: 'Wer im Schuljahr {schuljahr} dabei ist',
      admin: {
        description: '{schuljahr} wird durch das Schuljahr aus dem Global «Elternrat» ersetzt.',
      },
    },
  ],
}

export const AlleArbeitsgruppen: Block = {
  slug: 'arbeitsgruppen',
  interfaceName: 'ArbeitsgruppenBlock',
  labels: { singular: 'Alle Arbeitsgruppen', plural: 'Alle Arbeitsgruppen' },
  // Alle Arbeitsgruppen mit Beschreibung und Beteiligten, auch ruhende. Ziel der Links /arbeitsgruppen#slug.
  fields: [titel],
}

export const ElternboxFormular: Block = {
  slug: 'elternbox',
  interfaceName: 'ElternboxBlock',
  labels: { singular: 'Elternbox-Formular', plural: 'Elternbox-Formulare' },
  fields: [titel],
}

export const alleBloecke: Block[] = [
  Buehne,
  TextBlock,
  BildText,
  Karten,
  Downloads,
  Video,
  GalerieBlock,
  Aktuell,
  Liste,
  ArchivUebersicht,
  Hinweis,
  Personen,
  AlleArbeitsgruppen,
  ElternboxFormular,
]

/** Blockfeld für Seiten und Globals. */
export const inhaltField = (name: string, label: string, description?: string): Field => ({
  name,
  type: 'blocks',
  label,
  labels: { singular: 'Block', plural: 'Blöcke' },
  blocks: alleBloecke,
  admin: { description, initCollapsed: true },
})
