import type { CollectionConfig } from 'payload'

import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { slugField, teaserFelder } from '../lib/fields'

export const Arbeitsgruppen: CollectionConfig = {
  slug: 'arbeitsgruppen',
  labels: { singular: 'Arbeitsgruppe', plural: 'Arbeitsgruppen' },
  admin: { useAsTitle: 'name', group: 'Inhalte', defaultColumns: ['name', 'reihenfolge'] },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  defaultSort: 'reihenfolge',
  fields: [
    { name: 'name', type: 'text', label: 'Name', required: true },
    {
      name: 'beschreibung',
      type: 'richText',
      label: 'Kurzbeschreibung',
      required: true,
      admin: { description: 'Ein bis drei Absätze. Erscheint auf der Übersicht aller Arbeitsgruppen.' },
    },
    ...teaserFelder,
    {
      name: 'details',
      type: 'richText',
      label: 'Weitere Informationen',
      admin: {
        description:
          'Optional, zum Beispiel eine Charta oder ein Merkblatt. Sobald hier, bei Dokumenten oder Videos etwas steht, bekommt die Arbeitsgruppe eine eigene Seite.',
      },
    },
    {
      name: 'dokumente',
      type: 'relationship',
      relationTo: 'dokumente',
      hasMany: true,
      label: 'Dokumente zum Herunterladen',
    },
    {
      name: 'videos',
      type: 'array',
      label: 'Videos',
      labels: { singular: 'Video', plural: 'Videos' },
      fields: [
        { name: 'titel', type: 'text', label: 'Titel' },
        {
          name: 'url',
          type: 'text',
          label: 'YouTube-Link',
          required: true,
          validate: (wert: unknown) =>
            (typeof wert === 'string' && /youtu\.?be/.test(wert)) || 'Bitte einen YouTube-Link angeben.',
        },
      ],
    },
    {
      name: 'reihenfolge',
      type: 'number',
      label: 'Reihenfolge',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Kleinere Zahlen erscheinen zuerst.' },
    },
    slugField('name'),
  ],
}
