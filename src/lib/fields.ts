import type { Field } from 'payload'

import { istSchuljahr, schuljahrVon } from './schuljahr'
import { slugify } from './slug'

export const schuljahrField: Field = {
  name: 'schuljahr',
  type: 'text',
  label: 'Schuljahr',
  required: true,
  index: true,
  defaultValue: () => schuljahrVon(new Date()),
  validate: (wert: unknown) => istSchuljahr(wert) || 'Bitte in der Form 2025/26 angeben.',
  admin: { description: 'Zum Beispiel 2025/26. Danach wird im Archiv gruppiert.' },
}

export const slugField = (quelle: string): Field => ({
  name: 'slug',
  type: 'text',
  label: 'Adresse (Slug)',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Teil der Webadresse. Leer lassen, dann wird er aus dem Titel erzeugt.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const basis = data?.[quelle]
        return typeof basis === 'string' ? slugify(basis) : value
      },
    ],
  },
})
