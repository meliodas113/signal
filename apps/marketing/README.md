# @signal/marketing — autonomous Twitter/X marketing team

A small "marketing team" that runs as a pipeline of roles, generates branded
SIGNAL content, renders a tailored image, and posts to X — every 2 hours, fully
automatically, from your Mac.

```
Strategist  →  (Sector intel)  →  Copywriter + Editor  →  Designer   →  Publisher
calendar.ts    sectorNews.ts       writer.ts (Claude)      render.ts     twitter.ts
pick pillar    fresh SBIR news     draft, self-edit,       HTML → PNG    X API v2
& angle        (free RSS)          emit tweet + img spec   (branded)     + media
```

**Content pillars** rotate across the day so the feed never feels repetitive:

- **pain** — the 8 founder pain points (P1–P8) from the product strategy.
- **why-signal** — the differentiators (honesty, SBIR-native depth, push-not-pull).
- **sector** — reacts to current SBIR/STTR / deep-tech funding news.
- **build-log** — build-in-public principles.

Everything the copy can claim is grounded in `src/strategy/productFacts.ts` — the
model is told it may not invent numbers or promise outcomes.

## Setup (one time)

```bash
cd apps/marketing
npm install                 # from repo root, npm workspaces also works
npm run browser:install     # downloads headless Chromium for image rendering
cp .env.example .env        # then fill in your keys (see below)
```

### Keys you need in `.env`

| Key | Why | Where |
|-----|-----|-------|
| `ANTHROPIC_API_KEY` | writes the copy | https://console.anthropic.com |
| `X_API_KEY` / `X_API_SECRET` | your X app | https://developer.x.com |
| `X_ACCESS_TOKEN` / `X_ACCESS_SECRET` | post as your account | X app → Keys & tokens (Read **and Write**) |
| `X_HANDLE` | nicer log links | your @handle, no @ |

> In the X developer portal: create a Project + App, set **User authentication →
> Read and Write**, then generate the **Access Token & Secret** for your own
> account. All four X values are required to post.

## Try it without posting

```bash
npm run post:dry      # full pipeline, renders an image, does NOT post
npm run preview       # same + prints the file:// path to open the PNG
```

This works even before you add any keys — the copywriter falls back to a
deterministic draft so you can see the image templates immediately. Generated
images + the source HTML land in `output/`.

## Go live

```bash
npm run post                 # generate + post a single tweet right now
npm run schedule:install     # launchd job: posts every 2 hours, survives reboot
npm run schedule:status      # is it loaded? when did it last run?
npm run schedule:uninstall   # stop it
```

Prefer a foreground loop instead of launchd? `npm run loop` (Ctrl-C to stop).

## Guardrails baked in

- **Monthly cap** (`MONTHLY_POST_CAP`, default 450) keeps you under the X free-tier
  ~500 writes/month limit. The publisher refuses once you hit it.
- **Min-interval guard** (`MIN_MINUTES_BETWEEN_POSTS`, default 110) prevents
  double-posting if the scheduler fires twice.
- **No-repeat memory** — the last posts are fed back to the writer to force fresh
  angles and wording. History + counters live in `output/state.json`.
- **Honest media fallback** — if image upload fails (the free X tier often blocks
  media upload), it posts text-only and logs the reason instead of dropping the slot.

## Caveats

- **Local + automatic** means tweets only fire while your Mac is awake and online.
  Overnight/asleep slots are skipped (the cap + interval guards keep it sane).
  Move `run-once.sh` to a $5 VPS cron for true 24/7.
- **Free-tier media upload** is the one likely friction point. If you see
  "posting text only" in the logs, that tier limitation is why — upgrading to X
  Basic enables images.
- X's free write limit changes periodically; adjust `MONTHLY_POST_CAP` to match.
