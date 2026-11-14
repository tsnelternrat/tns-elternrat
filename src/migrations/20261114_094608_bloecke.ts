import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_seiten_blocks_buehne_knoepfe_stil" AS ENUM('voll', 'hell');
  CREATE TYPE "public"."enum_seiten_blocks_text_breite" AS ENUM('schmal', 'voll');
  CREATE TYPE "public"."enum_seiten_blocks_bild_text_bild_position" AS ENUM('rechts', 'links');
  CREATE TYPE "public"."enum_seiten_blocks_karten_spalten" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_seiten_blocks_aktuell_zeigen" AS ENUM('bulletin', 'protokoll', 'galerie');
  CREATE TYPE "public"."enum_seiten_blocks_liste_quelle" AS ENUM('protokolle', 'bulletins', 'galerien', 'arbeitsgruppen');
  CREATE TYPE "public"."enum_seiten_blocks_liste_darstellung" AS ENUM('karten', 'liste');
  CREATE TYPE "public"."enum_startseite_blocks_buehne_knoepfe_stil" AS ENUM('voll', 'hell');
  CREATE TYPE "public"."enum_startseite_blocks_text_breite" AS ENUM('schmal', 'voll');
  CREATE TYPE "public"."enum_startseite_blocks_bild_text_bild_position" AS ENUM('rechts', 'links');
  CREATE TYPE "public"."enum_startseite_blocks_karten_spalten" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_startseite_blocks_aktuell_zeigen" AS ENUM('bulletin', 'protokoll', 'galerie');
  CREATE TYPE "public"."enum_startseite_blocks_liste_quelle" AS ENUM('protokolle', 'bulletins', 'galerien', 'arbeitsgruppen');
  CREATE TYPE "public"."enum_startseite_blocks_liste_darstellung" AS ENUM('karten', 'liste');
  CREATE TYPE "public"."enum_elternrat_blocks_buehne_knoepfe_stil" AS ENUM('voll', 'hell');
  CREATE TYPE "public"."enum_elternrat_blocks_text_breite" AS ENUM('schmal', 'voll');
  CREATE TYPE "public"."enum_elternrat_blocks_bild_text_bild_position" AS ENUM('rechts', 'links');
  CREATE TYPE "public"."enum_elternrat_blocks_karten_spalten" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_elternrat_blocks_aktuell_zeigen" AS ENUM('bulletin', 'protokoll', 'galerie');
  CREATE TYPE "public"."enum_elternrat_blocks_liste_quelle" AS ENUM('protokolle', 'bulletins', 'galerien', 'arbeitsgruppen');
  CREATE TYPE "public"."enum_elternrat_blocks_liste_darstellung" AS ENUM('karten', 'liste');
  CREATE TYPE "public"."enum_texte_blocks_buehne_knoepfe_stil" AS ENUM('voll', 'hell');
  CREATE TYPE "public"."enum_texte_blocks_text_breite" AS ENUM('schmal', 'voll');
  CREATE TYPE "public"."enum_texte_blocks_bild_text_bild_position" AS ENUM('rechts', 'links');
  CREATE TYPE "public"."enum_texte_blocks_karten_spalten" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_texte_blocks_aktuell_zeigen" AS ENUM('bulletin', 'protokoll', 'galerie');
  CREATE TYPE "public"."enum_texte_blocks_liste_quelle" AS ENUM('protokolle', 'bulletins', 'galerien', 'arbeitsgruppen');
  CREATE TYPE "public"."enum_texte_blocks_liste_darstellung" AS ENUM('karten', 'liste');
  CREATE TABLE "seiten_blocks_buehne_knoepfe" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"ziel" varchar NOT NULL,
  	"stil" "enum_seiten_blocks_buehne_knoepfe_stil" DEFAULT 'voll'
  );
  
  CREATE TABLE "seiten_blocks_buehne" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"text" jsonb,
  	"bild_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "seiten_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"text" jsonb NOT NULL,
  	"breite" "enum_seiten_blocks_text_breite" DEFAULT 'schmal',
  	"gross" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "seiten_blocks_bild_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"text" jsonb,
  	"bild_id" integer NOT NULL,
  	"bild_position" "enum_seiten_blocks_bild_text_bild_position" DEFAULT 'rechts',
  	"legende" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "seiten_blocks_karten_karten" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"text" varchar,
  	"link_label" varchar,
  	"link_ziel" varchar,
  	"farbig" boolean
  );
  
  CREATE TABLE "seiten_blocks_karten" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"spalten" "enum_seiten_blocks_karten_spalten" DEFAULT '2',
  	"block_name" varchar
  );
  
  CREATE TABLE "seiten_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "seiten_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"url" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "seiten_blocks_galerie" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"galerie_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "seiten_blocks_aktuell_zeigen" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_seiten_blocks_aktuell_zeigen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "seiten_blocks_aktuell" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar DEFAULT 'Aktuell',
  	"block_name" varchar
  );
  
  CREATE TABLE "seiten_blocks_liste" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"quelle" "enum_seiten_blocks_liste_quelle" DEFAULT 'protokolle' NOT NULL,
  	"anzahl" numeric DEFAULT 3,
  	"darstellung" "enum_seiten_blocks_liste_darstellung" DEFAULT 'karten',
  	"link_alle" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "seiten_blocks_archiv" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "seiten" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"titel_zeigen" boolean DEFAULT true,
  	"beschreibung" varchar,
  	"in_navigation" boolean DEFAULT false,
  	"reihenfolge" numeric DEFAULT 100,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "seiten_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dokumente_id" integer,
  	"arbeitsgruppen_id" integer
  );
  
  CREATE TABLE "startseite_blocks_buehne_knoepfe" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"ziel" varchar NOT NULL,
  	"stil" "enum_startseite_blocks_buehne_knoepfe_stil" DEFAULT 'voll'
  );
  
  CREATE TABLE "startseite_blocks_buehne" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"text" jsonb,
  	"bild_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "startseite_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"text" jsonb NOT NULL,
  	"breite" "enum_startseite_blocks_text_breite" DEFAULT 'schmal',
  	"gross" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "startseite_blocks_bild_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"text" jsonb,
  	"bild_id" integer NOT NULL,
  	"bild_position" "enum_startseite_blocks_bild_text_bild_position" DEFAULT 'rechts',
  	"legende" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "startseite_blocks_karten_karten" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"text" varchar,
  	"link_label" varchar,
  	"link_ziel" varchar,
  	"farbig" boolean
  );
  
  CREATE TABLE "startseite_blocks_karten" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"spalten" "enum_startseite_blocks_karten_spalten" DEFAULT '2',
  	"block_name" varchar
  );
  
  CREATE TABLE "startseite_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "startseite_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"url" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "startseite_blocks_galerie" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"galerie_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "startseite_blocks_aktuell_zeigen" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_startseite_blocks_aktuell_zeigen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "startseite_blocks_aktuell" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar DEFAULT 'Aktuell',
  	"block_name" varchar
  );
  
  CREATE TABLE "startseite_blocks_liste" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"quelle" "enum_startseite_blocks_liste_quelle" DEFAULT 'protokolle' NOT NULL,
  	"anzahl" numeric DEFAULT 3,
  	"darstellung" "enum_startseite_blocks_liste_darstellung" DEFAULT 'karten',
  	"link_alle" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "startseite_blocks_archiv" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "startseite_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dokumente_id" integer,
  	"arbeitsgruppen_id" integer
  );
  
  CREATE TABLE "elternrat_blocks_buehne_knoepfe" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"ziel" varchar NOT NULL,
  	"stil" "enum_elternrat_blocks_buehne_knoepfe_stil" DEFAULT 'voll'
  );
  
  CREATE TABLE "elternrat_blocks_buehne" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"text" jsonb,
  	"bild_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "elternrat_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"text" jsonb NOT NULL,
  	"breite" "enum_elternrat_blocks_text_breite" DEFAULT 'schmal',
  	"gross" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "elternrat_blocks_bild_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"text" jsonb,
  	"bild_id" integer NOT NULL,
  	"bild_position" "enum_elternrat_blocks_bild_text_bild_position" DEFAULT 'rechts',
  	"legende" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "elternrat_blocks_karten_karten" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"text" varchar,
  	"link_label" varchar,
  	"link_ziel" varchar,
  	"farbig" boolean
  );
  
  CREATE TABLE "elternrat_blocks_karten" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"spalten" "enum_elternrat_blocks_karten_spalten" DEFAULT '2',
  	"block_name" varchar
  );
  
  CREATE TABLE "elternrat_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "elternrat_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"url" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "elternrat_blocks_galerie" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"galerie_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "elternrat_blocks_aktuell_zeigen" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_elternrat_blocks_aktuell_zeigen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "elternrat_blocks_aktuell" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar DEFAULT 'Aktuell',
  	"block_name" varchar
  );
  
  CREATE TABLE "elternrat_blocks_liste" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"quelle" "enum_elternrat_blocks_liste_quelle" DEFAULT 'protokolle' NOT NULL,
  	"anzahl" numeric DEFAULT 3,
  	"darstellung" "enum_elternrat_blocks_liste_darstellung" DEFAULT 'karten',
  	"link_alle" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "elternrat_blocks_archiv" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "texte_blocks_buehne_knoepfe" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"ziel" varchar NOT NULL,
  	"stil" "enum_texte_blocks_buehne_knoepfe_stil" DEFAULT 'voll'
  );
  
  CREATE TABLE "texte_blocks_buehne" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"text" jsonb,
  	"bild_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "texte_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"text" jsonb NOT NULL,
  	"breite" "enum_texte_blocks_text_breite" DEFAULT 'schmal',
  	"gross" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "texte_blocks_bild_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"text" jsonb,
  	"bild_id" integer NOT NULL,
  	"bild_position" "enum_texte_blocks_bild_text_bild_position" DEFAULT 'rechts',
  	"legende" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "texte_blocks_karten_karten" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"text" varchar,
  	"link_label" varchar,
  	"link_ziel" varchar,
  	"farbig" boolean
  );
  
  CREATE TABLE "texte_blocks_karten" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"spalten" "enum_texte_blocks_karten_spalten" DEFAULT '2',
  	"block_name" varchar
  );
  
  CREATE TABLE "texte_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "texte_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"url" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "texte_blocks_galerie" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"galerie_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "texte_blocks_aktuell_zeigen" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_texte_blocks_aktuell_zeigen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "texte_blocks_aktuell" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar DEFAULT 'Aktuell',
  	"block_name" varchar
  );
  
  CREATE TABLE "texte_blocks_liste" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"quelle" "enum_texte_blocks_liste_quelle" DEFAULT 'protokolle' NOT NULL,
  	"anzahl" numeric DEFAULT 3,
  	"darstellung" "enum_texte_blocks_liste_darstellung" DEFAULT 'karten',
  	"link_alle" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "texte_blocks_archiv" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titel" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "texte_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dokumente_id" integer,
  	"arbeitsgruppen_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "seiten_id" integer;
  ALTER TABLE "elternrat_rels" ADD COLUMN "arbeitsgruppen_id" integer;
  ALTER TABLE "seiten_blocks_buehne_knoepfe" ADD CONSTRAINT "seiten_blocks_buehne_knoepfe_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten_blocks_buehne"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_blocks_buehne" ADD CONSTRAINT "seiten_blocks_buehne_bild_id_media_id_fk" FOREIGN KEY ("bild_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seiten_blocks_buehne" ADD CONSTRAINT "seiten_blocks_buehne_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_blocks_text" ADD CONSTRAINT "seiten_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_blocks_bild_text" ADD CONSTRAINT "seiten_blocks_bild_text_bild_id_media_id_fk" FOREIGN KEY ("bild_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seiten_blocks_bild_text" ADD CONSTRAINT "seiten_blocks_bild_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_blocks_karten_karten" ADD CONSTRAINT "seiten_blocks_karten_karten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten_blocks_karten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_blocks_karten" ADD CONSTRAINT "seiten_blocks_karten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_blocks_downloads" ADD CONSTRAINT "seiten_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_blocks_video" ADD CONSTRAINT "seiten_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_blocks_galerie" ADD CONSTRAINT "seiten_blocks_galerie_galerie_id_galerien_id_fk" FOREIGN KEY ("galerie_id") REFERENCES "public"."galerien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seiten_blocks_galerie" ADD CONSTRAINT "seiten_blocks_galerie_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_blocks_aktuell_zeigen" ADD CONSTRAINT "seiten_blocks_aktuell_zeigen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."seiten_blocks_aktuell"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_blocks_aktuell" ADD CONSTRAINT "seiten_blocks_aktuell_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_blocks_liste" ADD CONSTRAINT "seiten_blocks_liste_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_blocks_archiv" ADD CONSTRAINT "seiten_blocks_archiv_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_rels" ADD CONSTRAINT "seiten_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_rels" ADD CONSTRAINT "seiten_rels_dokumente_fk" FOREIGN KEY ("dokumente_id") REFERENCES "public"."dokumente"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seiten_rels" ADD CONSTRAINT "seiten_rels_arbeitsgruppen_fk" FOREIGN KEY ("arbeitsgruppen_id") REFERENCES "public"."arbeitsgruppen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_blocks_buehne_knoepfe" ADD CONSTRAINT "startseite_blocks_buehne_knoepfe_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."startseite_blocks_buehne"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_blocks_buehne" ADD CONSTRAINT "startseite_blocks_buehne_bild_id_media_id_fk" FOREIGN KEY ("bild_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "startseite_blocks_buehne" ADD CONSTRAINT "startseite_blocks_buehne_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."startseite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_blocks_text" ADD CONSTRAINT "startseite_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."startseite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_blocks_bild_text" ADD CONSTRAINT "startseite_blocks_bild_text_bild_id_media_id_fk" FOREIGN KEY ("bild_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "startseite_blocks_bild_text" ADD CONSTRAINT "startseite_blocks_bild_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."startseite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_blocks_karten_karten" ADD CONSTRAINT "startseite_blocks_karten_karten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."startseite_blocks_karten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_blocks_karten" ADD CONSTRAINT "startseite_blocks_karten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."startseite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_blocks_downloads" ADD CONSTRAINT "startseite_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."startseite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_blocks_video" ADD CONSTRAINT "startseite_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."startseite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_blocks_galerie" ADD CONSTRAINT "startseite_blocks_galerie_galerie_id_galerien_id_fk" FOREIGN KEY ("galerie_id") REFERENCES "public"."galerien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "startseite_blocks_galerie" ADD CONSTRAINT "startseite_blocks_galerie_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."startseite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_blocks_aktuell_zeigen" ADD CONSTRAINT "startseite_blocks_aktuell_zeigen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."startseite_blocks_aktuell"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_blocks_aktuell" ADD CONSTRAINT "startseite_blocks_aktuell_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."startseite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_blocks_liste" ADD CONSTRAINT "startseite_blocks_liste_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."startseite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_blocks_archiv" ADD CONSTRAINT "startseite_blocks_archiv_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."startseite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_rels" ADD CONSTRAINT "startseite_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."startseite"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_rels" ADD CONSTRAINT "startseite_rels_dokumente_fk" FOREIGN KEY ("dokumente_id") REFERENCES "public"."dokumente"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "startseite_rels" ADD CONSTRAINT "startseite_rels_arbeitsgruppen_fk" FOREIGN KEY ("arbeitsgruppen_id") REFERENCES "public"."arbeitsgruppen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_buehne_knoepfe" ADD CONSTRAINT "elternrat_blocks_buehne_knoepfe_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat_blocks_buehne"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_buehne" ADD CONSTRAINT "elternrat_blocks_buehne_bild_id_media_id_fk" FOREIGN KEY ("bild_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_buehne" ADD CONSTRAINT "elternrat_blocks_buehne_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_text" ADD CONSTRAINT "elternrat_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_bild_text" ADD CONSTRAINT "elternrat_blocks_bild_text_bild_id_media_id_fk" FOREIGN KEY ("bild_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_bild_text" ADD CONSTRAINT "elternrat_blocks_bild_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_karten_karten" ADD CONSTRAINT "elternrat_blocks_karten_karten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat_blocks_karten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_karten" ADD CONSTRAINT "elternrat_blocks_karten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_downloads" ADD CONSTRAINT "elternrat_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_video" ADD CONSTRAINT "elternrat_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_galerie" ADD CONSTRAINT "elternrat_blocks_galerie_galerie_id_galerien_id_fk" FOREIGN KEY ("galerie_id") REFERENCES "public"."galerien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_galerie" ADD CONSTRAINT "elternrat_blocks_galerie_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_aktuell_zeigen" ADD CONSTRAINT "elternrat_blocks_aktuell_zeigen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."elternrat_blocks_aktuell"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_aktuell" ADD CONSTRAINT "elternrat_blocks_aktuell_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_liste" ADD CONSTRAINT "elternrat_blocks_liste_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_blocks_archiv" ADD CONSTRAINT "elternrat_blocks_archiv_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elternrat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_blocks_buehne_knoepfe" ADD CONSTRAINT "texte_blocks_buehne_knoepfe_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."texte_blocks_buehne"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_blocks_buehne" ADD CONSTRAINT "texte_blocks_buehne_bild_id_media_id_fk" FOREIGN KEY ("bild_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "texte_blocks_buehne" ADD CONSTRAINT "texte_blocks_buehne_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_blocks_text" ADD CONSTRAINT "texte_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_blocks_bild_text" ADD CONSTRAINT "texte_blocks_bild_text_bild_id_media_id_fk" FOREIGN KEY ("bild_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "texte_blocks_bild_text" ADD CONSTRAINT "texte_blocks_bild_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_blocks_karten_karten" ADD CONSTRAINT "texte_blocks_karten_karten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."texte_blocks_karten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_blocks_karten" ADD CONSTRAINT "texte_blocks_karten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_blocks_downloads" ADD CONSTRAINT "texte_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_blocks_video" ADD CONSTRAINT "texte_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_blocks_galerie" ADD CONSTRAINT "texte_blocks_galerie_galerie_id_galerien_id_fk" FOREIGN KEY ("galerie_id") REFERENCES "public"."galerien"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "texte_blocks_galerie" ADD CONSTRAINT "texte_blocks_galerie_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_blocks_aktuell_zeigen" ADD CONSTRAINT "texte_blocks_aktuell_zeigen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."texte_blocks_aktuell"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_blocks_aktuell" ADD CONSTRAINT "texte_blocks_aktuell_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_blocks_liste" ADD CONSTRAINT "texte_blocks_liste_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_blocks_archiv" ADD CONSTRAINT "texte_blocks_archiv_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_rels" ADD CONSTRAINT "texte_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."texte"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_rels" ADD CONSTRAINT "texte_rels_dokumente_fk" FOREIGN KEY ("dokumente_id") REFERENCES "public"."dokumente"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "texte_rels" ADD CONSTRAINT "texte_rels_arbeitsgruppen_fk" FOREIGN KEY ("arbeitsgruppen_id") REFERENCES "public"."arbeitsgruppen"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "seiten_blocks_buehne_knoepfe_order_idx" ON "seiten_blocks_buehne_knoepfe" USING btree ("_order");
  CREATE INDEX "seiten_blocks_buehne_knoepfe_parent_id_idx" ON "seiten_blocks_buehne_knoepfe" USING btree ("_parent_id");
  CREATE INDEX "seiten_blocks_buehne_order_idx" ON "seiten_blocks_buehne" USING btree ("_order");
  CREATE INDEX "seiten_blocks_buehne_parent_id_idx" ON "seiten_blocks_buehne" USING btree ("_parent_id");
  CREATE INDEX "seiten_blocks_buehne_path_idx" ON "seiten_blocks_buehne" USING btree ("_path");
  CREATE INDEX "seiten_blocks_buehne_bild_idx" ON "seiten_blocks_buehne" USING btree ("bild_id");
  CREATE INDEX "seiten_blocks_text_order_idx" ON "seiten_blocks_text" USING btree ("_order");
  CREATE INDEX "seiten_blocks_text_parent_id_idx" ON "seiten_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "seiten_blocks_text_path_idx" ON "seiten_blocks_text" USING btree ("_path");
  CREATE INDEX "seiten_blocks_bild_text_order_idx" ON "seiten_blocks_bild_text" USING btree ("_order");
  CREATE INDEX "seiten_blocks_bild_text_parent_id_idx" ON "seiten_blocks_bild_text" USING btree ("_parent_id");
  CREATE INDEX "seiten_blocks_bild_text_path_idx" ON "seiten_blocks_bild_text" USING btree ("_path");
  CREATE INDEX "seiten_blocks_bild_text_bild_idx" ON "seiten_blocks_bild_text" USING btree ("bild_id");
  CREATE INDEX "seiten_blocks_karten_karten_order_idx" ON "seiten_blocks_karten_karten" USING btree ("_order");
  CREATE INDEX "seiten_blocks_karten_karten_parent_id_idx" ON "seiten_blocks_karten_karten" USING btree ("_parent_id");
  CREATE INDEX "seiten_blocks_karten_order_idx" ON "seiten_blocks_karten" USING btree ("_order");
  CREATE INDEX "seiten_blocks_karten_parent_id_idx" ON "seiten_blocks_karten" USING btree ("_parent_id");
  CREATE INDEX "seiten_blocks_karten_path_idx" ON "seiten_blocks_karten" USING btree ("_path");
  CREATE INDEX "seiten_blocks_downloads_order_idx" ON "seiten_blocks_downloads" USING btree ("_order");
  CREATE INDEX "seiten_blocks_downloads_parent_id_idx" ON "seiten_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "seiten_blocks_downloads_path_idx" ON "seiten_blocks_downloads" USING btree ("_path");
  CREATE INDEX "seiten_blocks_video_order_idx" ON "seiten_blocks_video" USING btree ("_order");
  CREATE INDEX "seiten_blocks_video_parent_id_idx" ON "seiten_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "seiten_blocks_video_path_idx" ON "seiten_blocks_video" USING btree ("_path");
  CREATE INDEX "seiten_blocks_galerie_order_idx" ON "seiten_blocks_galerie" USING btree ("_order");
  CREATE INDEX "seiten_blocks_galerie_parent_id_idx" ON "seiten_blocks_galerie" USING btree ("_parent_id");
  CREATE INDEX "seiten_blocks_galerie_path_idx" ON "seiten_blocks_galerie" USING btree ("_path");
  CREATE INDEX "seiten_blocks_galerie_galerie_idx" ON "seiten_blocks_galerie" USING btree ("galerie_id");
  CREATE INDEX "seiten_blocks_aktuell_zeigen_order_idx" ON "seiten_blocks_aktuell_zeigen" USING btree ("order");
  CREATE INDEX "seiten_blocks_aktuell_zeigen_parent_idx" ON "seiten_blocks_aktuell_zeigen" USING btree ("parent_id");
  CREATE INDEX "seiten_blocks_aktuell_order_idx" ON "seiten_blocks_aktuell" USING btree ("_order");
  CREATE INDEX "seiten_blocks_aktuell_parent_id_idx" ON "seiten_blocks_aktuell" USING btree ("_parent_id");
  CREATE INDEX "seiten_blocks_aktuell_path_idx" ON "seiten_blocks_aktuell" USING btree ("_path");
  CREATE INDEX "seiten_blocks_liste_order_idx" ON "seiten_blocks_liste" USING btree ("_order");
  CREATE INDEX "seiten_blocks_liste_parent_id_idx" ON "seiten_blocks_liste" USING btree ("_parent_id");
  CREATE INDEX "seiten_blocks_liste_path_idx" ON "seiten_blocks_liste" USING btree ("_path");
  CREATE INDEX "seiten_blocks_archiv_order_idx" ON "seiten_blocks_archiv" USING btree ("_order");
  CREATE INDEX "seiten_blocks_archiv_parent_id_idx" ON "seiten_blocks_archiv" USING btree ("_parent_id");
  CREATE INDEX "seiten_blocks_archiv_path_idx" ON "seiten_blocks_archiv" USING btree ("_path");
  CREATE UNIQUE INDEX "seiten_slug_idx" ON "seiten" USING btree ("slug");
  CREATE INDEX "seiten_updated_at_idx" ON "seiten" USING btree ("updated_at");
  CREATE INDEX "seiten_created_at_idx" ON "seiten" USING btree ("created_at");
  CREATE INDEX "seiten_rels_order_idx" ON "seiten_rels" USING btree ("order");
  CREATE INDEX "seiten_rels_parent_idx" ON "seiten_rels" USING btree ("parent_id");
  CREATE INDEX "seiten_rels_path_idx" ON "seiten_rels" USING btree ("path");
  CREATE INDEX "seiten_rels_dokumente_id_idx" ON "seiten_rels" USING btree ("dokumente_id");
  CREATE INDEX "seiten_rels_arbeitsgruppen_id_idx" ON "seiten_rels" USING btree ("arbeitsgruppen_id");
  CREATE INDEX "startseite_blocks_buehne_knoepfe_order_idx" ON "startseite_blocks_buehne_knoepfe" USING btree ("_order");
  CREATE INDEX "startseite_blocks_buehne_knoepfe_parent_id_idx" ON "startseite_blocks_buehne_knoepfe" USING btree ("_parent_id");
  CREATE INDEX "startseite_blocks_buehne_order_idx" ON "startseite_blocks_buehne" USING btree ("_order");
  CREATE INDEX "startseite_blocks_buehne_parent_id_idx" ON "startseite_blocks_buehne" USING btree ("_parent_id");
  CREATE INDEX "startseite_blocks_buehne_path_idx" ON "startseite_blocks_buehne" USING btree ("_path");
  CREATE INDEX "startseite_blocks_buehne_bild_idx" ON "startseite_blocks_buehne" USING btree ("bild_id");
  CREATE INDEX "startseite_blocks_text_order_idx" ON "startseite_blocks_text" USING btree ("_order");
  CREATE INDEX "startseite_blocks_text_parent_id_idx" ON "startseite_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "startseite_blocks_text_path_idx" ON "startseite_blocks_text" USING btree ("_path");
  CREATE INDEX "startseite_blocks_bild_text_order_idx" ON "startseite_blocks_bild_text" USING btree ("_order");
  CREATE INDEX "startseite_blocks_bild_text_parent_id_idx" ON "startseite_blocks_bild_text" USING btree ("_parent_id");
  CREATE INDEX "startseite_blocks_bild_text_path_idx" ON "startseite_blocks_bild_text" USING btree ("_path");
  CREATE INDEX "startseite_blocks_bild_text_bild_idx" ON "startseite_blocks_bild_text" USING btree ("bild_id");
  CREATE INDEX "startseite_blocks_karten_karten_order_idx" ON "startseite_blocks_karten_karten" USING btree ("_order");
  CREATE INDEX "startseite_blocks_karten_karten_parent_id_idx" ON "startseite_blocks_karten_karten" USING btree ("_parent_id");
  CREATE INDEX "startseite_blocks_karten_order_idx" ON "startseite_blocks_karten" USING btree ("_order");
  CREATE INDEX "startseite_blocks_karten_parent_id_idx" ON "startseite_blocks_karten" USING btree ("_parent_id");
  CREATE INDEX "startseite_blocks_karten_path_idx" ON "startseite_blocks_karten" USING btree ("_path");
  CREATE INDEX "startseite_blocks_downloads_order_idx" ON "startseite_blocks_downloads" USING btree ("_order");
  CREATE INDEX "startseite_blocks_downloads_parent_id_idx" ON "startseite_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "startseite_blocks_downloads_path_idx" ON "startseite_blocks_downloads" USING btree ("_path");
  CREATE INDEX "startseite_blocks_video_order_idx" ON "startseite_blocks_video" USING btree ("_order");
  CREATE INDEX "startseite_blocks_video_parent_id_idx" ON "startseite_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "startseite_blocks_video_path_idx" ON "startseite_blocks_video" USING btree ("_path");
  CREATE INDEX "startseite_blocks_galerie_order_idx" ON "startseite_blocks_galerie" USING btree ("_order");
  CREATE INDEX "startseite_blocks_galerie_parent_id_idx" ON "startseite_blocks_galerie" USING btree ("_parent_id");
  CREATE INDEX "startseite_blocks_galerie_path_idx" ON "startseite_blocks_galerie" USING btree ("_path");
  CREATE INDEX "startseite_blocks_galerie_galerie_idx" ON "startseite_blocks_galerie" USING btree ("galerie_id");
  CREATE INDEX "startseite_blocks_aktuell_zeigen_order_idx" ON "startseite_blocks_aktuell_zeigen" USING btree ("order");
  CREATE INDEX "startseite_blocks_aktuell_zeigen_parent_idx" ON "startseite_blocks_aktuell_zeigen" USING btree ("parent_id");
  CREATE INDEX "startseite_blocks_aktuell_order_idx" ON "startseite_blocks_aktuell" USING btree ("_order");
  CREATE INDEX "startseite_blocks_aktuell_parent_id_idx" ON "startseite_blocks_aktuell" USING btree ("_parent_id");
  CREATE INDEX "startseite_blocks_aktuell_path_idx" ON "startseite_blocks_aktuell" USING btree ("_path");
  CREATE INDEX "startseite_blocks_liste_order_idx" ON "startseite_blocks_liste" USING btree ("_order");
  CREATE INDEX "startseite_blocks_liste_parent_id_idx" ON "startseite_blocks_liste" USING btree ("_parent_id");
  CREATE INDEX "startseite_blocks_liste_path_idx" ON "startseite_blocks_liste" USING btree ("_path");
  CREATE INDEX "startseite_blocks_archiv_order_idx" ON "startseite_blocks_archiv" USING btree ("_order");
  CREATE INDEX "startseite_blocks_archiv_parent_id_idx" ON "startseite_blocks_archiv" USING btree ("_parent_id");
  CREATE INDEX "startseite_blocks_archiv_path_idx" ON "startseite_blocks_archiv" USING btree ("_path");
  CREATE INDEX "startseite_rels_order_idx" ON "startseite_rels" USING btree ("order");
  CREATE INDEX "startseite_rels_parent_idx" ON "startseite_rels" USING btree ("parent_id");
  CREATE INDEX "startseite_rels_path_idx" ON "startseite_rels" USING btree ("path");
  CREATE INDEX "startseite_rels_dokumente_id_idx" ON "startseite_rels" USING btree ("dokumente_id");
  CREATE INDEX "startseite_rels_arbeitsgruppen_id_idx" ON "startseite_rels" USING btree ("arbeitsgruppen_id");
  CREATE INDEX "elternrat_blocks_buehne_knoepfe_order_idx" ON "elternrat_blocks_buehne_knoepfe" USING btree ("_order");
  CREATE INDEX "elternrat_blocks_buehne_knoepfe_parent_id_idx" ON "elternrat_blocks_buehne_knoepfe" USING btree ("_parent_id");
  CREATE INDEX "elternrat_blocks_buehne_order_idx" ON "elternrat_blocks_buehne" USING btree ("_order");
  CREATE INDEX "elternrat_blocks_buehne_parent_id_idx" ON "elternrat_blocks_buehne" USING btree ("_parent_id");
  CREATE INDEX "elternrat_blocks_buehne_path_idx" ON "elternrat_blocks_buehne" USING btree ("_path");
  CREATE INDEX "elternrat_blocks_buehne_bild_idx" ON "elternrat_blocks_buehne" USING btree ("bild_id");
  CREATE INDEX "elternrat_blocks_text_order_idx" ON "elternrat_blocks_text" USING btree ("_order");
  CREATE INDEX "elternrat_blocks_text_parent_id_idx" ON "elternrat_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "elternrat_blocks_text_path_idx" ON "elternrat_blocks_text" USING btree ("_path");
  CREATE INDEX "elternrat_blocks_bild_text_order_idx" ON "elternrat_blocks_bild_text" USING btree ("_order");
  CREATE INDEX "elternrat_blocks_bild_text_parent_id_idx" ON "elternrat_blocks_bild_text" USING btree ("_parent_id");
  CREATE INDEX "elternrat_blocks_bild_text_path_idx" ON "elternrat_blocks_bild_text" USING btree ("_path");
  CREATE INDEX "elternrat_blocks_bild_text_bild_idx" ON "elternrat_blocks_bild_text" USING btree ("bild_id");
  CREATE INDEX "elternrat_blocks_karten_karten_order_idx" ON "elternrat_blocks_karten_karten" USING btree ("_order");
  CREATE INDEX "elternrat_blocks_karten_karten_parent_id_idx" ON "elternrat_blocks_karten_karten" USING btree ("_parent_id");
  CREATE INDEX "elternrat_blocks_karten_order_idx" ON "elternrat_blocks_karten" USING btree ("_order");
  CREATE INDEX "elternrat_blocks_karten_parent_id_idx" ON "elternrat_blocks_karten" USING btree ("_parent_id");
  CREATE INDEX "elternrat_blocks_karten_path_idx" ON "elternrat_blocks_karten" USING btree ("_path");
  CREATE INDEX "elternrat_blocks_downloads_order_idx" ON "elternrat_blocks_downloads" USING btree ("_order");
  CREATE INDEX "elternrat_blocks_downloads_parent_id_idx" ON "elternrat_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "elternrat_blocks_downloads_path_idx" ON "elternrat_blocks_downloads" USING btree ("_path");
  CREATE INDEX "elternrat_blocks_video_order_idx" ON "elternrat_blocks_video" USING btree ("_order");
  CREATE INDEX "elternrat_blocks_video_parent_id_idx" ON "elternrat_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "elternrat_blocks_video_path_idx" ON "elternrat_blocks_video" USING btree ("_path");
  CREATE INDEX "elternrat_blocks_galerie_order_idx" ON "elternrat_blocks_galerie" USING btree ("_order");
  CREATE INDEX "elternrat_blocks_galerie_parent_id_idx" ON "elternrat_blocks_galerie" USING btree ("_parent_id");
  CREATE INDEX "elternrat_blocks_galerie_path_idx" ON "elternrat_blocks_galerie" USING btree ("_path");
  CREATE INDEX "elternrat_blocks_galerie_galerie_idx" ON "elternrat_blocks_galerie" USING btree ("galerie_id");
  CREATE INDEX "elternrat_blocks_aktuell_zeigen_order_idx" ON "elternrat_blocks_aktuell_zeigen" USING btree ("order");
  CREATE INDEX "elternrat_blocks_aktuell_zeigen_parent_idx" ON "elternrat_blocks_aktuell_zeigen" USING btree ("parent_id");
  CREATE INDEX "elternrat_blocks_aktuell_order_idx" ON "elternrat_blocks_aktuell" USING btree ("_order");
  CREATE INDEX "elternrat_blocks_aktuell_parent_id_idx" ON "elternrat_blocks_aktuell" USING btree ("_parent_id");
  CREATE INDEX "elternrat_blocks_aktuell_path_idx" ON "elternrat_blocks_aktuell" USING btree ("_path");
  CREATE INDEX "elternrat_blocks_liste_order_idx" ON "elternrat_blocks_liste" USING btree ("_order");
  CREATE INDEX "elternrat_blocks_liste_parent_id_idx" ON "elternrat_blocks_liste" USING btree ("_parent_id");
  CREATE INDEX "elternrat_blocks_liste_path_idx" ON "elternrat_blocks_liste" USING btree ("_path");
  CREATE INDEX "elternrat_blocks_archiv_order_idx" ON "elternrat_blocks_archiv" USING btree ("_order");
  CREATE INDEX "elternrat_blocks_archiv_parent_id_idx" ON "elternrat_blocks_archiv" USING btree ("_parent_id");
  CREATE INDEX "elternrat_blocks_archiv_path_idx" ON "elternrat_blocks_archiv" USING btree ("_path");
  CREATE INDEX "texte_blocks_buehne_knoepfe_order_idx" ON "texte_blocks_buehne_knoepfe" USING btree ("_order");
  CREATE INDEX "texte_blocks_buehne_knoepfe_parent_id_idx" ON "texte_blocks_buehne_knoepfe" USING btree ("_parent_id");
  CREATE INDEX "texte_blocks_buehne_order_idx" ON "texte_blocks_buehne" USING btree ("_order");
  CREATE INDEX "texte_blocks_buehne_parent_id_idx" ON "texte_blocks_buehne" USING btree ("_parent_id");
  CREATE INDEX "texte_blocks_buehne_path_idx" ON "texte_blocks_buehne" USING btree ("_path");
  CREATE INDEX "texte_blocks_buehne_bild_idx" ON "texte_blocks_buehne" USING btree ("bild_id");
  CREATE INDEX "texte_blocks_text_order_idx" ON "texte_blocks_text" USING btree ("_order");
  CREATE INDEX "texte_blocks_text_parent_id_idx" ON "texte_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "texte_blocks_text_path_idx" ON "texte_blocks_text" USING btree ("_path");
  CREATE INDEX "texte_blocks_bild_text_order_idx" ON "texte_blocks_bild_text" USING btree ("_order");
  CREATE INDEX "texte_blocks_bild_text_parent_id_idx" ON "texte_blocks_bild_text" USING btree ("_parent_id");
  CREATE INDEX "texte_blocks_bild_text_path_idx" ON "texte_blocks_bild_text" USING btree ("_path");
  CREATE INDEX "texte_blocks_bild_text_bild_idx" ON "texte_blocks_bild_text" USING btree ("bild_id");
  CREATE INDEX "texte_blocks_karten_karten_order_idx" ON "texte_blocks_karten_karten" USING btree ("_order");
  CREATE INDEX "texte_blocks_karten_karten_parent_id_idx" ON "texte_blocks_karten_karten" USING btree ("_parent_id");
  CREATE INDEX "texte_blocks_karten_order_idx" ON "texte_blocks_karten" USING btree ("_order");
  CREATE INDEX "texte_blocks_karten_parent_id_idx" ON "texte_blocks_karten" USING btree ("_parent_id");
  CREATE INDEX "texte_blocks_karten_path_idx" ON "texte_blocks_karten" USING btree ("_path");
  CREATE INDEX "texte_blocks_downloads_order_idx" ON "texte_blocks_downloads" USING btree ("_order");
  CREATE INDEX "texte_blocks_downloads_parent_id_idx" ON "texte_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "texte_blocks_downloads_path_idx" ON "texte_blocks_downloads" USING btree ("_path");
  CREATE INDEX "texte_blocks_video_order_idx" ON "texte_blocks_video" USING btree ("_order");
  CREATE INDEX "texte_blocks_video_parent_id_idx" ON "texte_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "texte_blocks_video_path_idx" ON "texte_blocks_video" USING btree ("_path");
  CREATE INDEX "texte_blocks_galerie_order_idx" ON "texte_blocks_galerie" USING btree ("_order");
  CREATE INDEX "texte_blocks_galerie_parent_id_idx" ON "texte_blocks_galerie" USING btree ("_parent_id");
  CREATE INDEX "texte_blocks_galerie_path_idx" ON "texte_blocks_galerie" USING btree ("_path");
  CREATE INDEX "texte_blocks_galerie_galerie_idx" ON "texte_blocks_galerie" USING btree ("galerie_id");
  CREATE INDEX "texte_blocks_aktuell_zeigen_order_idx" ON "texte_blocks_aktuell_zeigen" USING btree ("order");
  CREATE INDEX "texte_blocks_aktuell_zeigen_parent_idx" ON "texte_blocks_aktuell_zeigen" USING btree ("parent_id");
  CREATE INDEX "texte_blocks_aktuell_order_idx" ON "texte_blocks_aktuell" USING btree ("_order");
  CREATE INDEX "texte_blocks_aktuell_parent_id_idx" ON "texte_blocks_aktuell" USING btree ("_parent_id");
  CREATE INDEX "texte_blocks_aktuell_path_idx" ON "texte_blocks_aktuell" USING btree ("_path");
  CREATE INDEX "texte_blocks_liste_order_idx" ON "texte_blocks_liste" USING btree ("_order");
  CREATE INDEX "texte_blocks_liste_parent_id_idx" ON "texte_blocks_liste" USING btree ("_parent_id");
  CREATE INDEX "texte_blocks_liste_path_idx" ON "texte_blocks_liste" USING btree ("_path");
  CREATE INDEX "texte_blocks_archiv_order_idx" ON "texte_blocks_archiv" USING btree ("_order");
  CREATE INDEX "texte_blocks_archiv_parent_id_idx" ON "texte_blocks_archiv" USING btree ("_parent_id");
  CREATE INDEX "texte_blocks_archiv_path_idx" ON "texte_blocks_archiv" USING btree ("_path");
  CREATE INDEX "texte_rels_order_idx" ON "texte_rels" USING btree ("order");
  CREATE INDEX "texte_rels_parent_idx" ON "texte_rels" USING btree ("parent_id");
  CREATE INDEX "texte_rels_path_idx" ON "texte_rels" USING btree ("path");
  CREATE INDEX "texte_rels_dokumente_id_idx" ON "texte_rels" USING btree ("dokumente_id");
  CREATE INDEX "texte_rels_arbeitsgruppen_id_idx" ON "texte_rels" USING btree ("arbeitsgruppen_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_seiten_fk" FOREIGN KEY ("seiten_id") REFERENCES "public"."seiten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elternrat_rels" ADD CONSTRAINT "elternrat_rels_arbeitsgruppen_fk" FOREIGN KEY ("arbeitsgruppen_id") REFERENCES "public"."arbeitsgruppen"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_seiten_id_idx" ON "payload_locked_documents_rels" USING btree ("seiten_id");
  CREATE INDEX "elternrat_rels_arbeitsgruppen_id_idx" ON "elternrat_rels" USING btree ("arbeitsgruppen_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "seiten_blocks_buehne_knoepfe" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_blocks_buehne" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_blocks_bild_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_blocks_karten_karten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_blocks_karten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_blocks_downloads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_blocks_galerie" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_blocks_aktuell_zeigen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_blocks_aktuell" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_blocks_liste" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_blocks_archiv" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seiten_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_blocks_buehne_knoepfe" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_blocks_buehne" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_blocks_bild_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_blocks_karten_karten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_blocks_karten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_blocks_downloads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_blocks_galerie" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_blocks_aktuell_zeigen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_blocks_aktuell" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_blocks_liste" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_blocks_archiv" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "startseite_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elternrat_blocks_buehne_knoepfe" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elternrat_blocks_buehne" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elternrat_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elternrat_blocks_bild_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elternrat_blocks_karten_karten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elternrat_blocks_karten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elternrat_blocks_downloads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elternrat_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elternrat_blocks_galerie" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elternrat_blocks_aktuell_zeigen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elternrat_blocks_aktuell" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elternrat_blocks_liste" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "elternrat_blocks_archiv" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_blocks_buehne_knoepfe" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_blocks_buehne" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_blocks_bild_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_blocks_karten_karten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_blocks_karten" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_blocks_downloads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_blocks_galerie" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_blocks_aktuell_zeigen" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_blocks_aktuell" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_blocks_liste" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_blocks_archiv" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "texte_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "seiten_blocks_buehne_knoepfe" CASCADE;
  DROP TABLE "seiten_blocks_buehne" CASCADE;
  DROP TABLE "seiten_blocks_text" CASCADE;
  DROP TABLE "seiten_blocks_bild_text" CASCADE;
  DROP TABLE "seiten_blocks_karten_karten" CASCADE;
  DROP TABLE "seiten_blocks_karten" CASCADE;
  DROP TABLE "seiten_blocks_downloads" CASCADE;
  DROP TABLE "seiten_blocks_video" CASCADE;
  DROP TABLE "seiten_blocks_galerie" CASCADE;
  DROP TABLE "seiten_blocks_aktuell_zeigen" CASCADE;
  DROP TABLE "seiten_blocks_aktuell" CASCADE;
  DROP TABLE "seiten_blocks_liste" CASCADE;
  DROP TABLE "seiten_blocks_archiv" CASCADE;
  DROP TABLE "seiten" CASCADE;
  DROP TABLE "seiten_rels" CASCADE;
  DROP TABLE "startseite_blocks_buehne_knoepfe" CASCADE;
  DROP TABLE "startseite_blocks_buehne" CASCADE;
  DROP TABLE "startseite_blocks_text" CASCADE;
  DROP TABLE "startseite_blocks_bild_text" CASCADE;
  DROP TABLE "startseite_blocks_karten_karten" CASCADE;
  DROP TABLE "startseite_blocks_karten" CASCADE;
  DROP TABLE "startseite_blocks_downloads" CASCADE;
  DROP TABLE "startseite_blocks_video" CASCADE;
  DROP TABLE "startseite_blocks_galerie" CASCADE;
  DROP TABLE "startseite_blocks_aktuell_zeigen" CASCADE;
  DROP TABLE "startseite_blocks_aktuell" CASCADE;
  DROP TABLE "startseite_blocks_liste" CASCADE;
  DROP TABLE "startseite_blocks_archiv" CASCADE;
  DROP TABLE "startseite_rels" CASCADE;
  DROP TABLE "elternrat_blocks_buehne_knoepfe" CASCADE;
  DROP TABLE "elternrat_blocks_buehne" CASCADE;
  DROP TABLE "elternrat_blocks_text" CASCADE;
  DROP TABLE "elternrat_blocks_bild_text" CASCADE;
  DROP TABLE "elternrat_blocks_karten_karten" CASCADE;
  DROP TABLE "elternrat_blocks_karten" CASCADE;
  DROP TABLE "elternrat_blocks_downloads" CASCADE;
  DROP TABLE "elternrat_blocks_video" CASCADE;
  DROP TABLE "elternrat_blocks_galerie" CASCADE;
  DROP TABLE "elternrat_blocks_aktuell_zeigen" CASCADE;
  DROP TABLE "elternrat_blocks_aktuell" CASCADE;
  DROP TABLE "elternrat_blocks_liste" CASCADE;
  DROP TABLE "elternrat_blocks_archiv" CASCADE;
  DROP TABLE "texte_blocks_buehne_knoepfe" CASCADE;
  DROP TABLE "texte_blocks_buehne" CASCADE;
  DROP TABLE "texte_blocks_text" CASCADE;
  DROP TABLE "texte_blocks_bild_text" CASCADE;
  DROP TABLE "texte_blocks_karten_karten" CASCADE;
  DROP TABLE "texte_blocks_karten" CASCADE;
  DROP TABLE "texte_blocks_downloads" CASCADE;
  DROP TABLE "texte_blocks_video" CASCADE;
  DROP TABLE "texte_blocks_galerie" CASCADE;
  DROP TABLE "texte_blocks_aktuell_zeigen" CASCADE;
  DROP TABLE "texte_blocks_aktuell" CASCADE;
  DROP TABLE "texte_blocks_liste" CASCADE;
  DROP TABLE "texte_blocks_archiv" CASCADE;
  DROP TABLE "texte_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_seiten_fk";
  
  ALTER TABLE "elternrat_rels" DROP CONSTRAINT "elternrat_rels_arbeitsgruppen_fk";
  
  DROP INDEX "payload_locked_documents_rels_seiten_id_idx";
  DROP INDEX "elternrat_rels_arbeitsgruppen_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "seiten_id";
  ALTER TABLE "elternrat_rels" DROP COLUMN "arbeitsgruppen_id";
  DROP TYPE "public"."enum_seiten_blocks_buehne_knoepfe_stil";
  DROP TYPE "public"."enum_seiten_blocks_text_breite";
  DROP TYPE "public"."enum_seiten_blocks_bild_text_bild_position";
  DROP TYPE "public"."enum_seiten_blocks_karten_spalten";
  DROP TYPE "public"."enum_seiten_blocks_aktuell_zeigen";
  DROP TYPE "public"."enum_seiten_blocks_liste_quelle";
  DROP TYPE "public"."enum_seiten_blocks_liste_darstellung";
  DROP TYPE "public"."enum_startseite_blocks_buehne_knoepfe_stil";
  DROP TYPE "public"."enum_startseite_blocks_text_breite";
  DROP TYPE "public"."enum_startseite_blocks_bild_text_bild_position";
  DROP TYPE "public"."enum_startseite_blocks_karten_spalten";
  DROP TYPE "public"."enum_startseite_blocks_aktuell_zeigen";
  DROP TYPE "public"."enum_startseite_blocks_liste_quelle";
  DROP TYPE "public"."enum_startseite_blocks_liste_darstellung";
  DROP TYPE "public"."enum_elternrat_blocks_buehne_knoepfe_stil";
  DROP TYPE "public"."enum_elternrat_blocks_text_breite";
  DROP TYPE "public"."enum_elternrat_blocks_bild_text_bild_position";
  DROP TYPE "public"."enum_elternrat_blocks_karten_spalten";
  DROP TYPE "public"."enum_elternrat_blocks_aktuell_zeigen";
  DROP TYPE "public"."enum_elternrat_blocks_liste_quelle";
  DROP TYPE "public"."enum_elternrat_blocks_liste_darstellung";
  DROP TYPE "public"."enum_texte_blocks_buehne_knoepfe_stil";
  DROP TYPE "public"."enum_texte_blocks_text_breite";
  DROP TYPE "public"."enum_texte_blocks_bild_text_bild_position";
  DROP TYPE "public"."enum_texte_blocks_karten_spalten";
  DROP TYPE "public"."enum_texte_blocks_aktuell_zeigen";
  DROP TYPE "public"."enum_texte_blocks_liste_quelle";
  DROP TYPE "public"."enum_texte_blocks_liste_darstellung";`)
}
