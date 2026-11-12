import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'

export const Startseite: GlobalConfig = {
  slug: 'startseite',
  label: 'Startseite',
  admin: { group: 'Inhalte' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: 'titel', type: 'text', label: 'Titel', required: true, defaultValue: 'Willkommen beim Elternrat' },
    { name: 'einleitung', type: 'richText', label: 'Begrüssungstext' },
    { name: 'bild', type: 'upload', relationTo: 'media', label: 'Bild' },
  ],
}
