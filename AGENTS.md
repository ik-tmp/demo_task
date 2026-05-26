# AGENTS.md

Guidance for coding agents working in this repository.

## Project Shape

This is a frontend-only Next.js prototype for the AI companion entry experience described in `docs/PLAN.md`. The project has pivoted from a route-first browse/match/create app into a conversational web funnel with a large evolving companion portrait.

The core product promise is the path from app open to the user's first preview conversation:

- A default companion is visible immediately.
- The entry flow happens through chat, not a classical form or wizard.
- Users can browse existing companions, get matched quickly, stay with the default companion, or say "I'm waiting for someone else" to shape someone specific.
- The companion portrait changes as the user answers.
- The first conversation starts before any paywall appears.
- A mocked paywall can appear only when the user tries to continue beyond the preview conversation.

Do not add a backend, auth, account persistence, analytics, real payments, real model calls, or full moderation surfaces unless the plan changes. "AI" behavior should stay deterministic and localized behind functions that can later be replaced with model calls.

## Current Product Decisions

- No dedicated memory / "what I know" panel for now. User signals can affect copy, recommendations, portrait state, and first-chat context, but do not need a separate visible surface.
- Do not use "help me make someone" as the creation framing. Use the default companion plus "I'm waiting for someone else" and follow-up questions.
- The funnel should always produce a viable companion. If answers or filters are restrictive, broaden silently and show best-fit results instead of exposing "no match" logic.
- The paywall is for continuing beyond the preview conversation, not for starting the first chat.
- Generated realistic portrait assets are central to the product direction. Use `design/` concepts as the visual reference point.

## Existing Implementation Status

The current app code was built for the previous direction. Treat it as legacy exploration until each piece is deliberately adapted.

- Existing route skeletons (`/`, `/browse`, `/c/[id]`, `/match`, `/create`, `/chat/[id]`) may be kept, replaced, or heavily revised.
- Existing primitives may be reused if they help the new portrait-first chat shell.
- Existing browse/match/create assumptions should not constrain the new flow.
- Track progress in `docs/IMPLEMENTATION.md`.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS v4 with tokens in `src/app/globals.css`
- Framer Motion for transitions and portrait/chat state changes
- Zustand with `sessionStorage` persistence for funnel/session state when needed
- Static companion data and deterministic helpers for demo behavior
- Hand-rolled primitives in `src/components/ui`
- Playwright in `tests/e2e/` for visual screenshot review

Avoid shadcn-style generic component drops; the visual identity should come from this codebase and the generated concept direction.

## Product Direction

- Mobile-first, portrait-first.
- Chat is the product surface; the funnel should feel like a conversation, not a form.
- The large realistic portrait is the emotional anchor.
- Copy should be warm, direct, and specific. Avoid generic labels like "Submit", "Next step", and "Complete profile".
- Character names and display moments use editorial type; UI and body text use the sans face.
- Use dark base colors, realistic portrait lighting, restrained motion, and precise spacing.
- Use icons only when they clarify an action.
- Keep cards at `8px` radius or less.

## Implementation Priorities

Follow `docs/PLAN.md` and `docs/IMPLEMENTATION.md` unless the user redirects.

1. First-screen chat plus portrait shell.
2. Default companion portrait and state changes.
3. Shared conversational branching.
4. Quick match path.
5. "I'm waiting for someone else" specific-companion path.
6. Browse/discovery as a secondary path with best-fit fallback.
7. First preview conversation for every path.
8. Mock paywall after preview continuation.
9. Loading, fallback, error, rejection, and skipped-answer states.
10. Mobile portrait-first polish.
11. Desktop split-presence polish.
12. Final portrait assets and screenshot review.

If scope needs to be cut, protect the first screen, quick match, specific-companion path, and first preview conversation.

## Commands

- `npm run dev` starts the local development server.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm run build` verifies the production build.
- `npm run format` formats the repo with Prettier.
- `npm run test:e2e` runs the Playwright screenshot suite (desktop + mobile).
- `npm run test:e2e:desktop` runs only the desktop project.

Run `npm run lint`, `npm run typecheck`, and `npm run build` before handing off meaningful code changes when practical. When making visible UI changes, also run `npm run test:e2e` and review the PNGs under `test-results/screenshots/` before committing.

### Playwright Notes

- The suite boots `next start` on port `4321` via `webServer`. It needs a fresh `npm run build` first.
- Only Chromium is installed (`npx playwright install chromium`). The mobile project uses Chromium-based Pixel emulation, not WebKit.
- Hover-state tests skip on mobile.
- Screenshots are namespaced by project: `test-results/screenshots/desktop/` and `test-results/screenshots/mobile/`. They are gitignored.

## State And Data

- Keep funnel/session state deterministic and local.
- Use `sessionStorage`, not local storage, until the plan changes.
- Static companion records can live in `src/data/characters.json` or a replacement data file if the new portrait/state model needs a different shape.
- Keep matching, rationale, portrait-state selection, voice-preview, and chat-response logic deterministic for the demo.

## Editing Notes

- Keep changes scoped to the user request.
- Prefer the new product plan over the old route map.
- Prefer structured data and typed helpers over ad hoc string manipulation.
- Do not commit generated build output or `node_modules`.
