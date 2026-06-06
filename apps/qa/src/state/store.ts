import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname } from "node:path";
import { config } from "../config.js";
import type { Bug, RunRecord, State } from "../types.js";

const EMPTY: State = { filed: {}, runs: [] };

/** Stable id for a bug across runs — drives dedupe. */
export function fingerprint(bug: Bug): string {
  return createHash("sha1").update(`${bug.check}|${bug.key}`).digest("hex").slice(0, 12);
}

export async function loadState(): Promise<State> {
  try {
    const parsed = JSON.parse(await readFile(config.stateFile, "utf8")) as State;
    return { filed: parsed.filed ?? {}, runs: parsed.runs ?? [] };
  } catch {
    return structuredClone(EMPTY);
  }
}

export async function saveState(state: State): Promise<void> {
  await mkdir(dirname(config.stateFile), { recursive: true });
  state.runs = state.runs.slice(-200);
  await writeFile(config.stateFile, JSON.stringify(state, null, 2), "utf8");
}

/** True if this bug was already filed within the cooldown window. */
export function recentlyFiled(state: State, fp: string, now = Date.now()): boolean {
  const rec = state.filed[fp];
  if (!rec) return false;
  const ageHours = (now - new Date(rec.ts).getTime()) / 3.6e6;
  return ageHours < config.refileCooldownHours;
}

export function recordRun(state: State, run: RunRecord): void {
  state.runs.push(run);
}
