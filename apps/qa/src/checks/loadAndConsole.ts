import type { Browser } from "playwright";
import { openPage, shot } from "../browser.js";
import type { Bug } from "../types.js";

const ROUTES = [
  { hash: "", name: "home" },
  { hash: "#/about", name: "about" },
];

/** Every route loads, renders, and produces no JS/console/network/image errors. */
export async function checkLoadAndConsole(browser: Browser, baseUrl: string): Promise<Bug[]> {
  const bugs: Bug[] = [];

  for (const route of ROUTES) {
    const url = `${baseUrl}/${route.hash}`;
    const b = await openPage(browser);

    let status = 0;
    try {
      const resp = await b.page.goto(url, { waitUntil: "load", timeout: 30_000 });
      status = resp?.status() ?? 0;
    } catch (e) {
      bugs.push({
        check: "load",
        key: `nav:${route.name}`,
        title: `Page fails to load: ${route.name}`,
        severity: "blocker",
        url,
        detail: `Navigating to \`${url}\` threw:\n\n\`\`\`\n${err(e)}\n\`\`\``,
      });
      await b.close();
      continue;
    }

    // Let the SPA hydrate/render.
    await b.page.waitForTimeout(800);

    if (status >= 400) {
      bugs.push({
        check: "load",
        key: `status:${route.name}`,
        title: `${route.name} returned HTTP ${status}`,
        severity: "blocker",
        url,
        detail: `Expected a 2xx response, got **${status}**.`,
      });
    }

    const brokenImgs: string[] = await b.page.$$eval("img", (imgs) =>
      imgs
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src),
    );

    const hasFindings =
      b.pageErrors.length > 0 ||
      b.consoleErrors.length > 0 ||
      b.failedRequests.length > 0 ||
      brokenImgs.length > 0;
    const screenshotPath = hasFindings ? await shot(b.page, `load_${route.name}`) : undefined;

    if (b.pageErrors.length) {
      bugs.push({
        check: "load",
        key: `pageerror:${route.name}`,
        title: `Uncaught JS error on ${route.name}`,
        severity: "high",
        url,
        screenshotPath,
        detail: `Uncaught exception(s):\n\n\`\`\`\n${b.pageErrors.slice(0, 5).join("\n")}\n\`\`\``,
      });
    }
    if (b.consoleErrors.length) {
      bugs.push({
        check: "load",
        key: `console:${route.name}`,
        title: `Console errors on ${route.name}`,
        severity: "medium",
        url,
        screenshotPath,
        detail: `\`console.error\` output:\n\n\`\`\`\n${b.consoleErrors.slice(0, 8).join("\n")}\n\`\`\``,
      });
    }
    if (b.failedRequests.length) {
      bugs.push({
        check: "load",
        key: `netfail:${route.name}`,
        title: `Failed network requests on ${route.name}`,
        severity: "high",
        url,
        screenshotPath,
        detail: `Requests returning ≥ 400:\n\n\`\`\`\n${b.failedRequests.slice(0, 10).join("\n")}\n\`\`\``,
      });
    }
    if (brokenImgs.length) {
      bugs.push({
        check: "load",
        key: `img:${route.name}`,
        title: `Broken images on ${route.name}`,
        severity: "medium",
        url,
        screenshotPath,
        detail: `Images that failed to load:\n\n\`\`\`\n${brokenImgs.join("\n")}\n\`\`\``,
      });
    }

    await b.close();
  }

  return bugs;
}

function err(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
