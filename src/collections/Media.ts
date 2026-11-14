import type { CollectionConfig } from 'payload'

import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

/**
 * Adresse des Vorschaubilds im Admin. Payload setzt sonst /api/media/file/… ein; diese Route gibt es
 * mit disablePayloadAccessControl nicht (Fehler 500), darum zeigte der Admin nur Datei-Symbole.
 * Gleiche Basis-URL wie @payloadcms/storage-vercel-blob.
 */
function vorschau({ doc }: { doc: Record<string, unknown> }) {
  const sizes = doc.sizes as { thumb?: { filename?: string | null } } | undefined
  const datei = sizes?.thumb?.filename || (doc.filename as string | undefined)
  if (!datei) return null
  const store = process.env.BLOB_READ_WRITE_TOKEN?.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]
  const basis =
    process.env.STORAGE_VERCEL_BLOB_BASE_URL ||
    (store ? `https://${store.toLowerCase()}.public.blob.vercel-storage.com` : '/api/media/file')
  return `${basis}/${encodeURIComponent(datei)}`
}

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
    adminThumbnail: vorschau,
  },
}
