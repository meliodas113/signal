# SIGNAL QA agent

An autonomous QA team for the SIGNAL landing page. It drives the site in a real
headless Chromium browser (Playwright), finds regressions, and files them into
Linear with screenshots — on a schedule.

By default it **boots the local `apps/landing` dev server** and tests that, so it
catches bugs in your working copy before they ship. Point it at production by
setting `QA_TARGET_URL`.

## What it checks

| Suite              | What it asserts |
| ------------------ | --------------- |
| **load + console** | Each route (`/`, `#/about`) loads, returns 2xx, renders, and has no uncaught JS errors, `console.error`s, failed (≥400) requests, or broken images. |
| **nav + links**    | Nav anchors (`#why`, `#how`, `#pricing`, `#get`) have real targets, the `#/about` route renders content, and no link has an empty/malformed `href`. |
| **email capture**  | The signup input exists, an invalid address is rejected client-side, and a valid submit reaches a terminal state (success **or** a presented error) instead of hanging or throwing. Uses a fake `QA_TEST_EMAIL`. |
| **responsive**     | No horizontal overflow at mobile (390px), tablet (768px), desktop (1440px); screenshots offenders. |

Each failure becomes a Linear issue in the **Signal** team: titled `[QA] …`,
priority by severity (blocker→Urgent … low→Low), labelled `qa-bot` + severity,
with the failure screenshot attached. Bugs are **deduplicated** — the same
finding won't refile within `QA_REFILE_COOLDOWN_HOURS` (default 7 days).

## Setup

```bash
npm install                 # from the repo root (workspaces)
npm run browser:install -w @signal/qa   # one-time: download Chromium
cp apps/qa/.env.example apps/qa/.env    # then fill in LINEAR_API_KEY
```

Get a Linear **Personal API key**: Linear → Settings → Security & access →
Personal API keys.

## Run

```bash
# from apps/qa  (or add -w @signal/qa from the root)
npm run check:dry     # run all checks, save screenshots, DON'T touch Linear
npm run check         # run + file bugs to Linear
npm run loop          # foreground loop every QA_LOOP_INTERVAL_HOURS (default 6)
```

Screenshots and run state land in `apps/qa/output/` (gitignored).

## Schedule (every 6h, via launchd)

```bash
npm run schedule:install     # load the launchd job (runs at load, then every 6h)
npm run schedule:status      # is it loaded?
npm run schedule:uninstall   # remove it
```

Runs only while your Mac is awake and online. Logs: `output/launchd.{out,err}.log`.

## Config (`.env`)

| Var | Default | Meaning |
| --- | ------- | ------- |
| `LINEAR_API_KEY` | — | Required to file issues. Without it, checks still run and report locally. |
| `LINEAR_TEAM_ID` | Signal team | Team to file into. |
| `QA_TARGET_URL` | _(empty)_ | Empty = auto-start local landing dev server. Set to `https://getsignal.co.in` to test prod. |
| `QA_TEST_EMAIL` | `qa-bot@example.com` | Address used by the signup check. |
| `QA_REFILE_COOLDOWN_HOURS` | `168` | Dedupe window — don't refile the same bug sooner than this. |
| `QA_LOOP_INTERVAL_HOURS` | `6` | `npm run loop` cadence. |
