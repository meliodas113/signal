// =============================================================================
// Branded HTML welcome email for SIGNAL early-access signups.
// Built with table-based layout + inline styles for broad email-client support
// (Gmail, Outlook, Apple Mail, etc.). Dark theme to match the marketing site.
// =============================================================================

const C = {
  bg: "#0a0d0e",
  surface: "#11171a",
  line: "#222d31",
  text: "#e9f0ea",
  dim: "#8a9a93",
  faint: "#586863",
  signal: "#c2f53f",
};

export interface WelcomeEmailParams {
  email: string;
  siteUrl?: string;
}

export function renderWelcomeEmail({ email, siteUrl }: WelcomeEmailParams): string {
  const preheader = "Your radar is locked in — here's what happens next.";
  const cta = siteUrl
    ? `
      <tr>
        <td style="padding: 28px 0 8px;">
          <a href="${escapeAttr(siteUrl)}" target="_blank"
             style="display:inline-block;background:${C.signal};color:${C.bg};
                    font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;
                    font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
                    text-decoration:none;padding:14px 26px;border-radius:10px;">
            Explore SIGNAL &rarr;
          </a>
        </td>
      </tr>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark light" />
    <meta name="supported-color-schemes" content="dark light" />
    <title>You're on the SIGNAL early-access list</title>
  </head>
  <body style="margin:0;padding:0;background:${C.bg};">
    <!-- preheader (hidden) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.bg};font-size:1px;line-height:1px;">
      ${preheader}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background:${C.bg};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                 style="max-width:560px;width:100%;background:${C.surface};
                        border:1px solid ${C.line};border-radius:18px;overflow:hidden;">
            <!-- header -->
            <tr>
              <td style="padding:34px 36px 22px;border-bottom:1px solid ${C.line};
                         background:radial-gradient(420px 200px at 90% -20%, rgba(194,245,63,0.10), transparent 60%);">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="vertical-align:middle;padding-right:12px;">
                      <div style="width:30px;height:30px;border-radius:50%;
                                  border:1px solid ${C.signal};
                                  background:radial-gradient(circle, rgba(194,245,63,0.30), transparent 70%);"></div>
                    </td>
                    <td style="vertical-align:middle;">
                      <div style="font-family:Archivo,Arial,sans-serif;font-weight:800;font-size:18px;
                                  letter-spacing:4px;color:${C.text};">SIGNAL</div>
                      <div style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9px;
                                  letter-spacing:3px;color:${C.dim};margin-top:2px;">SBIR / STTR RADAR</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- body -->
            <tr>
              <td style="padding:34px 36px 36px;">
                <div style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;
                            letter-spacing:3px;text-transform:uppercase;color:${C.signal};">
                  Early access confirmed
                </div>
                <h1 style="margin:14px 0 0;font-family:Archivo,Arial,sans-serif;font-weight:800;
                           font-size:28px;line-height:1.1;letter-spacing:-0.5px;color:${C.text};">
                  You're on the list.
                </h1>
                <p style="margin:18px 0 0;font-family:Archivo,Arial,sans-serif;font-size:15px;
                          line-height:1.65;color:${C.dim};">
                  Thanks for signing up with
                  <span style="color:${C.text};">${escapeHtml(email)}</span>.
                  SIGNAL is a grant radar for SBIR/STTR: it reads dense federal solicitation
                  text the way a domain expert would, matches it to your technology, scores the
                  fit, and watches every deadline — so you never miss a window of non-dilutive
                  funding.
                </p>

                <!-- what happens next -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                       style="margin-top:26px;border-top:1px solid ${C.line};">
                  ${nextRow("01", "We'll calibrate your radar", "When we open the doors, you'll describe what you build — once — and SIGNAL starts scoring every open topic for real fit.")}
                  ${nextRow("02", "Matches come to you", "A short, scored digest lands in your inbox: the topics that fit, why they fit, the next move, and the ticking deadline.")}
                  ${nextRow("03", "You move before the window shuts", "Deadline countdowns and closing-soon alerts mean you act while there's still time — no portal-hopping required.")}
                </table>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  ${cta}
                </table>
              </td>
            </tr>

            <!-- footer -->
            <tr>
              <td style="padding:22px 36px 30px;border-top:1px solid ${C.line};">
                <p style="margin:0;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;
                          line-height:1.8;color:${C.faint};">
                  Independent tool — not affiliated with or endorsed by the U.S. government, the
                  SBA, or any agency. Opportunity data is sourced from public records and may lag
                  the official version of record.
                </p>
                <p style="margin:14px 0 0;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;
                          color:${C.faint};">
                  You're receiving this because you requested early access at our site.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function nextRow(no: string, title: string, body: string): string {
  return `
    <tr>
      <td style="padding:16px 0;border-bottom:1px solid ${C.line};vertical-align:top;width:34px;">
        <span style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;
                     font-weight:700;color:${C.signal};">${no}</span>
      </td>
      <td style="padding:16px 0;border-bottom:1px solid ${C.line};vertical-align:top;">
        <div style="font-family:Archivo,Arial,sans-serif;font-weight:700;font-size:15px;color:${C.text};">
          ${title}
        </div>
        <div style="font-family:Archivo,Arial,sans-serif;font-size:13.5px;line-height:1.6;
                    color:${C.dim};margin-top:4px;">${body}</div>
      </td>
    </tr>`;
}

/** Plain-text fallback for clients that don't render HTML. */
export function welcomeEmailText(email: string, siteUrl?: string): string {
  return [
    "SIGNAL — SBIR/STTR RADAR",
    "",
    "EARLY ACCESS CONFIRMED",
    "You're on the list.",
    "",
    `Thanks for signing up with ${email}. SIGNAL is a grant radar for SBIR/STTR:`,
    "it reads dense federal solicitation text the way a domain expert would, matches",
    "it to your technology, scores the fit, and watches every deadline — so you never",
    "miss a window of non-dilutive funding.",
    "",
    "What happens next:",
    "01. We'll calibrate your radar — describe what you build once.",
    "02. Matches come to you — a short, scored digest in your inbox.",
    "03. You move before the window shuts — deadline alerts included.",
    siteUrl ? `\nExplore SIGNAL: ${siteUrl}` : "",
    "",
    "Independent tool — not affiliated with or endorsed by the U.S. government, the SBA,",
    "or any agency. You're receiving this because you requested early access at our site.",
  ].join("\n");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, "&quot;");
}
