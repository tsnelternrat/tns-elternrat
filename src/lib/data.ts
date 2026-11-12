import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Arbeitsgruppen, Dokumente, Media } from '@/payload-types'

export const payloadClient = cache(async () => getPayload({ config }))

/** Beziehungsfelder kommen je nach Tiefe als ID oder als Dokument zurück. */
export function alsDokument<T extends { id: number }>(wert: number | T | null | undefined): T | null {
  return wert && typeof wert === 'object' ? wert : null
}

export function alsListe<T extends { id: number }>(werte: (number | T)[] | null | undefined): T[] {
  return (werte ?? []).filter((w): w is T => typeof w === 'object' && w !== null)
}

export function bildUrl(bild: Media | null, groesse?: 'thumb' | 'mittel'): string | null {
  if (!bild) return null
  return (groesse && bild.sizes?.[groesse]?.url) || bild.url || null
}

export const datum = (wert: string, stil: 'lang' | 'monat' = 'lang'): string =>
  new Intl.DateTimeFormat('de-CH', {
    timeZone: 'Europe/Zurich',
    ...(stil === 'lang' ? { day: 'numeric', month: 'long', year: 'numeric' } : { month: 'long', year: 'numeric' }),
  }).format(new Date(wert))

export function dateigroesse(datei: Pick<Dokumente, 'filesize'>): string {
  const bytes = datei.filesize ?? 0
  if (!bytes) return 'PDF'
  return bytes > 1e6 ? `PDF, ${(bytes / 1e6).toFixed(1)} MB` : `PDF, ${Math.max(1, Math.round(bytes / 1e3))} KB`
}

/** Gruppiert nach Schuljahr, neuestes zuerst; die Reihenfolge innerhalb bleibt erhalten. */
export function nachSchuljahr<T extends { schuljahr: string }>(eintraege: T[]): [string, T[]][] {
  const gruppen = new Map<string, T[]>()
  for (const e of eintraege) gruppen.set(e.schuljahr, [...(gruppen.get(e.schuljahr) ?? []), e])
  return [...gruppen.entries()].sort(([a], [b]) => b.localeCompare(a))
}

export function youtubeId(url: string): string | null {
  const treffer = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/)
  return treffer ? treffer[1] : null
}

export const hatDetailseite = (ag: Arbeitsgruppen): boolean =>
  Boolean(ag.details || ag.dokumente?.length || ag.videos?.length)
