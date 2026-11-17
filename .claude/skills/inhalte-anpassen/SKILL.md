---
name: inhalte-anpassen
description: Texte und Inhalte der Elternrat-Website (Payload CMS) gesammelt anpassen, z. B. nach Rückmeldungen – Schreibweisen vereinheitlichen, AG-Beschreibungen umschreiben, Sätze auf Start- oder Unterseiten ersetzen. Erst lokal, dann Prod, dann deployen.
---

# Inhalte der Website anpassen

Alle Texte liegen in der Payload-Datenbank (Neon Postgres), nicht im Code. Ausnahme: Vorlagen in
`src/lib/standardSeiten.ts` und `src/lib/standardStartseite.ts` greifen nur, wenn ein Eintrag fehlt. Trotzdem kurz
mit `grep` prüfen, ob der Text auch dort steht.

Wo was liegt:

| Inhalt | Ort |
|---|---|
| Startseite | Global `startseite`, Feld `inhalt` (Blöcke) |
| Elternrat, Arbeitsgruppen, Archiv, Elternbox | Collection `seiten`, Feld `inhalt` (Blöcke), per `slug` |
| AG-Texte | Collection `arbeitsgruppen`, Felder `beschreibung` und `details` (Lexical-Richtext) |
| Vorstand, Delegierte | Global `elternrat` |

## Ablauf

1. **Frische Prod-Kopie lokal:** `pnpm db:kopie` (liest Prod nur, überschreibt die lokale DB).
2. **Bestand ansehen:** `scripts/_texte-lesen.ts` aus `vorlage-lesen.ts` (in diesem Ordner) anlegen und mit
   `pnpm payload run scripts/_texte-lesen.ts` ausführen. Das Skript gibt alle Texte als Klartext mit Pfad aus,
   Links als `[Text](url)`.
3. **Änderungen schreiben:** `scripts/_texte-anpassen.ts` aus `vorlage-anpassen.ts` anlegen und füllen:
   - `neu`: ganze Felder neu schreiben (AG-Beschreibungen), Absätze mit Links über `absatz()` aus `src/lib/lexical.ts`
   - `ersetzungen`: Ersetzungen in Textknoten; Struktur, Links und Formatierung bleiben dabei erhalten. Gilt auch
     für die einfachen Textfelder in `textfelder` (z. B. Namen: AG-`beteiligte`, Vorstand, Delegierte im Global
     `elternrat`). Bei Namen vorher im Dump suchen, wie sie tatsächlich geschrieben sind.
4. **Lokal ausführen:** `pnpm payload run scripts/_texte-anpassen.ts`. Danach Schritt 2 wiederholen oder den lokalen
   Dump mit grep auf verbliebene alte Formen prüfen.
5. **Dem User die neuen Texte zeigen und vor Prod fragen.**
6. **Prod:**
   ```bash
   PROD=$(grep -E '^DATABASE_URL=' .env.prod.local | cut -d= -f2- | tr -d '"')
   DATABASE_URL="$PROD" pnpm payload run scripts/_texte-anpassen.ts -- --prod
   ```
   Die IDs stimmen mit Prod überein, weil die lokale DB eine frische Kopie ist (Schritt 1).
7. **Deployen**, damit die Seiten neu gerendert werden (das Skript setzt `PAYLOAD_SKIP_REVALIDATE`):
   `vercel deploy --prod`
8. **Prüfen** mit `vercel curl <deployment-url>/<pfad> | grep …`.
9. **Aufräumen:** die `scripts/_*.ts`-Dateien löschen, sie werden nicht committet.

## Stolpersteine

- `payload run` führt das Modul nur aus: `await main()` auf oberster Ebene, sonst gibt es keine Ausgabe.
- Argumente brauchen `--`: `pnpm payload run skript.ts -- --prod`.
- Ein gesetztes `DATABASE_URL` hat Vorrang vor `.env.local`. Ohne lokale DB verweigern die Vorlagen den Lauf, wenn
  `--prod` fehlt.
- Die Ausgabe enthält «Pulling schema» und SSL-Warnungen, beides kann man ignorieren.
- Stand 2026-11: `tsn-elternrat.ch` zeigt noch auf die alte WordPress-Seite. Darum die Vercel-Deployment-URL
  prüfen, nicht die Domain.

## Schreibkonventionen (Rückmeldungen des Elternrats)

- Geschlechtergerecht mit Stern: Schüler\*innen, Vertreter\*innen; «Lehrpersonen» statt «Lehrer».
- Schulname: Tagesschule Nordstrasse (nicht «Schülerclub Nordstrasse»).
- Anführungszeichen «…», Schweizer Rechtschreibung (ss statt ß).
- AG-Beschreibungen einheitlich: beginnen mit «Die AG …», sachlich, 1–3 Sätze, keine «wir»-Form; Kontakt über die
  Elternbox (`/elternbox`). Keine Fakten erfinden, fehlende Angaben lieber bei der AG erfragen.
