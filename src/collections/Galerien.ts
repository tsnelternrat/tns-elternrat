import type { CollectionConfig } from 'payload'

import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { slugField } from '../lib/fields'

export const Galerien: CollectionConfig = {
  slug: 'galerien',
  labels: { singular: 'Fotogalerie', plural: 'Fotogalerien' },
  admin: { useAsTitle: 'titel', group: 'Archiv', defaultColumns: ['titel', 'datum'] },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  defaultSort: '-datum',
  fields: [
    { name: 'titel', type: 'text', label: 'Titel', required: true },
    {
      name: 'datum',
      type: 'date',
      label: 'Datum des Anlasses',
      required: true,
      admin: { date: { displayFormat: 'd.M.yyyy' } },
    },
    {
      name: 'bilder',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Bilder',
      admin: { description: 'Mehrere Bilder auf einmal hochladen oder auswählen.' },
    },
    slugField('titel'),
  ],
}
