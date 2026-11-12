import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { de } from '@payloadcms/translations/languages/de'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Arbeitsgruppen } from './collections/Arbeitsgruppen'
import { Bulletins } from './collections/Bulletins'
import { Dokumente } from './collections/Dokumente'
import { Galerien } from './collections/Galerien'
import { Media } from './collections/Media'
import { Nachrichten } from './collections/Nachrichten'
import { Protokolle } from './collections/Protokolle'
import { Users } from './collections/Users'
import { Elternrat } from './globals/Elternrat'
import { Startseite } from './globals/Startseite'
import { Texte } from './globals/Texte'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Alle Dateien sind öffentlich: Links zeigen direkt auf den Blob-Store statt über Payload zu laufen.
const direkt = { disablePayloadAccessControl: true } as const

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Elternrat TSN' },
  },
  i18n: { supportedLanguages: { de }, fallbackLanguage: 'de' },
  // Die Reihenfolge hier bestimmt die Reihenfolge der Gruppen im Admin-Menü.
  collections: [Nachrichten, Arbeitsgruppen, Protokolle, Bulletins, Galerien, Media, Dokumente, Users],
  globals: [Startseite, Elternrat, Texte],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
  }),
  // Ohne RESEND_API_KEY werden keine E-Mails verschickt; Elternbox-Nachrichten landen dann nur im Admin.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM || 'elternbox@tsn-elternrat.ch',
        defaultFromName: 'Elternrat TSN',
      })
    : undefined,
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: direkt, protokolle: direkt, bulletins: direkt, dokumente: direkt },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Dateien gehen direkt vom Browser in den Blob-Store; sonst gilt auf Vercel das 4.5-MB-Limit pro Anfrage.
      clientUploads: true,
    }),
  ],
})
