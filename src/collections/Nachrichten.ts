import type { CollectionConfig } from 'payload'

import { adressen } from '../globals/Texte'

/**
 * Nachrichten aus der Elternbox. Sie entstehen nur über das Formular auf der Website
 * (Server Action mit Local API) und sind nur für angemeldete Personen sichtbar.
 */
export const Nachrichten: CollectionConfig = {
  slug: 'nachrichten',
  labels: { singular: 'Nachricht', plural: 'Nachrichten' },
  admin: {
    useAsTitle: 'vorschau',
    group: 'Elternbox',
    defaultColumns: ['vorschau', 'name', 'createdAt', 'erledigt'],
    description: 'Nachrichten, die Eltern über die Elternbox geschickt haben.',
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-createdAt',
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        try {
          const texte = await req.payload.findGlobal({ slug: 'texte', req })
          const an = adressen(texte.benachrichtigungsEmail)
          if (!an.length || !process.env.RESEND_API_KEY) return doc
          const absender = [doc.name, doc.email].filter(Boolean).join(', ') || 'anonym'
          await req.payload.sendEmail({
            to: an,
            replyTo: doc.email || undefined,
            subject: 'Neue Nachricht in der Elternbox',
            text: `Von: ${absender}\n\n${doc.nachricht}\n\nIm Admin ansehen: ${process.env.NEXT_PUBLIC_SERVER_URL || ''}/admin/collections/nachrichten/${doc.id}`,
          })
        } catch (fehler) {
          // Die Nachricht ist gespeichert; ein fehlgeschlagener Mailversand darf das Formular nicht scheitern lassen.
          req.payload.logger.error({ err: fehler }, 'Elternbox: Benachrichtigung konnte nicht gesendet werden')
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'nachricht', type: 'textarea', label: 'Nachricht', required: true, maxLength: 5000 },
    { name: 'name', type: 'text', label: 'Name', maxLength: 200 },
    { name: 'email', type: 'email', label: 'E-Mail' },
    {
      name: 'vorschau',
      type: 'text',
      label: 'Nachricht',
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const text = String(siblingData?.nachricht ?? '').replace(/\s+/g, ' ').trim()
            return text.length > 70 ? `${text.slice(0, 70)}…` : text
          },
        ],
      },
    },
    {
      name: 'erledigt',
      type: 'checkbox',
      label: 'Erledigt',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
