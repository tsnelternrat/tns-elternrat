import type { Metadata } from 'next'

import { Bloecke } from '@/components/bloecke/Bloecke'
import { Text } from '@/components/Text'
import { payloadClient } from '@/lib/data'

import { Formular } from './Formular'
import { Seite } from '@/components/Seite'

export const revalidate = false
export const metadata: Metadata = {
  title: 'Elternbox',
  description:
    'Schreiben Sie dem Elternrat der Tagesschule Nordstrasse direkt, auf Wunsch auch anonym.',
}

export default async function ElternboxSeite() {
  const payload = await payloadClient()
  const texte = await payload.findGlobal({ slug: 'texte', depth: 2 })

  return (
    <Seite>
      <div className="schmal">
        <h1>Elternbox</h1>
        <Text inhalt={texte.elternboxEinleitung} className="gross" />
        <Formular />
        <p className="hinweis">
          Ihre Nachricht lesen nur die Mitglieder des Elternrats. Name und E-Mail-Adresse sind
          freiwillig; ohne E-Mail können wir Ihnen allerdings nicht antworten.
        </p>
      </div>
      <Bloecke bloecke={texte.elternboxZusatz} />
    </Seite>
  )
}
