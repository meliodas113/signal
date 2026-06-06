import { Brand } from "./Brand";
import { navigate, goToSection } from "../router";

// `to` is a real route; `section` smooth-scrolls to a homepage section id.
const LINKS: ({ label: string } & ({ to: string } | { section: string }))[] = [
  { label: "About", to: "/about" },
  { label: "Why it's different", section: "why" },
  { label: "How it works", section: "how" },
  { label: "Pricing", section: "pricing" },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1140px] items-center justify-between gap-4 px-5 sm:px-7">
        <a
          href="/"
          aria-label="SIGNAL home"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          className="transition hover:opacity-80"
        >
          <Brand />
        </a>
        <div className="flex items-center gap-5 md:gap-7">
          {LINKS.map((l) =>
            "to" in l ? (
              <a
                key={l.label}
                href={l.to}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(l.to);
                }}
                className="hidden font-mono text-xs uppercase tracking-wider text-dim transition hover:text-text md:inline"
              >
                {l.label}
              </a>
            ) : (
              <a
                key={l.label}
                href={`/#${l.section}`}
                onClick={(e) => {
                  e.preventDefault();
                  goToSection(l.section);
                }}
                className="hidden font-mono text-xs uppercase tracking-wider text-dim transition hover:text-text md:inline"
              >
                {l.label}
              </a>
            ),
          )}
          <a
            href="/#get"
            onClick={(e) => {
              e.preventDefault();
              goToSection("get");
            }}
            className="whitespace-nowrap rounded-lg bg-signal px-3.5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-bg transition hover:shadow-[0_0_22px_rgba(194,245,63,0.35)] sm:px-[18px] sm:text-[11px]"
          >
            Get early access
          </a>
        </div>
      </div>
    </nav>
  );
}
