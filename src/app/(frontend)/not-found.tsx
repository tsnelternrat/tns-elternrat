import Link from 'next/link'

export default function NichtGefunden() {
  return (
    <div className="schmal">
      <h1>Diese Seite gibt es nicht</h1>
      <p className="gross">Vielleicht wurde sie beim Umbau der Website verschoben.</p>
      <Link href="/" className="knopf">
        Zur Startseite
      </Link>
    </div>
  )
}
