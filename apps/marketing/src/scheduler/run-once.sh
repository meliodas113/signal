#!/usr/bin/env bash
# Wrapper launchd calls every 2h. Resolves node (incl. nvm) then runs one cycle.
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$APP_DIR"

# launchd gives a bare environment — make node/npm reachable.
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  # shellcheck disable=SC1091
  . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 || true
  nvm use --silent >/dev/null 2>&1 || true
fi

echo "=== $(date '+%Y-%m-%d %H:%M:%S') run-once ==="
npm run post
