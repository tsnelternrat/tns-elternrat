import type { GlobalConfig } from 'payload'

import { inhaltField } from '../blocks'
import { revalidateGlobal } from '../hooks/revalidate'

export const Startseite: GlobalConfig = {
  slug: 'startseite',
  label: 'Startseite',
  admin: { group: 'Inhalte' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    inhaltField(
      'inhalt',
      'Inhalt',
      'Die Startseite besteht aus diesen Blöcken. Solange hier nichts steht, wird die bisherige feste Startseite gezeigt.',
    ),
    {
      type: 'collapsible',
      label: 'Bisherige Startseite',
      admin: {
        initCollapsed: true,
        description: 'Wird nur verwendet, solange oben keine Blöcke stehen.',
      },
      fields: [
        {
          name: 'titel',
          type: 'text',
          label: 'Titel',
          required: true,
          defaultValue: 'Willkommen beim Elternrat',
        },
        { name: 'einleitung', type: 'richText', label: 'Begrüssungstext' },
        { name: 'bild', type: 'upload', relationTo: 'media', label: 'Bild' },
      ],
    },
  ],
}
