# AI Companion Entry Write-up

This is a frontend-only Next.js prototype for the first few minutes of an AI
companion app.

The flow is:

```text
reel -> browse / quick match / create -> preview chat -> mock paywall
```

The main idea is that the user should meet the cast before they hit anything that
feels like a form or a marketplace. They should be able to tap a face, ask for a
match, describe someone new, or just browse. The first chat happens before the
paywall.

To run it:

```bash
npm install
npm run dev
```

## What I Built

- A full-screen opening reel for Iris, Noa, Mira, and Sasha.
- Four ways forward from the reel: tap a companion, show the gallery, quick match,
  or create from a description.
- A shared portrait-first funnel shell for browse, match, create, and chat.
- A gallery with a best-fit hero, companion tiles, a create tile, and locked
  placeholder companions.
- A quick match flow that asks a few questions, picks a companion, and explains the
  match in plain language.
- A create flow that builds a companion from feeling, role, voice, look, boundary,
  context, and name.
- A preview chat with deterministic companion responses.
- A mock paywall that appears only after the preview is used.
- Desktop and mobile Playwright screenshots for visual review.

The app does not call a real model. The "AI" behavior is local and deterministic so
the demo is stable and easy to review.

## What I Cut, and Why

- Backend, auth, accounts, and long-term persistence. They do not help prove the
  entry experience. I used Zustand and `sessionStorage` instead.
- Real model calls. For this prototype, predictable behavior was more useful than
  realistic generation. The code still has typed helper functions where model calls
  could go later.
- Runtime image generation. Portraits are static assets because live generation
  would add latency, cost, and moderation work.
- Real payments. The paywall is only there to show where monetization would appear.
- A deep chat system. The goal was to make the first preview conversation feel good,
  not build the whole companion product.
- The older route-first marketplace idea. The reel cold open was a stronger and more
  specific direction, so I focused on that.

## Key Technical Decisions

- I kept the app frontend-only with Next.js App Router, TypeScript, Tailwind v4, Framer
  Motion, and Zustand.
- Companion content lives in `src/data/companions.json` instead of being scattered
  through components.
- Ranking, matching, create selection, rationale, and chat replies live behind typed
  deterministic helpers in `src/lib/*`.
- Browse, match, create, and chat share the same funnel shell so the portrait layout
  and motion rules stay consistent.
- Face-safe layout is treated as a real constraint. Controls and chat panels are
  designed around the portrait instead of being placed on top of it.
- I used Playwright screenshots as the visual QA loop because a UI like this can pass
  typecheck and still feel wrong.

## AI Coding Tools

I used both Claude Code and Codex.

Claude Code did most of the heavy build work. The useful part was keeping the product
direction in `AGENTS.md` and `docs/DIRECTION-B.md`, then asking it to work within
those constraints.

Codex was useful after that for cleanup: fixing some of the "AI slop" Claude left
behind, rewriting text that sounded too generic, tightening implementation details, and
helping with image generation work.

Where it helped:

- Fast scaffolding for routes, components, data files, and dialogue tables.
- Repetitive TypeScript work, especially wiring deterministic helper functions into
  the UI.
- Larger reshapes, like moving from the older route-first idea to the reel-first
  Casting Hall direction.
- Cleanup passes after the first implementation, especially copy and small UI details.
- Running screenshot-driven UI passes: change the layout, inspect the screenshots,
  tighten the next pass.
- Image generation and asset exploration, where it helped get to a stronger visual
  direction faster.

Where it did not help as much:

- Visual taste still needed manual review. Crops, face-safe spacing, and "does this
  feel cinematic?" were not things I could trust blindly.
- Copy often drifted toward generic app language unless I pushed it back toward the
  warmer product tone.
- Multi-file changes sometimes left unused pieces behind. Those need a human cleanup
  pass.
- Final image choice still needed manual taste. AI could generate options and prompts,
  but it could not reliably pick the best portrait for the product.

## What I Would Do Next With Another Week

1. Add real face-safe assertions to the Playwright suite.
2. Build the missing recovery states: image fallback, chat retry, sensitive input
   guard, and paywall error.
3. Swap one deterministic helper for a real model call, probably match rationale or
   the first chat opener.
4. Generate real portraits for the locked gallery companions.
5. Clean up unused layout primitives and either wire them into the shared shell or
   delete them.
6. Polish create: better boundary handling, a reveal adjustment step, and more
   distinct generated identities.
