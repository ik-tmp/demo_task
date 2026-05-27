import { expect, type Page, type TestInfo } from "@playwright/test";

const SETTLE_MS = 700;

export async function settle(page: Page) {
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(SETTLE_MS);
}

export async function snapshot(page: Page, info: TestInfo, name: string) {
  await settle(page);
  await page.screenshot({
    path: `test-results/screenshots/${info.project.name}/${name}.png`,
    fullPage: true,
    animations: "disabled",
  });
}

/**
 * Asserts that no chat sheet (data-chat-sheet) overlaps the face-safe
 * region of its FaceSafeFrame parent. Backs DIRECTION-B §13.
 */
export async function expectFaceSafeIntact(page: Page) {
  const violation = await page.evaluate(() => {
    const frames = Array.from(
      document.querySelectorAll<HTMLElement>("[data-face-safe-frame]"),
    );
    for (const frame of frames) {
      const rect = frame.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(frame).getPropertyValue("--face-safe-top"));
      const heightPct = parseFloat(
        getComputedStyle(frame).getPropertyValue("--face-safe-height"),
      );
      const faceTop = rect.top + (rect.height * top) / 100;
      const faceBottom = faceTop + (rect.height * heightPct) / 100;
      const overlays = frame.querySelectorAll<HTMLElement>("[data-face-safe-respects]");
      for (const overlay of overlays) {
        const oRect = overlay.getBoundingClientRect();
        if (oRect.top < faceBottom && oRect.bottom > faceTop) {
          return {
            face: { top: faceTop, bottom: faceBottom },
            overlay: { top: oRect.top, bottom: oRect.bottom, tag: overlay.tagName },
          };
        }
      }
    }
    return null;
  });
  expect(violation, "face-safe region must never overlap a chat sheet or overlay").toBeNull();
}
