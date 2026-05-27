# Direction B — Implementation Plan (Build-Now)

This document is the working plan for implementing Direction B against the asset state as of 2026-05-28. It is the companion to `docs/DIRECTION-B.md` (the spec) and supersedes the forward-looking sections of `docs/IMPLEMENTATION.md` (which tracked Direction A).

This plan is scoped to **what can be built now** with assets currently on disk. Anything that depends on unshipped assets is listed under **Deferred** with the asset prerequisite named.

---

## Status Key

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
- `[blocked]` Asset or decision dependency named inline

---

## Asset State (2026-05-28)

**On disk and usable:**
- Iris: 5 portrait states + `iris-reel.png`
- Noa: 5 portrait states + `noa-reel.png`
- Mira: 5 portrait states + `mira-reel.png` + desktop-wide variants + 360x360 thumbnails
- Sasha: 5 portrait states + `sasha-reel.png`
- Create: 4 in-progress vignette stages + 3 net-new reveal templates (`template-2-vera`, `template-4-playful`, `template-5-gentle`)
- Shared fallbacks: `portrait-blur.png`, `soft-fail.png`, `ambient-between.png`

**Missing:**
- No runtime asset blockers remain for the §A / §B / §C floor. Create templates #1, #3, and #6 reuse Noa, Sasha, and Iris per `docs/ASSET-PROMPTS.md`.

**Cosmetic gaps (non-blocking):**
- Iris and Noa have no `desktop/` wide variants or `thumbnails/` 360x360 crops. Mira-only.

---

## Build Sequence

Six milestones, ordered by dependency. Each lists `Spec ref`, `Deliverables`, `Dependencies`, and `Verification`.

### M0 — Data model + layout primitives

The foundation for everything else. Nothing else lands cleanly until §4 layout constraints are enforceable.

**Spec ref:** `DIRECTION-B.md` §4 Layout Constraints, §13 Layout Failure Modes.

**Deliverables:**
- `[ ]` Rewrite `src/data/characters.json` for the Direction B shape:
  - `id`, `name`, `premise` (one-line), `energy` (listener / provoker / guide), `reelOrder` weight inputs, asset map (`reel`, `neutral`, `warm`, `curious`, `closer`, `finalChat`, optional `desktop.*`, optional `thumbnails.*`), tag axes (`vibe`, `role`, `energy`, `pace`, `format`, `boundaries`) per §6.
  - Three records: Iris, Noa, Mira. A 4th-slot placeholder for Sasha is acceptable but not required.
- `[ ]` `<FaceSafeFrame>` primitive (or equivalent) that defines the face-safe region per companion crop and refuses to let descendants render into it. The face-safe rule must be CSS-enforceable, not a designer convention (§4).
- `[ ]` `<ChatSheet>` primitive for mobile:
  - Sizes fluidly to content.
  - Max-height capped by the face-safe region.
  - Internal scroll when content exceeds max-height.
  - Smooth height transitions (no snapping).
  - Top-blend gradient (24–40px) with `backdrop-blur` (8–12px), and a rule that legible content sits below the fully-opaque portion.
- `[ ]` `<DesktopSplit>` primitive: portrait column 60–70% width, chat column fixed-narrower, column widths stable across funnel transitions (only content inside changes).
- `[ ]` Responsive crop handling for ultra-wide viewports (gutter, not stretch).
- `[ ]` Playwright fixtures for the §13 failure modes:
  - Chat sheet overlap of face region at ≥360w → fail
  - Sheet height snap between fixed steps → fail
  - Portrait crops out face when sheet grows too tall → fail
  - Desktop column widths animate during step transition → fail
  - Any overlay (paywall, host bubble) covers face → fail
  - Portrait stretches on ultra-wide → fail

**Dependencies:** none.

**Verification:** Playwright fixtures green at 360, 768, 1280, 1920. Lint / typecheck / build pass.

---

### M1 — Reel cold open

**Spec ref:** §4 (Layout, Reel Pacing, What's in the Reel, Reel Ranking).

**Deliverables:**
- `[ ]` New entry surface that replaces the current `src/components/funnel-entry.tsx` opening screen. Old funnel-entry can stay in tree until M2 wires the funnel shell.
- `[ ]` Full-bleed reel renderer:
  - 3 vignettes auto-advance (~3s each, ~500ms cross-fade) per resolved §16 cast (Iris, Noa, Mira).
  - 4-slot data model — adding Sasha later is data-only.
  - Subtle Ken Burns / parallax motion on the still (§16 decision: stills + motion treatment, not video loops).
  - Editorial lower-left overlay: name in display face, one-line premise beneath.
  - Progress dotline showing reel position.
- `[ ]` Quiet line `"Who do you want to start with?"` + three text affordances `see everyone · pick for me · describe someone else`.
- `[ ]` Tap-a-vignette interrupts the reel and freezes that vignette (sets up M3 / M4 entry).
- `[ ]` Reel loops once, then settles on the highest-ranked vignette and goes still.
- `[ ]` Mobile reel: portrait orientation, swipe-up reveals the three affordances as a thumb-reachable sheet, dots above the home indicator.
- `[ ]` Ranking inputs:
  - Time of day (evening favors warmer; afternoon favors sharper).
  - `?from=` query parameter weighting (e.g., `?from=quiet` favors listener-type).
  - `sessionStorage` memory of prior rejections.
  - Small randomized component so repeat visitors see variety.

**Dependencies:** M0 (face-safe + layout primitives).

**Verification:** Refresh changes order; `?from=quiet` leads with Iris; reviewer can see the reel as a single cinematic surface, not a header + body composition.

---

### M2 — Funnel shell

The chat-panel + portrait pairing reused by Browse, Match, and Create after the user interrupts the reel.

**Spec ref:** §5.

**Deliverables:**
- `[ ]` Shell layout: chosen vignette stays large (right on desktop, top on mobile), chat panel beneath/beside obeying §4 face-safe rules.
- `[ ]` Step affordances: one short question, 1–5 chip replies, always-available free text input, small back affordance.
- `[ ]` Dot trail above the input — inferred progress, not labeled "Step 2 of 5".
- `[ ]` Skip-ahead / "just meet them" link at the bottom of the chat panel.
- `[ ]` Forward-motion mechanics:
  - Chosen chips animate, ghost briefly, persist as removable summary pills above the chat.
  - Narrative loading lines between steps (~600ms italic).
  - Vignette visibly changes after each answer (handled per-path in M3 / M4 / M6).
- `[ ]` Back restores the previous step with chosen pills intact.
- `[ ]` `sessionStorage`-backed funnel state, per-path session key.

**Dependencies:** M0, M1.

**Verification:** Shell renders identically across Browse / Match / Create entries with only step content differing. Back/skip work without losing pills.

---

### M3 — Match path

Highest-leverage AI surface — the narrated reveal is one of the four AI techniques the brief is judged on (§9).

**Spec ref:** §7, §9.2, §10.2, §13 Rejection.

**Deliverables:**
- `[ ]` Match entry from reel "pick for me" and from gallery footer.
- `[ ]` Soft unresolved portrait stand-in. Implementation: CSS blur + low-contrast filter applied to the destination companion's `neutral` state, resolving to sharp over the funnel. No extra asset needed.
- `[ ]` Q1 Feeling, Q2 Role, Q3 Avoidances per §7 chip sets, with free text accepted at every step.
- `[ ]` Dynamic Q4 Familiarity fires only when Q1+Q2+Q3 leave 2+ candidates indistinguishable.
- `[ ]` "I don't know yet" at Q2 branches to softer Q3a (`"Should they ask first, or just be there?"`).
- `[ ]` Per-answer effects:
  - Pill persists above chat.
  - Portrait lighting/blur shift visibly.
  - ~600ms narrated loading line.
- `[ ]` Narrated reveal: three lines arrive ~600ms apart while portrait resolves from blurred → sharp. Third line lands as the resolution completes. No spinner, no score, no "98% match."
- `[ ]` Reveal surface: large vignette, name in editorial type, first-message preview chat bubble, "why her" panel (three rationale bullets matched to the user's answers), action row (`say hi · show me another · show similar · open everyone`).
- `[ ]` Rejection diagnostic: one question `"Was it the look, the voice, or the energy?"` → next reveal addresses the named axis.
- `[ ]` Two rejections → Create handoff offer (`"Want to describe them instead?"`). In this milestone, route to Create's chip-driven mechanics from M6; visual generation moment falls back to existing companions (see Deferred).

**Dependencies:** M0, M1, M2. Companion ranking logic from M1.

**Verification:** End-to-end §10.2 script runnable. All three rationale bullets read like they came from the user's pills. Portrait visibly narrows.

---

### M4 — Browse path

**Spec ref:** §6, §10.1, §13 Rejection.

**Deliverables:**
- `[ ]` Vignette-funnel (tap-a-face from reel):
  - Vignette stays large, no card chrome.
  - Two-line companion profile (premise + sample first line in their voice).
  - Two chips `say hi · tell me more`.
  - Free text → one-line in-voice host answer.
  - Max 3 turns before chips force `say hi` / `show me another`.
- `[ ]` Gallery (`see everyone`): full-screen surface per §16 decision (not a sheet).
  - Mobile: vertically-paged stack of vignette-sized presences.
  - Desktop: horizontally-paged carousel.
  - Per item: large vignette, editorial name, one-line premise, three sample first lines, three trait tags.
  - Paging: keyboard-arrow desktop, swipe mobile.
- `[ ]` Conversational input above gallery (`"Describe what you want to see."`) parsing to filters and reordering with visible animation.
- `[ ]` Chip row beneath gallery: `softer · sharper · older · younger · more direct · less polished · stranger`. Chips are additive and persist as removable pills.
- `[ ]` Active chips show `"Why you're seeing this"` line at the bottom of the active vignette.
- `[ ]` Search inside the same input: keyword → tag map. Deterministic; presented as sentence-level understanding.
- `[ ]` Tag axes per §6 (vibe / role / energy / pace / format / boundaries). Chip row exposes 6–8 at a time, rotated by axis the user has touched least.
- `[ ]` Best-fit fallback: gallery never empties. Silently broadens and labels active item `"Closest to what you asked for."`
- `[ ]` Primary action on any gallery item: `say hi to [name]` → routes to M5.
- `[ ]` Two browse rejections → Create handoff offer.

**Dependencies:** M0, M1, M2.

**Verification:** End-to-end §10.1 script runnable. Filter overconstrain produces silent broadening, never an empty state.

---

### M5 — First conversation + paywall

The destination. Should feel earned by the funnel.

**Spec ref:** §11, §12.

**Deliverables:**
- `[ ]` Desktop layout: chat column fixed-narrower on left, large vignette in final-chat state on right (using `final-chat` portrait per companion).
- `[ ]` Mobile layout: vignette top, chat sheet bottom — starts at minimum height (room for active companion message + replies + input only), grows up to face-safe cap, then scrolls internally.
- `[ ]` Arrival-aware first messages:
  - Browse: cites the active filters / what brought them to this companion.
  - Match: cites the rationale ("No fixing, got it…").
  - Create: cites the user's described intent (uses Create mechanics from M6; visual generation moment deferred).
- `[ ]` Character-by-character first-message arrival (~1.5s).
- `[ ]` Suggested replies above input that update based on what the companion just said.
- `[ ]` Deterministic canned in-voice responses per companion. Each companion's voice must read distinctly across the first ~3 exchanges.
- `[ ]` Host does not appear in first chat. Host returns only if user backs out to switch companions.
- `[ ]` Optional portrait state strip beneath the desktop vignette — **enable for Mira only** for now (only Mira has `thumbnails/`). Iris/Noa render without the strip. Strip must not visually compete with the face.
- `[ ]` Mock paywall after ~3 exchanges or on 4th user message. Overlay does not dim the vignette; companion and chat stay visible. Surface per §12 with `continue · not now · try someone else` actions and dismissed / mock-success / error states.

**Dependencies:** M0, M1, M2. Either M3 or M4 to reach this surface.

**Verification:** All three arrival messages distinct in voice and cite the path. Paywall never appears during the funnel. Face-safe enforced even with paywall overlay open.

---

### M6 — Create funnel mechanics (visual generation deferred)

Build the Create funnel against the shipped Create assets. The reveal surface can now use the in-progress stages and deterministic template outputs instead of routing everything through a launch-companion fallback.

**Spec ref:** §8, §10.3.

**Deliverables (now):**
- `[ ]` Create entry from reel "describe someone else" and from two-rejection handoffs in M3 / M4.
- `[ ]` All five core steps with chips and free text:
  - Step 1 Feeling (multi-select up to 2).
  - Step 2 Role.
  - Step 3 Voice — three sample first lines as chat bubbles, user taps one.
  - Step 4 Look (multi-select up to 2).
  - Step 5 Name — 3 AI-suggested names from prior choices + free text field. Names deterministic from feeling+look pair per §8.
- `[ ]` Optional steps wired:
  - Pace fires if Step 1 picks contain a conflicting pair (mischief + patience).
  - Boundaries fires if free text contains boundary words ("doesn't flirt", "no roleplay").
  - Context always offered as last optional turn; free text seeds the first message.
- `[ ]` Inline AI-as-co-writer suggestions per §9.3 (e.g., `"You said mischief. Light, or with an edge?"`).
- `[ ]` Pills persist for each answer; free-text skip parses and back-fills pills retroactively, jumping to Step 4 or 5.
- `[ ]` Dot trail with 5 dots + extras for optional steps.
- `[ ]` Reveal surface skeleton: large vignette, name, composed one-line premise (from feeling + role), "what shaped them" panel listing user's choices verbatim, first-message preview, adjust row, `meet [name]` primary action.

**Visual generation moment:**
- The "in-progress vignette" area advances through `in-progress-1..4.png`.
- On reveal, route the user to one of the six deterministic template outcomes: Noa-like, Vera-like, Sasha-like, Playful, Gentle, or Iris-like. The Noa/Sasha/Iris outcomes reuse cast assets; the other three use `template-2-vera.png`, `template-4-playful.png`, and `template-5-gentle.png`.

**Dependencies:** M0, M1, M2. M5 for the first-chat handoff.

**Verification:** Funnel completes end-to-end. Pills back-fill correctly on free-text skip. Reveal lands on a viable companion every time.

---

### M7 — Edge cases and recovery

Fold these in across milestones as soon as the surface they touch exists. Listed separately so nothing falls through the cracks.

**Spec ref:** §13.

**Deliverables:**
- `[ ]` Narrative loading copy used everywhere a step transitions (~600ms italic).
- `[ ]` Reel never shows a spinner — assets that aren't ready hold the prior vignette with subtle Ken Burns.
- `[ ]` Gallery never empties — silent broaden + `"Closest to what you asked for."` label.
- `[ ]` Match low-confidence still produces a reveal; gentler narrated lines; `show me another` prominent.
- `[ ]` Image generation/load failure: keep best current portrait, surface `"That look didn't come together. Your choices are saved."`
- `[ ]` Chat send failure: `"That didn't go through."` inline retry chip.
- `[ ]` Paywall error: `"That didn't go through. Nothing changed."` inline, calm, no red.
- `[ ]` Indecision: repeated "either is fine" / "I don't know" triggers Host short-circuit to a confident low-risk reveal (Iris is the demo's safe pick).
- `[ ]` Sensitive input guard: out-of-scope free text → `"I can't build that here. Want to keep it adult, respectful, and fictional?"` + two adjacent chip choices.
- `[ ]` Back from first chat re-enters reveal surface (chat context preserved).
- `[ ]` Back from reel → does nothing (reel is the first surface; browser back exits demo).

**Dependencies:** Whichever milestone owns the surface.

---

## Deferred (asset-gated)

These cannot land until the named assets ship.

- **Iris/Noa desktop variants + thumbnails** — needed for the optional portrait state strip in §11 and for sharper desktop crops. Implementation renders mobile crops at desktop sizes for these two until variants ship.

---

## What This Plan Does Not Cover

- Real model calls, runtime image generation, real payments, account creation, persistence beyond `sessionStorage`, deep chat past ~3 turns. All explicitly fakeable per §15.
- Re-doing Direction A surfaces. The legacy routes can be deleted or kept as redirects to the reel — that's a cleanup item for after M1.

---

## Recommended Build Order

The milestones can be parallelized to some extent, but the critical path is:

```
M0 ─► M1 ─► M2 ─┬─► M3 ─┬─► M5
                ├─► M4 ─┤
                └─► M6 ─┘
M7 folds into each milestone as the surfaces land.
```

Suggested single-developer sequence: M0 → M1 → M2 → M3 → M5 (closes one full path end-to-end) → M4 → M6 → M7 cleanup pass.

---

## Verification per Milestone

For each milestone:

- `npm run lint`, `npm run typecheck`, `npm run build` pass.
- `npm run test:e2e` passes including the M0 layout failure fixtures.
- Screenshots reviewed under `test-results/screenshots/{desktop,mobile}/` at 360, 768, 1280, 1920.
- The §13 failure modes are bugs, not polish. Any of them showing in a screenshot is a stop-the-line issue.

After M5 (first end-to-end Direction B path runnable): manually walk Match → first chat → paywall and confirm the reviewer's 30-second pitch from §1 still reads.

---

## Relationship to Existing Docs

- `docs/DIRECTION-B.md` — the spec. This plan references its sections rather than restating them.
- `docs/IMPLEMENTATION.md` — historical tracker for Direction A. The "Suggested Next Build Step" section there is now superseded by this doc. The Direction A "done" entries there remain accurate as history.
- `docs/PLAN.md` — Direction A spec. Retained as reference per `DIRECTION-B.md` §17.
- `docs/PROPOSAL.md` — the three-direction proposal that led to Direction B.
- `docs/ASSET-PROMPTS.md` — prompts for asset generation; the source of truth for what's been generated.
