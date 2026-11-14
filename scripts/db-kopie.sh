#!/usr/bin/env bash
# Kopiert die produktive Datenbank in die lokale Docker-Datenbank (docker-compose.yml).
# Von Prod wird nur gelesen (pg_dump). Die lokale Datenbank wird dabei überschrieben.
#
#   vercel env pull .env.prod.local --environment=production   # einmalig
#   pnpm db:kopie
set -euo pipefail
cd "$(dirname "$0")/.."

QUELLE="${PROD_DATABASE_URL:-$(grep -E '^DATABASE_URL_UNPOOLED=' .env.prod.local 2>/dev/null | cut -d= -f2- | tr -d '"' || true)}"
if [ -z "$QUELLE" ]; then
  echo "Keine Quelle: PROD_DATABASE_URL setzen oder .env.prod.local mit vercel env pull anlegen." >&2
  exit 1
fi

docker compose up -d --wait db >/dev/null 2>&1
echo "Lokale Datenbank leeren …"
docker compose exec -T db psql -q -U payload -d elternrat -c 'DROP SCHEMA IF EXISTS public CASCADE;'
echo "Prod-Daten kopieren …"
docker compose exec -T db pg_dump --no-owner --no-privileges --schema=public "$QUELLE" \
  | docker compose exec -T db psql -q -U payload -d elternrat -v ON_ERROR_STOP=1 >/dev/null
echo "Fertig."
