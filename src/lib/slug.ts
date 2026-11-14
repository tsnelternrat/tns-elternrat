export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Wie slugify, aber «/» bleibt als Trenner erhalten: «Archiv/Protokolle» → «archiv/protokolle». */
export const slugifyPfad = (text: string): string =>
  text.split('/').map(slugify).filter(Boolean).join('/')
