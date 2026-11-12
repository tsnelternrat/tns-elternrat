import { notFound } from 'next/navigation'

/** Fängt unbekannte Adressen ab, damit die eigene «Nicht gefunden»-Seite mit Kopf und Fuss erscheint. */
export default function Unbekannt() {
  notFound()
}
