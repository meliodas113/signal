import type { ReactNode } from "react";

interface KickerProps {
  children: ReactNode;
  center?: boolean;
}

/** Mono uppercase label with a leading rule — used above section headings. */
export function Kicker({ children, center = false }: KickerProps) {
  return (
    <div
      className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.34em] text-signal ${
        center ? "justify-center" : ""
      }`}
    >
      <span className="h-px w-[30px] bg-signal" />
      {children}
    </div>
  );
}
