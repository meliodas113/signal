import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, type Browser, type ConsoleMessage, type Page } from "playwright";
import { config } from "./config.js";

export interface PageBundle {
  page: Page;
  /** console.error output collected since the page opened. */
  consoleErrors: string[];
  /** uncaught exceptions (window 'error'/'unhandledrejection'). */
  pageErrors: string[];
  /** HTTP responses with status >= 400. */
  failedRequests: string[];
  /** Closes the page and its context. */
  close: () => Promise<void>;
}

export async function launchBrowser(): Promise<Browser> {
  return chromium.launch({ headless: true });
}

export async function openPage(
  browser: Browser,
  viewport: { width: number; height: number } = { width: 1440, height: 900 },
): Promise<PageBundle> {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();

  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on("console", (m: ConsoleMessage) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => pageErrors.push(e.message));
  page.on("response", (r) => {
    const s = r.status();
    if (s >= 400) failedRequests.push(`${s} ${r.url()}`);
  });

  return { page, consoleErrors, pageErrors, failedRequests, close: () => ctx.close() };
}

/** Capture a full-page screenshot into output/shots and return its path. */
export async function shot(page: Page, name: string): Promise<string> {
  await mkdir(config.shotsDir, { recursive: true });
  const file = resolve(config.shotsDir, `${Date.now()}_${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}
