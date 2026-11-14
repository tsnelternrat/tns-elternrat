import type { MetadataRoute } from 'next'

import { basisUrl } from '@/lib/basisUrl'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${basisUrl()}/sitemap.xml`,
  }
}
