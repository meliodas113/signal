-- =============================================================================
-- SIGNAL — early-access signups
-- Captures every "Get early access" submission from the marketing site.
-- Written exclusively by the `early-access` Edge Function (service-role key),
-- which bypasses RLS. RLS is enabled with no policies, so the anon/public
-- roles get zero direct access to the table.
-- =============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.early_access_signups (
  id                    uuid primary key default gen_random_uuid(),
  email                 text not null,
  source                text,                       -- which form: hero | final-cta | about-cta
  referrer              text,                        -- document.referrer when available
  user_agent            text,
  welcome_email_sent_at timestamptz,                 -- set once the Resend mail succeeds
  created_at            timestamptz not null default now()
);

-- One row per address, case-insensitive (so Foo@x.com == foo@x.com).
create unique index if not exists early_access_signups_email_lower_idx
  on public.early_access_signups (lower(email));

-- Handy for "newest first" admin queries.
create index if not exists early_access_signups_created_at_idx
  on public.early_access_signups (created_at desc);

alter table public.early_access_signups enable row level security;
-- Intentionally no policies — only the Edge Function (service role) may write.
