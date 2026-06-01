// Client for the SIGNAL early-access signup endpoint (a Supabase Edge Function).
// Configure via apps/landing/.env (see .env.example):
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface EarlyAccessResult {
  ok: true;
  emailed?: boolean;
  alreadyRegistered?: boolean;
}

/**
 * Submit an email to the early-access list. Resolves on success, throws an
 * Error (with a user-presentable message) on failure.
 */
export async function submitEarlyAccess(
  email: string,
  source?: string,
): Promise<EarlyAccessResult> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Signups aren't configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  const endpoint = `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/early-access`;

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email,
        source,
        referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
      }),
    });
  } catch {
    throw new Error("Network error — please check your connection and try again.");
  }

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `Something went wrong (${res.status}). Please try again.`);
  }

  return (await res.json()) as EarlyAccessResult;
}
