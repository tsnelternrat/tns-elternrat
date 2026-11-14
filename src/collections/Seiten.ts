import type { CollectionConfig } from 'payload'

import { inhaltField } from '../blocks'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { slugField } from '../lib/fields'

/** Adressen, die Next.js oder Payload selbst belegen. */
export const vergebeneAdressen = ['admin', 'api']

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
      name: 'navigationsTitel',
      type: 'text',
      label: 'Titel in der Navigation',
      admin: {
        position: 'sidebar',
        description: 'Leer lassen, dann wird der Titel verwendet.',
        condition: (data) => Boolean(data?.inNavigation),
      },
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
    slugField('titel', {
      pfad: true,
      pruefen: (wert) =>
        !vergebeneAdressen.includes(String(wert).split('/')[0]) ||
        `«${wert}» ist vom System belegt. Bitte eine andere Adresse wählen.`,
    }),
  ],
}
