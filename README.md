# SIGNAL

An SBIR/STTR **grant radar** for tech startups. SIGNAL reads a startup's technology and scores open
federal solicitations for genuine fit — matching on *meaning*, not keywords — then tracks every
deadline so a funding window never closes unnoticed.

This is an npm-workspaces **monorepo** with two apps and a shared design system.

```
signal/
├── apps/
│   ├── landing/      Marketing site            (Vite + React + TS + Tailwind v4)
│   └── dashboard/    Matching dashboard        (Vite + React + TS + Tailwind v4)
└── packages/
    ├── theme/        Shared design tokens + motifs (Tailwind v4 @theme, CSS)
    └── ui/           Shared React primitives (RadarScope, cn) — consumed as source
```

## Why Vite (not Create React App)

CRA was **officially deprecated by the React team on Feb 14, 2025**, receives no security updates,
and its pinned dependency tree conflicts with React 19 (`npx create-react-app` fails outright).
The React team now recommends a framework or a build tool like **Vite**. So this project is built
on Vite — the same React you'd write either way, on tooling that's actually maintained.

## Tech

- **React 19** + **TypeScript** (strict)
- **Vite** for dev/build
- **Tailwind CSS v4** — CSS-first config. A single `@import "tailwindcss";` plus the shared
  `@theme` token file in `packages/theme/signal.css`. No `tailwind.config.js`.

## Getting started

Requires **Node 20+**.

```bash
npm install            # install all workspaces from the repo root

npm run dev:landing    # marketing site   → http://localhost:5173
npm run dev:dashboard  # dashboard app    → http://localhost:5173 (run separately)
```

Other scripts (from the root):

```bash
npm run build          # typecheck + build every app
npm run typecheck      # tsc --noEmit across workspaces
npm run build:landing  # build a single app
```

> Note: this repo was scaffolded but **not** `npm install`-ed or built in the authoring
> environment (no network access there). Run `npm install` once locally; if any pinned version
> needs a nudge for your platform, bump it in the relevant `package.json`.

## The shared design system

`packages/theme/signal.css` is the single source of truth for color, type, and the radar/scanline
motifs. Each app imports it right after Tailwind:

```css
/* apps/*/src/index.css */
@import "tailwindcss";
@import "../../../packages/theme/signal.css";
```

Because the tokens are declared in Tailwind v4's `@theme`, they're available as **both** CSS
variables (`var(--color-signal)`) and utility classes (`bg-signal`, `text-dim`, `border-line`,
`font-mono`, …) in every app automatically.

## Wiring up real matching (dashboard)

The dashboard scores solicitations through `apps/dashboard/src/lib/match.ts`:

- If `VITE_MATCH_API_URL` is set, it `POST`s `{ profile, solicitations }` and expects
  `MatchScore[]` back.
- If not, it runs a local heuristic so the UI is fully usable with no backend.

**Important:** the LLM key must live **server-side**. Point `VITE_MATCH_API_URL` at a serverless
function (Supabase Edge Function, Vercel function, etc.) that holds the key and calls the model.
Never ship a model API key in the browser bundle. See `apps/dashboard/.env.example`.

The sample solicitations in `apps/dashboard/src/data/solicitations.ts` are shaped like SBIR.gov
`solicitation_topics` records; in production your function pulls the live SBIR.gov Solicitations API
on a schedule, stores results, and the app reads from your database.

## Push to GitHub

This repo is already `git init`-ed with an initial commit. To publish it:

1. Create a **new empty repo** on GitHub (no README/license — keep it empty).
2. From the repo root:

```bash
git remote add origin https://github.com/<you>/<repo>.git
git branch -M main
git push -u origin main
```

## License

Add a license of your choice (e.g. MIT) before publishing.

---

*Independent tool — not affiliated with or endorsed by the U.S. government, the SBA, or any agency.
Opportunity data is sourced from public records and may lag the official version of record.*
