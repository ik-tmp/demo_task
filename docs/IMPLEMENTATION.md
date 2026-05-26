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
- `[~]` Design tokens, font loading, primitives
  - Global dark theme, Google fonts, and first-pass UI primitives exist.
  - Needs a dedicated polish pass for spacing, responsive states, and component coverage.
- `[~]` Character seed data
  - Four seed characters exist in `src/data/characters.json`.
  - Plan calls for roughly fourteen with fuller metadata, related-character overlap, voice samples, chat branches, and avatar keys.
- `[~]` Funnel shell and morphing UI
  - Opening question is implemented with chip choices, hover/focus accent shift, and session-backed branch selection.
  - Needs shared-layout transitions, back preservation behavior, resume state, and deeper branch step wiring.
- `[~]` Browse path
  - Discovery grid, character cards, character detail pages, and chat handoff exist as scaffolded UI.
  - Search, filters, sort behavior, skeletons, empty states, related characters, and image-fallback states are not implemented yet.
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
- `[ ]` Mobile pass
  - Layouts use responsive primitives.
  - Needs real viewport testing and fixes for funnel, browse, detail, create preview, and chat.
- `[ ]` Motion pass
  - Basic CSS transition on the entry background exists.
  - Needs route/step transitions, reveal timing, filter sheet gesture work, and final motion tuning.
- `[ ]` Demo polish
  - Needs refresh restore, back preservation, abandon/resume, and a full walkthrough.

## Current Version Pins

- Next.js `16.2.6`
- React `19.2.6`
- TypeScript `6.0.3`
- Tailwind CSS `4.3.0`
- Framer Motion `12.40.0`
- Zustand `5.0.13`
- Lucide React `1.16.0`

## Next Build Step

Build out the first real vertical slice: opening funnel -> browse grid -> character detail -> chat, including deterministic state handoff and the main empty/error states for that path.
