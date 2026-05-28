# Proposal: Gallery Redesign (Hero + Grid)

Status: proposed, awaiting build go-ahead.
Last updated: May 28, 2026.

This proposes redesigning the `show all companions` surface (`/gallery`) from a
single full-screen vignette carousel into a **hero + grid** of companions, with
locked placeholder tiles behind the mock paywall and a dedicated "create your
own" tile that highlights full AI customizability.

## 1. Direction Change

This is a deliberate change to the product spec. Today:

- `docs/DIRECTION-B.md` §6 states *"The gallery is a full-screen discovery
  surface, not a card grid."*
- `AGENTS.md` says do not reintroduce "marketplace grids" unless the product
  direction changes.

This proposal *is* that direction change. As part of the build, §6 and
`AGENTS.md` will be updated so the grid becomes the intended gallery rather than
a contradiction.

What carries over unchanged:

- Search + refinement ranking (`rankForGallery` in `src/lib/browse.ts`).
- The never-empty / closest-fit rule (DIRECTION-B §6, §13).
- Face-safe crops on every portrait (DIRECTION-B §4).
- Playwright screenshot coverage; e2e ≤5s; animations behind
  `prefers-reduced-motion`.

## 2. Chosen Layout — Option C: Hero + Grid Hybrid

```
┌────────────────────────────────────────┐
│ ‹ reel   [ describe who you want…   🔍 ] │
├────────────────────────────────────────┤
│ ┌──────────────────┐  best fit          │
│ │   IRIS           │  "She listens       │
│ │   big vignette   │   first…"           │
│ │   ▓▓▓▓▓▓▓▓       │  [ say hi ]         │
│ └──────────────────┘                     │
│ everyone else                            │
│ ┌───┐┌───┐┌───┐┌╌╌╌┐┌╌╌╌┐               │
│ │NOA││MIRA││SASH││+✦ ││🔒 │               │
│ └───┘└───┘└───┘└╌╌╌┘└╌╌╌┘               │
└────────────────────────────────────────┘
```

- **Top bar** (unchanged): `‹ reel`, natural-language search field, submit.
  Keeps the existing query + refinement logic.
- **Hero** (top): the #1 ranked companion rendered as a large vignette —
  face-safe portrait crop, serif name, premise, the existing "you asked for X /
  closest match" line, and the `say hi` CTA. Preserves the never-empty /
  closest-match behavior and the cinematic emotional anchor.
- **Grid** ("everyone else"): the remaining real companions as portrait tiles
  (face-safe crop, serif name) → tap routes to `/chat/[id]?from=browse`. The
  **create tile** and **locked placeholder tiles** are interleaved at the end.
- **Refinement chips**: kept as a compact row (carried from the current bottom
  bar).
- **Responsive**: 2 columns on mobile, 3–4 on desktop. Hero spans full width on
  mobile; sits in/above the grid on desktop.

### Options considered

| Option | Summary | Decision |
| ------ | ------- | -------- |
| A — Poster grid | Uniform portrait tiles, cinematic wall-of-faces; create + locked tiles inline. | Not chosen |
| B — Sectioned tiers | Labeled bands: Create → Available now → Unlock more. Most "productized". | Not chosen |
| **C — Hero + grid hybrid** | Best-fit hero on top, grid of everyone else below. Bridges old + new; keeps never-empty feel. | **Chosen** |

## 3. Create Tile

- One accented tile: gradient/dashed border, sparkle, `coral`→`orchid` accent.
- Copy: *"Create your own — describe anyone, we'll build them."*
- Routes to `/create`.
- The only tile that reads as an action rather than a face; highlights the
  full-customizability-with-AI path.

## 4. Locked Placeholders

- New data module `src/data/gallery-placeholders.ts` — a few teaser tiles
  (name + one vibe word, no real assets). Kept out of `companions.json` so they
  never leak into reel/match ranking.
- Default count: **3** (open question, see §7).
- Render: blurred/dimmed portrait frame with a lock glyph + short label.
- Tap behavior: opens the existing mock paywall (`src/components/chat/paywall.tsx`),
  framed as "unlock the full cast" rather than "preview ended".
- Later asset generation: drop the generated portrait in and flip a `locked`
  flag — no layout change required.

## 5. File Changes

- `src/components/gallery/gallery.tsx` — full rewrite to hero + grid.
- `src/data/gallery-placeholders.ts` — new locked-tile data module.
- `src/components/chat/paywall.tsx` — support a "locked cast" framing/entry.
- `src/data/surface-dialogue.ts` — gallery copy for new tiles/sections.
- `docs/DIRECTION-B.md` §6 + `AGENTS.md` — make the grid the intended gallery.
- `tests/e2e/direction-b.spec.ts` — update gallery screenshots.

## 6. Out of Scope

Per `AGENTS.md`: no backend, no auth, no real payments, no runtime image
generation, no analytics. Placeholders stay static and deterministic. The
paywall remains mocked.

## 7. Open Questions

- Number of locked placeholder tiles (default: 3).
- Names/vibe words for the placeholder teasers.
