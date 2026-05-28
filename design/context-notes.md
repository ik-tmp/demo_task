# Companion Funnel Design Notes

## Active Direction

The active visual direction is Casting Hall: a full-bleed cinematic reel introduces companions before the user chooses browse, match, or create. The product should feel like a cast reveal followed by an intimate first conversation.

## Active Concept References

- `concept-07-reel-cold-open.png` - active reel entry reference.
- `concept-08-match-reveal.png` - active narrated match reveal reference.
- `concept-09-create-reveal.png` - active create reveal reference.

Use these for layout, tone, density, and palette when building new Direction B surfaces.

## Historical Concepts

The earlier images are Direction A explorations. They can still help with atmosphere and portrait/chat pairing, but they are not source-of-truth layouts:

- `concept-01-presence-split.png`
- `concept-02-mobile-portrait-funnel.png`
- `concept-03-conversational-creator.png`
- `concept-04-chat-with-presence.png`
- `concept-05-default-companion-entry.png`
- `concept-06-preview-continuation-paywall.png`

Do not revive the single default-companion opening screen from these concepts without explicit product redirection.

## Visual Principles

- Portraits and vignettes are the main product surface.
- The reel should feel cinematic, not like a marketplace carousel.
- Chat/funnel UI should sit lightly over or beside the portrait and must never cover the face-safe region.
- Use dark base colors, warm portrait highlights, editorial names, and restrained motion.
- Keep controls quiet and direct: text affordances, chips, small icon-supported actions.
- Avoid generic onboarding, stepper, dashboard, and card-grid language.

## Asset Notes

Runtime assets live under `public/companions/`:

- Cast: `iris`, `noa`, `mira`, `sasha`
- Create stages/templates: `create`
- Shared fallbacks: `_shared`

The prompt and inventory source is `docs/ASSET-PROMPTS.md`.
