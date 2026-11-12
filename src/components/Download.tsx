import { dateigroesse } from '@/lib/data'

type Datei = { url?: string | null; titel: string; filesize?: number | null }

export function Download({ datei, zusatz, titel }: { datei: Datei; zusatz?: string; titel?: string }) {
  if (!datei.url) return null
  return (
    <a className="download" href={datei.url} target="_blank" rel="noopener">
      <span className="download-titel">{titel ?? datei.titel}</span>
      <span className="download-meta">{[zusatz, dateigroesse(datei)].filter(Boolean).join(' · ')}</span>
    </a>
  )
}

export function DownloadListe({ dateien }: { dateien: Datei[] }) {
  if (!dateien.length) return null
  return (
    <ul className="downloads">
      {dateien.map((d) => (
        <li key={d.url ?? d.titel}>
          <Download datei={d} />
        </li>
      ))}
    </ul>
  )
}
