import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { config } from "../config.js";
import type { PostRecord, State } from "../types.js";

const EMPTY: State = { history: [], monthly: {} };

export async function loadState(): Promise<State> {
  try {
    const raw = await readFile(config.stateFile, "utf8");
    const parsed = JSON.parse(raw) as State;
    return { history: parsed.history ?? [], monthly: parsed.monthly ?? {} };
  } catch {
    return structuredClone(EMPTY);
  }
}

export async function saveState(state: State): Promise<void> {
  await mkdir(dirname(config.stateFile), { recursive: true });
  // keep history bounded so the file stays small
  state.history = state.history.slice(-500);
  await writeFile(config.stateFile, JSON.stringify(state, null, 2), "utf8");
}

export function monthKey(d = new Date()): string {
  return d.toISOString().slice(0, 7); // YYYY-MM
}

export function recordPost(state: State, rec: PostRecord): void {
  state.history.push(rec);
  if (!rec.dry_run) {
    const k = monthKey(new Date(rec.ts));
    state.monthly[k] = (state.monthly[k] ?? 0) + 1;
  }
}

/** Reasons we might refuse to post this cycle. Returns null if clear to go. */
export function gateReason(state: State, now = new Date()): string | null {
  const used = state.monthly[monthKey(now)] ?? 0;
  if (used >= config.monthlyCap) {
    return `monthly cap reached (${used}/${config.monthlyCap}) — protecting the free-tier write limit`;
  }
  const lastReal = [...state.history].reverse().find((h) => !h.dry_run && h.tweet_id);
  if (lastReal) {
    const mins = (now.getTime() - new Date(lastReal.ts).getTime()) / 60000;
    if (mins < config.minMinutesBetweenPosts) {
      return `last post was ${Math.round(mins)}m ago (< ${config.minMinutesBetweenPosts}m guard)`;
    }
  }
  return null;
}
