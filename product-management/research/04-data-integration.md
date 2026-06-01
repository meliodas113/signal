# Data Integration — SBIR.gov API & Data Model

The dashboard today runs on 8 hand-authored demo records (`apps/dashboard/src/data/solicitations.ts`)
shaped *loosely* like SBIR.gov. Going live means wiring real data. This doc is the contract.

## Source APIs (public, free, no key)

Base host: `https://api.www.sbir.gov/public/api`

### Solicitations API
```
GET https://api.www.sbir.gov/public/api/solicitations?open=1&rows=50&start=0&format=json
```
Params: `keyword=`, `agency=` (DOD|HHS|NASA|NSF|DOE|USDA|EPA|DOC|ED|DOT|DHS), `open=1`,
`closed=1`, `rows=` (max 50), `start=` (offset), `format=json|xml`.

Top-level fields: `solicitation_title`, `solicitation_number`, `program`, `phase`, `agency`,
`branch`, `solicitation_year`, `release_date`, `open_date`, `close_date`,
`application_due_date` (can be multiple), `current_status`, `solicitation_agency_url`,
`solicitation_topics[]`.

`solicitation_topics[]`: `topic_title`, `branch`, `topic_number`, `topic_description`,
`sbir_topic_link`, `subtopics[]` (`subtopic_title`, `subtopic_number`, `subtopic_description`).

### Awards API (competitive intelligence — currently unused, high value)
```
GET https://api.www.sbir.gov/public/api/awards?agency=NSF&year=2024&rows=100&start=0
```
Fields (35) include: `firm`, `award_title`, `agency`, `phase`, `program`, `award_amount`,
`award_year`, `pi_name`, `research_area_keywords`, `abstract`, `award_link`. **This is the dataset
behind "who has won this kind of topic, at what budget, what's my realistic shot."**

### Companies/Firms API — registrant lookups (later).

> ⚠️ **Reliability note (verified 2026-06):** the API **returns 403 without a `User-Agent` header**
> and is **aggressively rate-limited (429)**; it also periodically shows *"undergoing maintenance,"*
> defaults to 25 rows, and caps at 50/request. Treat it as **batch ingest into our own store** with a
> set User-Agent, backoff on 429, and a retry queue — never a live in-browser call. This matches the
> architecture in the root README and is why a browser fallback heuristic exists.

## Critical gap: topic vs. solicitation granularity

- **Real model:** one *solicitation* contains many *topics*, each with many *subtopics*.
- **Founders match to a TOPIC/SUBTOPIC, not the umbrella solicitation.**
- **SIGNAL today** flattens everything into one `Solicitation` object with a single `topic: string`.
- **Action:** the data model must become `Solicitation → Topic[] → Subtopic[]`, and **scoring must
  run at the topic/subtopic level.** This is the most important data-model change before going live.

## Proposed normalized model (target)

```ts
interface Solicitation {
  id: string;              // solicitation_number
  title: string;
  agency: Agency;          // enum of the 11
  branch: string;
  program: "SBIR" | "STTR";
  status: "open" | "future" | "closed";
  openDate: string | null;
  closeDate: string | null;
  dueDates: string[];      // application_due_date[]
  agencyUrl: string;
  topics: Topic[];
}
interface Topic {
  id: string;              // topic_number
  title: string;
  description: string;     // the dense text we score against
  link: string;
  subtopics: Subtopic[];
  // SIGNAL-derived:
  embedding?: number[];    // for semantic match
}
```

## Architecture (server-side, scheduled)

```
[SBIR.gov APIs] --daily ingest--> [our store: Postgres/Supabase] --reads--> [dashboard]
                                         ^
                  [match service: embeds topics, scores vs profile, holds LLM key]
```

- **Ingest job** (cron/Edge Function): pull `open=1` per agency, upsert solicitations+topics, mark
  newly-closed, detect *opening-soon*. Store `last_seen` for staleness/lapse detection.
- **Match service** (the `VITE_MATCH_API_URL` endpoint, already stubbed): holds the model key,
  embeds topic text + profile, returns `MatchScore[]`. The existing browser fallback heuristic stays
  as the no-backend dev path. **Never ship the model key in the browser** (already documented).
- **Awards enrichment:** periodic awards pull keyed by agency/topic-area for the competitive-intel
  feature.

## Staleness / lapse handling (2025 lesson)

Persist `ingested_at` and surface a "data as of {time}" line. If the ingest can't refresh or the
program is in a funding lapse, **say so** rather than showing confidently-stale opportunities. A
radar that's wrong about *open vs closed* is worse than no radar.
