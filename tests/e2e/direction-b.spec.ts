import { test, expect } from "@playwright/test";
import { snapshot, expectFaceSafeIntact } from "./helpers";

test.describe("Direction B — M1 Reel", () => {
  test("reel renders with companion + premise + affordances", async ({ page }, info) => {
    await page.goto("/");
    // One of the three companions must be visible by name as the first vignette.
    const name = page.locator("h1").first();
    await expect(name).toBeVisible();
    await expect(name).toHaveText(/^(Iris|Noa|Mira|Sasha)$/);

    // Host line and all three affordances.
    await expect(page.getByText(/who do you want to start with/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "see everyone" })).toBeVisible();
    await expect(page.getByRole("button", { name: "pick for me" })).toBeVisible();
    await expect(page.getByRole("button", { name: "describe someone else" })).toBeVisible();

    await snapshot(page, info, "b-01-reel-entry");
  });

  test("from=quiet leads with Iris (listener)", async ({ page }, info) => {
    await page.goto("/?from=quiet");
    const name = page.locator("h1").first();
    await expect(name).toHaveText("Iris");
    await snapshot(page, info, "b-02-reel-from-quiet");
  });

  test("face-safe region is intact on the reel", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expectFaceSafeIntact(page);
  });

  test("affordance: pick for me navigates to Match", async ({ page }, info) => {
    await page.goto("/");
    await page.getByRole("button", { name: "pick for me" }).click();
    await expect(page).toHaveURL(/\/match/);
    await snapshot(page, info, "b-03-pick-for-me-routed");
  });

  test("affordance: describe someone else navigates to Create", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "describe someone else" }).click();
    await expect(page).toHaveURL(/\/create/);
  });

  test("affordance: see everyone navigates to Gallery", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "see everyone" }).click();
    await expect(page).toHaveURL(/\/gallery/);
  });
});

test.describe("Direction B — M3 Match", () => {
  test("match flow lands on a named reveal", async ({ page }, info) => {
    await page.goto("/match");
    await page.getByRole("button", { name: /^start$/ }).click();
    await page.getByRole("button", { name: /^calmer$/ }).click();
    await page.getByRole("button", { name: /^listen$/ }).click();
    await page.getByRole("button", { name: /^not fix$/ }).click();
    await page.getByRole("button", { name: /^continue$/ }).click();
    // Q4 (familiarity) may fire when iris/sasha tie — handle it.
    await page.waitForTimeout(500);
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
    await expect(page.getByText(/why her/i)).toBeVisible();
    await snapshot(page, info, "b-04-match-reveal");
  });

  test("face-safe region intact during Match", async ({ page }) => {
    await page.goto("/match");
    await page.waitForLoadState("networkidle");
    await expectFaceSafeIntact(page);
  });

  test("pills persist as the funnel advances", async ({ page }) => {
    await page.goto("/match");
    await page.getByRole("button", { name: /^start$/ }).click();
    await page.getByRole("button", { name: /^calmer$/ }).click();
    // Wait for the next step to render — guarantees the previous step has unmounted.
    await expect(page.getByText(/lead, listen, tease, or ask/i)).toBeVisible();
    // Pill persists with the chosen answer.
    await expect(page.getByText("calmer", { exact: true })).toBeVisible();
  });

  test("show me another routes through rejection diagnostic", async ({ page }, info) => {
    await page.goto("/match");
    await page.getByRole("button", { name: /^start$/ }).click();
    await page.getByRole("button", { name: /^calmer$/ }).click();
    await page.getByRole("button", { name: /^listen$/ }).click();
    await page.getByRole("button", { name: /^not fix$/ }).click();
    await page.getByRole("button", { name: /^continue$/ }).click();
    await page.waitForTimeout(500);
    const famVisible = await page
      .getByRole("button", { name: /^familiar$/ })
      .isVisible()
      .catch(() => false);
    if (famVisible) {
      await page.getByRole("button", { name: /^familiar$/ }).click();
    }

    await expect(page.getByText(/I think you should meet/i)).toBeVisible({ timeout: 7000 });
    await page.getByRole("button", { name: /show me another/i }).click();
    await expect(
      page.getByText(/Was it the look, the voice, or the energy/i),
    ).toBeVisible();
    await snapshot(page, info, "b-05-match-rejection");
  });
});

test.describe("Direction B — M4 Browse", () => {
  test("vignette funnel renders companion + samples", async ({ page }, info) => {
    await page.goto("/companion/iris");
    await expect(page.getByText("Listens before she answers.")).toBeVisible();
    await page.getByRole("button", { name: /tell me more/i }).click();
    // Sample lines should appear.
    await expect(
      page.getByText(/What are you reading these days/i),
    ).toBeVisible();
    await snapshot(page, info, "b-06-vignette-funnel");
  });

  test("vignette funnel say hi routes to chat", async ({ page }) => {
    await page.goto("/companion/noa");
    await page.getByRole("button", { name: /^say hi to Noa$/i }).click();
    await expect(page).toHaveURL(/\/chat\/noa/);
  });

  test("face-safe respected on vignette funnel", async ({ page }) => {
    await page.goto("/companion/mira");
    await page.waitForLoadState("networkidle");
    await expectFaceSafeIntact(page);
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

  test("gallery refinement chip reorders without emptying", async ({ page }) => {
    await page.goto("/gallery");
    await page.getByRole("button", { name: /^sharper$/i }).first().click();
    await expect(page.locator("[data-pill='sharper']")).toBeVisible();
    await expect(page.locator("p.font-serif").first()).toBeVisible();
  });

  test("gallery deep-link with ?sharper=1 lands with refinement active", async ({ page }) => {
    await page.goto("/gallery?sharper=1");
    await expect(page.locator("[data-pill='sharper']")).toBeVisible();
  });
});

test.describe("Direction B — M5 First Chat + Paywall", () => {
  test("from=browse opens browse opener", async ({ page }, info) => {
    await page.goto("/chat/iris?from=browse");
    await expect(page.getByText(/looking for quiet/i)).toBeVisible({ timeout: 8000 });
    await snapshot(page, info, "b-08-chat-browse-opener");
  });

  test("from=match opens match opener", async ({ page }) => {
    await page.goto("/chat/iris?from=match");
    await expect(page.getByText(/no fixing, got it/i)).toBeVisible({ timeout: 8000 });
  });

  test("face-safe intact during chat", async ({ page }) => {
    await page.goto("/chat/iris?from=match");
    await page.waitForLoadState("networkidle");
    await expectFaceSafeIntact(page);
  });

  test("paywall surfaces after preview exchanges", async ({ page }, info) => {
    await page.goto("/chat/iris?from=match");
    // Wait for opener to finish typing.
    await expect(page.getByText(/no fixing, got it/i)).toBeVisible({ timeout: 8000 });
    // Use suggested replies to drive the conversation forward 3 times.
    for (let i = 0; i < 3; i += 1) {
      const suggested = page.getByRole("button", { name: /long one|tell me about you|not sure/i }).first();
      await suggested.waitFor({ state: "visible", timeout: 5000 });
      await suggested.click();
      // Give the companion time to respond.
      await page.waitForTimeout(1800);
    }
    await expect(page.getByText(/keep talking with iris/i)).toBeVisible({
      timeout: 5000,
    });
    await snapshot(page, info, "b-09-paywall");
  });

  test("from=create opens create opener", async ({ page }) => {
    await page.goto("/chat/iris?from=create");
    await expect(page.getByText(/you said warm and patient/i)).toBeVisible({
      timeout: 8000,
    });
  });

  test("paywall continue → mock success state", async ({ page }) => {
    await page.goto("/chat/iris?from=match");
    await expect(page.getByText(/no fixing, got it/i)).toBeVisible({ timeout: 8000 });
    for (let i = 0; i < 3; i += 1) {
      const suggested = page.getByRole("button", { name: /long one|tell me about you|not sure/i }).first();
      await suggested.waitFor({ state: "visible", timeout: 5000 });
      await suggested.click();
      await page.waitForTimeout(1800);
    }
    await page.getByRole("button", { name: /^continue$/ }).click();
    await expect(page.getByText(/you're in. keep going/i)).toBeVisible();
  });
});

test.describe("Direction B — M6 Create", () => {
  test("create funnel composes a reveal", async ({ page }, info) => {
    await page.goto("/create");
    // Step 1 — feeling (multi-select)
    await page.getByRole("button", { name: /^warmth$/i }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();
    // Step 2 — role (single-select)
    await page.getByRole("button", { name: /^confidant$/i }).click();
    // Step 3 — voice (pick a sample)
    await page.getByRole("button", { name: /just got in/i }).click();
    // Step 4 — look (multi-select)
    await page.getByRole("button", { name: /^warm apartment$/i }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();
    // Step 5 — name (pick suggestion)
    const nameBtn = page.getByRole("button", { name: /^Noa$|^Sasha$|^Mira$/i }).first();
    await nameBtn.click();
    // Reveal renders the "What shaped them" panel.
    await expect(page.getByText(/what shaped them/i)).toBeVisible({ timeout: 5000 });
    await snapshot(page, info, "b-10-create-reveal");
  });

  test("face-safe respected during Create", async ({ page }) => {
    await page.goto("/create");
    await page.waitForLoadState("networkidle");
    await expectFaceSafeIntact(page);
  });

  test("create reveal Meet routes to chat with from=create", async ({ page }) => {
    await page.goto("/create");
    await page.getByRole("button", { name: /^warmth$/i }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page.getByRole("button", { name: /^confidant$/i }).click();
    await page.getByRole("button", { name: /just got in/i }).click();
    await page.getByRole("button", { name: /^warm apartment$/i }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page.getByRole("button", { name: /^Noa$|^Sasha$|^Mira$/i }).first().click();
    await expect(page.getByRole("button", { name: /^meet /i })).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: /^meet /i }).click();
    await expect(page).toHaveURL(/\/chat\/.+\?from=create/);
  });
});
