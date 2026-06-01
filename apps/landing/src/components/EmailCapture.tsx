import { useState } from "react";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface EmailCaptureProps {
  cta?: string;
  placeholder?: string;
  centered?: boolean;
  /**
   * Where to send the address. Wire this to your backend (Supabase table,
   * form endpoint, etc.). When omitted, the form only confirms client-side.
   */
  onSubmit?: (email: string) => Promise<void> | void;
}

export function EmailCapture({
  cta = "Get access",
  placeholder = "founder@yourstartup.com",
  centered = false,
  onSubmit,
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!EMAIL_RE.test(email.trim())) {
      setError(true);
      return;
    }
    setError(false);
    await onSubmit?.(email.trim());
    setDone(true);
  }

  if (done) {
    return (
      <p className={`font-mono text-[13px] tracking-wide text-signal ${centered ? "text-center" : ""}`}>
        ✓ You&apos;re on the list — watch your inbox.
      </p>
    );
  }

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
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full min-w-0 flex-1 bg-transparent px-4 py-[15px] text-[15px] text-text outline-none placeholder:text-faint"
        />
        <button
          onClick={submit}
          className="cursor-pointer whitespace-nowrap bg-signal px-4 font-mono text-xs font-bold uppercase tracking-wider text-bg transition hover:brightness-110 sm:px-6"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
