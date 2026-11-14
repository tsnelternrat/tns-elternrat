import type { CollectionConfig } from 'payload'

import { inhaltField } from '../blocks'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { slugField } from '../lib/fields'

/** Adressen, die schon eine feste Seite haben. Eine frei gebaute Seite darf sie nicht belegen. */
export const vergebeneAdressen = [
  'admin',
  'api',
  'arbeitsgruppen',
  'archiv',
  'elternbox',
  'elternrat',
  'seiten',
]

export const Seiten: CollectionConfig = {
  slug: 'seiten',
  labels: { singular: 'Seite', plural: 'Seiten' },
  admin: {
    useAsTitle: 'titel',
    group: 'Inhalte',
    defaultColumns: ['titel', 'slug', 'inNavigation'],
    description: 'Frei aus Blöcken gebaute Seiten, erreichbar unter /adresse.',
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  defaultSort: 'reihenfolge',
  fields: [
    { name: 'titel', type: 'text', label: 'Titel', required: true },
    {
      name: 'titelZeigen',
      type: 'checkbox',
      label: 'Titel als Überschrift zeigen',
      defaultValue: true,
      admin: {
        description:
          'Ausschalten, wenn der erste Block (z. B. eine Bühne) schon eine Überschrift hat.',
      },
    },
    inhaltField('inhalt', 'Inhalt'),
    {
      name: 'beschreibung',
      type: 'textarea',
      label: 'Kurzbeschreibung für Suchmaschinen',
      admin: { position: 'sidebar' },
    },
    {
      name: 'inNavigation',
      type: 'checkbox',
      label: 'In der Navigation zeigen',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'reihenfolge',
      type: 'number',
      label: 'Reihenfolge',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
        description: 'In der Navigation erscheinen kleinere Zahlen zuerst.',
      },
    },
    slugField(
      'titel',
      (wert) =>
        !vergebeneAdressen.includes(String(wert)) ||
        `«${wert}» ist schon eine feste Seite. Bitte eine andere Adresse wählen.`,
    ),
  ],
}
