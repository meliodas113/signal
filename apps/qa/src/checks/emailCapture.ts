import type { Browser } from "playwright";
import { openPage, shot } from "../browser.js";
import { config } from "../config.js";
import type { Bug } from "../types.js";

/**
 * The early-access signup flow:
 *   - the input exists,
 *   - an invalid address is rejected client-side,
 *   - a valid submit reaches a *terminal* state (success or a presented error)
 *     rather than hanging on "Sending…" or throwing.
 *
 * This is backend-agnostic on purpose: on a local dev server without Supabase
 * env, a graceful "not configured" error is a pass — a stuck spinner or an
 * uncaught exception is a fail.
 */
export async function checkEmailCapture(browser: Browser, baseUrl: string): Promise<Bug[]> {
  const bugs: Bug[] = [];
  const b = await openPage(browser);
  const url = `${baseUrl}/#get`;

  await b.page.goto(url, { waitUntil: "load", timeout: 30_000 });
  await b.page.waitForTimeout(700);

  const email = b.page.locator('input[type="email"]').first();
  if ((await email.count()) === 0) {
    bugs.push({
      check: "email",
      key: "missing",
      title: "Email capture input not found",
      severity: "blocker",
      url,
      screenshotPath: await shot(b.page, "email_missing"),
      detail: "No `input[type=email]` was found — the signup form may be missing.",
    });
    await b.close();
    return bugs;
  }

  // 1. Invalid address → inline validation error.
  await email.fill("not-an-email");
  await email.press("Enter");
  await b.page.waitForTimeout(500);
  if ((await b.page.getByRole("alert").count()) === 0) {
    bugs.push({
      check: "email",
      key: "validation",
      title: "Invalid email is not rejected",
      severity: "high",
      url,
      screenshotPath: await shot(b.page, "email_no_validation"),
      detail: "Submitting `not-an-email` did not surface a validation error to the user.",
    });
  }

  // 2. Valid address → must settle (success OR presented error), never hang.
  await email.fill(config.testEmail);
  await email.press("Enter");
  const success = b.page.getByText(/on the list/i);
  let settled = false;
  for (let i = 0; i < 20; i++) {
    await b.page.waitForTimeout(500); // up to ~10s
    if ((await success.count()) > 0 || (await b.page.getByRole("alert").count()) > 0) {
      settled = true;
      break;
    }
  }
  if (!settled) {
    bugs.push({
      check: "email",
      key: "stuck",
      title: "Signup never resolves after submit",
      severity: "high",
      url,
      screenshotPath: await shot(b.page, "email_stuck"),
      detail: `Submitting a valid email (\`${config.testEmail}\`) never reached a success or error state within ~10s — the form appears stuck.`,
    });
  }

  if (b.pageErrors.length) {
    bugs.push({
      check: "email",
      key: "pageerror",
      title: "JS exception during signup",
      severity: "high",
      url,
      detail: `Uncaught error while submitting:\n\n\`\`\`\n${b.pageErrors.slice(0, 5).join("\n")}\n\`\`\``,
    });
  }

  await b.close();
  return bugs;
}
