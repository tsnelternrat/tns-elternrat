import type { Payload, PayloadRequest } from 'payload'

/**
 * Bilder-Ordner (Payload «folders», siehe Media.ts). Bilder einer Fotogalerie liegen in
 * «Fotogalerien › <Titel der Galerie>», alle anderen dort, wo sie jemand im Admin hinlegt.
 */

export const GALERIEN_ORDNER = 'Fotogalerien'

async function ordner(
  payload: Payload,
  name: string,
  eltern: number | null,
  req?: Partial<PayloadRequest>,
): Promise<number> {
  const { docs } = await payload.find({
    collection: 'payload-folders',
    where: {
      and: [
        { name: { equals: name } },
        eltern ? { folder: { equals: eltern } } : { folder: { exists: false } },
      ],
    },
    limit: 1,
    depth: 0,
    req,
  })
  if (docs[0]) return docs[0].id
  // Direkt über den Datenbank-Adapter: Der Payload-Hook reparentChildFolder liest den Elternordner
  // ohne req, also ausserhalb der Transaktion, und findet einen eben erst angelegten Ordner nicht.
  // Für einen neuen Ordner ist seine Zyklus-Prüfung ohnehin überflüssig.
  const neu = await payload.db.create({
    collection: 'payload-folders',
    data: { name, folder: eltern, folderType: ['media'] },
    req,
  })
  return neu.id as number
}

/** Legt Bilder der Galerie, die noch in keinem Ordner liegen, in den Ordner der Galerie. */
export async function bilderEinordnen(
  payload: Payload,
  galerie: { titel: string; bilder?: (number | { id: number })[] | null },
  req?: Partial<PayloadRequest>,
): Promise<number> {
  const ids = (galerie.bilder ?? []).map((b) => (typeof b === 'object' ? b.id : b))
  if (!ids.length) return 0
  const { docs: offen } = await payload.find({
    collection: 'media',
    where: { and: [{ id: { in: ids } }, { folder: { exists: false } }] },
    pagination: false,
    depth: 0,
    req,
  })
  if (!offen.length) return 0
  const oben = await ordner(payload, GALERIEN_ORDNER, null, req)
  const ziel = await ordner(payload, galerie.titel, oben, req)
  await payload.update({
    collection: 'media',
    where: { id: { in: offen.map((b) => b.id) } },
    data: { folder: ziel },
    depth: 0,
    req,
  })
  return offen.length
}

/** Einmalig für den Bestand: alle Galerien einordnen, übrige Bilder in «Website». */
export async function bestandEinordnen(payload: Payload, req?: Partial<PayloadRequest>) {
  const { docs: galerien } = await payload.find({
    collection: 'galerien',
    pagination: false,
    depth: 0,
    req,
  })
  let anzahl = 0
  for (const g of galerien) anzahl += await bilderEinordnen(payload, g, req)
  const { docs: rest } = await payload.find({
    collection: 'media',
    where: { folder: { exists: false } },
    pagination: false,
    depth: 0,
    req,
  })
  if (rest.length) {
    const website = await ordner(payload, 'Website', null, req)
    await payload.update({
      collection: 'media',
      where: { id: { in: rest.map((b) => b.id) } },
      data: { folder: website },
      depth: 0,
      req,
    })
  }
  return { galerien: galerien.length, inGalerien: anzahl, website: rest.length }
}
