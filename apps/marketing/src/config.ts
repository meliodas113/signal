import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, "..");

loadEnv({ path: resolve(ROOT, ".env") });

export const config = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  model: process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8",

  x: {
    apiKey: process.env.X_API_KEY ?? "",
    apiSecret: process.env.X_API_SECRET ?? "",
    accessToken: process.env.X_ACCESS_TOKEN ?? "",
    accessSecret: process.env.X_ACCESS_SECRET ?? "",
  },

  monthlyCap: Number(process.env.MONTHLY_POST_CAP ?? 450),
  minMinutesBetweenPosts: Number(process.env.MIN_MINUTES_BETWEEN_POSTS ?? 110),
  handle: (process.env.X_HANDLE ?? "").replace(/^@/, ""),
  siteUrl: process.env.SITE_URL ?? "https://getsignal.co.in",

  outputDir: resolve(ROOT, "output"),
  stateFile: resolve(ROOT, "output", "state.json"),
};

export function hasClaude() {
  return config.anthropicApiKey.length > 10;
}

export function hasTwitter() {
  const { apiKey, apiSecret, accessToken, accessSecret } = config.x;
  return [apiKey, apiSecret, accessToken, accessSecret].every((v) => v.length > 5);
}

/** Brand tokens — single source mirrored from packages/theme/signal.css. */
export const brand = {
  bg: "#0a0d0e",
  surface: "#11171a",
  surface2: "#151c20",
  line: "#222d31",
  text: "#e9f0ea",
  dim: "#8a9a93",
  faint: "#586863",
  signal: "#c2f53f",
  signalDim: "#7e9a2e",
  amber: "#ffb547",
  danger: "#ff5c52",
  display: "Archivo",
  mono: "JetBrains Mono",
};
