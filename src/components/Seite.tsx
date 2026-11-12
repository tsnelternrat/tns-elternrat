import { ViewTransition } from 'react'

/**
 * Rahmen für den Inhalt jeder Seite: Beim Seitenwechsel blendet er weich über. Links mit
 * transitionTypes «vor» oder «zurueck» schieben ihn zusätzlich in die passende Richtung
 * (siehe styles.css, Abschnitt «Übergänge»). Muss in der page.tsx stehen, nicht im Layout,
 * weil Layouts beim Navigieren stehen bleiben.
 */
const arten = { vor: 'vor', zurueck: 'zurueck', default: 'seite' }

export function Seite({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={arten} exit={arten} default="none">
      <div>{children}</div>
    </ViewTransition>
  )
}
