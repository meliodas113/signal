import { config, hasLinear, shouldStartServer } from "./config.js";
import { startLandingDevServer, type DevServer } from "./devServer.js";
import { launchBrowser } from "./browser.js";
import { checkLoadAndConsole } from "./checks/loadAndConsole.js";
import { checkNavAndLinks } from "./checks/navAndLinks.js";
import { checkEmailCapture } from "./checks/emailCapture.js";
import { checkResponsive } from "./checks/responsive.js";
import { createBugIssue } from "./report/linear.js";
import { fingerprint, loadState, recentlyFiled, recordRun, saveState } from "./state/store.js";
import type { Bug } from "./types.js";

const SEV_ORDER = { blocker: 0, high: 1, medium: 2, low: 3 } as const;

const SUITES = [
  ["load + console", checkLoadAndConsole],
  ["nav + links", checkNavAndLinks],
  ["email capture", checkEmailCapture],
  ["responsive", checkResponsive],
] as const;

/**
 * One full QA pass:
 *   (boot landing dev server) → run all checks in a real browser →
 *   dedupe → file bugs to Linear with screenshots.
 *
 * Flags:
 *   --dry-run   run the checks, save screenshots locally, but do NOT file to Linear.
 */
export async function runQa(opts: { dryRun: boolean }) {
  const log = (m: string) => console.log(`• ${m}`);
  const state = await loadState();

  let server: DevServer | undefined;
  let baseUrl = config.targetUrl;
  if (shouldStartServer()) {
    log("starting apps/landing dev server…");
    server = await startLandingDevServer();
    baseUrl = server.url;
  }
  log(`target → ${baseUrl}`);

  const browser = await launchBrowser();
  const bugs: Bug[] = [];
  try {
    for (const [name, fn] of SUITES) {
      log(`running: ${name}…`);
      try {
        bugs.push(...(await fn(browser, baseUrl)));
      } catch (e) {
        console.error(`   ✖ check "${name}" crashed:`, e instanceof Error ? e.message : e);
      }
    }
  } finally {
    await browser.close();
    if (server) await server.stop();
  }

  bugs.sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]);

  console.log(`\n${bugs.length === 0 ? "✅ no issues found" : `⚠  ${bugs.length} issue(s) found`}`);
  for (const b of bugs) console.log(`   [${b.severity}] ${b.title} — ${b.url}`);

  let filed = 0;
  if (bugs.length) {
    if (opts.dryRun) {
      console.log("\n(dry-run — not filing to Linear; screenshots are in output/shots)");
    } else if (!hasLinear()) {
      console.log("\n⚠  no LINEAR_API_KEY — found issues but cannot file. Add it to .env.");
    }
    const canFile = !opts.dryRun && hasLinear();

    for (const bug of bugs) {
      const fp = fingerprint(bug);
      if (recentlyFiled(state, fp)) {
        console.log(`   ↪ skip (filed recently): ${bug.title}`);
        continue;
      }
      if (!canFile) continue;
      try {
        const issue = await createBugIssue(bug);
        state.filed[fp] = {
          ts: new Date().toISOString(),
          fingerprint: fp,
          issueIdentifier: issue.identifier,
          issueUrl: issue.url,
          count: (state.filed[fp]?.count ?? 0) + 1,
        };
        filed++;
        console.log(`   ✅ filed ${issue.identifier}: ${issue.url}`);
      } catch (e) {
        console.error(`   ✖ failed to file "${bug.title}":`, e instanceof Error ? e.message : e);
      }
    }
  }

  recordRun(state, {
    ts: new Date().toISOString(),
    targetUrl: baseUrl,
    bugCount: bugs.length,
    filed,
    dryRun: opts.dryRun,
  });
  await saveState(state);
}

function parseArgs(argv: string[]) {
  return { dryRun: argv.includes("--dry-run") };
}

import { fileURLToPath } from "node:url";
import { argv } from "node:process";

if (fileURLToPath(import.meta.url) === argv[1]) {
  runQa(parseArgs(argv.slice(2))).catch((err) => {
    console.error("✖ qa run failed:", err);
    process.exit(1);
  });
}
