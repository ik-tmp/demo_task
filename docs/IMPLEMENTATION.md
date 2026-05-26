# Implementation Tracker

Last updated: May 26, 2026

This document tracks implementation progress against `docs/PLAN.md`. Keep it factual: mark what exists in the repo, what is partial, and what still needs a build pass.

## Status Key

- `[x]` Done
- `[~]` Partial
- `[ ]` Not started

## Milestones

- `[x]` Initial project setup
  - Next.js App Router, React, TypeScript, Tailwind, Zustand, Framer Motion, Lucide, ESLint, and Prettier are installed.
  - Route skeletons exist for `/`, `/browse`, `/c/[id]`, `/match`, `/create`, and `/chat/[id]`.
  - `npm run lint`, `npm run typecheck`, `npm run build`, and `npm audit --audit-level=moderate` pass.
- `[x]` Design tokens, font loading, primitives
  - Token layer in `src/app/globals.css` covers ink/copy/accent palettes, radii (`card`/`tile`/`pill`), shadows (`soft`/`deep`/`glow`), easings, drift/shimmer/pulse keyframes, and a `.grain` overlay.
  - Primitives in `src/components/ui/`: `Surface`, `Display`, `Eyebrow`, `Button`, `IconButton`, `Chip`, `ChoiceCard`, `Card`, `Avatar`, `Tag`, `MessageBubble`, `Field`.
  - Reused across the entry redesign; downstream pages still on first-pass scaffold styling.
- `[~]` Character seed data
  - Four seed characters exist in `src/data/characters.json`.
  - Plan calls for roughly fourteen with fuller metadata, related-character overlap, voice samples, chat branches, and avatar keys.
- `[~]` Funnel shell and morphing UI
  - Entry page (`/`) rebuilt: hero question, three `ChoiceCard`s, morphing `Surface` accent tied to hover/focus, side preview panel that crossfades between Browse / Match / Create states using Framer Motion.
  - Still missing: shared-layout transitions into the destination routes, back preservation, resume-on-return ("pick up where you left off"), deeper branch step wiring.
- `[~]` Browse path
  - Browse page rebuilt with `Surface`, `Display`, `Eyebrow`, instant search, multi-select tag filter chips, and Popular/New sort. Empty state with clear-filters action. Filter/sort logic lives in `src/lib/browse.ts`.
  - Character detail rebuilt with accent `Surface`, xl `Avatar`, sample dialogue rendered through `MessageBubble`, "similar in mood" tag-overlap related row reusing `CharacterCard`, back-to-browse link.
  - Reusable `CharacterCard` extracted in `src/components/character-card.tsx`.
  - Still pending: filter sheet/sort animation, skeleton loading, "Recommended for you" sort surfaced when arriving from Match/Create, image-fallback hardening.
- `[ ]` Match flow
  - First question surface exists only as static scaffold.
  - Needs question state, scoring, narrated interstitial, reveal, rationale, rerun, and browse fallback.
- `[ ]` Create flow
  - First archetype surface and preview placeholder exist only as static scaffold.
  - Needs progressive steps, multi-select traits, voice previews, name/avatar step, optional freeform field, live preview, and chat handoff.
- `[~]` Chat terminus
  - Basic chat shell exists with seeded opener and suggested-reply chips.
  - Needs arrival-aware opener logic, canned response branches, simulated send failure, input behavior, and generic degradation after the first designed turns.
- `[ ]` States pass
  - Empty, loading, error, and edge states from the plan still need systematic implementation.
- `[ ]` Copy pass
  - Initial copy follows the planned tone.
  - Needs a full review after all flows are functional.
- `[~]` Mobile pass
  - Entry page verified at 390×844 via Playwright; hero stacks cleanly, preview is hidden, choices full-width.
  - Other surfaces need real viewport testing and fixes.
- `[~]` Motion pass
  - Entry has Framer Motion crossfades on the preview panel, accent drift on the surface, and a live-pulse dot.
  - Step transitions across the funnel and shared-layout work into route destinations still pending.
- `[ ]` Demo polish
  - Needs refresh restore, back preservation, abandon/resume, and a full walkthrough.

## Visual Regression / Screenshots

- Playwright is wired in `playwright.config.ts` and `tests/e2e/screenshots.spec.ts`.
- Two projects run: `desktop` (1440×900) and `mobile` (390×844, Chromium-based Pixel emulation).
- The suite captures:
  - `01-entry-idle` — entry page resting state
  - `02..04-entry-hover-{browse,match,create}` — desktop hover/preview morphs
  - `05-entry-focus-browse` — keyboard-focus morph
  - `10-browse`, `10b-browse-filtered`, `10c-browse-empty` — discovery surface in three states
  - `11-character-iris`, `12-match`, `13-create`, `14-chat-iris` — remaining downstream routes
- Run: `npm run test:e2e` (boots a production server on 4321) or `npm run test:e2e:desktop`. Outputs land in `test-results/screenshots/<project>/` and are gitignored.

## Current Version Pins

- Next.js `16.2.6`
- React `19.2.6`
- TypeScript `6.0.3`
- Tailwind CSS `4.3.0`
- Framer Motion `12.40.0`
- Zustand `5.0.13`
- Lucide React `1.16.0`
- @playwright/test `^1.60.0`

## Next Build Step

Build the Match flow on top of the funnel shell: question state machine for 3–4 questions, deterministic scoring in `src/lib/match.ts` against the existing tag pool, a narrated interstitial that types out the user's selections, and a reveal that drops into the existing character detail or chat surface. Add "Show me someone else" and "Let me see all of them" CTAs so a bad match degrades to Browse.
