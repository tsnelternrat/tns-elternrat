import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Benutzer:in', plural: 'Benutzer:innen' },
  admin: { useAsTitle: 'email', group: 'Verwaltung' },
  auth: true,
  fields: [{ name: 'name', type: 'text', label: 'Name' }],
}
