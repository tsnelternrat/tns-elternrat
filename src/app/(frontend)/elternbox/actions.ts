'use server'

import { payloadClient } from '@/lib/data'

export type ElternboxStatus = { status: 'offen' | 'gesendet' | 'fehler'; meldung?: string; werte?: Record<string, string> }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function nachrichtSenden(_vorher: ElternboxStatus, formular: FormData): Promise<ElternboxStatus> {
  const feld = (name: string) => String(formular.get(name) ?? '').trim()
  const werte = { nachricht: feld('nachricht'), name: feld('name'), email: feld('email') }

  // Honigtopf: Das Feld ist für Menschen unsichtbar. Bots, die es ausfüllen, bekommen eine Erfolgsmeldung ohne Speicherung.
  if (feld('website')) return { status: 'gesendet' }

  if (werte.nachricht.length < 5) {
    return { status: 'fehler', meldung: 'Bitte schreiben Sie uns ein paar Worte.', werte }
  }
  if (werte.nachricht.length > 5000) {
    return { status: 'fehler', meldung: 'Die Nachricht ist zu lang (höchstens 5000 Zeichen).', werte }
  }
  if (werte.email && !EMAIL.test(werte.email)) {
    return { status: 'fehler', meldung: 'Die E-Mail-Adresse scheint nicht zu stimmen.', werte }
  }

  try {
    const payload = await payloadClient()
    await payload.create({
      collection: 'nachrichten',
      data: { nachricht: werte.nachricht, name: werte.name || undefined, email: werte.email || undefined },
    })
    return { status: 'gesendet' }
  } catch (fehler) {
    console.error('Elternbox: Speichern fehlgeschlagen', fehler)
    return {
      status: 'fehler',
      meldung: 'Das hat leider nicht geklappt. Bitte versuchen Sie es später noch einmal.',
      werte,
    }
  }
}
