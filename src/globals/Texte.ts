import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'

/** Zerlegt die Eingabe «a@x.ch, b@y.ch» in einzelne Adressen. */
export const adressen = (wert: unknown): string[] =>
  String(wert ?? '')
    .split(/[,;\s]+/)
    .filter(Boolean)

export const Texte: GlobalConfig = {
  slug: 'texte',
  label: 'Texte und Einstellungen',
  admin: { group: 'Einstellungen' },
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
      type: 'text',
      label: 'Benachrichtigung an',
      access: { read: ({ req }) => Boolean(req.user) },
      validate: (wert: unknown) =>
        adressen(wert).every((a) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a)) ||
        'Bitte gültige E-Mail-Adressen angeben, mehrere durch Komma getrennt.',
      admin: {
        description:
          'An diese Adressen geht eine E-Mail, sobald jemand in die Elternbox schreibt. Mehrere Adressen durch Komma trennen.',
      },
    },
  ],
}
