import type { Browser } from "playwright";
import { openPage, shot } from "../browser.js";
import type { Bug } from "../types.js";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

/** Flag horizontal overflow (content wider than the viewport) per breakpoint. */
export async function checkResponsive(browser: Browser, baseUrl: string): Promise<Bug[]> {
  const bugs: Bug[] = [];
  const url = `${baseUrl}/`;

  for (const vp of VIEWPORTS) {
    const b = await openPage(browser, { width: vp.width, height: vp.height });
    await b.page.goto(url, { waitUntil: "load", timeout: 30_000 });
    await b.page.waitForTimeout(700);

    const overflow = await b.page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const offenders: string[] = [];
      if (docW > winW + 2) {
        document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > winW + 2 && r.width > 1) {
            const tag = el.tagName.toLowerCase();
            const cls =
              typeof el.className === "string" && el.className.trim()
                ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
                : "";
            offenders.push(`${tag}${cls} (right=${Math.round(r.right)})`);
          }
        });
      }
      return { docW, winW, offenders: [...new Set(offenders)].slice(0, 8) };
    });

    if (overflow.docW > overflow.winW + 2) {
      bugs.push({
        check: "responsive",
        key: `overflow:${vp.name}`,
        title: `Horizontal overflow on ${vp.name} (${vp.width}px)`,
        severity: "medium",
        url,
        viewport: `${vp.name} ${vp.width}×${vp.height}`,
        screenshotPath: await shot(b.page, `responsive_${vp.name}`),
        detail:
          `Page is **${overflow.docW}px** wide on a **${overflow.winW}px** viewport, ` +
          `causing horizontal scroll.\n\nLikely offenders:\n\n\`\`\`\n${overflow.offenders.join("\n")}\n\`\`\``,
      });
    }

    await b.close();
  }

  return bugs;
}
