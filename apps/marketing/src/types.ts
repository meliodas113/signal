export type Pillar = "pain" | "sector" | "why-signal" | "build-log";

export type TemplateId =
  | "painpoint" // big headline pain, radar framing
  | "stat" // a number that lands
  | "comparison" // old way vs SIGNAL way
  | "quote" // a sharp one-liner / principle
  | "tip"; // actionable founder tip

/** The deterministic brief the Strategist hands to the Copywriter. */
export interface Brief {
  pillar: Pillar;
  angle: string; // the specific thing this post is about
  product_facts: string[]; // grounded facts the copy may use
  sector_context?: string; // optional fresh news snippet
  avoid: string[]; // recent posts to not repeat
  guidance: string; // voice + structural guidance for this pillar
}

/** Structured output from the Copywriter/Editor Claude call. */
export interface DraftResult {
  tweet: string; // final tweet text (<= 280 chars, no image alt)
  alt_text: string; // accessibility alt text for the image
  image: ImageSpec;
  rationale: string; // why this angle/copy (logged, not posted)
}

export interface ImageSpec {
  template: TemplateId;
  kicker: string; // small eyebrow label, e.g. "GRANT RADAR"
  headline: string; // the hero line
  subline?: string; // supporting line
  stat?: string; // big number for the "stat" template
  stat_label?: string; // caption under the stat
  left?: string; // "comparison" template: the old way
  right?: string; // "comparison" template: the SIGNAL way
  footer?: string; // small footer, defaults to handle/site
}

export interface PostRecord {
  id: string;
  ts: string; // ISO
  pillar: Pillar;
  angle: string;
  tweet: string;
  template: TemplateId;
  tweet_id?: string; // X id once posted
  url?: string;
  image_path?: string;
  dry_run: boolean;
}

export interface State {
  history: PostRecord[];
  monthly: Record<string, number>; // "YYYY-MM" -> count of real posts
}
