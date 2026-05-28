# Implementation Tracker

Last updated: May 28, 2026

This document tracks progress against the rewritten product plan in `docs/PLAN.md`. The project has pivoted from a route-based browse/match/create prototype to a conversational web funnel with a large evolving companion portrait.

The existing app code can be reused selectively, but it should be treated as legacy exploration until it is deliberately adapted to the new direction. Do not count an old route or component as complete just because it exists in the repo.

## Status Key

- `[x]` Done
- `[~]` Partial
- `[ ]` Not started
- `[legacy]` Exists, but belongs to the previous direction

## Current Artifacts

- `[x]` New product/design plan
  - `docs/PLAN.md` now defines the new direction: chat-driven funnel, default companion, "I'm waiting for someone else" specific-companion path, best-fit fallback logic, evolving portraits, and paywall after preview continuation.
- `[x]` Portrait-first conversational shell
  - `src/components/funnel-entry.tsx` is now the primary product surface.
  - `/`, `/browse`, `/match`, `/create`, `/c/[id]`, and `/chat/[id]` all enter the same conversational shell instead of separate route-first legacy surfaces.
  - The shell supports entry, browse/discovery, quick match, specific-companion shaping, first preview chat, portrait state changes, and the mocked continuation paywall.
- `[x]` Concept images
  - `design/concept-01-presence-split.png`
  - `design/concept-02-mobile-portrait-funnel.png`
  - `design/concept-03-conversational-creator.png`
  - `design/concept-04-chat-with-presence.png`
  - `design/concept-05-default-companion-entry.png`
  - `design/concept-06-preview-continuation-paywall.png`
  - `design/concept-07-reel-cold-open.png`
  - `design/concept-08-match-reveal.png`
  - `design/concept-09-create-reveal.png`
  - Direction B screen mockups were generated from `docs/ASSET-PROMPTS.md` with the built-in image generation tool; originals remain under `$CODEX_HOME/generated_images/`.
- `[x]` Context notes
  - `design/context-notes.md` summarizes the plan/site takeaways and generated concept framing.
- `[x]` Mira portrait asset set
  - `public/companions/mira/` contains one generated realistic vertical/mobile companion set for the default companion direction: neutral, warm, curious, closer, and final chat.
  - `public/companions/mira/desktop/` contains a matching desktop-native `1672x941` wide set for the split-presence mockups, so desktop no longer depends on cropping vertical sources.
  - `public/companions/mira/thumbnails/` contains matching `360x360` state-strip crops.
  - Source generations were created with the built-in image generation tool and copied into the project; originals remain under `$CODEX_HOME/generated_images/`.
- `[x]` Direction B Tier 1 cast asset floor
  - Generated Iris and Noa as full five-state wide portrait sets in `public/companions/iris/` and `public/companions/noa/`.
  - Generated dedicated cold-open reel stills at `public/companions/iris/iris-reel.png` and `public/companions/noa/noa-reel.png`.
  - Generated Mira's reel-specific city-night vignette at `public/companions/mira/mira-reel.png`.
  - These assets are copied into the repo and tracked in `docs/ASSET-PROMPTS.md`; they are generated art assets only and are not yet wired into a Direction B reel implementation.
- `[x]` Direction B remaining generated assets
  - Generated Sasha's full wide portrait set plus `sasha-reel.png` in `public/companions/sasha/`.
  - Generated Create-path in-progress frames and net-new deterministic templates in `public/companions/create/`.
  - Generated shared fallback backdrops in `public/companions/_shared/`.
  - These assets are copied into the repo and tracked in `docs/ASSET-PROMPTS.md`.
- `[legacy]` Existing Next.js prototype
  - The old browse/match/create/chat route implementations have been replaced by wrappers around the new conversational shell.
  - Some older primitive components and static character data remain available, but the product flow is no longer driven by the old route map.

## Product Scope Tracker

- `[x]` First-screen conversational shell
  - App opens directly into the product, not a landing page.
  - Large realistic default companion portrait is visible immediately.
  - Chat asks the first question and offers: browse, match, stay with default companion, or "I'm waiting for someone else."
  - No dedicated memory / "what I know" panel.

- `[x]` Portrait state system
  - Define how companion visuals change after answers: warmer, curious, closer, final chat state.
  - One Mira/default companion set now exists with neutral, warm, curious, closer, and final chat states.
  - The live funnel now switches the large portrait and state thumbnails as the user browses, matches, shapes a specific companion, or enters chat.
  - Additional companion portrait sets are deferred per current user direction: use the one generated Mira set for now.

- `[x]` Shared funnel conversation
  - One chat interaction model supports browse, quick match, default companion, and specific-companion paths.
  - Branching is dynamic and conversational, not a visible wizard.
  - Free text can jump deeper into the path when the user is specific.
  - In-shell back behavior restores previous conversation state without clearing earlier answers.
  - Funnel state persists in `sessionStorage` per route-backed session key.
  - Dialogue and reviewable surface copy now live in `src/data/dialogues.ts`, `src/data/match-dialogue.ts`, `src/data/create-dialogue.ts`, and `src/data/surface-dialogue.ts`; TSX components should stay mostly rendering/flow code.

- `[x]` Discover existing companions
  - Browse starts through chat and can open a fuller discovery view.
  - Restrictive filters silently broaden to best-fit results.
  - The product always shows viable companions instead of exposing "no match" logic.

- `[x]` Quick match
  - Ask only enough questions to produce a credible companion.
  - Current flow includes feeling, role, first-message texture, avoidances, and optional familiarity.
  - Use a narrated reveal rather than a spinner.
  - Rejection becomes signal for the next result.
  - Reveal explains fit in human language, not scoring terms.

- `[x]` Specific companion path
  - Replace "make someone" framing with "I'm waiting for someone else."
  - User describes who they hoped would answer.
  - Follow-up questions shape feeling, role, voice, pace, appearance, boundaries, first-message context, and name.
  - Preview shows portrait, name, first message, and what shaped them.

- `[x]` First conversation
  - Browse, Match, default companion, and Specific paths all arrive in chat.
  - First message reflects the user's path and recent choices.
  - The large portrait remains present beside or above the conversation.
  - Chat only needs the first preview exchange to feel designed.

- `[x]` Mock paywall
  - Appears only when the user tries to continue beyond the preview conversation.
  - Does not block reaching the first conversation.
  - No real payment, auth, checkout, or account setup.

- `[x]` States and recovery
  - Loading uses narrative copy and portrait transitions, not generic spinners.
  - Restrictive choices still produce best-fit companions.
  - Variant/image fallback keeps the current viable portrait and offers adjacent directions.
  - Chat send and paywall mock failures are inline and calm.
  - Implemented: narrative match reveal, best-fit browse fallback, richer browse refinements, image fallback, sensitive-input guard, chat send failure copy, paywall success/dismissal, and a natural restore-access paywall error path.

- `[~]` Mobile pass — **known broken, do not treat as baseline for Direction B**
  - Portrait-first layout.
  - Bottom chat sheet.
  - Large tap targets.
  - Portrait state thumbnails or subtle confirmation moments.
  - **Known issues (user-flagged 2026-05-27):** chat sheet is not responsive enough and sometimes covers the companion's face. The face-safe-region constraint defined in `docs/DIRECTION-B.md` §4 Layout Constraints is the hard rule going forward — the current implementation violates it. Do not port the existing mobile sheet behavior into the Direction B rebuild without fixing it.

- `[~]` Desktop pass — **known suboptimal, rework required for Direction B**
  - Split-presence layout: conversation plus large portrait.
  - Optional portrait state strip.
  - Minimal navigation.
  - **Known issues (user-flagged 2026-05-27):** layout is not ideal (specifics not given). Direction B calls for the portrait column to take 60–70% of viewport width with the chat column fixed-narrower, rather than the existing near-equal split. See `docs/DIRECTION-B.md` §4 Layout Constraints for the cross-surface rules.

- `[x]` Copy pass
  - Remove form/funnel language.
  - Avoid "submit", "next step", "complete your profile", and "make someone."
  - Use direct conversational copy: "stay with you", "I'm waiting for someone else", "keep talking", "say hi."

## Legacy Code Audit

Before implementation starts, audit the current codebase and decide what to keep:

- `[x]` Keep, adapt, or replace the app shell.
- `[x]` Keep, adapt, or replace UI primitives.
- `[x]` Replace the old opening screen if it cannot support portrait-first chat.
- `[x]` Replace or heavily revise `/browse`, `/match`, `/create`, and `/chat/[id]` if they keep the old route-first mental model.
- `[x]` Decide whether existing static character data is useful for new seed companions.
- `[x]` Decide whether existing Playwright screenshots still match the new product surface.

## Asset Needs

- `[x]` Seed companion portrait set for current scope.
  - One Mira/default companion set generated and wired throughout the UI.
  - Direction B now has generated cast sets for Iris, Noa, and Sasha, plus reel vignettes for Iris, Noa, Mira, and Sasha.
- `[x]` Direction B Tier 1 floor cast assets.
  - Iris:
    - `public/companions/iris/iris-neutral.png`
    - `public/companions/iris/iris-reel.png`
    - `public/companions/iris/iris-warm.png`
    - `public/companions/iris/iris-curious.png`
    - `public/companions/iris/iris-closer.png`
    - `public/companions/iris/iris-final-chat.png`
  - Noa:
    - `public/companions/noa/noa-neutral.png`
    - `public/companions/noa/noa-reel.png`
    - `public/companions/noa/noa-warm.png`
    - `public/companions/noa/noa-curious.png`
    - `public/companions/noa/noa-closer.png`
    - `public/companions/noa/noa-final-chat.png`
  - Mira reel:
    - `public/companions/mira/mira-reel.png`
  - All generated Tier 1 files are `1672x941` PNGs. They match the existing Mira desktop-wide size but are lower than the aspirational `docs/ASSET-PROMPTS.md` target of `>=2944x1656`.
- `[x]` Direction B Sasha, Create, and shared fallback assets.
  - Sasha:
    - `public/companions/sasha/sasha-neutral.png`
    - `public/companions/sasha/sasha-reel.png`
    - `public/companions/sasha/sasha-warm.png`
    - `public/companions/sasha/sasha-curious.png`
    - `public/companions/sasha/sasha-closer.png`
    - `public/companions/sasha/sasha-final-chat.png`
  - Create:
    - `public/companions/create/in-progress-1.png`
    - `public/companions/create/in-progress-2.png`
    - `public/companions/create/in-progress-3.png`
    - `public/companions/create/in-progress-4.png`
    - `public/companions/create/template-2-vera.png`
    - `public/companions/create/template-4-playful.png`
    - `public/companions/create/template-5-gentle.png`
  - Shared:
    - `public/companions/_shared/portrait-blur.png`
    - `public/companions/_shared/soft-fail.png`
    - `public/companions/_shared/ambient-between.png`
  - All files in this pass are `1672x941` PNGs. `in-progress-4.png` was derived from Noa's neutral asset with a local blur per `docs/ASSET-PROMPTS.md`.
- `[x]` Default companion portrait and states.
  - Desktop-wide:
    - `public/companions/mira/desktop/mira-neutral-desktop.png`
    - `public/companions/mira/desktop/mira-warm-desktop.png`
    - `public/companions/mira/desktop/mira-curious-desktop.png`
    - `public/companions/mira/desktop/mira-closer-desktop.png`
    - `public/companions/mira/desktop/mira-final-chat-desktop.png`
  - Vertical/mobile:
    - `public/companions/mira/mira-neutral.png`
    - `public/companions/mira/mira-warm.png`
    - `public/companions/mira/mira-curious.png`
    - `public/companions/mira/mira-closer.png`
    - `public/companions/mira/mira-final-chat.png`
- `[x]` Quick-match reveal portrait states.
  - Quick match uses deterministic Mira state transitions and selected seed-character copy until additional companion portrait sets are added.
- `[x]` Specific-companion in-progress and final portrait states.
  - The "I'm waiting for someone else" path uses neutral, warm, curious, closer, and final Mira states to imply generation/progression with one generated asset set.
- `[x]` Mobile crops for portrait-first layout.
  - Mira originals are vertical portrait assets and frame the mobile-first shell cleanly in current screenshots.
- `[x]` Desktop-wide portrait assets.
  - Mira desktop originals match the design mockup aspect (`1672x941`) and include right-side safe space for desktop overlays/state strips.
- `[x]` Blurred/soft fallback backgrounds.
  - The portrait surface falls back to a soft dark room gradient if image loading fails.

## Suggested Next Build Step

The product direction has pivoted from `docs/PLAN.md` (Direction A) to `docs/DIRECTION-B.md` (Direction B — Casting Hall with funnel). The existing end-to-end demo built for Direction A still works, but it does not match the new direction, and its layout has known failures.

Priority work for the Direction B rebuild:

1. **Fix layout failures before anything else.** The mobile chat sheet overlapping the companion's face is the most visible product-promise break in the current build. Resolve face-safe-region enforcement per `docs/DIRECTION-B.md` §4 Layout Constraints across the existing surfaces, so screenshots are presentable while the rest of the rebuild lands.
2. **Build the reel cold-open** as the new app entry per `docs/DIRECTION-B.md` §4. Replace the default-companion-and-question opening screen.
3. **Rework Create** into the multi-step composition path (feeling → role → voice → look → name) with an in-progress vignette that resolves into a playable loop, per `docs/DIRECTION-B.md` §8.
4. **Adapt Browse** into the reel-driven entry + gallery (carousel of vignettes, conversational input + chip row), per `docs/DIRECTION-B.md` §6.
5. **Generate the new cast assets** (Iris, Noa, Sasha) per `docs/ASSET-PROMPTS.md` §A. Mira from Direction A is reused as one of the four cast members.

Deferred until the above lands:

- Replace placeholder shared-portrait browse candidates once new portrait sets are available.
- Continue reviewing screenshots for crop, density, and text-fit regressions as new states are added.
- If the demo needs deeper editability later, expand one-step back into a visible prior-answer editor without adding a separate memory panel.

## Verification Target

When meaningful UI work begins, verify:

- first screen at desktop and mobile sizes
- one full path to first conversation
- portrait changes after at least two interactions
- best-fit fallback never shows a dead-end
- paywall appears only after the preview exchange
- **face-safe region is honored across all viewport sizes** (≥360w, ≥768w, ≥1280w, ≥1920w). Chat sheet never covers the face; desktop split gives the portrait 60–70% of viewport width. See `docs/DIRECTION-B.md` §13 Layout Failure Modes for the testable bug list.

Run lint/typecheck/build when implementation changes are made. For visible UI work, use Playwright screenshots and review outputs before handoff.

### Latest Verification

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run test:e2e` passed: 17 passed, 1 mobile-only skip for the desktop browse search panel.
- Screenshot artifacts reviewed under:
  - `test-results/screenshots/desktop/`
  - `test-results/screenshots/mobile/`
