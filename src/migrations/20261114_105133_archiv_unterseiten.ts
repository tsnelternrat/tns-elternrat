import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_seiten_blocks_liste_darstellung" ADD VALUE 'schuljahr';
  ALTER TYPE "public"."enum_startseite_blocks_liste_darstellung" ADD VALUE 'schuljahr';
  ALTER TABLE "seiten_blocks_archiv" ADD COLUMN "protokolle_text" varchar;
  ALTER TABLE "seiten_blocks_archiv" ADD COLUMN "bulletins_text" varchar;
  ALTER TABLE "seiten_blocks_archiv" ADD COLUMN "fotos_text" varchar;
  ALTER TABLE "startseite_blocks_archiv" ADD COLUMN "protokolle_text" varchar;
  ALTER TABLE "startseite_blocks_archiv" ADD COLUMN "bulletins_text" varchar;
  ALTER TABLE "startseite_blocks_archiv" ADD COLUMN "fotos_text" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "seiten_blocks_liste" ALTER COLUMN "darstellung" SET DATA TYPE text;
  ALTER TABLE "seiten_blocks_liste" ALTER COLUMN "darstellung" SET DEFAULT 'karten'::text;
  DROP TYPE "public"."enum_seiten_blocks_liste_darstellung";
  CREATE TYPE "public"."enum_seiten_blocks_liste_darstellung" AS ENUM('karten', 'liste');
  ALTER TABLE "seiten_blocks_liste" ALTER COLUMN "darstellung" SET DEFAULT 'karten'::"public"."enum_seiten_blocks_liste_darstellung";
  ALTER TABLE "seiten_blocks_liste" ALTER COLUMN "darstellung" SET DATA TYPE "public"."enum_seiten_blocks_liste_darstellung" USING "darstellung"::"public"."enum_seiten_blocks_liste_darstellung";
  ALTER TABLE "startseite_blocks_liste" ALTER COLUMN "darstellung" SET DATA TYPE text;
  ALTER TABLE "startseite_blocks_liste" ALTER COLUMN "darstellung" SET DEFAULT 'karten'::text;
  DROP TYPE "public"."enum_startseite_blocks_liste_darstellung";
  CREATE TYPE "public"."enum_startseite_blocks_liste_darstellung" AS ENUM('karten', 'liste');
  ALTER TABLE "startseite_blocks_liste" ALTER COLUMN "darstellung" SET DEFAULT 'karten'::"public"."enum_startseite_blocks_liste_darstellung";
  ALTER TABLE "startseite_blocks_liste" ALTER COLUMN "darstellung" SET DATA TYPE "public"."enum_startseite_blocks_liste_darstellung" USING "darstellung"::"public"."enum_startseite_blocks_liste_darstellung";
  ALTER TABLE "seiten_blocks_archiv" DROP COLUMN "protokolle_text";
  ALTER TABLE "seiten_blocks_archiv" DROP COLUMN "bulletins_text";
  ALTER TABLE "seiten_blocks_archiv" DROP COLUMN "fotos_text";
  ALTER TABLE "startseite_blocks_archiv" DROP COLUMN "protokolle_text";
  ALTER TABLE "startseite_blocks_archiv" DROP COLUMN "bulletins_text";
  ALTER TABLE "startseite_blocks_archiv" DROP COLUMN "fotos_text";`)
}
