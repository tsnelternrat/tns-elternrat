#!/usr/bin/env bash
# Vercel-CLI mit dem Konto des Elternrats (Team «TSN Elternrat»), unabhängig vom globalen Login.
# Der Token liegt in .env.vercel.local (nicht im Git):
#
#   VERCEL_TOKEN=…   # erstellt unter https://vercel.com/account/settings/tokens, Scope «TSN Elternrat»
#
#   pnpm vc deploy --prod
#   pnpm vc env pull .env.prod.local --environment=production
set -euo pipefail
cd "$(dirname "$0")/.."

DATEI=.env.vercel.local
TOKEN="$(grep -E '^VERCEL_TOKEN=' "$DATEI" 2>/dev/null | cut -d= -f2- | tr -d '"' || true)"
if [ -z "$TOKEN" ]; then
  echo "Kein Token: VERCEL_TOKEN=… in $DATEI eintragen (siehe Kopf von scripts/vercel.sh)." >&2
  exit 1
fi

VERCEL_TOKEN="$TOKEN" exec vercel --scope tsn-elternrat "$@"
