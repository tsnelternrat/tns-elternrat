import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'

export const Texte: GlobalConfig = {
  slug: 'texte',
  label: 'Texte und Einstellungen',
  admin: { group: 'Inhalte' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'arbeitsgruppenEinleitung',
      type: 'richText',
      label: 'Einleitung der Seite «Arbeitsgruppen»',
    },
    {
      name: 'elternboxEinleitung',
      type: 'richText',
      label: 'Einleitung der Elternbox',
    },
    {
      name: 'benachrichtigungsEmail',
      type: 'email',
      label: 'Benachrichtigung an',
      access: { read: ({ req }) => Boolean(req.user) },
      admin: { description: 'An diese Adresse geht eine E-Mail, sobald jemand in die Elternbox schreibt.' },
    },
  ],
}
