# Implementation Tracker

Last updated: May 26, 2026

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
- `[x]` Concept images
  - `design/concept-01-presence-split.png`
  - `design/concept-02-mobile-portrait-funnel.png`
  - `design/concept-03-conversational-creator.png`
  - `design/concept-04-chat-with-presence.png`
  - `design/concept-05-default-companion-entry.png`
  - `design/concept-06-preview-continuation-paywall.png`
- `[x]` Context notes
  - `design/context-notes.md` summarizes the plan/site takeaways and generated concept framing.
- `[legacy]` Existing Next.js prototype
  - The repo still contains the earlier route map and UI implementation.
  - It should not drive the new design. Reuse only pieces that serve the new plan after review.

## Product Scope Tracker

- `[ ]` First-screen conversational shell
  - App opens directly into the product, not a landing page.
  - Large realistic default companion portrait is visible immediately.
  - Chat asks the first question and offers: browse, match, stay with default companion, or "I'm waiting for someone else."
  - No dedicated memory / "what I know" panel.

- `[ ]` Portrait state system
  - Define how companion visuals change after answers: warmer, curious, closer, final chat state.
  - Generate final asset sets for seed companions.
  - Keep visual continuity across states.

- `[ ]` Shared funnel conversation
  - One chat interaction model supports browse, quick match, default companion, and specific-companion paths.
  - Branching is dynamic and conversational, not a visible wizard.
  - Free text can jump deeper into the path when the user is specific.

- `[ ]` Discover existing companions
  - Browse starts through chat and can open a fuller discovery view.
  - Restrictive filters silently broaden to best-fit results.
  - The product always shows viable companions instead of exposing "no match" logic.

- `[ ]` Quick match
  - Ask only enough questions to produce a credible companion.
  - Use a narrated reveal rather than a spinner.
  - Rejection becomes signal for the next result.
  - Reveal explains fit in human language, not scoring terms.

- `[ ]` Specific companion path
  - Replace "make someone" framing with "I'm waiting for someone else."
  - User describes who they hoped would answer.
  - Follow-up questions shape feeling, role, voice, pace, boundaries, ritual, appearance, name, and first message.
  - Preview shows portrait, name, first message, and what shaped them.

- `[ ]` First conversation
  - Browse, Match, default companion, and Specific paths all arrive in chat.
  - First message reflects the user's path and recent choices.
  - The large portrait remains present beside or above the conversation.
  - Chat only needs the first preview exchange to feel designed.

- `[ ]` Mock paywall
  - Appears only when the user tries to continue beyond the preview conversation.
  - Does not block reaching the first conversation.
  - No real payment, auth, checkout, or account setup.

- `[ ]` States and recovery
  - Loading uses narrative copy and portrait transitions, not generic spinners.
  - Restrictive choices still produce best-fit companions.
  - Variant/image fallback keeps the current viable portrait and offers adjacent directions.
  - Chat send and paywall mock failures are inline and calm.

- `[ ]` Mobile pass
  - Portrait-first layout.
  - Bottom chat sheet.
  - Large tap targets.
  - Portrait state thumbnails or subtle confirmation moments.

- `[ ]` Desktop pass
  - Split-presence layout: conversation plus large portrait.
  - Optional portrait state strip.
  - Minimal navigation.

- `[ ]` Copy pass
  - Remove form/funnel language.
  - Avoid "submit", "next step", "complete your profile", and "make someone."
  - Use direct conversational copy: "stay with you", "I'm waiting for someone else", "keep talking", "say hi."

## Legacy Code Audit

Before implementation starts, audit the current codebase and decide what to keep:

- `[ ]` Keep, adapt, or replace the app shell.
- `[ ]` Keep, adapt, or replace UI primitives.
- `[ ]` Replace the old opening screen if it cannot support portrait-first chat.
- `[ ]` Replace or heavily revise `/browse`, `/match`, `/create`, and `/chat/[id]` if they keep the old route-first mental model.
- `[ ]` Decide whether existing static character data is useful for new seed companions.
- `[ ]` Decide whether existing Playwright screenshots still match the new product surface.

## Asset Needs

- `[ ]` 3-5 seed companion portrait sets.
- `[ ]` Default companion portrait and states.
- `[ ]` Quick-match reveal portrait states.
- `[ ]` Specific-companion in-progress and final portrait states.
- `[ ]` Mobile crops for portrait-first layout.
- `[ ]` Blurred/soft fallback backgrounds.

## Suggested Next Build Step

Start with the first-screen shell:

1. Build a full-screen desktop split layout and mobile portrait-first layout.
2. Place the default companion portrait as the primary visual surface.
3. Add the first chat question and four intent replies.
4. Wire only enough state to prove that a reply changes copy and portrait state.
5. Keep the rest mocked until the core interaction feels right.

This is the highest-leverage slice because every path depends on the user believing the conversation and portrait are the product.

## Verification Target

When meaningful UI work begins, verify:

- first screen at desktop and mobile sizes
- one full path to first conversation
- portrait changes after at least two interactions
- best-fit fallback never shows a dead-end
- paywall appears only after the preview exchange

Run lint/typecheck/build when implementation changes are made. For visible UI work, use Playwright screenshots and review outputs before handoff.
