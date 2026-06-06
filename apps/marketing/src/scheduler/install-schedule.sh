#!/usr/bin/env bash
# Install / uninstall / check the launchd job that posts every 2 hours.
# Usage: bash install-schedule.sh {install|uninstall|status}
set -euo pipefail

LABEL="co.getsignal.marketing"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"
RUNNER="$APP_DIR/src/scheduler/run-once.sh"
INTERVAL=7200 # 2 hours
DOMAIN="gui/$(id -u)"

cmd="${1:-status}"

case "$cmd" in
  install)
    chmod +x "$RUNNER"
    mkdir -p "$HOME/Library/LaunchAgents" "$APP_DIR/output"
    cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>${RUNNER}</string>
  </array>
  <key>StartInterval</key><integer>${INTERVAL}</integer>
  <key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>${APP_DIR}/output/launchd.out.log</string>
  <key>StandardErrorPath</key><string>${APP_DIR}/output/launchd.err.log</string>
  <key>WorkingDirectory</key><string>${APP_DIR}</string>
</dict>
</plist>
PLIST
    launchctl bootout "$DOMAIN" "$PLIST" 2>/dev/null || true
    launchctl bootstrap "$DOMAIN" "$PLIST"
    launchctl enable "${DOMAIN}/${LABEL}"
    echo "✅ installed & loaded: ${LABEL} (every $((INTERVAL/3600))h)"
    echo "   plist : $PLIST"
    echo "   logs  : $APP_DIR/output/launchd.{out,err}.log"
    echo "   note  : posts only while your Mac is awake & online."
    ;;
  uninstall)
    launchctl bootout "$DOMAIN" "$PLIST" 2>/dev/null || true
    rm -f "$PLIST"
    echo "🗑  uninstalled: ${LABEL}"
    ;;
  status)
    if launchctl print "${DOMAIN}/${LABEL}" >/dev/null 2>&1; then
      echo "● ${LABEL} is loaded."
      launchctl print "${DOMAIN}/${LABEL}" | grep -E "state =|run interval|last exit" || true
    else
      echo "○ ${LABEL} is not loaded. Run: npm run schedule:install"
    fi
    ;;
  *)
    echo "Usage: $0 {install|uninstall|status}"; exit 1;;
esac
