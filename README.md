# AI Companion Entry

Frontend-only prototype for an AI companion entry experience. The current product direction is a conversational web funnel: the user opens directly into chat with a large realistic companion portrait, answers a few adaptive questions, and reaches a first preview conversation.

The repo previously explored a route-first browse/match/create flow. The plan has pivoted. Treat existing app code as reusable legacy exploration, not as the final product direction.

## Product Direction

- Chat-driven funnel, not a classical onboarding form.
- Large evolving companion portrait visible from the first screen.
- Default companion is available immediately.
- Users can browse existing companions, get a quick match, stay with the default companion, or say "I'm waiting for someone else" to shape someone specific.
- Restrictive answers should still lead to a best-fit companion; do not expose "no match" logic.
- The first preview conversation starts before any paywall.
- Mocked paywall appears only when the user tries to continue beyond the preview conversation.
- No real backend, auth, payments, persistence, analytics, or model calls.

## Design References

Generated concept images live in `design/`:

- `design/concept-01-presence-split.png`
- `design/concept-02-mobile-portrait-funnel.png`
- `design/concept-03-conversational-creator.png`
- `design/concept-04-chat-with-presence.png`
- `design/concept-05-default-companion-entry.png`
- `design/concept-06-preview-continuation-paywall.png`
- `design/context-notes.md`

## Docs

- `docs/PLAN.md` describes the target product and design direction.
- `docs/IMPLEMENTATION.md` tracks progress against the pivoted plan.
- `AGENTS.md` contains coding-agent guidance for this repo.

## Current Setup

- Next.js `16.2.6` App Router
- React `19.2.6`
- TypeScript `6.0.3`
- Tailwind CSS `4.3.0`
- Framer Motion `12.40.0`
- Zustand `5.0.13`
- Lucide React `1.16.0`
- ESLint `9.39.4` with `eslint-config-next` `16.2.6`

Package versions were checked against the npm registry on May 26, 2026. ESLint is pinned to the latest compatible v9 release because Next's lint plugin dependencies have not yet widened their peer ranges to ESLint 10. `postcss` is overridden to `8.5.15` so Next's internal PostCSS dependency stays on the patched current line.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev          # local dev server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run build        # production build
npm run format       # Prettier write
npm run format:check # Prettier check
npm run test:e2e     # Playwright screenshots
```

## Existing Routes

The current codebase still contains the earlier route-based prototype:

- `/`
- `/browse`
- `/c/[id]`
- `/match`
- `/create`
- `/chat/[id]`

These routes may be reused, replaced, or heavily revised. The new product plan is the source of truth.

## Project Structure

```text
design/                 Generated concepts and context notes
docs/                   Product plan and implementation tracker
src/app/                App Router pages, layout, global CSS
src/components/         Shell, funnel, and shared UI primitives
src/data/characters.json Static companion seed data
src/lib/                Data access and deterministic helpers
src/store/              Zustand session state
src/types/              Shared TypeScript types
tests/e2e/              Playwright screenshot suite
```

## Notes

The demo should present product behavior, not technical AI depth. Keep "AI-like" moments deterministic first: branching questions, match rationale, portrait-state changes, creator suggestions, and first-chat copy.
