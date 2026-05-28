# Implementation Tracker

Last updated: May 28, 2026

This document tracks the active Casting Hall implementation described in `docs/DIRECTION-B.md`. Direction A and the earlier proposal docs have been removed so this tracker is the only implementation status document.

## Status Key

- `[x]` Done
- `[~]` Partial or needs polish
- `[ ]` Not started

## Current App Shape

- `[x]` `/` renders the cinematic reel through `src/components/reel/reel.tsx`.
- `[x]` `/gallery` renders the full-screen companion gallery.
- `[x]` `/companion/[id]` renders the short browse/vignette funnel.
- `[x]` `/match` renders quick match.
- `[x]` `/create` renders create/specific-companion composition.
- `[x]` `/chat/[id]` renders preview chat and the mock paywall.
- `[x]` Retired Direction A routes are gone from `src/app`; there is no `/browse` or `/c/[id]`.

## Implemented Surfaces

- `[x]` Companion data model
  - `src/data/companions.json` contains Iris, Noa, Mira, and Sasha.
  - Each record includes premise, energy, scene, assets, face-safe geometry, ranking weights, tag axes, sample lines, openers, and rationale copy.
  - `src/types/companion.ts` defines the typed shape.

- `[x]` Reel cold open
  - Full-bleed reel with generated `*-reel.png` assets.
  - Client-side ranking uses time of day, `?from=`, prior rejection ids, and deterministic jitter.
  - Sasha is present as the fourth cast member but sorted after the first three launch energies.
  - Users can open a companion, show all companions, choose someone, or describe who they want.

- `[x]` Shared funnel shell and layout primitives
  - `FunnelShell` provides the portrait/chat layout used by browse, match, create, and chat.
  - `FaceSafeFrame` exposes face-safe CSS variables.
  - Mobile chat surfaces are capped below the face-safe region and scroll internally.
  - Desktop uses a fixed 34/66 chat/portrait split in the shared shell.
  - Standalone `ChatSheet` and `DesktopSplit` primitives exist, though the current shell implements its own layout.

- `[x]` Browse path
  - Tapping a reel face opens `VignetteFunnel`.
  - Users can say hi, view sample first messages, ask up to three deterministic preview questions, show softer/sharper, or open the gallery.
  - Gallery uses a best-fit hero vignette plus a portrait-tile grid, a create tile, and locked placeholder tiles behind the mock paywall, with search, refinement chips, ranking, persistent pills, and best-fit ordering.

- `[x]` Match path
  - Match asks feeling, role, message texture, avoidances, and optional familiarity.
  - The candidate portrait resolves from blurred to sharp.
  - Reveal lines and "why this match" bullets are composed from the user's answers.
  - Rejection asks look/voice/energy and routes to another reveal or create after two misses.

- `[x]` Create path
  - Create asks feeling, role, voice sample, look, boundary, context, and name.
  - Free text can back-fill inferred pills and skip forward.
  - In-progress vignette stages are shown while the user answers.
  - Reveal can use either a launch companion or a dedicated generated template.
  - "What you asked for" and first-message preview are shown before chat.

- `[x]` First chat and paywall
  - Chat asks for a name/alias and one context line when missing.
  - First messages are personalized by source: browse, match, create, or direct.
  - Deterministic chat branches run for the preview.
  - Paywall appears only after the preview is spent.
  - Mock unlock streams bonus lines and re-enables the input.

- `[x]` Assets
  - Iris, Noa, Mira, and Sasha each have reel, neutral, warm, curious, closer, and final-chat assets.
  - Mira still has legacy desktop and thumbnail subdirectories; current loaders support that shape.
  - Create in-progress stages, create templates, and shared fallback assets exist.
  - Asset prompts and inventory live in `docs/ASSET-PROMPTS.md`.

- `[x]` Playwright coverage
  - `tests/e2e/direction-b.spec.ts` covers reel, `?from=quiet` ranking, match reveal/rejection, vignette funnel, gallery, first chat/paywall, and create reveal/chat handoff.
  - Screenshots are written under `test-results/screenshots/{desktop,mobile}/`.

## Known Gaps

- `[~]` Face-safe tests
  - `expectFaceSafeIntact` exists in `tests/e2e/helpers.ts`, but the Direction B specs do not currently call it.
  - Add assertions for reel, funnel, reveal, chat, paywall, and gallery breakpoints.

- `[~]` Gallery placeholders
  - Locked placeholder tiles (`src/data/gallery-placeholders.ts`) use gradient stand-ins; real generated portraits still need to be produced and wired in (set `asset`, flip `locked`).

- `[~]` Match branch nuance
  - Dynamic familiarity Q4 exists.
  - The "I don't know yet" softer branch is not a distinct question yet; it currently continues through the standard flow.
  - "Show similar" from the original spec is not a separate action.

- `[~]` Create polish
  - Boundary is always part of the current flow rather than only appearing when signal demands it.
  - The reveal does not include the final adjust row yet.
  - Synthetic template reveals route into the nearest launch companion chat instead of a fully synthetic chat identity.

- `[~]` Recovery states
  - Gallery never empties and preview matching always produces a candidate.
  - Sensitive-input guard, explicit image-load failure copy, chat send retry, and paywall error state still need implementation.

- `[~]` Layout primitive cleanup
  - `ChatSheet` and `DesktopSplit` are available but not wired into the current `FunnelShell`.
  - Either adopt them in the shell or remove them if they stay unused after layout tests land.

## Next Priorities

1. Wire `expectFaceSafeIntact` into the e2e suite and add viewport-specific layout checks.
2. Review generated screenshots for reel, match, create, chat, and paywall after the current uncommitted UI work settles.
3. Finish gallery mobile paging/swipe behavior or explicitly revise the spec if the current gallery is the intended MVP.
4. Add create reveal adjust chips and improve synthetic-template chat handoff.
5. Add recovery states: sensitive-input guard, image fallback copy, chat retry, paywall error.

## Verification Guidance

For meaningful code changes, run:

```bash
npm run lint
npm run typecheck
npm run build
```

For visible UI changes, also run:

```bash
npm run test:e2e
```

Review the screenshots under:

- `test-results/screenshots/desktop/`
- `test-results/screenshots/mobile/`

Face-safe regressions are bugs, not polish. Chat sheets, paywalls, host copy, and controls must not overlap the companion's face-safe region.
