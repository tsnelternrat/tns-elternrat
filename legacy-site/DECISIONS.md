# Was vom alten Auftritt übernommen wird

Stand 2026-11-12, mit Daniel Seite für Seite anhand von `INDEX.md` entschieden.
Hier steht nur, **was** mitkommt. Struktur, Navigation und Startseite der neuen Seite sind noch offen.

## Bleibt

| Inhalt | Quelle | Bemerkung |
|---|---|---|
| Über den Elternrat | `pages/ueber-den-elternrat.md` | Einleitung, Gruppenfoto. Vorstand und Delegierte **strukturiert** pflegen (pro Schuljahr: Rollen, Klassen, Lehrpersonen, Delegierte). Liste 2025/26 übernehmen. |
| Arbeitsgruppen, Einleitung | `pages/arbeitsgruppen.md` | Nur der Einleitungstext, die Linkliste entfällt. |
| AG Bulletin | `pages/arbeitsgruppen/ag-bulletin.md` | Text von 2015 |
| AG Elternkontaktgremium | `pages/arbeitsgruppen/ag-elternmitwirkung-auf-stadt-und-schulkreisebene.md` | |
| AG Kafi im Gang | `pages/arbeitsgruppen/ag-kafi-im-gang.md` | Text von 2015 |
| AG Sommerabend | `pages/arbeitsgruppen/ag-sommerabend.md` | Text von 2015 |
| AG Verkehr | `pages/arbeitsgruppen/ag-verkehr.md` | Text von 2015 |
| AG Elternbildung | `pages/arbeitsgruppen/ag-weiterbildung.md` | |
| AG Kulturbrücke | `pages/arbeitsgruppen/ag-kulturbruecke.md` | |
| AG Klassenznüni | `pages/arbeitsgruppen/ag-klassenznueni.md` | |
| Charta Klassenznüni | `pages/charta-klassenznueni.md` | Text und PDF; gehört inhaltlich zur AG Klassenznüni. |
| Gemeinsam gegen die Läuseplage | `pages/lauseplage.md` | Text, 3 PDFs, 3 YouTube-Videos. |
| Protokolle | `pages/dokumente/protokolle.md` | Alle 87 PDFs, SJ 05/06 bis 25/26. |
| Bulletins | `pages/dokumente/bulletins.md` | Alle 16. |
| Fotogalerien | `pages/dokumente/fotogallerien.md` | Alle sechs Galerien, 130 Fotos (2016 bis 2023). |
| Flyer über den Elternrat | PDF `2023/03/er_flyer.pdf` | Nur das PDF, keine eigene Seite. |
| Konzept Elternrat | PDF `2015/12/Elternrat-Konzept-2015.pdf` | Nur das PDF, keine eigene Seite. |
| Kontakt | `pages/kontakt.md` | Einleitungstext. Formular heute: Vorname, Nachname, E-Mail, Betreff, Nachricht. |

## Fällt weg

- Entwürfe von 2021: «Arbeitsgruppen / neu», «Bulletins / neu», «Protokollarchiv / neu», «Fotos / neu», «Über den Elternrat / neu»
- AG Schüeli, AG Freiluftlabor, AG Elterntisch
- «Dokumente» (reine Linkliste), Seiten «Flyer» und «Konzept» (PDFs bleiben)
- «Weiterbildung für Eltern» samt 29 Fotos und PDF
- «Links» (15 externe Links von 2015)
- «Newsletter» und «Benachrichtigungen abonnieren»: keine Benachrichtigungsfunktion mehr
- Die zwei Beiträge (Hinweise auf neues Bulletin bzw. Protokoll)

## Noch offen

- Startseite: Entwurf «Homepage» (`pages/test.md`) als Ideenquelle aufbewahrt; Entscheid zusammen mit der neuen Struktur.
- Konzept: «Über den Elternrat» verlinkt die Fassungen 2003 und 2006, «Dokumente» die von 2015. Annahme: 2015 gilt, die alten entfallen.
- Die Läuseplage-Seite nennt eine «AG Läuse», die in der AG-Liste nicht vorkommt.
- Alte AG-Texte sprechen noch vom «Schülerclub Nordstrasse».
- Über-Seite: Foto ist mit 2026/2027 beschriftet, Liste mit 2025/26.

## Fehlende oder defekte Dateien

- Bulletin 2018-03 (`2019/03/190313_TSN_Bulletin.pdf`) fehlt auf dem Server.
- Bulletins «2021-02» und «2021-01» zeigen auf dasselbe PDF.
- Protokoll vom 18.02.2016: Link zeigt auf `2016/031/...`, eine Datei dieses Pfads gibt es nicht.

## Stand nach dem Import (2026-11-12)

Importiert mit `pnpm import:legacy`: 9 Arbeitsgruppen, 87 Protokolle, 16 Bulletins, 6 Galerien mit 130 Fotos, 6 Dokumente.

Platzhalter, die im Admin noch zu bereinigen sind:

- **AG Läuse** ist als neunte Arbeitsgruppe angelegt, mit dem Inhalt der alten Seite «Läuseplage».
- **Bulletin 2021-01 und 2021-02** sind beide vorhanden, mit demselben PDF.
- **Bulletin 2018-03** fehlt (Datei nicht auf dem alten Server).
- **Protokoll vom 18.02.2016** fehlt (defekter Link auf der alten Seite).
- **Protokolltitel** ohne Tag im alten Titel heissen «Protokoll März 2026» und sind auf den 1. des Monats datiert.
- **Bulletin-Daten** stammen aus dem Dateinamen; bei den alten Ausgaben (2007 bis 2018) sind sie geschätzt.
- **Startseite:** Begrüssungstext aus dem Entwurf von 2021 und aus `Struktur.md`.
- **Elternbox:** Einleitung ist der Text der alten Kontaktseite; Benachrichtigungsadresse ist leer.
- **Elternrat:** Bildlegende sagt 2026/2027, Liste ist 2025/26; Konzept 2015 und Flyer sind verlinkt, die Fassungen 2003/2006 nicht.
- Alte AG-Texte sprechen noch vom «Schülerclub Nordstrasse».

## Nachtrag aus dem Protokoll vom 28.09.2026

- Arbeitsgruppen haben neu die Felder «Beteiligte» und «Ruhend»; alle sind nach Protokoll gefüllt.
- Neu angelegt: AG Webseite/Digitalisierung, AG Advent, AG Räbeliechtli, AG Infrastruktur, AG Medienbewusstsein, AG Fundgrube. **Die Kurzbeschreibungen sind Platzhalter** (ein Satz, aus dem Namen abgeleitet).
- Umbenannt: AG Bulletin → AG Elternrat-Bulletin, AG Elternbildung → AG Elternweiterbildung (Adressen unverändert).
- AG Läuse entfernt; ihre drei PDFs liegen noch unverknüpft unter «Dokumente». AG Kulturbrücke bleibt ohne Beteiligte.
- Vorstand: Vorsitz Maëlis Nibourel / Dennis Padel, Finanzen Johannes von Liebe.
- Die Delegiertenliste ist weiterhin die von 2025/26; die Liste 2026/27 fehlt noch.
