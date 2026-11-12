// Icons, die im Admin für Teaser gewählt werden können. Die Zeichnungen dazu stehen in components/Icon.tsx.
export const icons = [
  { value: 'gruppe', label: 'Gruppe' },
  { value: 'sprechblase', label: 'Sprechblase' },
  { value: 'dokument', label: 'Dokument' },
  { value: 'heft', label: 'Heft' },
  { value: 'foto', label: 'Foto' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
  { value: 'kalender', label: 'Kalender' },
  { value: 'kaffee', label: 'Kaffee' },
  { value: 'sonne', label: 'Sonne' },
  { value: 'verkehr', label: 'Verkehr' },
  { value: 'bildung', label: 'Bildung' },
  { value: 'welt', label: 'Welt' },
  { value: 'apfel', label: 'Apfel' },
  { value: 'lupe', label: 'Lupe' },
  { value: 'herz', label: 'Herz' },
] as const

export type IconName = (typeof icons)[number]['value']
