# Automation — the SIGNAL PM agent

This folder automates the "product manager for SIGNAL" role so the thinking in
`product-management/` stays live and reusable instead of going stale in a doc.

## The `signal-pm` skill

The live skill is installed at **`.claude/skills/signal-pm/SKILL.md`** (repo root, so Claude Code
discovers it). Invoke it by asking Claude to act as SIGNAL's PM — e.g.:

- "As SIGNAL's PM, spec the readiness/registration feature."
- "Prioritize the next 3 things to build and update the roadmap."
- "Plan the dashboard changes for per-topic scoring."
- "Refresh the SBIR research — did anything change since the 2031 reauthorization?"

The skill always loads this knowledge base first, grounds recommendations in the actual code under
`apps/dashboard/src/`, leads with a decision, and edits the KB when facts change.

> Why the skill lives in `.claude/skills/` and not here: Claude Code only auto-discovers skills under
> a project's `.claude/skills/` directory. This folder is the *home of the PM system* (knowledge +
> tooling); the skill file is its executable entry point. Keep them in sync — if you edit one,
> consider the other.

## `refresh-research.sh`

Pulls live SBIR.gov solicitation data to validate the data contract in
`../research/04-data-integration.md`. No API key needed.

```bash
chmod +x refresh-research.sh
./refresh-research.sh            # all open solicitations
./refresh-research.sh NSF        # one agency
./refresh-research.sh DOD autonomy
```

If the API shape drifts from the doc, update `../research/04-data-integration.md` and bump its
"Last refreshed" line.

## Keeping the PM system honest

SBIR/STTR is policy-sensitive (2025 lapse, reauthorization through 2031). Re-run research
periodically (the skill's Workflow C) and update the dated KB files. Stale PM docs are worse than
none — they encode confident, wrong decisions.
