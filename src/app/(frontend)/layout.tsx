import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo'
import { payloadClient } from '@/lib/data'

import './styles.css'

const schrift = DM_Sans({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'Elternrat Tagesschule Nordstrasse', template: '%s · Elternrat TSN' },
  description:
    'Der Elternrat der Tagesschule Nordstrasse in Zürich Wipkingen: Arbeitsgruppen, Protokolle, Bulletins und die Elternbox für Ihre Anliegen.',
}

/** Navigation aus den Seiten mit «In der Navigation zeigen»; fehlende Standardseiten mit ihrer Vorlage. */
async function ladeNavigation() {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'seiten',
    limit: 200,
    depth: 0,
    select: {
      titel: true,
      navigationsTitel: true,
      slug: true,
      inNavigation: true,
      reihenfolge: true,
    },
  })
  const vorhanden = new Set(docs.map((d) => d.slug))
  const vorlagen = [
    { slug: 'elternrat', label: 'Elternrat', reihenfolge: 10 },
    { slug: 'arbeitsgruppen', label: 'Arbeitsgruppen', reihenfolge: 20 },
    { slug: 'archiv', label: 'Archiv', reihenfolge: 30 },
  ].filter((v) => !vorhanden.has(v.slug))
  return [
    ...vorlagen,
    ...docs
      .filter((d) => d.inNavigation && d.slug)
      .map((d) => ({
        slug: d.slug!,
        label: d.navigationsTitel || d.titel,
        reihenfolge: d.reihenfolge ?? 100,
      })),
  ]
    .sort((a, b) => a.reihenfolge - b.reihenfolge)
    .map((n) => ({ href: `/${n.slug}`, label: n.label }))
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navigation = await ladeNavigation()
  return (
    <html lang="de-CH" className={schrift.className}>
      <body>
        <a className="sprung" href="#inhalt">
          Zum Inhalt springen
        </a>
        <header className="kopf">
          <div className="breite kopf-innen">
            <Link href="/" className="kopf-logo" aria-label="Elternrat TSN, zur Startseite">
              <Logo />
            </Link>
            <nav aria-label="Hauptnavigation">
              <ul>
                {navigation.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href}>{n.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link href="/elternbox" className="knopf knopf-klein kopf-knopf">
              Elternbox
            </Link>
          </div>
        </header>
        <main id="inhalt" className="breite">
          {children}
        </main>
        <footer className="fuss">
          <div className="breite fuss-innen">
            <div>
              <h2>Haben Sie ein Anliegen?</h2>
              <p>
                Schreiben Sie uns in die Elternbox oder sprechen Sie die Delegierten Ihrer Klasse
                an.
              </p>
              <Link href="/elternbox" className="knopf">
                Zur Elternbox
              </Link>
            </div>
            <div>
              <p>
                <strong>Elternrat der Tagesschule Nordstrasse</strong>
                <br />
                Zürich Wipkingen
              </p>
              <ul className="fuss-links">
                {navigation.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href}>{n.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
