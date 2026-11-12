import type { CollectionConfig } from 'payload'

import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Dokumente: CollectionConfig = {
  slug: 'dokumente',
  labels: { singular: 'Dokument', plural: 'Dokumente' },
  admin: { useAsTitle: 'titel', group: 'Dateien', defaultColumns: ['titel', 'filename'] },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  defaultSort: 'titel',
  upload: { mimeTypes: ['application/pdf'] },
  fields: [
    { name: 'titel', type: 'text', label: 'Titel', required: true },
  ],
}
