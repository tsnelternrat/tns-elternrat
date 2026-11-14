# Elternrat Tagesschule Nordstrasse

Website des Elternrats, gebaut mit [Payload CMS](https://payloadcms.com) und Next.js, gehostet auf Vercel.

- Website: `/`
- Admin: `/admin`

## Lokal entwickeln

Voraussetzungen: Node 24 (`nvm use`), pnpm, Zugriff auf das Vercel-Projekt `tns-elternrat`.

Lokal läuft eine eigene Postgres in Docker, getrennt von der produktiven Datenbank:

```bash
pnpm install
docker compose up -d                                          # lokale Datenbank
vercel env pull .env.prod.local --environment=production      # nur für die Kopie der Prod-Daten
pnpm db:kopie                                                 # Prod-Daten lesend in die lokale DB kopieren
pnpm dev
```

`.env.local` zeigt auf die lokale Datenbank (`postgres://payload:payload@localhost:54329/elternrat`) und enthält
ein absichtlich ungültiges `BLOB_READ_WRITE_TOKEN` mit der echten Store-ID (`vercel_blob_rw_<store-id>_nurlesen`):
Bilder werden aus dem Prod-Store angezeigt, Hochladen und Löschen schlagen lokal fehl.

Payload gleicht das Schema nur gegen eine lokale Datenbank automatisch ab («push»). Gegen eine andere Datenbank nur mit
`PAYLOAD_PUSH=true` (siehe `src/payload.config.ts`).

## Datenbank-Migrationen

Prod bekommt Schemaänderungen nur über Migrationen (`src/migrations/`). Ablauf nach einer Feldänderung:

```bash
pnpm dev                                   # lokal entwickeln, Schema wird lokal gepusht
pnpm payload migrate:create <name>         # Migration aus der Änderung erzeugen, prüfen, committen
pnpm db:kopie && pnpm migrate              # optional: an einer frischen Prod-Kopie testen
```

Beim Vercel-Build läuft `pnpm migrate --prod` automatisch, aber nur für Production-Deployments
(`scripts/build.sh`). Schlägt die Migration fehl, bricht der Build ab und die bisherige Version bleibt online.
Preview-Builds und lokale Builds verändern die Datenbank nicht.

`pnpm migrate` verweigert den Dienst, solange in `payload_migrations` ein «dev»-Eintrag steht (Schema per Push
verändert). Lokal heisst das: vor dem Testen von Migrationen `pnpm db:kopie`.

**Einmalig vor dem ersten Deploy mit Migrationen:** Das Prod-Schema ist bisher per Push entstanden und entspricht der
Baseline-Migration. Die muss in Prod als ausgeführt markiert werden, mit der Prod-`DATABASE_URL`:

```bash
DATABASE_URL="<prod>" pnpm migrate --baseline --prod
```

Beim ersten Aufruf von `/admin` wird das erste Benutzerkonto angelegt.

## Aufbau

| Bereich | Wo gepflegt | Seite |
|---|---|---|
| Startseite | Global «Startseite», aus Blöcken | `/` |
| Elternrat, Arbeitsgruppen, Archiv, Elternbox und weitere Seiten | Collection «Seiten», aus Blöcken | `/adresse` |
| Vorstand und Delegierte | Global «Elternrat» (Block «Vorstand und Delegierte») | `/elternrat` |
| Arbeitsgruppen | Collection «Arbeitsgruppen» (Block «Alle Arbeitsgruppen») | `/arbeitsgruppen/...` |
| Protokolle, Bulletins, Fotogalerien | je eine Collection; Seiten `/archiv/...` aus Blöcken | `/archiv/...` |
| Elternbox | Collection «Elternbox» (nur im Admin sichtbar) | `/elternbox` |

## Blöcke

Seiten werden aus Blöcken gebaut (`src/blocks/index.ts`, Darstellung in `src/components/bloecke/`):
Bühne, Text, Bild mit Text, Karten, Dokumente, Video, Fotogalerie, Hinweis; Teaser, die ihren Inhalt selbst
aus den Collections holen: «Aktuell» (je das Neuste), «Liste aus dem Archiv» (Protokolle, Bulletins, Galerien,
Arbeitsgruppen) und «Archiv-Übersicht»; dazu «Vorstand und Delegierte», «Alle Arbeitsgruppen» und
«Elternbox-Formular».

Elternrat, Arbeitsgruppen, Archiv und Elternbox sind Einträge in «Seiten». Fehlt einer, zeigt die Adresse die
Vorlage aus `src/lib/standardSeiten.ts` (die frühere feste Seite), ebenso die Startseite ohne Blöcke
(`src/lib/standardStartseite.ts`). `pnpm bloecke:ueberfuehren` legt die Einträge aus den Vorlagen an,
`--beispiel` zusätzlich `/beispiel` mit allen Blocktypen.
Nach jeder Änderung im Admin wird die Website neu gerendert (`src/hooks/revalidate.ts`).

## Infrastruktur

- **Datenbank:** Neon Postgres (`tsn-elternrat-db`), über den Vercel Marketplace mit dem Projekt verbunden.
- **Dateien:** Vercel Blob (`tsn-elternrat-media`). Uploads gehen direkt vom Browser in den Store.
- **E-Mail:** Ist `RESEND_API_KEY` gesetzt, meldet die Elternbox neue Nachrichten per E-Mail an die Adresse
  aus dem Global «Einstellungen». Ohne Schlüssel landen Nachrichten nur im Admin. Absender: `EMAIL_FROM`.
- `NEXT_PUBLIC_SERVER_URL` (z. B. `https://tsn-elternrat.ch`) wird für den Admin-Link in der E-Mail verwendet.


## Alte Website

`legacy-site/` enthält den Scrape der früheren WordPress-Seite (`scripts/scrape-legacy-site.py`).
Was übernommen wurde, steht in `legacy-site/DECISIONS.md`. Der Import ist wiederholbar:

```bash
pnpm import:legacy --reset   # löscht importierte Inhalte und spielt sie neu ein
```

Benutzerkonten und Elternbox-Nachrichten bleiben dabei erhalten. Die Mediendateien des Scrapes
(`legacy-site/media/`, 380 MB) sind nicht im Repository; `python3 scripts/scrape-legacy-site.py` lädt sie neu.
