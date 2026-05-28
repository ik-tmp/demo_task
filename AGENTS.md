# AGENTS.md

Guidance for coding agents working in this repository.

## Project Shape

This is a frontend-only Next.js prototype for the AI companion entry experience described in `docs/DIRECTION-B.md`. The active direction is **Casting Hall**: a cinematic reel introduces the cast before the user enters browse, quick match, or create.

The core product promise is the path from app open to the user's first preview conversation:

- A full-bleed companion reel is visible immediately.
- The reel introduces Iris, Noa, Mira, and Sasha with cinematic portrait assets.
- Users can tap a face, show all companions, ask the app to choose, or describe who they want.
- Browse, match, and create share a portrait-first funnel shell after the reel.
- The companion portrait or vignette changes as the user answers.
- The first conversation starts before any paywall appears.
- A mocked paywall appears only when the user tries to continue beyond the preview conversation.

Do not add a backend, auth, account persistence, analytics, real payments, real model calls, runtime image generation, or full moderation surfaces unless the plan changes. "AI" behavior should stay deterministic and localized behind functions that can later be replaced with model calls.

## Current Product Decisions

- `docs/DIRECTION-B.md` is the active product/design source of truth.
- `docs/IMPLEMENTATION.md` tracks current progress and known gaps.
- The app opens on the reel, not on a single default companion.
- Creation is framed as "describe who you want", not "help me make someone".
- The funnel should always produce a viable companion or reveal. If answers are restrictive, broaden silently and show the best fit.
- The paywall is for continuing beyond preview chat, not for starting the first chat.
- Generated realistic portrait assets are central to the product direction. Use `design/` and `public/companions/` as visual references.

## Current Implementation Status

The codebase now has Direction B surfaces:

- `/` renders the reel.
- `/gallery` renders the hero + grid gallery (best-fit hero, companion tiles, a create tile, and locked placeholder tiles behind the mock paywall).
- `/companion/[id]` renders a browse/vignette funnel.
- `/match` renders quick match.
- `/create` renders the create funnel.
- `/chat/[id]` renders first preview chat and the mock paywall.

Treat the old route-first browse/match/create assumptions as retired. Do not reintroduce `/browse`, `/c/[id]`, route-tab navigation, or a default-companion landing screen unless the product direction changes. The gallery is intentionally a hero + grid (see `docs/DIRECTION-B.md` §6); this is not a route-first marketplace and the reel remains the cold open.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS v4 with tokens in `src/app/globals.css`
- Framer Motion for transitions and portrait/chat state changes
- Zustand with `sessionStorage` persistence
- Static companion data and deterministic helpers for demo behavior
- Hand-rolled primitives in `src/components/ui`
- Playwright in `tests/e2e/` for desktop and mobile screenshot review

Avoid shadcn-style generic component drops; the visual identity should come from this codebase and the generated concept direction.

## Product Direction

- The reel is the opening product surface; the funnel starts after the user interrupts it.
- Chat is the control layer; it should feel conversational, not like a classical form.
- The large realistic portrait is the emotional anchor.
- Copy should be warm, direct, and specific. Avoid generic labels like "Submit", "Next step", and "Complete profile".
- Character names and display moments use editorial type; UI and body text use the sans face.
- Use dark base colors, realistic portrait lighting, restrained motion, and precise spacing.
- Use icons only when they clarify an action.
- Keep cards at `8px` radius or less.

## Implementation Priorities

Follow `docs/DIRECTION-B.md` and `docs/IMPLEMENTATION.md` unless the user redirects.

1. Preserve the reel cold open and cinematic cast presentation.
2. Keep face-safe layout constraints intact across reel, funnel, reveal, chat, and paywall surfaces.
3. Maintain one shared funnel shell for browse, match, and create.
4. Keep quick match short, deterministic, and rationale-driven.
5. Keep create as a multi-step composition path with visible vignette progression.
6. Keep browse/gallery best-fit behavior; never show a dead-end empty state.
7. Preserve path-aware first-chat copy and the name/context prelude.
8. Keep the mock paywall after the preview conversation only.
9. Add or update Playwright screenshots for visible UI changes.

If scope needs to be cut, protect the reel, quick match, create reveal, first preview conversation, and face-safe layout.

## Commands

- `npm run dev` starts the local development server.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm run build` verifies the production build.
- `npm run format` formats the repo with Prettier.
- `npm run test:e2e` runs the Playwright screenshot suite.
- `npm run test:e2e:desktop` runs only the desktop project.

Run `npm run lint`, `npm run typecheck`, and `npm run build` before handing off meaningful code changes when practical. When making visible UI changes, also run `npm run test:e2e` and review the PNGs under `test-results/screenshots/` before committing.

### Playwright Notes

- The suite boots `next start` on port `4321` via `webServer`. It needs a fresh `npm run build` first.
- Desktop uses Chromium at `1440x900`.
- Mobile uses Chromium-based Pixel 7 emulation at `390x844`.
- Screenshots are namespaced by project: `test-results/screenshots/desktop/` and `test-results/screenshots/mobile/`. They are gitignored.

## State And Data

- Keep funnel/session state deterministic and local.
- Use `sessionStorage`, not local storage, until the plan changes.
- Companion records live in `src/data/companions.json`.
- Keep ranking, matching, create-template selection, rationale, portrait-state selection, and chat-response logic deterministic for the demo.

## Editing Notes

- Keep changes scoped to the user request.
- Prefer the active Casting Hall plan over retired Direction A docs or route maps.
- Prefer structured data and typed helpers over ad hoc string manipulation.
- Do not commit generated build output, `node_modules`, or screenshot artifacts.
