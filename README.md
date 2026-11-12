# Elternrat Tagesschule Nordstrasse

Website des Elternrats, gebaut mit [Payload CMS](https://payloadcms.com) und Next.js, gehostet auf Vercel.

- Website: `/`
- Admin: `/admin`

## Lokal entwickeln

Voraussetzungen: Node 24 (`nvm use`), pnpm, Zugriff auf das Vercel-Projekt `tns-elternrat`.

```bash
pnpm install
vercel env pull .env.local   # Datenbank, Blob-Store und PAYLOAD_SECRET
pnpm dev
```

Beim ersten Aufruf von `/admin` wird das erste Benutzerkonto angelegt.

## Aufbau

| Bereich | Wo gepflegt | Seite |
|---|---|---|
| Startseite | Global «Startseite» | `/` |
| Elternrat, Vorstand, Delegierte | Global «Elternrat» | `/elternrat` |
| Arbeitsgruppen | Collection «Arbeitsgruppen», Einleitung in «Texte und Einstellungen» | `/arbeitsgruppen` |
| Protokolle, Bulletins, Fotogalerien | je eine Collection | `/archiv/...` |
| Elternbox | Collection «Elternbox» (nur im Admin sichtbar) | `/elternbox` |

Das neueste Protokoll, Bulletin und die neueste Galerie erscheinen automatisch auf der Startseite.
Nach jeder Änderung im Admin wird die Website neu gerendert (`src/hooks/revalidate.ts`).

## Infrastruktur

- **Datenbank:** Neon Postgres (`tsn-elternrat-db`), über den Vercel Marketplace mit dem Projekt verbunden.
- **Dateien:** Vercel Blob (`tsn-elternrat-media`). Uploads gehen direkt vom Browser in den Store.
- **E-Mail:** Ist `RESEND_API_KEY` gesetzt, meldet die Elternbox neue Nachrichten per E-Mail an die Adresse
  aus «Texte und Einstellungen». Ohne Schlüssel landen Nachrichten nur im Admin. Absender: `EMAIL_FROM`.
- `NEXT_PUBLIC_SERVER_URL` (z. B. `https://tsn-elternrat.ch`) wird für den Admin-Link in der E-Mail verwendet.

Lokal und produktiv wird dieselbe Datenbank verwendet. Payload gleicht das Schema im Entwicklungsmodus
automatisch ab (`push`); wer ein Feld ändert und `pnpm dev` startet, ändert also die produktive Datenbank.

## Alte Website

`legacy-site/` enthält den Scrape der früheren WordPress-Seite (`scripts/scrape-legacy-site.py`).
Was übernommen wurde, steht in `legacy-site/DECISIONS.md`. Der Import ist wiederholbar:

```bash
pnpm import:legacy --reset   # löscht importierte Inhalte und spielt sie neu ein
```

Benutzerkonten und Elternbox-Nachrichten bleiben dabei erhalten. Die Mediendateien des Scrapes
(`legacy-site/media/`, 380 MB) sind nicht im Repository; `python3 scripts/scrape-legacy-site.py` lädt sie neu.
