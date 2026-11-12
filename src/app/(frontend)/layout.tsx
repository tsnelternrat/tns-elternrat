import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo'

import './styles.css'

const schrift = DM_Sans({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'Elternrat Tagesschule Nordstrasse', template: '%s · Elternrat TSN' },
  description:
    'Der Elternrat der Tagesschule Nordstrasse in Zürich Wipkingen: Arbeitsgruppen, Protokolle, Bulletins und die Elternbox für Ihre Anliegen.',
}

const navigation = [
  { href: '/elternrat', label: 'Elternrat' },
  { href: '/arbeitsgruppen', label: 'Arbeitsgruppen' },
  { href: '/archiv', label: 'Archiv' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
                <li>
                  <Link href="/elternbox" className="knopf knopf-klein">
                    Elternbox
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main id="inhalt" className="breite">
          {children}
        </main>
        <footer className="fuss">
          <div className="breite fuss-innen">
            <div>
              <h2>Haben Sie ein Anliegen?</h2>
              <p>Schreiben Sie uns in die Elternbox oder sprechen Sie die Delegierten Ihrer Klasse an.</p>
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
