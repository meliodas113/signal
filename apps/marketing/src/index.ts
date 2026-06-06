import { randomUUID } from "node:crypto";
import { hasClaude, hasTwitter } from "./config.js";
import { buildBrief } from "./strategy/calendar.js";
import { sectorContext } from "./intel/sectorNews.js";
import { writeDraft } from "./content/writer.js";
import { renderImage } from "./design/render.js";
import { publish } from "./post/twitter.js";
import { gateReason, loadState, recordPost, saveState } from "./state/store.js";
import type { PostRecord } from "./types.js";

/**
 * One full cycle of the SIGNAL marketing team:
 *   Strategist → (Sector intel) → Copywriter/Editor → Designer → Publisher
 *
 * Flags:
 *   --dry-run   generate + render but do NOT post (no X creds needed)
 *   --open      (with --dry-run) print the local image path to inspect
 *   --force     ignore the min-interval / cap guards (still respects dry-run)
 */
export async function runCycle(opts: { dryRun: boolean; force: boolean; open: boolean }) {
  const log = (m: string) => console.log(`• ${m}`);
  const state = await loadState();

  if (!opts.dryRun && !opts.force) {
    const reason = gateReason(state);
    if (reason) {
      console.log(`⏸  skipping this slot: ${reason}`);
      return;
    }
  }

  // 1. Strategist — pick pillar + angle from rotation & history.
  const brief = buildBrief({ history: state.history });
  // Only pay for sector news when the brief is actually a sector slot.
  if (brief.pillar === "sector") {
    log("fetching sector news…");
    brief.sector_context = await sectorContext().catch(() => undefined);
  }
  log(`brief → pillar=${brief.pillar} angle=${brief.angle}`);

  // 2. Copywriter + Editor.
  log(hasClaude() ? "writing copy (Claude)…" : "writing copy (fallback — no ANTHROPIC_API_KEY)…");
  const draft = await writeDraft(brief);
  console.log(`\n  TWEET: ${draft.tweet}\n  (${draft.tweet.length} chars) — ${draft.rationale}\n`);

  // 3. Designer — render branded PNG.
  const id = `${new Date().toISOString().replace(/[:.]/g, "-")}_${draft.image.template}`;
  log(`rendering image (${draft.image.template})…`);
  const imagePath = await renderImage(draft.image, id);
  log(`image → ${imagePath}`);

  const rec: PostRecord = {
    id: randomUUID(),
    ts: new Date().toISOString(),
    pillar: brief.pillar,
    angle: brief.angle,
    tweet: draft.tweet,
    template: draft.image.template,
    image_path: imagePath,
    dry_run: opts.dryRun,
  };

  // 4. Publisher.
  if (opts.dryRun) {
    log("dry-run — not posting.");
    if (opts.open) log(`open: file://${imagePath}`);
  } else if (!hasTwitter()) {
    console.log("⚠  no X credentials — generated content but cannot post. Add keys to .env.");
    rec.dry_run = true;
  } else {
    log("posting to X…");
    const out = await publish({ text: draft.tweet, imagePath, altText: draft.alt_text });
    rec.tweet_id = out.tweet_id;
    rec.url = out.url;
    console.log(`✅ posted${out.with_image ? " with image" : " (text only — see media note)"}: ${out.url}`);
  }

  recordPost(state, rec);
  await saveState(state);
}

function parseArgs(argv: string[]) {
  return {
    dryRun: argv.includes("--dry-run"),
    force: argv.includes("--force"),
    open: argv.includes("--open"),
  };
}

// Run only when this file is the entry point (not when imported by loop.ts).
import { fileURLToPath } from "node:url";
import { argv } from "node:process";

if (fileURLToPath(import.meta.url) === argv[1]) {
  runCycle(parseArgs(argv.slice(2))).catch((err) => {
    console.error("✖ cycle failed:", err);
    process.exit(1);
  });
}
