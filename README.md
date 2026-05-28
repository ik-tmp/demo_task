# AI Companion Entry

Frontend-only Next.js prototype for a cinematic AI companion entry experience. The current product direction is **Casting Hall**: the app opens on a full-bleed companion reel, then routes the user into browse, quick match, or create. Every path reaches a first preview conversation before the mock paywall appears.

No backend, auth, real payments, analytics, account persistence, real model calls, or runtime image generation are part of this prototype. "AI" behavior is deterministic and local: ranking, matching, text parsing, vignette selection, first-message personalization, and preview chat branching.

## Active Product Direction

- App opens directly into the reel, not a landing page.
- Users can tap a companion, show all companions, ask the app to choose, or describe who they want.
- The cast is Iris, Noa, Mira, and Sasha, backed by generated portrait/reel assets.
- Browse uses a vignette funnel and a full-screen gallery, not a marketplace grid.
- Match asks a few conversational questions and reveals a companion with a rationale.
- Create uses feeling, role, voice, look, boundary/context, and name inputs to compose a reveal.
- First chat asks for a name/alias and one context line if missing, then opens with path-aware copy.
- The mocked paywall appears only after the preview chat is spent.

## Docs

- `docs/DIRECTION-B.md` is the active product and design spec.
- `docs/IMPLEMENTATION.md` tracks current implementation status and known gaps.
- `docs/ASSET-PROMPTS.md` stores asset inventory and regeneration prompts.
- `design/context-notes.md` explains which generated concepts are active references.
- `AGENTS.md` contains coding-agent guidance for this repo.

Historical Direction A and proposal docs were removed to avoid conflicting guidance.

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
npm run test:e2e:desktop
```

The Playwright suite expects a fresh production build; it boots `next start` on port `4321`.

## Routes

- `/` - cinematic reel entry
- `/gallery` - full-screen companion gallery
- `/companion/[id]` - short browse/vignette funnel for one companion
- `/match` - quick match funnel
- `/create` - create/specific-companion funnel
- `/chat/[id]` - first preview chat and mock paywall

## Project Structure

```text
design/                  Generated concept images and design notes
docs/                    Active product, implementation, and asset docs
public/companions/       Generated companion and fallback assets
src/app/                 App Router pages, layout, global CSS
src/components/          Reel, funnel, gallery, chat, layout, and UI components
src/data/companions.json Companion records and asset maps
src/data/*.ts            Deterministic dialogue/copy tables
src/lib/                 Ranking, matching, create, browse, and chat helpers
src/store/               Zustand session state persisted to sessionStorage
src/types/               Shared TypeScript types
tests/e2e/               Direction B Playwright screenshot suite
```

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS v4 tokens in `src/app/globals.css`
- Framer Motion for reel, funnel, portrait, and chat transitions
- Zustand with `sessionStorage` persistence
- Static companion data and deterministic helpers
- Hand-rolled primitives in `src/components/ui`
- Playwright for desktop/mobile screenshot review
