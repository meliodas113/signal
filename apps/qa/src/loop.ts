import { runQa } from "./index.js";
import { config } from "./config.js";

/**
 * Alternative to launchd: a long-running foreground loop that runs a QA pass
 * every QA_LOOP_INTERVAL_HOURS. Handy for testing; the launchd job (the default)
 * survives reboots and logout, this does not.
 */
const MS = config.loopIntervalHours * 60 * 60 * 1000;

async function tick() {
  try {
    await runQa({ dryRun: false });
  } catch (e) {
    console.error("tick error:", e);
  }
}

console.log(`SIGNAL QA loop started — every ${config.loopIntervalHours}h. Ctrl-C to stop.`);
await tick();
setInterval(tick, MS);
