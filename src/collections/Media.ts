import type { CollectionConfig } from 'payload'

import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Bild', plural: 'Bilder' },
  admin: { group: 'Dateien' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Bildbeschreibung',
      admin: { description: 'Kurze Beschreibung für Menschen, die das Bild nicht sehen können.' },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    // Originale werden beim Hochladen verkleinert, Handyfotos sind sonst mehrere MB gross.
    resizeOptions: { width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true },
    imageSizes: [
      { name: 'thumb', width: 480, height: 480, fit: 'cover' },
      { name: 'mittel', width: 1200, withoutEnlargement: true },
    ],
    adminThumbnail: 'thumb',
  },
}
