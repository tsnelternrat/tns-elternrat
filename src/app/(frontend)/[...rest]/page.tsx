import { notFound } from 'next/navigation'

/**
 * Fängt unbekannte Adressen ab, damit die eigene «Nicht gefunden»-Seite mit Kopf und Fuss erscheint.
 * Ohne vorab erzeugte Pfade und mit dynamicParams = false wird dafür nichts gerendert:
 * Anfragen von Bots auf alte WordPress-Adressen kosten so keine Rechenzeit.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return []
}

export default function Unbekannt() {
  notFound()
}
