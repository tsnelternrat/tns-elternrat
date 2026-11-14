/**
 * Überträgt die behaltenen Inhalte der alten WordPress-Seite (legacy-site/) nach Payload.
 * Was mitkommt, steht in legacy-site/DECISIONS.md.
 *
 *   pnpm import:legacy            bricht ab, wenn schon Inhalte vorhanden sind
 *   pnpm import:legacy --nur-personen   liest nur Vorstand und Delegierte neu ein
 *   pnpm import:legacy --reset    löscht zuerst alle importierbaren Inhalte (nicht Benutzer:innen, nicht Elternbox)
 */
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import path from 'path'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { fileURLToPath } from 'url'

import { schuljahrVon } from '../src/lib/schuljahr'
import config from '../src/payload.config'

process.env.PAYLOAD_SKIP_REVALIDATE = 'true'

const LEGACY = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../legacy-site')
const lies = (datei: string) => fs.readFileSync(path.join(LEGACY, datei), 'utf8')
const seite = (name: string) => new JSDOM(lies(`pages/${name}.html`)).window.document

type MediaEintrag = { source_url: string; file: string; bytes: number }
const mediaIndex = new Map<string, MediaEintrag>()
/** Wie im Scraper: WordPress-Grössensuffixe (-300x200, -scaled) entfernen, Gross-/Kleinschreibung ignorieren. */
const schluessel = (url: string) =>
  decodeURIComponent(url.split('/wp-content/uploads/')[1] ?? '')
    .split('?')[0]
    .replace(/(-\d+x\d+|-scaled)+(\.[A-Za-z0-9]+)$/, '$2')
    .toLowerCase()
for (const m of JSON.parse(lies('media.json')) as MediaEintrag[]) mediaIndex.set(schluessel(m.source_url), m)

const uebersprungen: string[] = []

/** Lokaler Pfad einer Datei aus der alten Mediathek, oder null, wenn sie fehlt. */
function lokal(url: string, wofuer: string): string | null {
  const eintrag = url.includes('/wp-content/uploads/') ? mediaIndex.get(schluessel(url)) : undefined
  if (!eintrag || !eintrag.bytes) {
    uebersprungen.push(`${wofuer}: ${url}`)
    return null
  }
  return path.join(LEGACY, eintrag.file)
}

const NEUE_ADRESSEN: [RegExp, string][] = [
  [/\/arbeitsgruppen\/?$/, '/arbeitsgruppen'],
  [/\/(dokumente\/)?protokolle\/?$/, '/archiv/protokolle'],
  [/\/(dokumente\/)?bulletins\/?$/, '/archiv/bulletins'],
  [/\/kontakt\/?$/, '/elternbox'],
]

/** Entfernt WordPress-Beiwerk (Datei-Blöcke, Bilder, Embeds) und biegt interne Links auf die neuen Adressen um. */
function bereinige(wurzel: Element | Document): string {
  const kopie = ('body' in wurzel ? wurzel.body : wurzel).cloneNode(true) as Element
  kopie.querySelectorAll('.wp-block-file, figure, img, iframe, object, script, style').forEach((el) => el.remove())
  kopie.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href')!
    if (!/^https?:\/\/(www\.)?tsn-elternrat\.ch/.test(href)) return
    const neu = NEUE_ADRESSEN.find(([muster]) => muster.test(href))
    if (neu) a.setAttribute('href', neu[1])
    else a.replaceWith(...Array.from(a.childNodes)) // Ziel gibt es nicht mehr: Text behalten, Link entfernen
  })
  kopie.querySelectorAll('p').forEach((p) => !p.textContent?.trim() && p.remove())
  return kopie.innerHTML.trim()
}


async function main() {
  const payload = await getPayload({ config })
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const lexical = (html: string) => (html.trim() ? convertHTMLToLexical({ editorConfig, html, JSDOM }) : undefined)

  const inhalte = ['arbeitsgruppen', 'galerien', 'protokolle', 'bulletins', 'dokumente', 'media'] as const
  const vorhanden = (await Promise.all(inhalte.map((c) => payload.count({ collection: c })))).reduce(
    (summe, c) => summe + c.totalDocs,
    0,
  )
  const nurPersonen = process.argv.includes('--nur-personen')
  if (vorhanden > 0 && !nurPersonen) {
    if (!process.argv.includes('--reset')) {
      console.error(`Es sind bereits ${vorhanden} Einträge vorhanden. Mit --reset werden sie zuerst gelöscht.`)
      process.exit(1)
    }
    for (const c of inhalte) {
      const { docs } = await payload.delete({ collection: c, where: { id: { exists: true } } })
      console.log(`gelöscht: ${docs.length} × ${c}`)
    }
  }

  const dokumentCache = new Map<string, number>()
  async function dokument(url: string, titel: string): Promise<number | null> {
    const filePath = lokal(url, `Dokument «${titel}»`)
    if (!filePath) return null
    if (!dokumentCache.has(filePath)) {
      const doc = await payload.create({ collection: 'dokumente', data: { titel }, filePath })
      dokumentCache.set(filePath, doc.id)
    }
    return dokumentCache.get(filePath)!
  }

  const bildCache = new Map<string, number>()
  async function bild(url: string, alt: string, wofuer: string): Promise<number | null> {
    const filePath = lokal(url, wofuer)
    if (!filePath) return null
    if (!bildCache.has(filePath)) {
      const doc = await payload.create({ collection: 'media', data: { alt }, filePath })
      bildCache.set(filePath, doc.id)
    }
    return bildCache.get(filePath)!
  }

  // ---------------------------------------------------------------- Elternrat
  {
    const dok = seite('ueber-den-elternrat')
    // Die Liste steht in wenigen Absätzen mit <br> dazwischen
    const roh = new JSDOM(lies('pages/ueber-den-elternrat.html').replace(/<br\s*\/?>|<\/p>|<\/h\d>/gi, '\n'))
    const zeilen = (roh.window.document.body.textContent ?? '')
      .split('\n')
      .map((z) => z.trim())
      .filter((z) => z.includes(':'))
    const vorstand: { rolle: string; personen: string }[] = []
    const klassen: { stufe: 'kg' | 'unterstufe' | 'mittelstufe'; klasse: string; delegierte: string }[] = []
    const weitere: { rolle: string; personen: string }[] = []
    for (const zeile of zeilen) {
      const [links, ...rest] = zeile.split(':')
      const personen = rest.join(':').trim()
      if (!personen || personen.length > 120) continue
      const rolle = links.trim()
      if (/^(Vorsitz|Stv\.|Finanzen|Aktuar)/.test(rolle)) vorstand.push({ rolle, personen })
      else if (/^KG /.test(rolle)) klassen.push({ stufe: 'kg', klasse: rolle.replace(/^KG /, ''), delegierte: personen })
      else if (/^1\.-3\. Klasse /.test(rolle))
        klassen.push({ stufe: 'unterstufe', klasse: rolle.replace(/^1\.-3\. Klasse /, ''), delegierte: personen })
      else if (/^4\.-6\. Klasse /.test(rolle))
        klassen.push({ stufe: 'mittelstufe', klasse: rolle.replace(/^4\.-6\. Klasse /, ''), delegierte: personen })
      else if (/gruppe/i.test(rolle)) weitere.push({ rolle, personen })
    }
    const jahr = (dok.body.textContent ?? '').match(/Elternrat (\d{4})\/(\d{2})/)
    if (nurPersonen) {
      await payload.updateGlobal({ slug: 'elternrat', data: { vorstand, klassen, weitere } })
      console.log(`Elternrat: ${vorstand.length} Ämter, ${klassen.length} Klassen, ${weitere.length} weitere`)
      process.exit(0)
    }
    await payload.updateGlobal({
      slug: 'elternrat',
      data: {
        schuljahr: jahr ? `${jahr[1]}/${jahr[2]}` : schuljahrVon(new Date()),
        vorstand,
        klassen,
        weitere,
      },
    })
    console.log(`Elternrat: ${vorstand.length} Ämter, ${klassen.length} Klassen, ${weitere.length} weitere`)
  }

  // Einleitungen, Gruppenfoto, Flyer/Konzept und Startseite stehen seit Nov. 2026 in Blöcken (Collection «Seiten»,
  // Global «Startseite») und werden hier nicht mehr importiert. Grundgerüst: pnpm bloecke:ueberfuehren.

  // ---------------------------------------------------------------- Arbeitsgruppen
  const ags: { name: string; quelle: string }[] = [
    { name: 'AG Bulletin', quelle: 'arbeitsgruppen/ag-bulletin' },
    { name: 'AG Elternkontaktgremium', quelle: 'arbeitsgruppen/ag-elternmitwirkung-auf-stadt-und-schulkreisebene' },
    { name: 'AG Kafi im Gang', quelle: 'arbeitsgruppen/ag-kafi-im-gang' },
    { name: 'AG Sommerabend', quelle: 'arbeitsgruppen/ag-sommerabend' },
    { name: 'AG Verkehr', quelle: 'arbeitsgruppen/ag-verkehr' },
    { name: 'AG Elternbildung', quelle: 'arbeitsgruppen/ag-weiterbildung' },
    { name: 'AG Kulturbrücke', quelle: 'arbeitsgruppen/ag-kulturbruecke' },
    { name: 'AG Klassenznüni', quelle: 'arbeitsgruppen/ag-klassenznueni' },
  ]
  let reihenfolge = 10
  for (const ag of ags) {
    const daten: RequiredDataFromCollectionSlug<'arbeitsgruppen'> = {
      name: ag.name,
      beschreibung: lexical(bereinige(seite(ag.quelle)))!,
      reihenfolge,
    }
    if (ag.name === 'AG Klassenznüni') {
      const charta = seite('charta-klassenznueni')
      const pdf = charta.querySelector('.wp-block-file a')?.getAttribute('href')
      daten.details = lexical(`<h2>Charta Klassenznüni</h2>${bereinige(charta)}`)
      const id = pdf ? await dokument(pdf, 'Charta Klassenznüni') : null
      if (id) daten.dokumente = [id]
    }
    await payload.create({ collection: 'arbeitsgruppen', data: daten })
    reihenfolge += 10
  }
  {
    // Platzhalter: Die alte Seite «Läuseplage» nennt eine AG Läuse, die in der AG-Liste fehlte.
    const dok = seite('lauseplage')
    const dokumente: number[] = []
    for (const a of Array.from(dok.querySelectorAll('.wp-block-file a:not(.wp-block-file__button)'))) {
      const id = await dokument(a.getAttribute('href')!, a.textContent!.trim())
      if (id) dokumente.push(id)
    }
    const videos = Array.from(dok.querySelectorAll('iframe'))
      .map((f) => f.getAttribute('src') ?? '')
      .filter((src) => src.includes('youtube'))
      .map((src) => ({ url: src.split('?')[0].replace('/embed/', '/watch?v=') }))
    const teile = new JSDOM(bereinige(dok)).window.document
    const erster = teile.querySelector('p')
    const beschreibung = erster ? `<p>${erster.innerHTML}</p>` : ''
    erster?.remove()
    await payload.create({
      collection: 'arbeitsgruppen',
      data: {
        name: 'AG Läuse',
        beschreibung: lexical(beschreibung)!,
        details: lexical(teile.body.innerHTML.replace(/<\/?div[^>]*>/g, '')),
        dokumente,
        videos,
        reihenfolge,
      },
    })
  }
  console.log(`Arbeitsgruppen: ${ags.length + 1}`)

  // ---------------------------------------------------------------- Protokolle und Bulletins
  const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'] // prettier-ignore
  const utc = (jahr: number, monat: number, tag = 1) => new Date(Date.UTC(jahr, monat - 1, tag, 12)).toISOString()

  /** Links einer Dokumentenliste samt Schuljahr der vorangehenden Überschrift («SJ 25/26», «SJ 2025/26»). */
  function eintraege(dok: Document): { label: string; href: string; schuljahr: string }[] {
    const liste: { label: string; href: string; schuljahr: string }[] = []
    let schuljahr = ''
    for (const el of Array.from(dok.querySelectorAll('h2, h3, h4, a[href]'))) {
      if (el.tagName !== 'A') {
        const m = el.textContent?.match(/SJ\s*(?:20)?(\d{2})\/(\d{2})/)
        if (m) schuljahr = `20${m[1]}/${m[2]}`
        continue
      }
      const label = el.textContent?.replace(/\s+/g, ' ').trim() ?? ''
      if (label && schuljahr) liste.push({ label, href: el.getAttribute('href')!, schuljahr })
    }
    return liste
  }

  let anzahl = 0
  for (const e of eintraege(seite('dokumente/protokolle'))) {
    const filePath = lokal(e.href, `Protokoll «${e.label}» (${e.schuljahr})`)
    if (!filePath) continue
    const m = e.label.match(/(\d{4})\.(\d{2})(?:\.(\d{2}))?/)
    const [jahr, monat, tag] = m ? [Number(m[1]), Number(m[2]), m[3] ? Number(m[3]) : 0] : [0, 0, 0]
    // Ohne Datum im Titel: Ende des Schuljahres annehmen (Sammelprotokoll)
    const datum = m ? utc(jahr, monat, tag || 1) : utc(Number(e.schuljahr.slice(0, 4)) + 1, 7)
    const titel = !m
      ? e.label.replace('Protokoll ER', 'Protokolle')
      : tag
        ? `Protokoll vom ${tag}. ${MONATE[monat - 1]} ${jahr}`
        : `Protokoll ${MONATE[monat - 1]} ${jahr}`
    await payload.create({ collection: 'protokolle', data: { titel, datum, schuljahr: e.schuljahr }, filePath })
    anzahl++
  }
  console.log(`Protokolle: ${anzahl}`)

  anzahl = 0
  for (const e of eintraege(seite('dokumente/bulletins'))) {
    const filePath = lokal(e.href, `Bulletin «${e.label}» (${e.schuljahr})`)
    if (!filePath) continue
    const nummer = e.label.match(/(\d{4})-0?(\d)/)
    const ausDatei = path.basename(filePath).match(/^(\d{2})-?(\d{2})-?(\d{2})[_-]/)
    // Datum aus dem Dateinamen (JJMMTT), sonst grob aus der Ausgabennummer geschätzt
    const datum = ausDatei
      ? utc(2000 + Number(ausDatei[1]), Number(ausDatei[2]), Number(ausDatei[3]))
      : nummer
        ? utc(Number(nummer[1]), Math.min(12, Number(nummer[2]) * 4 - 1))
        : utc(Number(e.schuljahr.slice(0, 4)), 9)
    await payload.create({
      collection: 'bulletins',
      data: { titel: e.label.replace(/^ER /, ''), datum, schuljahr: e.schuljahr },
      filePath,
    })
    anzahl++
  }
  console.log(`Bulletins: ${anzahl}`)

  // ---------------------------------------------------------------- Fotogalerien
  {
    const dok = seite('dokumente/fotogallerien')
    let galerien = 0
    let bilder = 0
    for (const h of Array.from(dok.querySelectorAll('h2'))) {
      const titel = h.textContent?.trim().replace(/^Impressionen /, '') ?? ''
      if (!titel) continue
      const urls: string[] = []
      for (let el = h.nextElementSibling; el && el.tagName !== 'H2'; el = el.nextElementSibling) {
        el.querySelectorAll('a[href*="/wp-content/uploads/"]').forEach((a) => urls.push(a.getAttribute('href')!))
      }
      const jahr = Number(titel.match(/\d{4}/)?.[0] ?? 2000)
      const monat = /sommer/i.test(titel) ? 7 : /advent/i.test(titel) ? 12 : /willkommen/i.test(titel) ? 8 : 1
      const ids: number[] = []
      for (const url of urls) {
        const id = await bild(url, titel, `Galerie «${titel}»`)
        if (id) ids.push(id)
      }
      await payload.create({ collection: 'galerien', data: { titel, datum: utc(jahr, monat), bilder: ids } })
      galerien++
      bilder += ids.length
      console.log(`  Galerie «${titel}»: ${ids.length} Bilder`)
    }
    console.log(`Galerien: ${galerien} mit ${bilder} Bildern`)
  }

  if (uebersprungen.length) {
    console.log(`\nÜbersprungen (Datei fehlt im Scrape):\n- ${[...new Set(uebersprungen)].join('\n- ')}`)
  }
  process.exit(0)
}

// Top-Level-await: `payload run` beendet den Prozess, sobald das Modul geladen ist.
try {
  await main()
} catch (fehler) {
  console.error(fehler)
  process.exit(1)
}
