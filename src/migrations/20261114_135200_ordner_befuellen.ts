import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

import { bestandEinordnen } from '../lib/ordner'

/**
 * Bestehende Bilder einsortieren: je Galerie ein Ordner unter «Fotogalerien», der Rest in «Website».
 * Eigene Migration, weil ein Ordner-Hook von Payload ausserhalb der Transaktion liest und die
 * Tabelle aus 20261114_135119_ordner darum schon committet sein muss.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const ergebnis = await bestandEinordnen(payload, req)
  payload.logger.info(`Ordner: ${JSON.stringify(ergebnis)}`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`UPDATE "media" SET "folder_id" = NULL; DELETE FROM "payload_folders";`)
}
