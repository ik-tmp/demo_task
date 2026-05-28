/**
 * Honors the user's `prefers-reduced-motion` setting for our JS-driven
 * pacing (typing animation, narrated-loading delays, paced reveals).
 * These are setTimeout-based, so CSS can't disable them — we gate them
 * here instead. Reduced motion collapses every artificial delay to zero,
 * which also lets the Playwright suite (emulating reduced motion) drive
 * the flows near-instantly.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Returns `ms`, or 0 when the user prefers reduced motion. */
export function motionMs(ms: number): number {
  return prefersReducedMotion() ? 0 : ms;
}

/** Returns `sec` (a Framer Motion duration), or 0 under reduced motion. */
export function motionSec(sec: number): number {
  return prefersReducedMotion() ? 0 : sec;
}
