import { Brand } from "./Brand";

export function Footer() {
  return (
    <footer className="mt-[30px] border-t border-line py-11">
      <div className="mx-auto flex max-w-[1140px] flex-wrap items-start justify-between gap-6 px-5 sm:px-7">
        <Brand />
        <p className="max-w-[54ch] font-mono text-[11px] leading-[1.8] tracking-wide text-faint">
          <span className="text-dim">
            Independent tool — not affiliated with or endorsed by the U.S. government, the SBA, or
            any agency.
          </span>
          <br />
          Opportunity data is sourced from public records and may lag the official version of
          record. Always confirm details and deadlines on the official agency solicitation before
          applying.
        </p>
      </div>
    </footer>
  );
}
