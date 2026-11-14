'use client'

import { useCallback, useEffect, useRef, useState, ViewTransition } from 'react'

/** So viele Vorschaubilder passen auf dem Handy etwa in den ersten Bildschirm. */
const SOFORT = 6

type Bild = { thumb: string; gross: string; alt: string }

/** `uebergang`: Name, unter dem das erste Bild beim Seitenwechsel aus dem Vorschaubild der Übersicht hervorgeht. */
export function Galerie({ bilder, uebergang }: { bilder: Bild[]; uebergang?: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [aktiv, setAktiv] = useState<number | null>(null)

  const weiter = useCallback(
    (schritt: number) =>
      setAktiv((i) => (i === null ? i : (i + schritt + bilder.length) % bilder.length)),
    [bilder.length],
  )

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (aktiv !== null && !d.open) d.showModal()
    if (aktiv === null && d.open) d.close()
  }, [aktiv])

  useEffect(() => {
    if (aktiv === null) return
    const taste = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') weiter(1)
      if (e.key === 'ArrowLeft') weiter(-1)
    }
    window.addEventListener('keydown', taste)
    return () => window.removeEventListener('keydown', taste)
  }, [aktiv, weiter])

  return (
    <>
      <ul className="galerie">
        {bilder.map((b, i) => (
          <li key={b.gross}>
            <button
              type="button"
              onClick={() => setAktiv(i)}
              aria-label={`Bild ${i + 1} von ${bilder.length} vergrössern`}
            >
              {i === 0 && uebergang ? (
                <ViewTransition name={uebergang} share="morph" default="none">
                  <img src={b.thumb} alt={b.alt} fetchPriority="high" width={480} height={480} />
                </ViewTransition>
              ) : (
                // Die ersten Bilder sind sofort sichtbar und werden nicht verzögert geladen.
                <img
                  src={b.thumb}
                  alt={b.alt}
                  loading={i < SOFORT ? undefined : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : undefined}
                  width={480}
                  height={480}
                />
              )}
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        className="lightbox"
        onClose={() => setAktiv(null)}
        onClick={(e) => e.target === dialog.current && setAktiv(null)}
      >
        {aktiv !== null && (
          <>
            <img src={bilder[aktiv].gross} alt={bilder[aktiv].alt} />
            <div className="lightbox-leiste">
              <button type="button" onClick={() => weiter(-1)} aria-label="Vorheriges Bild">
                ←
              </button>
              <span>
                {aktiv + 1} / {bilder.length}
              </span>
              <button type="button" onClick={() => weiter(1)} aria-label="Nächstes Bild">
                →
              </button>
              <button type="button" onClick={() => setAktiv(null)}>
                Schliessen
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  )
}
