import { useState } from "react";
import { submitEarlyAccess } from "../lib/earlyAccess";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface EmailCaptureProps {
  cta?: string;
  placeholder?: string;
  centered?: boolean;
  /** Where the signup originated — stored with the row (hero | final-cta | about-cta). */
  source?: string;
  /**
   * Override the submit behaviour. When omitted, the address is sent to the
   * early-access Edge Function (Supabase) which records it and emails a welcome.
   */
  onSubmit?: (email: string) => Promise<void> | void;
}

type Status = "idle" | "submitting" | "done";

export function EmailCapture({
  cta = "Get access",
  placeholder = "founder@yourstartup.com",
  centered = false,
  source,
  onSubmit,
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (status === "submitting") return;
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setStatus("submitting");
    try {
      if (onSubmit) await onSubmit(email.trim());
      else await submitEarlyAccess(email.trim(), source);
      setStatus("done");
    } catch (e) {
      setStatus("idle");
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <p
        className={`font-mono text-[13px] tracking-wide text-signal ${centered ? "text-center" : ""}`}
      >
        ✓ You&apos;re on the list — check your inbox for a confirmation.
      </p>
    );
  }

  const submitting = status === "submitting";

  return (
    <div className={centered ? "mx-auto w-full max-w-[420px]" : "w-full max-w-[420px]"}>
      <div
        className={`flex overflow-hidden rounded-xl border bg-surface transition focus-within:border-signal-dim ${
          error ? "border-danger" : "border-line"
        }`}
      >
        <input
          type="email"
          aria-label="Email address"
          aria-invalid={!!error}
          placeholder={placeholder}
          value={email}
          disabled={submitting}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full min-w-0 flex-1 bg-transparent px-4 py-[15px] text-[15px] text-text outline-none placeholder:text-faint disabled:opacity-60"
        />
        <button
          onClick={submit}
          disabled={submitting}
          className="cursor-pointer whitespace-nowrap bg-signal px-4 font-mono text-xs font-bold uppercase tracking-wider text-bg transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70 sm:px-6"
        >
          {submitting ? "Sending…" : cta}
        </button>
      </div>
      {error && (
        <p
          role="alert"
          className={`mt-2 font-mono text-[11px] leading-snug text-danger ${
            centered ? "text-center" : ""
          }`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
