import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'
import { schuljahrField } from '../lib/fields'

export const Elternrat: GlobalConfig = {
  slug: 'elternrat',
  label: 'Elternrat',
  admin: { group: 'Inhalte', description: 'Seite «Elternrat»: Einleitung, Vorstand und Delegierte.' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Über den Elternrat',
          fields: [
            { name: 'einleitung', type: 'richText', label: 'Einleitung' },
            { name: 'foto', type: 'upload', relationTo: 'media', label: 'Gruppenfoto' },
            { name: 'fotoLegende', type: 'text', label: 'Bildlegende' },
            {
              name: 'dokumente',
              type: 'relationship',
              relationTo: 'dokumente',
              hasMany: true,
              label: 'Dokumente zum Herunterladen',
              admin: { description: 'Zum Beispiel Flyer und Konzept.' },
            },
          ],
        },
        {
          label: 'Vorstand und Delegierte',
          description: 'Zu Beginn jedes Schuljahres anpassen.',
          fields: [
            schuljahrField,
            {
              name: 'vorstand',
              type: 'array',
              label: 'Vorstand',
              labels: { singular: 'Amt', plural: 'Ämter' },
              admin: { initCollapsed: false },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'rolle', type: 'text', label: 'Amt', required: true, admin: { width: '40%' } },
                    { name: 'personen', type: 'text', label: 'Person(en)', required: true },
                  ],
                },
              ],
            },
            {
              name: 'klassen',
              type: 'array',
              label: 'Elternvertretungen der Klassen',
              labels: { singular: 'Klasse', plural: 'Klassen' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'stufe',
                      type: 'select',
                      label: 'Stufe',
                      required: true,
                      options: [
                        { label: 'Kindergarten', value: 'kg' },
                        { label: '1.–3. Klasse', value: 'unterstufe' },
                        { label: '4.–6. Klasse', value: 'mittelstufe' },
                      ],
                      admin: { width: '25%' },
                    },
                    {
                      name: 'klasse',
                      type: 'text',
                      label: 'Klasse',
                      required: true,
                      admin: { description: 'Lehrpersonen oder Standort, z. B. «Bandi/Stählin».' },
                    },
                    {
                      name: 'delegierte',
                      type: 'text',
                      label: 'Delegierte',
                      required: true,
                      admin: { description: 'Namen mit Komma trennen.' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'weitere',
              type: 'array',
              label: 'Weitere Aufgaben',
              labels: { singular: 'Aufgabe', plural: 'Aufgaben' },
              admin: { description: 'Zum Beispiel Sprachgruppen oder Website.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'rolle', type: 'text', label: 'Aufgabe', required: true, admin: { width: '40%' } },
                    { name: 'personen', type: 'text', label: 'Person(en)', required: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
