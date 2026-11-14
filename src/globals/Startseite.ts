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
      'Die Startseite besteht aus diesen Blöcken. Solange hier nichts steht, wird eine einfache Standard-Startseite gezeigt.',
    ),
  ],
}
