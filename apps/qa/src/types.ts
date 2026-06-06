export type Severity = "blocker" | "high" | "medium" | "low";

export interface Bug {
  /** Suite that found it: "load" | "nav" | "email" | "responsive". */
  check: string;
  /** Stable identity within the suite — used for dedupe across runs. */
  key: string;
  /** Linear issue title (prefixed with [QA] when filed). */
  title: string;
  severity: Severity;
  /** Markdown body describing the failure. */
  detail: string;
  /** Where it was observed. */
  url: string;
  /** e.g. "mobile 390×844" — only for responsive bugs. */
  viewport?: string;
  /** Local PNG path captured at failure time, uploaded to Linear. */
  screenshotPath?: string;
}

export interface FiledRecord {
  ts: string;
  fingerprint: string;
  issueIdentifier?: string;
  issueUrl?: string;
  count: number;
}

export interface RunRecord {
  ts: string;
  targetUrl: string;
  bugCount: number;
  filed: number;
  dryRun: boolean;
}

export interface State {
  /** fingerprint -> last filing. */
  filed: Record<string, FiledRecord>;
  runs: RunRecord[];
}
