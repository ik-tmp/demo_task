# AGENTS.md

Guidance for coding agents working in this repository.

## Project Shape

This is a frontend-only Next.js App Router prototype for the AI companion entry experience described in `docs/PLAN.md`. The core product promise is the path from app open to first conversation:

- `/` conversational funnel entry
- `/browse` discovery grid
- `/c/[id]` character detail
- `/match` quick match flow
- `/create` character creator
- `/chat/[id]` thin chat terminus

Do not add a backend, auth, account persistence, analytics, real model calls, or moderation surfaces unless the plan changes. "AI" behavior should stay deterministic and localized behind functions that can later be replaced with model calls.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS v4 with tokens in `src/app/globals.css`
- Framer Motion for shared-layout and transition work
- Zustand with `sessionStorage` persistence for funnel/session state
- Static character data in `src/data/characters.json`
- Hand-rolled primitives in `src/components/ui`

Use the existing primitives and route structure before introducing new abstractions. Avoid shadcn-style generic component drops; the visual identity should come from this codebase.

## Product Direction

- Mobile-first.
- Chat is the product; the funnel should feel conversational, not like a form.
- Copy should be warm and direct. Avoid generic labels like "Submit".
- Character names and display moments use the editorial serif. UI and body text use the sans face.
- Use dark base colors, character accents, and restrained motion.
- Keep cards at `8px` radius or less.
- Use icons only when they clarify an action.

## Implementation Priorities

Follow the build order in `docs/PLAN.md` unless the user redirects. Track implementation progress in `docs/IMPLEMENTATION.md`.

1. Design tokens, fonts, primitives
2. Character seed data
3. Funnel shell and morphing UI
4. Browse, filters, character page, chat shell
5. Match flow
6. Create flow
7. Empty/loading/error states
8. Copy pass
9. Mobile pass
10. Motion pass
11. Demo polish

If scope needs to be cut, protect the funnel shell and browse path first.

## Commands

- `npm run dev` starts the local development server.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm run build` verifies the production build.
- `npm run format` formats the repo with Prettier.

Run `npm run lint`, `npm run typecheck`, and `npm run build` before handing off meaningful code changes when practical.

## State And Data

- Funnel state belongs in `src/store/funnel-store.ts`.
- Static character records belong in `src/data/characters.json`.
- Keep matching, rationale, voice-preview, and chat-response logic deterministic.
- Session persistence should use `sessionStorage`, not local storage, until the plan changes.

## Editing Notes

- Keep changes scoped to the user request.
- Preserve the current design language and route map.
- Prefer structured data and typed helpers over ad hoc string manipulation.
- Do not commit generated build output or `node_modules`.
