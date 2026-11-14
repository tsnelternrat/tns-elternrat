import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "elternrat_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "elternrat_rels" CASCADE;
  ALTER TABLE "startseite" DROP CONSTRAINT "startseite_bild_id_media_id_fk";
  
  ALTER TABLE "elternrat" DROP CONSTRAINT "elternrat_foto_id_media_id_fk";
  
  DROP INDEX "startseite_bild_idx";
  DROP INDEX "elternrat_foto_idx";
  ALTER TABLE "startseite" DROP COLUMN "titel";
  ALTER TABLE "startseite" DROP COLUMN "einleitung";
  ALTER TABLE "startseite" DROP COLUMN "bild_id";
  ALTER TABLE "elternrat" DROP COLUMN "einleitung";
  ALTER TABLE "elternrat" DROP COLUMN "foto_id";
  ALTER TABLE "elternrat" DROP COLUMN "foto_legende";
  ALTER TABLE "texte" DROP COLUMN "arbeitsgruppen_einleitung";
  ALTER TABLE "texte" DROP COLUMN "protokolle_einleitung";
  ALTER TABLE "texte" DROP COLUMN "bulletins_einleitung";
  ALTER TABLE "texte" DROP COLUMN "fotos_einleitung";
  ALTER TABLE "texte" DROP COLUMN "elternbox_einleitung";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "elternrat_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dokumente_id" integer
  );
  
  ALTER TABLE "startseite" ADD COLUMN "titel" varchar DEFAULT 'Willkommen beim Elternrat' NOT NULL;
  ALTER TABLE "startseite" ADD COLUMN "einleitung" jsonb;
  ALTER TABLE "startseite" ADD COLUMN "bild_id" integer;
  ALTER TABLE "elternrat" ADD COLUMN "einleitung" jsonb;
  ALTER TABLE "elternrat" ADD COLUMN "foto_id" integer;
  ALTER TABLE "elternrat" ADD COLUMN "foto_legende" varchar;
  ALTER TABLE "texte" ADD COLUMN "arbeitsgruppen_einleitung" jsonb;
  ALTER TABLE "texte" ADD COLUMN "protokolle_einleitung" varchar;
  ALTER TABLE "texte" ADD COLUMN "bulletins_einleitung" varchar;
  ALTER TABLE "texte" ADD COLUMN "fotos_einleitung" varchar;
  ALTER TABLE "texte" ADD COLUMN "elternbox_einleitung" jsonb;
  ALTER TABLE "elternrat_rels" ADD CONSTRAINT "elternrat_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_rels" ADD CONSTRAINT "elternrat_rels_dokumente_fk" FOREIGN KEY ("dokumente_id") REFERENCES "public"."dokumente"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "elternrat_rels_order_idx" ON "elternrat_rels" USING btree ("order");
  CREATE INDEX "elternrat_rels_parent_idx" ON "elternrat_rels" USING btree ("parent_id");
  CREATE INDEX "elternrat_rels_path_idx" ON "elternrat_rels" USING btree ("path");
  CREATE INDEX "elternrat_rels_dokumente_id_idx" ON "elternrat_rels" USING btree ("dokumente_id");
  ALTER TABLE "startseite" ADD CONSTRAINT "startseite_bild_id_media_id_fk" FOREIGN KEY ("bild_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elternrat" ADD CONSTRAINT "elternrat_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "startseite_bild_idx" ON "startseite" USING btree ("bild_id");
  CREATE INDEX "elternrat_foto_idx" ON "elternrat" USING btree ("foto_id");`)
}
