'use client'

import { useActionState } from 'react'

import { type ElternboxStatus, nachrichtSenden } from './actions'

const start: ElternboxStatus = { status: 'offen' }

export function Formular() {
  const [stand, senden, laeuft] = useActionState(nachrichtSenden, start)

  if (stand.status === 'gesendet') {
    return (
      <div className="karte karte-farbig" role="status">
        <h2>Danke für Ihre Nachricht</h2>
        <p>Sie ist beim Elternrat angekommen. Wenn Sie eine E-Mail-Adresse angegeben haben, melden wir uns bei Ihnen.</p>
      </div>
    )
  }

  return (
    <form action={senden} className="formular karte">
      {stand.status === 'fehler' && (
        <p className="fehler" role="alert">
          {stand.meldung}
        </p>
      )}
      <label>
        Ihre Nachricht
        <textarea name="nachricht" rows={7} required maxLength={5000} defaultValue={stand.werte?.nachricht} />
      </label>
      <div className="formular-zeile">
        <label>
          Name <span className="freiwillig">freiwillig</span>
          <input type="text" name="name" autoComplete="name" maxLength={200} defaultValue={stand.werte?.name} />
        </label>
        <label>
          E-Mail <span className="freiwillig">freiwillig, für eine Antwort</span>
          <input type="email" name="email" autoComplete="email" defaultValue={stand.werte?.email} />
        </label>
      </div>
      <div className="honigtopf" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button type="submit" className="knopf" disabled={laeuft}>
        {laeuft ? 'Wird gesendet …' : 'Nachricht senden'}
      </button>
    </form>
  )
}
