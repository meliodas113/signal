import type { MatchScore, Profile, Solicitation, Verdict } from "../types";

const ENDPOINT = import.meta.env.VITE_MATCH_API_URL as string | undefined;

/**
 * Score solicitations against a startup profile.
 *
 * In production this POSTs to a server-side endpoint that calls the LLM with
 * the model key held SERVER-SIDE (never in the browser). If `VITE_MATCH_API_URL`
 * is not set, we fall back to a local heuristic so the UI is fully usable in
 * development without a backend.
 */
export async function scoreSolicitations(
  profile: Profile,
  solicitations: Solicitation[],
): Promise<MatchScore[]> {
  if (ENDPOINT) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, solicitations }),
    });
    if (!res.ok) throw new Error(`Match endpoint returned ${res.status}`);
    const data: unknown = await res.json();
    if (!Array.isArray(data)) throw new Error("Match endpoint returned an unexpected shape");
    return data as MatchScore[];
  }
  return heuristicScore(profile, solicitations);
}

const STOP = new Set([
  "the", "and", "for", "with", "our", "your", "that", "this", "are", "but", "from",
  "into", "they", "you", "all", "can", "has", "have", "will", "tech", "technology",
  "build", "building", "system", "systems", "data",
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

function bandToVerdict(score: number): Verdict {
  if (score >= 75) return "Strong match";
  if (score >= 50) return "Possible";
  if (score >= 30) return "Weak";
  return "Skip";
}

/** Transparent, deterministic stand-in for the LLM matcher. */
function heuristicScore(profile: Profile, solicitations: Solicitation[]): MatchScore[] {
  const profTokens = tokenize(profile.tech);

  return solicitations.map((s) => {
    const topicTokens = tokenize(`${s.title} ${s.topic}`);
    let overlap = 0;
    for (const t of profTokens) if (topicTokens.has(t)) overlap += 1;

    const denom = Math.max(6, Math.min(profTokens.size, 14));
    let score = Math.round(Math.min(1, overlap / denom) * 88) + (overlap > 0 ? 6 : 0);

    if (profile.agencies.length && profile.agencies.includes(s.agency)) score += 6;
    if (profile.phase !== "Either" && s.phase.includes(profile.phase.replace("Phase ", "")))
      score += 3;
    score = Math.max(4, Math.min(99, score));

    const verdict = bandToVerdict(score);
    const isSTTR = s.program === "STTR";

    return {
      id: s.id,
      fit_score: score,
      verdict,
      why:
        overlap > 0
          ? `Overlaps your stack on ${overlap} key term${overlap > 1 ? "s" : ""}.`
          : "Limited overlap with your described technology.",
      next_step:
        verdict === "Strong match" || verdict === "Possible"
          ? "Read the topic; draft a fit brief."
          : "Skim later if scope shifts.",
      eligibility_flag: isSTTR ? "STTR — requires a research-institution partner." : null,
    } satisfies MatchScore;
  });
}
