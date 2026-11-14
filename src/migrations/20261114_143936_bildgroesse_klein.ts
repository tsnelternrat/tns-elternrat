import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "sizes_klein_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_klein_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_klein_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_klein_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_klein_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_klein_filename" varchar;
  CREATE INDEX "media_sizes_klein_sizes_klein_filename_idx" ON "media" USING btree ("sizes_klein_filename");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "media_sizes_klein_sizes_klein_filename_idx";
  ALTER TABLE "media" DROP COLUMN "sizes_klein_url";
  ALTER TABLE "media" DROP COLUMN "sizes_klein_width";
  ALTER TABLE "media" DROP COLUMN "sizes_klein_height";
  ALTER TABLE "media" DROP COLUMN "sizes_klein_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_klein_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_klein_filename";`)
}
