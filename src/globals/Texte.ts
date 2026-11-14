import type { GlobalConfig } from 'payload'

import { inhaltField } from '../blocks'
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
  // Die Reiter dienen nur der Übersicht im Admin; die Felder liegen weiterhin direkt im Global.
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Arbeitsgruppen',
          fields: [
            {
              name: 'arbeitsgruppenEinleitung',
              type: 'richText',
              label: 'Einleitung der Seite «Arbeitsgruppen»',
            },
            inhaltField(
              'arbeitsgruppenZusatz',
              'Weitere Inhalte',
              'Blöcke unter der Liste der Arbeitsgruppen.',
            ),
          ],
        },
        {
          label: 'Archiv',
          fields: [
            {
              name: 'protokolleEinleitung',
              type: 'textarea',
              label: 'Kurztext zu den Protokollen',
              admin: {
                description: 'Steht auf der Archiv-Übersicht und oben auf der Seite «Protokolle».',
              },
            },
            {
              name: 'bulletinsEinleitung',
              type: 'textarea',
              label: 'Kurztext zu den Bulletins',
              admin: {
                description: 'Steht auf der Archiv-Übersicht und oben auf der Seite «Bulletins».',
              },
            },
            {
              name: 'fotosEinleitung',
              type: 'textarea',
              label: 'Kurztext zu den Fotos',
              admin: {
                description: 'Steht auf der Archiv-Übersicht und oben auf der Seite «Fotos».',
              },
            },
            inhaltField('archivZusatz', 'Weitere Inhalte', 'Blöcke unter den drei Archiv-Karten.'),
          ],
        },
        {
          label: 'Elternbox',
          fields: [
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
            inhaltField('elternboxZusatz', 'Weitere Inhalte', 'Blöcke unter dem Formular.'),
          ],
        },
      ],
    },
  ],
}
