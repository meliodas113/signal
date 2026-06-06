import { runCycle } from "./index.js";

/**
 * Alternative to launchd: a long-running foreground loop that posts every
 * INTERVAL hours. Handy for testing or if you'd rather `npm run loop` in a
 * terminal than install the scheduler. The launchd job (the default) survives
 * reboots and logout; this does not.
 */
const HOURS = Number(process.env.LOOP_INTERVAL_HOURS ?? 2);
const MS = HOURS * 60 * 60 * 1000;

async function tick() {
  try {
    await runCycle({ dryRun: false, force: false, open: false });
  } catch (err) {
    console.error("tick error:", err);
  }
}

console.log(`SIGNAL marketing loop started — every ${HOURS}h. Ctrl-C to stop.`);
await tick();
setInterval(tick, MS);
