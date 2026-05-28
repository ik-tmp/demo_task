# Product Spec: Casting Hall

This is the active product and design spec for the AI companion entry prototype. It replaces the retired Direction A default-companion funnel and the earlier proposal docs.

The assignment goal remains: build the path a new user takes from app open to a first conversation with a character. This product handles browse, quick match, and create through one cinematic entry system.

## 1. Product Promise

The app opens like a cast reveal. Before the user fills out anything, they see generated companions in cinematic vignettes. From that reel they can:

- tap a companion and start from that person
- show all companions
- ask the product to choose
- describe who they want

Every path reaches a first preview conversation. The paywall appears only after the preview conversation is spent.

## 2. Cast

The current cast:

| Companion | Energy    | Reel moment                     | Product role                |
| --------- | --------- | ------------------------------- | --------------------------- |
| Iris      | listener  | reading by a window at dusk     | calm, gentle, unhurried     |
| Noa       | provoker  | mid-laugh at a kitchen counter  | witty, warm, sharp          |
| Mira      | guide     | walking through a city at night | direct, grounded, practical |
| Sasha     | confidant | at a desk in late lamp light    | patient, thorough, steady   |

All four have generated reel, neutral, warm, curious, closer, and final-chat assets. Sasha is supported in data and assets, but ranking keeps her behind the first three launch energies unless user signals point toward her.

## 3. Reel Entry

The first screen is the product surface, not a landing page.

Desktop:

- Full-bleed reel fills the viewport.
- Companion name uses editorial type over the lower-left image area.
- A one-line premise sits beneath the name.
- The bottom affordances are quiet: `show all companions`, `choose someone for me`, `describe who you want`.
- Progress dots show reel position.

Mobile:

- Same full-bleed treatment with responsive crop.
- Face-safe rules still apply.
- Bottom controls stay below the face-safe region.

Reel behavior:

- Vignettes auto-advance with a short cross-fade and subtle still-image motion.
- The order is ranked locally from time of day, `?from=`, prior rejected ids in `sessionStorage`, and small deterministic jitter.
- Tapping a vignette interrupts the reel and routes to `/companion/[id]`.
- `show all companions` routes to `/gallery`.
- `choose someone for me` routes to `/match`.
- `describe who you want` routes to `/create`.

## 4. Layout Rules

These rules apply to every surface with a companion portrait: reel, browse, gallery, match, create, first chat, and paywall.

- The portrait is the emotional anchor.
- Every companion has a face-safe region.
- No chat sheet, chip row, input, host line, modal, paywall, or overlay may cover the face-safe region.
- On mobile, the chat sheet sizes to content, caps below the face-safe region, and scrolls internally when content is taller than the cap.
- On desktop, the portrait receives the wider side of the split. The shared shell uses a stable 34/66 chat/portrait split.
- The top of any mobile chat sheet uses a soft blend/blur edge. Text and controls sit below the readable opaque area.
- Ultra-wide layouts preserve image aspect ratio rather than stretching the portrait.

Any face-safe violation is a product bug, not a polish issue.

## 5. Shared Funnel Shell

After the reel, browse, match, and create use the same basic shell:

- large portrait or vignette
- chat/control panel
- one short prompt at a time
- chips for low-friction answers
- free text where specificity matters
- removable answer pills where relevant
- dot trail for implied progress
- short narrated loading lines
- back behavior that preserves prior answers
- escape routes back to reel, gallery, or chat

The shell should feel conversational, but it still needs forward motion. Every answer should visibly affect copy, ranking, portrait state, or the reveal.

## 6. Browse

Browse starts in two ways:

- tapping a face in the reel
- opening `show all companions`

### Vignette Funnel

Tapping a companion opens a short profile/funnel for that person:

- large vignette remains present
- name and premise are shown
- user can say hi immediately
- user can view sample first messages
- user can ask a small number of deterministic preview questions
- user can ask for softer/sharper or open the gallery

Browse users should not be forced through a long interview.

### Gallery

The gallery is a hero + grid discovery surface.

- The top-ranked companion is presented as a large best-fit hero vignette.
- The remaining companions fill a portrait-tile grid below the hero.
- A dedicated "create your own" tile in the grid routes to `/create` and is the
  one tile that reads as an action rather than a face.
- A few locked placeholder tiles sit behind the mock paywall as the rest of the
  cast (portraits generated later). Tapping a locked tile opens the paywall in
  its "unlock the full cast" framing.
- Locked placeholders live in `src/data/gallery-placeholders.ts`, kept out of
  `companions.json` so they never enter reel/match/create ranking.
- Search accepts natural phrases and maps them to tags deterministically.
- Refinement chips reorder results (and the hero) rather than filtering them out.
- Active refinements persist as removable pills.
- The gallery never empties. If a query is restrictive, the hero shows the
  closest fit.
- Any active companion can route to `/chat/[id]?from=browse`.

## 7. Quick Match

Match is for users who want the product to decide.

The current question set:

1. How should the first message make the user feel?
2. What should the companion do at the start?
3. What should the first few messages feel like?
4. What should the conversation avoid?
5. Optional familiarity question if the prior answers leave multiple close candidates.

Match requirements:

- Keep the flow short.
- Show the candidate portrait resolving from blurred to sharp.
- Use narrated reveal lines instead of a spinner.
- Explain the match with human rationale, not scores.
- Treat rejection as signal: ask whether the miss was look, voice, or energy.
- After two misses, offer the create path.

## 8. Create

Create is framed as describing who the user wanted to meet. It should not feel like profile construction.

The current flow:

1. Feeling
2. Role
3. Voice sample
4. Look/setting
5. Boundary
6. Optional context line
7. Name
8. Reveal

Create requirements:

- The in-progress vignette should visibly resolve as the user answers.
- Voice is demonstrated with sample first lines, not adjective-only labels.
- Look is mood-led, not a body/face slider panel.
- Free text can infer signals and skip forward.
- The reveal shows name, premise, what shaped them, and a first-message preview.
- The reveal always produces a viable companion or template.

## 9. First Chat

The first chat is the destination.

Before the opener, the app may ask:

- what the companion should call the user
- one lightweight context line if no context was captured earlier

The first companion message must reflect the path:

- Browse: references the companion or filters/refinements that led there.
- Match: references the match rationale or avoidances.
- Create: references the described intent and shaping choices.
- Direct: still gives a coherent opener.

The preview only needs the first few turns to feel designed. Replies are deterministic and companion-specific.

## 10. Mock Paywall

The paywall is a continuation gate.

- Never appears during the reel or funnel.
- Never blocks the first chat opener.
- Appears only after the preview chat is spent.
- Uses fake plans and fake unlock behavior.
- Mock unlock can stream bonus lines and re-enable input.
- No real checkout, account creation, payment collection, or subscription backend.

## 11. How AI Shows Up

All AI-like behavior is deterministic in the prototype, but the product should make the ideas visible:

- Ranking: reel and gallery order respond to query, time, refinements, and prior rejections.
- Matching: quick match scores companions locally and explains the result in human language.
- Suggestions: create offers voice samples, names, and shaping prompts.
- Generation: generated assets, in-progress create stages, and template reveals make the companion feel assembled.
- Personalization: first chat uses name, context, match answers, create answers, and browse refinements.

Keep these behaviors behind typed helpers and data tables so real model calls can replace them later.

## 12. State And Scope

- Use `sessionStorage` via Zustand for local demo state.
- Use static JSON/data modules for companions and dialogue.
- Do not add backend persistence.
- Do not add auth.
- Do not add real payments.
- Do not add analytics.
- Do not add runtime model/image calls.
- Do not build deep chat intelligence past the preview.

## 13. Recovery States

Required recovery behavior:

- Gallery never shows an empty result.
- Match always produces a best available reveal.
- Create always resolves to a companion or template.
- Image load failures should keep the current viable portrait and show calm copy.
- Chat send failures should show inline retry copy.
- Paywall failure should be calm and non-destructive.
- Sensitive or out-of-scope text should redirect to adult, respectful, fictional choices.

Some recovery states are still implementation gaps; see `docs/IMPLEMENTATION.md`.

## 14. Active Routes

- `/` - reel entry
- `/gallery` - full-screen discovery
- `/companion/[id]` - companion vignette funnel
- `/match` - quick match
- `/create` - create funnel
- `/chat/[id]` - preview conversation and paywall

Retired Direction A routes such as `/browse` and `/c/[id]` should not be restored unless the product plan changes.
