# AI Companion Entry

Frontend-only prototype for the AI companion entry experience in `docs/PLAN.md`. The app is scoped to the funnel from first open to first conversation, with deterministic "AI-like" behavior so product flow and polish can be judged without backend services.

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
```

## Routes

- `/` conversational entry question
- `/browse` discovery grid scaffold
- `/c/[id]` character detail scaffold
- `/match` first quick-match question scaffold
- `/create` first creator question scaffold
- `/chat/[id]` thin chat shell scaffold

## Project Structure

```text
docs/                    Product plan and implementation tracker
src/app/                 App Router pages, layout, global CSS
src/components/          Shell, funnel, and shared UI primitives
src/data/characters.json Static companion seed data
src/lib/                 Data access and utilities
src/store/               Zustand session state
src/types/               Shared TypeScript types
```

## Docs

- `docs/PLAN.md` describes the target product and build order.
- `docs/IMPLEMENTATION.md` tracks what has been implemented against the plan.

## Notes

The project intentionally has no backend, auth, database, or model calls. Future AI seams should stay isolated behind deterministic functions first, then become model-backed only when the product flow is already working.
