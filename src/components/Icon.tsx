import type { ReactNode } from 'react'

import type { IconName } from '@/lib/icons'
import type { Media } from '@/payload-types'
import { bildUrl } from '@/lib/data'

const zeichnungen: Record<IconName, ReactNode> = {
  gruppe: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6M16 14.5c2.8 0 5 2 5 5.5" />
    </>
  ),
  sprechblase: <path d="M4 4h16v12h-8l-5 4v-4H4z" />,
  dokument: <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" />,
  heft: <path d="M12 6C10 4.500 7 4 4 4.500v13c3-.5 6 0 8 1.500 2-1.500 5-2 8-1.500v-13C17 4 14 4.500 12 6zM12 6v13" />,
  foto: (
    <>
      <path d="M3 5h18v14H3zM3 16l5-4 4 3 3-2 6 4" />
      <circle cx="8.500" cy="9.500" r="1.500" />
    </>
  ),
  video: <path d="M3 6h13v12H3zM16 10l5-3v10l-5-3" />,
  audio: <path d="M4 9h4l5-4v14l-5-4H4zM16.500 8.500a5 5 0 0 1 0 7M19 6a8.500 8.500 0 0 1 0 12" />,
  kalender: <path d="M4 5h16v15H4zM4 10h16M8 3v4M16 3v4" />,
  kaffee: <path d="M5 9h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM17 10h1.500a2.500 2.500 0 0 1 0 5H17M8 3v3M12 3v3" />,
  sonne: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400" />
    </>
  ),
  verkehr: (
    <>
      <rect x="8" y="2" width="8" height="20" rx="2" />
      <circle cx="12" cy="7" r="1.300" />
      <circle cx="12" cy="12" r="1.300" />
      <circle cx="12" cy="17" r="1.300" />
    </>
  ),
  bildung: <path d="M2 9l10-5 10 5-10 5zM6 11.500V16c2 2 10 2 12 0v-4.500M22 9v6" />,
  welt: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3.500 3 3.500 15 0 18M12 3c-3.500 3-3.500 15 0 18" />
    </>
  ),
  apfel: (
    <path d="M12 7.500C10 5.500 5 6 5 11.500c0 4.500 3 8.500 5 8.500 1 0 1.200-.6 2-.6s1 .6 2 .6c2 0 5-4 5-8.500C19 6 14 5.500 12 7.500zM12 7.500c0-2 1-3.500 3-4.500" />
  ),
  lupe: (
    <>
      <circle cx="10.500" cy="10.500" r="6.500" />
      <path d="M15.500 15.500L21 21" />
    </>
  ),
  herz: <path d="M12 20s-8-5-8-11a4.500 4.500 0 0 1 8-2.500A4.500 4.500 0 0 1 20 9c0 6-8 11-8 11z" />,
}

export function Icon({ name }: { name: IconName }) {
  return (
    <span className="icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {zeichnungen[name] ?? zeichnungen.dokument}
      </svg>
    </span>
  )
}

/** Kopf eines Teasers: das Foto, falls vorhanden, sonst das Icon. */
export function TeaserKopf({ bild, icon }: { bild?: Media | null; icon: IconName }) {
  const url = bildUrl(bild ?? null, 'thumb')
  if (url) return <img className="karte-bild" src={url} alt="" loading="lazy" />
  return <Icon name={icon} />
}
