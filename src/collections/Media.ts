import type { CollectionConfig } from 'payload'

import { blobBasis } from '../lib/blob'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

/**
 * Adresse des Vorschaubilds im Admin. Payload setzt sonst /api/media/file/… ein; diese Route gibt es
 * mit disablePayloadAccessControl nicht (Fehler 500), darum zeigte der Admin nur Datei-Symbole.
 */
function vorschau({ doc }: { doc: Record<string, unknown> }) {
  const sizes = doc.sizes as { thumb?: { filename?: string | null } } | undefined
  const datei = sizes?.thumb?.filename || (doc.filename as string | undefined)
  if (!datei) return null
  const basis = blobBasis() ?? '/api/media/file'
  return `${basis}/${encodeURIComponent(datei)}`
}

export const webp = { format: 'webp', options: { quality: 80 } } as const

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Bild', plural: 'Bilder' },
  admin: { group: 'Dateien' },
  // Ordner, z. B. einer pro Anlass; im Admin mit Kachelansicht («Nach Ordnern durchsuchen»).
  folders: true,
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
    // Die Website zeigt nur diese Grössen, als WebP (etwa ein Drittel kleiner als JPEG).
    // Bestehende Bilder umrechnen: scripts/webp-umrechnen.ts (gleiche Einstellungen).
    imageSizes: [
      { name: 'thumb', width: 480, height: 480, fit: 'cover', formatOptions: webp },
      { name: 'mittel', width: 1200, withoutEnlargement: true, formatOptions: webp },
    ],
    adminThumbnail: vorschau,
  },
}
