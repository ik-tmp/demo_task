import { test, expect } from "@playwright/test";
import {
  answerChatPrelude,
  snapshot,
  driveToPaywall,
} from "./helpers";

// Collapse JS-paced animations (typing, narrated delays) to zero so the
// suite drives the flows at full speed. The app honors prefers-reduced-motion.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test.describe("Direction B — M1 Reel", () => {
  test("reel renders with companion + premise + affordances", async ({ page }, info) => {
    await page.goto("/");
    // Sasha is intentionally held for the last reel slot.
    const name = page.locator("h1").first();
    await expect(name).toBeVisible();
    await expect(name).toHaveText(/^(Iris|Noa|Mira)$/);

    // Host line and all three affordances.
    await expect(page.getByText(/who do you want to talk to first/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "show all companions" })).toBeVisible();
    await expect(page.getByRole("button", { name: "choose someone for me" })).toBeVisible();
    await expect(page.getByRole("button", { name: "describe who you want" })).toBeVisible();

    await snapshot(page, info, "b-01-reel-entry");
  });

  test("from=quiet leads with Iris (listener)", async ({ page }, info) => {
    await page.goto("/?from=quiet");
    const name = page.locator("h1").first();
    await expect(name).toHaveText("Iris");
    await snapshot(page, info, "b-02-reel-from-quiet");
  });

  test("affordance: pick for me navigates to Match", async ({ page }, info) => {
    await page.goto("/");
    await page.getByRole("button", { name: "choose someone for me" }).click();
    await expect(page).toHaveURL(/\/match/);
    await snapshot(page, info, "b-03-pick-for-me-routed");
  });
});

test.describe("Direction B — M3 Match", () => {
  test("match intro offers the question path", async ({ page }, info) => {
    await page.goto("/match");
    await expect(page.getByText(/I can pick someone faster/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^answer a few questions$/ }),
    ).toBeVisible();
    await snapshot(page, info, "b-08-match-intro");
  });

  test("match flow lands on a named reveal", async ({ page }, info) => {
    await page.goto("/match");
    await page.getByRole("button", { name: /^answer a few questions$/ }).click();
    await page.getByRole("button", { name: /^calmer$/ }).click();
    await page.getByRole("button", { name: /^listen first$/ }).click();
    await page.getByRole("button", { name: /^quiet and close$/ }).click();
    await page.getByRole("button", { name: /^no quick advice$/ }).click();
    await page.getByRole("button", { name: /^keep going$/ }).click();
    // Q4 (familiarity) may fire when iris/sasha tie — handle it.
    await page.waitForTimeout(150);
    const famVisible = await page
      .getByRole("button", { name: /^familiar$/ })
      .isVisible()
      .catch(() => false);
    if (famVisible) {
      await page.getByRole("button", { name: /^familiar$/ }).click();
    }

    await expect(page.getByText(/I think you should meet/i)).toBeVisible({
      timeout: 7000,
    });
    await expect(page.getByText(/why this match/i)).toBeVisible();
    await snapshot(page, info, "b-04-match-reveal");
  });

  test("show me another routes through rejection diagnostic", async ({ page }, info) => {
    await page.goto("/match");
    await page.getByRole("button", { name: /^answer a few questions$/ }).click();
    await page.getByRole("button", { name: /^calmer$/ }).click();
    await page.getByRole("button", { name: /^listen first$/ }).click();
    await page.getByRole("button", { name: /^quiet and close$/ }).click();
    await page.getByRole("button", { name: /^no quick advice$/ }).click();
    await page.getByRole("button", { name: /^keep going$/ }).click();
    await page.waitForTimeout(150);
    const famVisible = await page
      .getByRole("button", { name: /^familiar$/ })
      .isVisible()
      .catch(() => false);
    if (famVisible) {
      await page.getByRole("button", { name: /^familiar$/ }).click();
    }

    await expect(page.getByText(/I think you should meet/i)).toBeVisible({ timeout: 7000 });
    await page.getByRole("button", { name: /choose someone else/i }).click();
    await expect(
      page.getByText(/What was wrong: the look, the voice, or the energy/i),
    ).toBeVisible();
    await snapshot(page, info, "b-05-match-rejection");
  });
});

test.describe("Direction B — M4 Browse", () => {
  test("vignette funnel renders companion + samples", async ({ page }, info) => {
    await page.goto("/companion/iris");
    await expect(page.getByText("She listens first, then asks gentle questions.")).toBeVisible();
    await page.getByRole("button", { name: /show first messages/i }).click();
    // Sample lines should appear.
    await expect(
      page.getByText(/What are you reading these days/i),
    ).toBeVisible();
    await snapshot(page, info, "b-06-vignette-funnel");
  });

  test("gallery renders companions, paging works", async ({ page }, info) => {
    await page.goto("/gallery");
    await expect(page.locator("p.font-serif").first()).toBeVisible();
    const nextBtn = page.getByRole("button", { name: "next" });
    if (await nextBtn.isVisible()) {
      const firstName = await page.locator("p.font-serif").first().innerText();
      await nextBtn.click();
      // Wait for animation to settle so only the new vignette is in DOM.
      await page.waitForTimeout(600);
      const secondName = await page.locator("p.font-serif").first().innerText();
      expect(secondName).not.toBe(firstName);
    }
    await snapshot(page, info, "b-07-gallery");
  });
});

test.describe("Direction B — M5 First Chat + Paywall", () => {
  test("paywall surfaces after preview exchanges", async ({ page }, info) => {
    await page.goto("/chat/iris?from=match");
    await answerChatPrelude(page);
    // Wait for opener to finish typing.
    await expect(page.getByText(/won't try to fix your day/i)).toBeVisible({ timeout: 8000 });
    // Drive the branching conversation to the paywall beat by clicking
    // whichever suggested reply is offered each beat.
    await driveToPaywall(page);
    await expect(page.getByText(/keep talking with iris/i)).toBeVisible({
      timeout: 8000,
    });
    await snapshot(page, info, "b-09-paywall");
  });

  test("paywall unlock → conversation continues with bonus lines", async ({ page }) => {
    await page.goto("/chat/iris?from=match");
    await answerChatPrelude(page);
    await expect(page.getByText(/won't try to fix your day/i)).toBeVisible({ timeout: 8000 });
    await driveToPaywall(page);
    await expect(page.getByText(/keep talking with iris/i)).toBeVisible({ timeout: 8000 });
    await page.getByRole("button", { name: /^unlock unlimited$/i }).click();
    // The mock unlock streams the beat's bonus lines, proving the gate lifted.
    await expect(page.getByText(/glad you stayed/i)).toBeVisible({ timeout: 8000 });
    // And the input is re-enabled (premium, faked).
    await expect(page.getByPlaceholder(/say something to iris/i)).toBeEnabled();
  });
});

test.describe("Direction B — M6 Create", () => {
  test("create funnel composes a reveal", async ({ page }, info) => {
    await page.goto("/create");
    // Step 1 — feeling (multi-select)
    await page.getByRole("button", { name: /^warmth$/i }).click();
    await page.getByRole("button", { name: /^keep going$/i }).click();
    // Step 2 — role (single-select)
    await page.getByRole("button", { name: /^confidant$/i }).click();
    // Step 3 — voice (pick a sample)
    await page.getByRole("button", { name: /just got in/i }).click();
    // Step 4 — look (multi-select)
    await page.getByRole("button", { name: /^warm apartment$/i }).click();
    await page.getByRole("button", { name: /^keep going$/i }).click();
    // Step 5 — boundary
    await page.getByRole("button", { name: /^stay warm without flirting$/i }).click();
    // Step 6 — context
    await page.getByRole("button", { name: /^skip ahead$/i }).click();
    // Step 7 — name (pick suggestion)
    const nameBtn = page.getByRole("button", { name: /^Noa$|^Sasha$|^Mira$/i }).first();
    await nameBtn.click();
    // Reveal renders the "What you asked for" panel.
    await expect(page.getByText(/what you asked for/i)).toBeVisible({ timeout: 5000 });
    await snapshot(page, info, "b-10-create-reveal");
  });

  test("create reveal Meet routes to chat with from=create", async ({ page }) => {
    await page.goto("/create");
    await page.getByRole("button", { name: /^warmth$/i }).click();
    await page.getByRole("button", { name: /^keep going$/i }).click();
    await page.getByRole("button", { name: /^confidant$/i }).click();
    await page.getByRole("button", { name: /just got in/i }).click();
    await page.getByRole("button", { name: /^warm apartment$/i }).click();
    await page.getByRole("button", { name: /^keep going$/i }).click();
    await page.getByRole("button", { name: /^stay warm without flirting$/i }).click();
    await page.getByRole("button", { name: /^skip ahead$/i }).click();
    await page.getByRole("button", { name: /^Noa$|^Sasha$|^Mira$/i }).first().click();
    await expect(page.getByRole("button", { name: /^meet /i })).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: /^meet /i }).click();
    await expect(page).toHaveURL(/\/chat\/.+\?from=create/);
  });
});
