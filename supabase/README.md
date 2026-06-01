# SIGNAL — early-access backend

Captures every **Get early access** submission into a hosted Postgres table and
sends an automated, branded HTML welcome email.

```
Browser form (EmailCapture)
      │  POST { email, source, referrer }
      ▼
Supabase Edge Function  ──►  Postgres  (early_access_signups)
   (early-access)       └─►  Resend     (welcome email)
```

- **DB:** Supabase Postgres — `public.early_access_signups`
- **API:** Supabase Edge Function — `early-access` (Deno)
- **Email:** Resend (HTML + plain-text)

The function uses the **service-role key** (auto-injected by Supabase) so it can
write to the RLS-locked table. The browser only ever sees the public anon key.

---

## One-time setup

### 1. Create the Supabase project
Create a project at <https://supabase.com>. Grab from **Project Settings → API**:
- Project URL  → `VITE_SUPABASE_URL`
- `anon` public key → `VITE_SUPABASE_ANON_KEY`

### 2. Install + link the CLI
```bash
brew install supabase/tap/supabase      # or see supabase.com/docs/guides/cli
supabase login
supabase link --project-ref <your-project-ref>
```

### 3. Apply the database migration
```bash
supabase db push        # applies supabase/migrations/0001_early_access_signups.sql
```

### 4. Create a Resend API key
Sign up at <https://resend.com>, verify a sending domain (or use the test
`onboarding@resend.dev` sender while developing), and create an API key.

### 5. Set the function secrets
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically — do
**not** set them yourself. Only set:
```bash
supabase secrets set \
  RESEND_API_KEY="re_xxxxxxxx" \
  RESEND_FROM="SIGNAL <hello@yourdomain.com>" \
  SITE_URL="https://yourdomain.com" \
  ALLOWED_ORIGIN="https://yourdomain.com"   # use * for local/dev
```

### 6. Deploy the function
```bash
supabase functions deploy early-access
```

### 7. Point the frontend at it
```bash
cp apps/landing/.env.example apps/landing/.env
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then:
npm run dev:landing
```

---

## Local development

Run the function locally (serves at `http://localhost:54321/functions/v1/early-access`):
```bash
supabase start
supabase functions serve early-access --env-file supabase/.env
```
Create `supabase/.env` (git-ignored) for local secrets:
```
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM=SIGNAL <onboarding@resend.dev>
SITE_URL=http://localhost:5173
ALLOWED_ORIGIN=*
```

## Test it
```bash
curl -i -X POST "$VITE_SUPABASE_URL/functions/v1/early-access" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","source":"curl"}'
# -> {"ok":true,"emailed":true}
# A second identical call -> {"ok":true,"alreadyRegistered":true}
```

## View signups
Supabase dashboard → **Table editor → early_access_signups**, or:
```sql
select email, source, welcome_email_sent_at, created_at
from early_access_signups
order by created_at desc;
```

## Notes
- A signup is saved even if the email send fails (delivery is best-effort);
  `welcome_email_sent_at` records whether the welcome mail went out.
- Duplicate emails are idempotent — no error, no duplicate row, no re-send.
- Want to gate spam harder? Add a Turnstile/hCaptcha token to the payload and
  verify it at the top of the function, or set `verify_jwt = true` (already on)
  plus rate limiting.
