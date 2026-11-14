import type { MetadataRoute } from 'next'

import { basisUrl } from '@/lib/basisUrl'
import { hatDetailseite, payloadClient } from '@/lib/data'
import { standardAdressen } from '@/lib/standardSeiten'

// Liegt ausserhalb der Layouts, die der Admin nach Änderungen erneuert; darum zusätzlich stündlich.
export const revalidate = 3600

/** Alle öffentlichen Seiten. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await payloadClient()
  const [seiten, arbeitsgruppen, galerien] = await Promise.all([
    payload.find({
      collection: 'seiten',
      pagination: false,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({ collection: 'arbeitsgruppen', pagination: false, depth: 0 }),
    payload.find({
      collection: 'galerien',
      pagination: false,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
  ])
  const basis = basisUrl()
  const adressen = new Map<string, string | undefined>([['', undefined]])
  for (const slug of standardAdressen) adressen.set(slug, undefined)
  for (const s of seiten.docs) if (s.slug) adressen.set(s.slug, s.updatedAt)
  for (const ag of arbeitsgruppen.docs)
    if (ag.slug && hatDetailseite(ag)) adressen.set(`arbeitsgruppen/${ag.slug}`, ag.updatedAt)
  for (const g of galerien.docs) if (g.slug) adressen.set(`archiv/fotos/${g.slug}`, g.updatedAt)
  return [...adressen].map(([pfad, geaendert]) => ({
    url: pfad ? `${basis}/${pfad}` : basis,
    ...(geaendert ? { lastModified: geaendert } : {}),
  }))
}
