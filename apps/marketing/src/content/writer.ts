import Anthropic from "@anthropic-ai/sdk";
import { config, hasClaude } from "../config.js";
import type { Brief, DraftResult, ImageSpec, TemplateId } from "../types.js";

/**
 * The Copywriter + Editor. A single Claude call plays both roles: draft 3
 * candidate tweets in SIGNAL's voice, critique them against the guardrails,
 * pick the strongest, and emit the final tweet plus a matching image spec.
 */

const SYSTEM = `You are the content team for SIGNAL — a "grant radar" that scores SBIR/STTR federal solicitations for genuine technical fit and tracks real deadlines, for deep-tech founders.

You operate as two roles in one pass:
1) COPYWRITER — draft three distinct candidate tweets for the brief.
2) EDITOR — critique them against the voice + guardrails, then choose and polish the single best one.

Then a DESIGNER spec: pick the image template and fill its fields so the visual amplifies (not repeats) the tweet.

Output ONLY a single JSON object, no markdown fences, matching exactly:
{
  "tweet": string,          // the final, polished tweet. <= 270 chars. No surrounding quotes.
  "alt_text": string,       // <= 200 chars, describes the image for screen readers.
  "rationale": string,      // 1 sentence: why this won. (internal, not posted)
  "image": {
    "template": "painpoint" | "stat" | "comparison" | "quote" | "tip",
    "kicker": string,       // <= 22 chars, uppercase, e.g. "GRANT RADAR" or "SBIR REALITY"
    "headline": string,     // the hero line. punchy. <= 60 chars.
    "subline": string,      // supporting line. <= 90 chars. ("" if not needed)
    "stat": string,         // for "stat" template: short, e.g. "6+ weeks" ("" otherwise)
    "stat_label": string,   // caption under the stat ("" otherwise)
    "left": string,         // for "comparison": the old/painful way ("" otherwise)
    "right": string         // for "comparison": the SIGNAL way ("" otherwise)
  }
}

Rules for the image: choose the template that fits the message. Use "stat" ONLY when product_facts contains a real number you can cite. Never invent numbers. The image text must be self-contained and readable without the tweet.`;

export async function writeDraft(brief: Brief): Promise<DraftResult> {
  if (!hasClaude()) return fallbackDraft(brief);

  const client = new Anthropic({ apiKey: config.anthropicApiKey });

  const user = `BRIEF
Pillar: ${brief.pillar}
Angle: ${brief.angle}

${brief.guidance}

GROUNDED PRODUCT FACTS (you may only assert things supported by these or the sector context):
${brief.product_facts.map((f) => `- ${f}`).join("\n")}
${brief.sector_context ? `\nFRESH SECTOR NEWS (cite/react, don't fabricate):\n${brief.sector_context}` : ""}

DO NOT REPEAT these recent posts (different angle and wording required):
${brief.avoid.map((a) => `- ${a}`).join("\n") || "- (none yet)"}

Produce the JSON now.`;

  const resp = await client.messages.create({
    model: config.model,
    max_tokens: 1200,
    system: SYSTEM,
    messages: [{ role: "user", content: user }],
  });

  const text = resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const parsed = extractJson(text);
  return normalize(parsed, brief);
}

function extractJson(text: string): any {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error(`No JSON in model output:\n${text.slice(0, 400)}`);
  return JSON.parse(text.slice(start, end + 1));
}

function normalize(raw: any, brief: Brief): DraftResult {
  const tweet = String(raw.tweet ?? "").trim().slice(0, 280);
  const img = raw.image ?? {};
  const template = ([
    "painpoint",
    "stat",
    "comparison",
    "quote",
    "tip",
  ].includes(img.template)
    ? img.template
    : "painpoint") as TemplateId;

  const image: ImageSpec = {
    template,
    kicker: str(img.kicker, "GRANT RADAR").toUpperCase().slice(0, 24),
    headline: str(img.headline, tweet).slice(0, 80),
    subline: opt(img.subline),
    stat: opt(img.stat),
    stat_label: opt(img.stat_label),
    left: opt(img.left),
    right: opt(img.right),
    footer: config.handle ? `@${config.handle}` : config.siteUrl.replace(/^https?:\/\//, ""),
  };

  if (!tweet) throw new Error("Model returned empty tweet");
  return {
    tweet,
    alt_text: str(raw.alt_text, image.headline).slice(0, 1000),
    image,
    rationale: str(raw.rationale, `auto:${brief.angle}`),
  };
}

const str = (v: unknown, fallback: string) =>
  typeof v === "string" && v.trim() ? v.trim() : fallback;
const opt = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

/** Deterministic, no-API draft so `--dry-run` works before keys are set. */
function fallbackDraft(brief: Brief): DraftResult {
  const fact = brief.product_facts[0] ?? "Finding the right SBIR/STTR grant shouldn't take a quarter.";
  const headline = fact.split(" — ")[0].split(".")[0].slice(0, 60);
  return {
    tweet: `${headline}. SIGNAL scores every open SBIR/STTR topic for real technical fit — and tells you what to skip. ${config.siteUrl}`.slice(
      0,
      270,
    ),
    alt_text: `SIGNAL branded card: ${headline}`,
    image: {
      template: "painpoint",
      kicker: "GRANT RADAR",
      headline,
      subline: "SIGNAL — the SBIR/STTR grant radar for deep-tech founders.",
      footer: config.handle ? `@${config.handle}` : config.siteUrl.replace(/^https?:\/\//, ""),
    },
    rationale: `fallback(no ANTHROPIC_API_KEY):${brief.angle}`,
  };
}
