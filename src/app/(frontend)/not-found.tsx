import Link from 'next/link'
import { Seite } from '@/components/Seite'

export default function NichtGefunden() {
  return (
    <Seite>
      <div className="schmal">
        <h1>Diese Seite gibt es nicht</h1>
        <p className="gross">Vielleicht wurde sie beim Umbau der Website verschoben.</p>
        <Link href="/" className="knopf">
          Zur Startseite
        </Link>
      </div>
    </Seite>
  )
}
