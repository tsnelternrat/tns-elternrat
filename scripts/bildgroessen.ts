/**
 * Rechnet fehlende Bildgrössen bestehender Bilder nach, mit denselben Einstellungen wie Payload bei
 * neuen Uploads (imageSizes in src/collections/Media.ts). Erzeugt pro Bild nur Grössen, die fehlen
 * oder noch kein WebP sind. Die Originale bleiben unverändert.
 *
 *   pnpm bildgroessen --probe <ordner>       nur ansehen: erste 5 Bilder lokal nach <ordner> schreiben
 *   pnpm bildgroessen [--prod]               nachrechnen, in den Blob-Store laden, Datenbank anpassen
 *   pnpm bildgroessen --aufraeumen [--prod]  danach: ersetzte alte Dateien aus dem Blob-Store löschen
 *
 * Braucht ein gültiges BLOB_READ_WRITE_TOKEN. Ersetzte Dateien stehen in backups/bildgroessen-alt.txt.
 * Danach die Website neu erzeugen (Deploy), die Seiten sind statisch.
 */
import { del, put } from '@vercel/blob'
import fs from 'fs/promises'
import path from 'path'
import { getPayload, type ImageSize } from 'payload'
import sharp, { type WebpOptions } from 'sharp'

import { Media } from '../src/collections/Media'
import config from '../src/payload.config'

process.env.PAYLOAD_SKIP_REVALIDATE = 'true'

const args = process.argv.slice(2)
const datenbank = process.env.DATABASE_URL ?? ''
const lokal = /@(localhost|127\.0\.0\.1)[:/]/.test(datenbank)
const token = process.env.BLOB_READ_WRITE_TOKEN
const ALTE_DATEIEN = path.resolve('backups/bildgroessen-alt.txt')
const probe = args.includes('--probe') ? args[args.indexOf('--probe') + 1] : null

const upload = Media.upload as { imageSizes: ImageSize[] }
const groessen = upload.imageSizes

type Eintrag = {
  filename: string
  filesize: number
  width: number
  height: number
  mimeType: string
  url: string
}
type Gespeichert = Partial<Record<string, Partial<Eintrag> | undefined>>

/** Wie Payload: EXIF-Drehung anwenden, dann skalieren bzw. mittig zuschneiden, als WebP. */
async function erzeuge(original: Buffer, name: string, g: ImageSize) {
  const { data, info } = await sharp(original)
    .rotate()
    .resize({
      width: g.width ?? undefined,
      height: g.height ?? undefined,
      fit: g.fit ?? 'cover',
      withoutEnlargement: g.withoutEnlargement,
    })
    .webp(g.formatOptions?.options as WebpOptions)
    .toBuffer({ resolveWithObject: true })
  const filename = `${name.replace(/\.[^.]+$/, '')}-${info.width}x${info.height}.webp`
  return {
    data,
    eintrag: {
      filename,
      filesize: data.length,
      width: info.width,
      height: info.height,
      mimeType: 'image/webp',
      url: `/api/media/file/${filename}`,
    } satisfies Eintrag,
  }
}

/** Gespeicherte Grösse in der Form, wie Payload sie in der Datenbank ablegt (relative URL). */
const wieGespeichert = (s: Partial<Eintrag>) => ({
  ...s,
  url: s.filename ? `/api/media/file/${s.filename}` : null,
})

async function main() {
  if (!lokal && !args.includes('--prod')) {
    console.error(
      'DATABASE_URL zeigt nicht auf die lokale Datenbank. Für Prod ausdrücklich --prod angeben.',
    )
    process.exit(1)
  }

  if (args.includes('--aufraeumen')) {
    const urls = (await fs.readFile(ALTE_DATEIEN, 'utf8')).split('\n').filter(Boolean)
    for (let i = 0; i < urls.length; i += 100) await del(urls.slice(i, i + 100), { token })
    console.log(`${urls.length} alte Dateien gelöscht.`)
    process.exit(0)
  }

  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'media', pagination: false, depth: 0 })
  const fehlend = (d: (typeof docs)[number]) =>
    groessen.filter((g) => (d.sizes as Gespeichert)?.[g.name]?.mimeType !== 'image/webp')
  const offen = docs.filter((d) => d.url && d.filename && fehlend(d).length)
  console.log(`${offen.length} von ${docs.length} Bildern nachzurechnen.`)

  if (probe) {
    await fs.mkdir(probe, { recursive: true })
    for (const d of offen.slice(0, 5)) {
      const original = Buffer.from(await (await fetch(d.url!)).arrayBuffer())
      for (const g of fehlend(d)) {
        const { data, eintrag } = await erzeuge(original, d.filename!, g)
        await fs.writeFile(path.join(probe, eintrag.filename), data)
        console.log(`${eintrag.filename}: ${Math.round(eintrag.filesize / 1024)} kB`)
      }
    }
    process.exit(0)
  }

  if (!token?.match(/^vercel_blob_rw_[a-z\d]+_[a-z\d]+$/i) || token.endsWith('_nurlesen')) {
    console.error('Kein gültiges BLOB_READ_WRITE_TOKEN.')
    process.exit(1)
  }

  await fs.mkdir(path.dirname(ALTE_DATEIEN), { recursive: true })
  let bytes = 0
  for (const d of offen) {
    const original = Buffer.from(await (await fetch(d.url!)).arrayBuffer())
    const vorhanden = (d.sizes ?? {}) as Gespeichert
    const sizes: Record<string, unknown> = {}
    // Alle Grössen mitschreiben, damit nichts überschrieben wird; neue ersetzen die fehlenden.
    for (const g of groessen)
      if (vorhanden[g.name]) sizes[g.name] = wieGespeichert(vorhanden[g.name]!)
    const ersetzt: string[] = []
    for (const g of fehlend(d)) {
      const { data, eintrag } = await erzeuge(original, d.filename!, g)
      await put(eintrag.filename, data, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 60 * 60 * 24 * 365,
        contentType: 'image/webp',
        token,
      })
      const alt = vorhanden[g.name]
      if (alt?.url && alt.filename && alt.filename !== eintrag.filename) ersetzt.push(alt.url)
      sizes[g.name] = eintrag
      bytes += eintrag.filesize
    }
    await payload.db.updateOne({ collection: 'media', id: d.id, data: { sizes } })
    // Ersetzte Dateien erst nach erfolgreicher Umstellung vormerken; gelöscht wird mit --aufraeumen.
    if (ersetzt.length) await fs.appendFile(ALTE_DATEIEN, ersetzt.map((u) => `${u}\n`).join(''))
    console.log(
      `${d.filename}: ${fehlend(d)
        .map((g) => g.name)
        .join(', ')}`,
    )
  }
  console.log(
    `Fertig: ${offen.length} Bilder, ${(bytes / 1024 / 1024).toFixed(1)} MB neue Dateien.`,
  )
  process.exit(0)
}

// Top-Level-await: `payload run` beendet den Prozess, sobald das Modul geladen ist.
try {
  await main()
} catch (fehler) {
  console.error(fehler)
  process.exit(1)
}
