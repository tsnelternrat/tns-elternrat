import type { CollectionConfig } from 'payload'

import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { schuljahrField } from '../lib/fields'

export const Protokolle: CollectionConfig = {
  slug: 'protokolle',
  labels: { singular: 'Protokoll', plural: 'Protokolle' },
  admin: { useAsTitle: 'titel', group: 'Archiv', defaultColumns: ['titel', 'datum', 'schuljahr'] },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  defaultSort: '-datum',
  upload: { mimeTypes: ['application/pdf'] },
  fields: [
    { name: 'titel', type: 'text', label: 'Titel', required: true, admin: { description: 'Zum Beispiel «Protokoll vom 18. Mai 2026».' } },
    { name: 'datum', type: 'date', label: 'Sitzungsdatum', required: true, admin: { date: { displayFormat: 'd.M.yyyy' } } },
    schuljahrField,
  ],
}
