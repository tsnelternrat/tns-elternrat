#!/usr/bin/env bash
# Build für Vercel und lokal. Nur bei einem Production-Deployment werden vorher die
# Datenbank-Migrationen ausgeführt; Preview-Builds und lokale Builds lassen die Datenbank in Ruhe.
# Schlägt die Migration fehl, bricht der Build ab und die bisherige Version bleibt online.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ "${VERCEL_ENV:-}" = "production" ]; then
  pnpm migrate --prod
fi

NODE_OPTIONS="--no-deprecation --max-old-space-size=8000" exec next build
