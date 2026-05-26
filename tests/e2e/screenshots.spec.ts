import { test, expect, type Page, type TestInfo } from "@playwright/test";

/**
 * Visual screenshot suite. Each test navigates to a route, optionally drives a
 * specific interaction state, and saves a full-page PNG into
 * `test-results/screenshots/<project>/`. The goal is reviewable artifacts, not
 * pixel-diff regression — assertions are limited to "page rendered".
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

test.describe("entry page", () => {
  test("idle hero", async ({ page }, info) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Hey\. Who do you want to meet\?/i }),
    ).toBeVisible();
    await snapshot(page, info, "01-entry-idle");
  });

  test("browse choice hovered", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "hover preview is desktop-only");
    await page.goto("/");
    await page
      .getByRole("button", { name: /Just looking around/i })
      .hover();
    await snapshot(page, info, "02-entry-hover-browse");
  });

  test("match choice hovered", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "hover preview is desktop-only");
    await page.goto("/");
    await page
      .getByRole("button", { name: /Match me with someone/i })
      .hover();
    await snapshot(page, info, "03-entry-hover-match");
  });

  test("create choice hovered", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "hover preview is desktop-only");
    await page.goto("/");
    await page
      .getByRole("button", { name: /I have someone in mind/i })
      .hover();
    await snapshot(page, info, "04-entry-hover-create");
  });

  test("keyboard focus on first choice", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "focus preview is desktop-only");
    await page.goto("/");
    await page
      .getByRole("button", { name: /Just looking around/i })
      .focus();
    await snapshot(page, info, "05-entry-focus-browse");
  });
});

test.describe("downstream routes", () => {
  test("browse grid", async ({ page }, info) => {
    await page.goto("/browse");
    await snapshot(page, info, "10-browse");
  });

  test("browse with tag filter", async ({ page }, info) => {
    await page.goto("/browse");
    await page.getByRole("button", { name: /^cozy$/i }).click();
    await snapshot(page, info, "10b-browse-filtered");
  });

  test("browse empty state", async ({ page }, info) => {
    await page.goto("/browse");
    await page.getByPlaceholder(/search names/i).fill("zzznotreal");
    await snapshot(page, info, "10c-browse-empty");
  });

  test("character detail (iris)", async ({ page }, info) => {
    await page.goto("/c/iris");
    await snapshot(page, info, "11-character-iris");
  });

  test("match flow", async ({ page }, info) => {
    await page.goto("/match");
    await snapshot(page, info, "12-match");
  });

  test("create flow", async ({ page }, info) => {
    await page.goto("/create");
    await snapshot(page, info, "13-create");
  });

  test("chat with iris", async ({ page }, info) => {
    await page.goto("/chat/iris");
    await snapshot(page, info, "14-chat-iris");
  });
});
