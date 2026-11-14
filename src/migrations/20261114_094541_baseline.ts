import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_elternrat_klassen_stufe" AS ENUM('kg', 'unterstufe', 'mittelstufe');
  CREATE TABLE "nachrichten" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nachricht" varchar NOT NULL,
  	"name" varchar,
  	"email" varchar,
  	"vorschau" varchar,
  	"erledigt" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "arbeitsgruppen_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "arbeitsgruppen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"beschreibung" jsonb NOT NULL,
  	"beteiligte" varchar,
  	"ruhend" boolean DEFAULT false,
  	"details" jsonb,
  	"reihenfolge" numeric DEFAULT 100,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "arbeitsgruppen_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dokumente_id" integer
  );
  
  CREATE TABLE "protokolle" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"datum" timestamp(3) with time zone NOT NULL,
  	"schuljahr" varchar NOT NULL,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "bulletins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"datum" timestamp(3) with time zone NOT NULL,
  	"schuljahr" varchar NOT NULL,
  	"titelbild_id" integer,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "galerien" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"datum" timestamp(3) with time zone NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "galerien_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_mittel_url" varchar,
  	"sizes_mittel_width" numeric,
  	"sizes_mittel_height" numeric,
  	"sizes_mittel_mime_type" varchar,
  	"sizes_mittel_filesize" numeric,
  	"sizes_mittel_filename" varchar
  );
  
  CREATE TABLE "dokumente" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"nachrichten_id" integer,
  	"arbeitsgruppen_id" integer,
  	"protokolle_id" integer,
  	"bulletins_id" integer,
  	"galerien_id" integer,
  	"media_id" integer,
  	"dokumente_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "startseite" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar DEFAULT 'Willkommen beim Elternrat' NOT NULL,
  	"einleitung" jsonb,
  	"bild_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "elternrat_vorstand" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rolle" varchar NOT NULL,
  	"personen" varchar NOT NULL
  );
  
  CREATE TABLE "elternrat_klassen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stufe" "enum_elternrat_klassen_stufe" NOT NULL,
  	"klasse" varchar NOT NULL,
  	"delegierte" varchar NOT NULL
  );
  
  CREATE TABLE "elternrat_weitere" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rolle" varchar NOT NULL,
  	"personen" varchar NOT NULL
  );
  
  CREATE TABLE "elternrat" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"einleitung" jsonb,
  	"foto_id" integer,
  	"foto_legende" varchar,
  	"schuljahr" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "elternrat_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dokumente_id" integer
  );
  
  CREATE TABLE "texte" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"arbeitsgruppen_einleitung" jsonb,
  	"elternbox_einleitung" jsonb,
  	"protokolle_einleitung" varchar,
  	"bulletins_einleitung" varchar,
  	"fotos_einleitung" varchar,
  	"benachrichtigungs_email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "arbeitsgruppen_videos" ADD CONSTRAINT "arbeitsgruppen_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."arbeitsgruppen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "arbeitsgruppen_rels" ADD CONSTRAINT "arbeitsgruppen_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."arbeitsgruppen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "arbeitsgruppen_rels" ADD CONSTRAINT "arbeitsgruppen_rels_dokumente_fk" FOREIGN KEY ("dokumente_id") REFERENCES "public"."dokumente"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "bulletins" ADD CONSTRAINT "bulletins_titelbild_id_media_id_fk" FOREIGN KEY ("titelbild_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "galerien_rels" ADD CONSTRAINT "galerien_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."galerien"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "galerien_rels" ADD CONSTRAINT "galerien_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_nachrichten_fk" FOREIGN KEY ("nachrichten_id") REFERENCES "public"."nachrichten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_arbeitsgruppen_fk" FOREIGN KEY ("arbeitsgruppen_id") REFERENCES "public"."arbeitsgruppen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_protokolle_fk" FOREIGN KEY ("protokolle_id") REFERENCES "public"."protokolle"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bulletins_fk" FOREIGN KEY ("bulletins_id") REFERENCES "public"."bulletins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_galerien_fk" FOREIGN KEY ("galerien_id") REFERENCES "public"."galerien"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dokumente_fk" FOREIGN KEY ("dokumente_id") REFERENCES "public"."dokumente"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite" ADD CONSTRAINT "startseite_bild_id_media_id_fk" FOREIGN KEY ("bild_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elternrat_vorstand" ADD CONSTRAINT "elternrat_vorstand_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_klassen" ADD CONSTRAINT "elternrat_klassen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_weitere" ADD CONSTRAINT "elternrat_weitere_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat" ADD CONSTRAINT "elternrat_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elternrat_rels" ADD CONSTRAINT "elternrat_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_rels" ADD CONSTRAINT "elternrat_rels_dokumente_fk" FOREIGN KEY ("dokumente_id") REFERENCES "public"."dokumente"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "nachrichten_updated_at_idx" ON "nachrichten" USING btree ("updated_at");
  CREATE INDEX "nachrichten_created_at_idx" ON "nachrichten" USING btree ("created_at");
  CREATE INDEX "arbeitsgruppen_videos_order_idx" ON "arbeitsgruppen_videos" USING btree ("_order");
  CREATE INDEX "arbeitsgruppen_videos_parent_id_idx" ON "arbeitsgruppen_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "arbeitsgruppen_slug_idx" ON "arbeitsgruppen" USING btree ("slug");
  CREATE INDEX "arbeitsgruppen_updated_at_idx" ON "arbeitsgruppen" USING btree ("updated_at");
  CREATE INDEX "arbeitsgruppen_created_at_idx" ON "arbeitsgruppen" USING btree ("created_at");
  CREATE INDEX "arbeitsgruppen_rels_order_idx" ON "arbeitsgruppen_rels" USING btree ("order");
  CREATE INDEX "arbeitsgruppen_rels_parent_idx" ON "arbeitsgruppen_rels" USING btree ("parent_id");
  CREATE INDEX "arbeitsgruppen_rels_path_idx" ON "arbeitsgruppen_rels" USING btree ("path");
  CREATE INDEX "arbeitsgruppen_rels_dokumente_id_idx" ON "arbeitsgruppen_rels" USING btree ("dokumente_id");
  CREATE INDEX "protokolle_schuljahr_idx" ON "protokolle" USING btree ("schuljahr");
  CREATE INDEX "protokolle_updated_at_idx" ON "protokolle" USING btree ("updated_at");
  CREATE INDEX "protokolle_created_at_idx" ON "protokolle" USING btree ("created_at");
  CREATE UNIQUE INDEX "protokolle_filename_idx" ON "protokolle" USING btree ("filename");
  CREATE INDEX "bulletins_schuljahr_idx" ON "bulletins" USING btree ("schuljahr");
  CREATE INDEX "bulletins_titelbild_idx" ON "bulletins" USING btree ("titelbild_id");
  CREATE INDEX "bulletins_updated_at_idx" ON "bulletins" USING btree ("updated_at");
  CREATE INDEX "bulletins_created_at_idx" ON "bulletins" USING btree ("created_at");
  CREATE UNIQUE INDEX "bulletins_filename_idx" ON "bulletins" USING btree ("filename");
  CREATE UNIQUE INDEX "galerien_slug_idx" ON "galerien" USING btree ("slug");
  CREATE INDEX "galerien_updated_at_idx" ON "galerien" USING btree ("updated_at");
  CREATE INDEX "galerien_created_at_idx" ON "galerien" USING btree ("created_at");
  CREATE INDEX "galerien_rels_order_idx" ON "galerien_rels" USING btree ("order");
  CREATE INDEX "galerien_rels_parent_idx" ON "galerien_rels" USING btree ("parent_id");
  CREATE INDEX "galerien_rels_path_idx" ON "galerien_rels" USING btree ("path");
  CREATE INDEX "galerien_rels_media_id_idx" ON "galerien_rels" USING btree ("media_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_mittel_sizes_mittel_filename_idx" ON "media" USING btree ("sizes_mittel_filename");
  CREATE INDEX "dokumente_updated_at_idx" ON "dokumente" USING btree ("updated_at");
  CREATE INDEX "dokumente_created_at_idx" ON "dokumente" USING btree ("created_at");
  CREATE UNIQUE INDEX "dokumente_filename_idx" ON "dokumente" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_nachrichten_id_idx" ON "payload_locked_documents_rels" USING btree ("nachrichten_id");
  CREATE INDEX "payload_locked_documents_rels_arbeitsgruppen_id_idx" ON "payload_locked_documents_rels" USING btree ("arbeitsgruppen_id");
  CREATE INDEX "payload_locked_documents_rels_protokolle_id_idx" ON "payload_locked_documents_rels" USING btree ("protokolle_id");
  CREATE INDEX "payload_locked_documents_rels_bulletins_id_idx" ON "payload_locked_documents_rels" USING btree ("bulletins_id");
  CREATE INDEX "payload_locked_documents_rels_galerien_id_idx" ON "payload_locked_documents_rels" USING btree ("galerien_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_dokumente_id_idx" ON "payload_locked_documents_rels" USING btree ("dokumente_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "startseite_bild_idx" ON "startseite" USING btree ("bild_id");
  CREATE INDEX "elternrat_vorstand_order_idx" ON "elternrat_vorstand" USING btree ("_order");
  CREATE INDEX "elternrat_vorstand_parent_id_idx" ON "elternrat_vorstand" USING btree ("_parent_id");
  CREATE INDEX "elternrat_klassen_order_idx" ON "elternrat_klassen" USING btree ("_order");
  CREATE INDEX "elternrat_klassen_parent_id_idx" ON "elternrat_klassen" USING btree ("_parent_id");
  CREATE INDEX "elternrat_weitere_order_idx" ON "elternrat_weitere" USING btree ("_order");
  CREATE INDEX "elternrat_weitere_parent_id_idx" ON "elternrat_weitere" USING btree ("_parent_id");
  CREATE INDEX "elternrat_foto_idx" ON "elternrat" USING btree ("foto_id");
  CREATE INDEX "elternrat_schuljahr_idx" ON "elternrat" USING btree ("schuljahr");
  CREATE INDEX "elternrat_rels_order_idx" ON "elternrat_rels" USING btree ("order");
  CREATE INDEX "elternrat_rels_parent_idx" ON "elternrat_rels" USING btree ("parent_id");
  CREATE INDEX "elternrat_rels_path_idx" ON "elternrat_rels" USING btree ("path");
  CREATE INDEX "elternrat_rels_dokumente_id_idx" ON "elternrat_rels" USING btree ("dokumente_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "nachrichten" CASCADE;
  DROP TABLE "arbeitsgruppen_videos" CASCADE;
  DROP TABLE "arbeitsgruppen" CASCADE;
  DROP TABLE "arbeitsgruppen_rels" CASCADE;
  DROP TABLE "protokolle" CASCADE;
  DROP TABLE "bulletins" CASCADE;
  DROP TABLE "galerien" CASCADE;
  DROP TABLE "galerien_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "dokumente" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "startseite" CASCADE;
  DROP TABLE "elternrat_vorstand" CASCADE;
  DROP TABLE "elternrat_klassen" CASCADE;
  DROP TABLE "elternrat_weitere" CASCADE;
  DROP TABLE "elternrat" CASCADE;
  DROP TABLE "elternrat_rels" CASCADE;
  DROP TABLE "texte" CASCADE;
  DROP TYPE "public"."enum_elternrat_klassen_stufe";`)
}
