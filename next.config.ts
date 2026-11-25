import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Adressen der alten WordPress-Seite, damit bestehende Links und Suchtreffer weiter funktionieren.
const alteAdressen: [string, string][] = [
  ['/ueber-den-elternrat', '/elternrat'],
  ['/arbeitsgruppen/ag-bulletin', '/arbeitsgruppen#ag-bulletin'],
  [
    '/arbeitsgruppen/ag-elternmitwirkung-auf-stadt-und-schulkreisebene',
    '/arbeitsgruppen#ag-elternkontaktgremium',
  ],
  ['/arbeitsgruppen/ag-weiterbildung', '/arbeitsgruppen#ag-elternbildung'],
  ['/arbeitsgruppen/ag-schueeli', '/arbeitsgruppen'],
  ['/arbeitsgruppen/ag-freiluftlabor', '/arbeitsgruppen'],
  ['/charta-klassenznueni', '/arbeitsgruppen/ag-klassenznueni'],
  ['/lauseplage', '/arbeitsgruppen'],
  ['/dokumente', '/archiv'],
  ['/dokumente/protokolle', '/archiv/protokolle'],
  ['/dokumente/bulletins', '/archiv/bulletins'],
  ['/dokumente/fotogallerien', '/archiv/fotos'],
  ['/dokumente/flyer-ueber-den-elternrat', '/elternrat'],
  ['/dokumente/konzept-elternrat', '/elternrat'],
  ['/dokumente/weiterbildung-fuer-eltern', '/arbeitsgruppen#ag-elternbildung'],
  ['/kontakt', '/elternbox'],
  ['/newsletter', '/'],
  ['/links', '/'],
  ['/bulletin', '/archiv/bulletins']
  
]

const nextConfig: NextConfig = {
  async redirects() {
    return alteAdressen.map(([source, destination]) => ({ source, destination, permanent: true }))
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

const konfig = withPayload(nextConfig, { devBundleServerPackages: false })
const payloadHeaders = konfig.headers!

/**
 * withPayload setzt «Critical-CH: Sec-CH-Prefers-Color-Scheme» für alle Adressen. Chrome lädt dann jede
 * Seite ein zweites Mal mit diesem Hinweis (in Lighthouse rund 1 s). Gebraucht wird er nur im Admin
 * für das helle oder dunkle Theme, darum gilt er nur noch dort.
 */
export default {
  ...konfig,
  headers: async () =>
    (await payloadHeaders()).map((regel) =>
      regel.source === '/:path*' && regel.headers.some((h) => h.key === 'Critical-CH')
        ? { ...regel, source: '/admin/:path*' }
        : regel,
    ),
} satisfies NextConfig
