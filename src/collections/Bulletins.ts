import type { CollectionConfig } from 'payload'

import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { schuljahrField } from '../lib/fields'

export const Bulletins: CollectionConfig = {
  slug: 'bulletins',
  labels: { singular: 'Bulletin', plural: 'Bulletins' },
  admin: { useAsTitle: 'titel', group: 'Archiv', defaultColumns: ['titel', 'datum', 'schuljahr'] },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  defaultSort: '-datum',
  upload: { mimeTypes: ['application/pdf'] },
  fields: [
    { name: 'titel', type: 'text', label: 'Titel', required: true, admin: { description: 'Zum Beispiel «Bulletin Frühling 2026».' } },
    { name: 'datum', type: 'date', label: 'Erscheinungsdatum', required: true, admin: { date: { displayFormat: 'd.M.yyyy' } } },
    schuljahrField,
    { name: 'titelbild', type: 'upload', relationTo: 'media', label: 'Titelbild', admin: { description: 'Optional: Bild der Titelseite.' } },
  ],
}
