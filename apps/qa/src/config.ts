import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, "..");
export const REPO_ROOT = resolve(ROOT, "..", "..");

loadEnv({ path: resolve(ROOT, ".env") });

// The "Signal" Linear team (workspace default).
const SIGNAL_TEAM_ID = "e77412b1-efeb-4abd-bf28-d573f5bd2031";

export const config = {
  // Linear.
  linearApiKey: process.env.LINEAR_API_KEY ?? "",
  linearTeamId: process.env.LINEAR_TEAM_ID ?? SIGNAL_TEAM_ID,

  // Target. Empty => start the local apps/landing dev server and test it.
  targetUrl: (process.env.QA_TARGET_URL ?? "").trim().replace(/\/+$/, ""),

  // The signup-flow check uses a clearly-fake address so it never pollutes a list.
  testEmail: process.env.QA_TEST_EMAIL ?? "qa-bot@example.com",

  // Don't refile the same bug more often than this (hours).
  refileCooldownHours: Number(process.env.QA_REFILE_COOLDOWN_HOURS ?? 168), // 7 days

  // Foreground-loop cadence (launchd uses its own interval).
  loopIntervalHours: Number(process.env.QA_LOOP_INTERVAL_HOURS ?? 6),

  outputDir: resolve(ROOT, "output"),
  stateFile: resolve(ROOT, "output", "state.json"),
  shotsDir: resolve(ROOT, "output", "shots"),
};

export function hasLinear() {
  return config.linearApiKey.length > 10;
}

/** When no explicit target is set, the agent boots the local landing dev server. */
export function shouldStartServer() {
  return config.targetUrl === "";
}
