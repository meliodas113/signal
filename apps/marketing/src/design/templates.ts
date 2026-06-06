import { brand } from "../config.js";
import type { ImageSpec } from "../types.js";

/**
 * The Designer. Produces a full HTML document for an ImageSpec, styled from the
 * SIGNAL brand tokens (mirrors packages/theme/signal.css). Rendered at 1600x900
 * (16:9 — X's single-image sweet spot) by design/render.ts.
 */

const W = 1600;
const H = 900;

export function renderHtml(spec: ImageSpec): string {
  return `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>${css()}</style></head>
<body>
  <div class="card">
    ${grain()}
    ${cornerScope()}
    <div class="content">
      <div class="kicker"><span class="dot"></span>${esc(spec.kicker)}</div>
      ${body(spec)}
    </div>
    <div class="footer">
      <div class="brandmark">${miniScope()}<span>SIGNAL</span></div>
      <div class="handle">${esc(spec.footer ?? "getsignal.co.in")}</div>
    </div>
  </div>
</body></html>`;
}

function body(spec: ImageSpec): string {
  switch (spec.template) {
    case "stat":
      return `
        <div class="stat-wrap">
          <div class="stat">${esc(spec.stat ?? "")}</div>
          ${spec.stat_label ? `<div class="stat-label">${esc(spec.stat_label)}</div>` : ""}
        </div>
        <h1 class="headline mid">${esc(spec.headline)}</h1>
        ${spec.subline ? `<p class="subline">${esc(spec.subline)}</p>` : ""}`;

    case "comparison":
      return `
        <h1 class="headline small">${esc(spec.headline)}</h1>
        <div class="cmp">
          <div class="col old">
            <div class="col-tag">THE OLD WAY</div>
            <div class="col-text">${esc(spec.left ?? "")}</div>
          </div>
          <div class="vs">→</div>
          <div class="col new">
            <div class="col-tag">WITH SIGNAL</div>
            <div class="col-text">${esc(spec.right ?? "")}</div>
          </div>
        </div>
        ${spec.subline ? `<p class="subline">${esc(spec.subline)}</p>` : ""}`;

    case "quote":
      return `
        <div class="quote-mark">"</div>
        <h1 class="headline quote">${esc(spec.headline)}</h1>
        ${spec.subline ? `<p class="subline">— ${esc(spec.subline)}</p>` : ""}`;

    case "tip":
      return `
        <h1 class="headline">${esc(spec.headline)}</h1>
        ${spec.subline ? `<p class="subline">${esc(spec.subline)}</p>` : ""}`;

    case "painpoint":
    default:
      return `
        <h1 class="headline">${esc(spec.headline)}</h1>
        ${spec.subline ? `<p class="subline">${esc(spec.subline)}</p>` : ""}`;
  }
}

function css(): string {
  return `
  :root{
    --bg:${brand.bg}; --surface:${brand.surface}; --surface2:${brand.surface2};
    --line:${brand.line}; --text:${brand.text}; --dim:${brand.dim}; --faint:${brand.faint};
    --signal:${brand.signal}; --signal-dim:${brand.signalDim}; --amber:${brand.amber}; --danger:${brand.danger};
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px;overflow:hidden}
  body{
    background:var(--bg);color:var(--text);
    font-family:"Archivo",system-ui,sans-serif;
    background-image:
      radial-gradient(1100px 700px at 88% -10%, rgba(194,245,63,.10), transparent 60%),
      radial-gradient(800px 600px at 6% 30%, rgba(194,245,63,.04), transparent 60%);
  }
  .card{position:relative;width:${W}px;height:${H}px;padding:90px 96px;display:flex;flex-direction:column;justify-content:space-between}
  .grain{position:absolute;inset:0;opacity:.5;
    background-image:repeating-linear-gradient(0deg, rgba(255,255,255,.012) 0 1px, transparent 1px 3px);
    pointer-events:none}
  .content{position:relative;z-index:2;display:flex;flex-direction:column;gap:34px;max-width:1240px;margin-top:18px}

  .kicker{display:inline-flex;align-items:center;gap:14px;align-self:flex-start;
    font-family:"JetBrains Mono",monospace;font-weight:700;font-size:24px;letter-spacing:.30em;
    color:var(--signal);border:1px solid var(--signal-dim);border-radius:999px;
    padding:12px 22px;background:rgba(194,245,63,.05)}
  .kicker .dot{width:11px;height:11px;border-radius:50%;background:var(--signal);
    box-shadow:0 0 16px 3px rgba(194,245,63,.7)}

  .headline{font-weight:800;font-size:96px;line-height:1.02;letter-spacing:-.02em;color:var(--text)}
  .headline.mid{font-size:72px}
  .headline.small{font-size:60px}
  .headline.quote{font-size:88px;font-weight:700;font-style:italic;letter-spacing:-.015em}
  .subline{font-size:36px;line-height:1.35;color:var(--dim);font-weight:500;max-width:1120px}

  .stat-wrap{display:flex;flex-direction:column;gap:6px}
  .stat{font-family:"JetBrains Mono",monospace;font-weight:700;font-size:230px;line-height:.9;
    color:var(--signal);letter-spacing:-.03em;text-shadow:0 0 60px rgba(194,245,63,.35)}
  .stat-label{font-size:34px;color:var(--dim);font-weight:600}

  .cmp{display:flex;align-items:stretch;gap:30px;margin-top:6px}
  .col{flex:1;border:1px solid var(--line);border-radius:22px;padding:34px 36px;background:var(--surface)}
  .col .col-tag{font-family:"JetBrains Mono",monospace;font-size:20px;letter-spacing:.2em;font-weight:700;margin-bottom:16px}
  .col.old{opacity:.92}
  .col.old .col-tag{color:var(--danger)}
  .col.new{border-color:var(--signal-dim);background:linear-gradient(180deg, rgba(194,245,63,.07), rgba(194,245,63,.02))}
  .col.new .col-tag{color:var(--signal)}
  .col-text{font-size:34px;line-height:1.3;font-weight:600;color:var(--text)}
  .vs{display:flex;align-items:center;font-size:54px;color:var(--faint);font-weight:800}

  .quote-mark{font-family:"Archivo";font-size:200px;line-height:.6;color:var(--signal);opacity:.5;height:90px}
  .tip-tag,.col-tag{font-family:"JetBrains Mono",monospace}
  .tip-tag{align-self:flex-start;font-size:22px;letter-spacing:.22em;font-weight:700;color:var(--amber);
    border:1px solid rgba(255,181,71,.4);border-radius:999px;padding:8px 18px;background:rgba(255,181,71,.06)}

  .footer{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;
    border-top:1px solid var(--line);padding-top:34px}
  .brandmark{display:flex;align-items:center;gap:18px;font-weight:900;font-size:38px;letter-spacing:.04em}
  .handle{font-family:"JetBrains Mono",monospace;font-size:30px;color:var(--dim)}

  .scope{flex:none;border-radius:50%;border:1px solid var(--signal-dim);position:relative;overflow:hidden;
    background:radial-gradient(circle, rgba(194,245,63,.14), transparent 70%)}
  .scope::after{content:"";position:absolute;inset:0;border-radius:50%;
    background:conic-gradient(from 30deg, rgba(194,245,63,.7), transparent 30%)}
  .scope::before{content:"";position:absolute;inset:0;border-radius:50%;
    background:
      linear-gradient(rgba(194,245,63,.28),rgba(194,245,63,.28)) 50%/1px 100% no-repeat,
      linear-gradient(rgba(194,245,63,.28),rgba(194,245,63,.28)) 50%/100% 1px no-repeat}
  .brandmark .scope{width:46px;height:46px}
  .corner-scope{position:absolute;top:-220px;right:-220px;width:680px;height:680px;z-index:1;opacity:.5}
  `;
}

function grain(): string {
  return `<div class="grain"></div>`;
}
function cornerScope(): string {
  return `<div class="scope corner-scope"></div>`;
}
function miniScope(): string {
  return `<span class="scope"></span>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const CANVAS = { width: W, height: H };
