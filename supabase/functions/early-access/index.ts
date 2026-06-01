// =============================================================================
// SIGNAL — `early-access` Edge Function
// POST { email, source?, referrer? }  ->  store the signup in Postgres and send
// a branded HTML welcome email via Resend.
//
// Runs on Supabase Edge Runtime (Deno). Uses the service-role key (auto-injected
// by the platform) so it can write to the RLS-locked table. Secrets required:
//   RESEND_API_KEY   – your Resend API key
//   RESEND_FROM      – e.g. "SIGNAL <hello@yourdomain.com>" (verified sender)
//   SITE_URL         – (optional) link used by the email CTA button
//   ALLOWED_ORIGIN   – (optional) CORS origin, defaults to "*"
// =============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";
import { renderWelcomeEmail, welcomeEmailText } from "./email-template.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM = Deno.env.get("RESEND_FROM") ?? "SIGNAL <onboarding@resend.dev>";
const SITE_URL = Deno.env.get("SITE_URL") ?? undefined;
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "*";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // ---- parse + validate ----------------------------------------------------
  let payload: { email?: unknown; source?: unknown; referrer?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const email = String(payload.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ error: "Please enter a valid email address." }, 422);
  }
  const source = payload.source ? String(payload.source).slice(0, 80) : null;
  const referrer = payload.referrer ? String(payload.referrer).slice(0, 400) : null;
  const userAgent = req.headers.get("user-agent")?.slice(0, 400) ?? null;

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // ---- store the signup ----------------------------------------------------
  const { data: row, error } = await supabase
    .from("early_access_signups")
    .insert({ email, source, referrer, user_agent: userAgent })
    .select("id")
    .single();

  if (error) {
    // 23505 = unique_violation -> already signed up. Treat as success (idempotent).
    if (error.code === "23505") {
      return json({ ok: true, alreadyRegistered: true });
    }
    console.error("early-access: insert failed", error);
    return json({ error: "Could not save your signup. Please try again." }, 500);
  }

  // ---- send the welcome email (best-effort) --------------------------------
  // A signup is already persisted; never fail the request just because mail
  // delivery hiccuped. We record whether it was sent.
  let emailed = false;
  if (RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [email],
          subject: "You're on the SIGNAL early-access list",
          html: renderWelcomeEmail({ email, siteUrl: SITE_URL }),
          text: welcomeEmailText(email, SITE_URL),
          tags: [{ name: "type", value: "early-access-welcome" }],
        }),
      });

      if (res.ok) {
        emailed = true;
        await supabase
          .from("early_access_signups")
          .update({ welcome_email_sent_at: new Date().toISOString() })
          .eq("id", row.id);
      } else {
        console.error("early-access: Resend error", res.status, await res.text());
      }
    } catch (e) {
      console.error("early-access: Resend threw", e);
    }
  } else {
    console.warn("early-access: RESEND_API_KEY not set — skipping welcome email.");
  }

  return json({ ok: true, emailed });
});
