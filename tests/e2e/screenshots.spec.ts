import { test, expect, type Page, type TestInfo } from "@playwright/test";

/**
 * Visual screenshot suite. The assertions only confirm that the intended state
 * rendered; the PNGs in test-results/screenshots are the review artifact.
 */

const SETTLE_MS = 700;

async function settle(page: Page) {
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(SETTLE_MS);
}

async function snapshot(page: Page, info: TestInfo, name: string) {
  await settle(page);
  await page.screenshot({
    path: `test-results/screenshots/${info.project.name}/${name}.png`,
    fullPage: true,
    animations: "disabled",
  });
}

test.describe("portrait-first funnel", () => {
  test("entry shell", async ({ page }, info) => {
    await page.goto("/");
    await expect(
      page.getByText("Hey. What kind of company would feel good right now?"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /I'm waiting for someone else/i }),
    ).toBeVisible();
    await snapshot(page, info, "01-entry-shell");
  });

  test("quick match reveal", async ({ page }, info) => {
    await page.goto("/");
    await page.getByRole("button", { name: /choose someone for me/i }).click();
    await page.getByRole("button", { name: /^calmer$/i }).click();
    await page.getByRole("button", { name: /^listen$/i }).click();
    await page.getByRole("button", { name: /^pressure$/i }).click();

    await expect(page.getByText(/I think you should meet/i)).toBeVisible();
    await snapshot(page, info, "02-match-reveal");
  });

  test("specific companion preview", async ({ page }, info) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: /I'm waiting for someone else/i })
      .click();
    await page.getByRole("button", { name: /^warmth$/i }).click();
    await page.getByRole("button", { name: /^mentor$/i }).click();
    await page.getByRole("button", { name: /No fixing/i }).click();
    await page.getByRole("button", { name: /^slow$/i }).click();
    await page.getByRole("button", { name: /^no fixing$/i }).click();
    await page.getByRole("button", { name: /^after work$/i }).click();
    await page.getByRole("button", { name: /^warm apartment$/i }).click();
    await page.getByRole("button", { name: /^Noa$/i }).click();

    await expect(page.getByText("Noa is ready to say hello.")).toBeVisible();
    await snapshot(page, info, "03-specific-preview");
  });

  test("back preserves earlier answers", async ({ page }, info) => {
    await page.goto("/");
    await page.getByRole("button", { name: /choose someone for me/i }).click();
    await page.getByRole("button", { name: /^calmer$/i }).click();
    await page.getByLabel("Go back").click();

    await expect(
      page.getByText("When they answer, what should you feel?"),
    ).toBeVisible();
    await expect(page.getByText("choose someone for me")).toBeVisible();
    await snapshot(page, info, "03b-back-preserves-context");
  });

  test("session survives refresh", async ({ page }, info) => {
    await page.goto("/");
    await page.getByRole("button", { name: /stay with you/i }).click();
    await expect(page.getByText(/What feels easy to say first/i)).toBeVisible();

    await page.reload();
    await expect(page.getByText(/What feels easy to say first/i)).toBeVisible();
    await snapshot(page, info, "03c-session-refresh");
  });

  test("first chat continuation gate", async ({ page }, info) => {
    await page.goto("/");
    await page.getByRole("button", { name: /stay with you/i }).click();
    await page.getByRole("button", { name: /tell me about your day/i }).click();
    await page.getByRole("button", { name: /keep talking/i }).click();

    await expect(page.getByText(/Keep talking with Mira/i)).toBeVisible();
    await snapshot(page, info, "04-preview-paywall");
  });

  test("paywall restore error", async ({ page }, info) => {
    await page.goto("/");
    await page.getByRole("button", { name: /stay with you/i }).click();
    await page.getByRole("button", { name: /tell me about your day/i }).click();
    await page.getByRole("button", { name: /keep talking/i }).click();
    await page.getByRole("button", { name: /restore access/i }).click();

    await expect(
      page.getByText("That did not go through. Nothing changed."),
    ).toBeVisible();
    await snapshot(page, info, "04b-paywall-error");
  });

  test("browse best-fit fallback", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop panel includes search");
    await page.goto("/browse");
    await page.getByRole("button", { name: /^calm$/i }).click();
    await page.getByLabel("Search companions").fill("zzznotreal");

    await expect(
      page.getByText("I found a few that feel close."),
    ).toBeVisible();
    await snapshot(page, info, "05-browse-fallback");
  });

  test("direct chat route", async ({ page }, info) => {
    await page.goto("/chat/iris");
    await expect(
      page.getByText(/You found me through the quiet ones/i),
    ).toBeVisible();
    await snapshot(page, info, "06-direct-chat");
  });
});
