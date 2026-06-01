#!/usr/bin/env bash
# =============================================================================
# refresh-research.sh — pull live SBIR.gov data to validate SIGNAL's data
# contract and sanity-check the knowledge base in ../research/04-data-integration.md.
#
# Public APIs, no key required. SBIR.gov caps rows at 50/request and periodically
# shows "undergoing maintenance" — treat failures as expected and retry later.
#
# Usage:
#   ./refresh-research.sh                # open solicitations, all agencies
#   ./refresh-research.sh NSF            # open solicitations for one agency
#   ./refresh-research.sh DOD autonomy   # open + keyword filter
# =============================================================================
set -euo pipefail

BASE="https://api.www.sbir.gov/public/api"
AGENCY="${1:-}"
KEYWORD="${2:-}"
ROWS=50

q="open=1&rows=${ROWS}&format=json"
[ -n "$AGENCY" ] && q="${q}&agency=${AGENCY}"
[ -n "$KEYWORD" ] && q="${q}&keyword=${KEYWORD}"

url="${BASE}/solicitations?${q}"
echo "→ GET ${url}" >&2

# A User-Agent is REQUIRED (the API returns 403 without one) and the endpoint is
# aggressively rate-limited (429). Verified 2026-06.
UA="Mozilla/5.0 (SIGNAL-research; +https://github.com/your-org/signal)"
resp="$(curl -fsS --max-time 30 -A "$UA" "$url" || {
  echo "SBIR.gov API request failed. Common causes: 403 (missing User-Agent)," >&2
  echo "429 (rate limited — wait and retry), or 'undergoing maintenance'." >&2
  exit 1
})"

if command -v jq >/dev/null 2>&1; then
  echo "$resp" | jq -r '
    "Open solicitations returned: \(length)\n",
    (.[] | "• [\(.agency)/\(.branch)] \(.solicitation_title) (\(.solicitation_number))"
         + "  program=\(.program) phase=\(.phase) close=\(.close_date)"
         + "  topics=\((.solicitation_topics // []) | length)")'
else
  echo "$resp"
  echo "(install jq for a readable summary)" >&2
fi

cat >&2 <<'NOTE'

Reminder: if field names or behavior here differ from
../research/04-data-integration.md, update that doc and bump its "Last refreshed"
line. The Awards API (../awards) powers the future competitive-intel feature (P5).
NOTE
