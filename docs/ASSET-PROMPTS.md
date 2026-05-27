# Asset Prompts for Direction B

Generative-image prompts for **every asset the Direction B implementation needs** — cast vignettes, state variants, Create-path imagery, UI fallbacks — plus a small section of screen-mockup prompts (§D) for design preview when needed. Model-agnostic, written for natural-language image generators (the built-in tool, Imagen, Flux Pro, Midjourney v6/v7, etc.). Tags like `--ar` are intentionally omitted; aspect ratio is named in words instead.

**Existing assets to reuse.** Mira already has a generated portrait state set per `docs/IMPLEMENTATION.md` (`public/companions/mira/`). She becomes one of the four reel cast members. Her state set covers chat/funnel use; she needs *one additional* asset for her reel role (A5).

**Conventions.**
- All companion portraits: adult, fully clothed, non-explicit, photoreal, cinematic editorial style.
- **Desktop-primary, mobile-fallback.** The product is presented on desktop. Mobile is a responsive fallback derived by cropping the same source image, not a separately-generated asset. Generate **one** high-resolution 16:9 source per companion per state and let display CSS handle the mobile crop. This halves asset volume and guarantees identity match across viewports.
- **Compose for both crops.** Keep the face/subject roughly in the right-center portion of the 16:9 frame (not far-left, not against the right edge). Desktop uses the full frame with typography in the lower-left negative space; mobile crops right-of-center (CSS `object-position: 70% center` or similar) so the face stays framed. If you push the face all the way to one edge, the mobile crop breaks.
- Lighting and palette are part of each companion's voice. Don't merge them.
- All UI mockups (§D): include placeholder text only where labeled; expect to do a real pass in Figma/code afterward — AI models will hallucinate text.

---

## A. Cast Vignettes (Reel Content + Funnel/Chat States)

Three new companions (Iris, Noa, Sasha), each needing a primary cinematic still plus four state variants. Plus one Mira-specific reel vignette (her existing portrait states don't cover her reel premise).

### A1 — Iris primary (listener, reading by a window at dusk)

> Cinematic editorial portrait, 16:9 aspect, high resolution (target ≥2944×1656). A woman in her early thirties seated by a large window at dusk in a quiet modern apartment. Soft warm-to-cool gradient light from the window falls low-contrast across her face. She has just lowered an open paperback book to her lap and lifted her gaze toward the camera with a small, attentive half-smile. Intelligent, calm eyes. Hair loosely tied back. Wearing a simple cream knit sweater, no jewelry. The room behind her is softly out of focus — a hint of bookshelves, a ceramic mug on the windowsill, the suggestion of late dusk sky beyond the glass. Shot on 50mm lens, shallow depth of field, subtle natural film grain. Muted palette of warm beige, faded denim, slate blue. **The subject is positioned right-of-center in the frame** (roughly the right third), leaving quiet negative space toward the lower-left third for editorial typography overlay. **Composition must survive a right-of-center vertical crop to 9:19 mobile aspect with the face still well-framed.** Premium, intimate, unhurried mood. Adult, fully clothed, non-explicit. Photoreal.

**Save as:** `public/companions/iris/iris-neutral.png`

### A2 — Noa primary (warm and sharp, mid-laugh at a kitchen counter)

> Cinematic editorial portrait, 16:9 aspect, high resolution (target ≥2944×1656). A woman in her early thirties standing at a kitchen counter at night in a warm city apartment. Caught mid-laugh, head tilted slightly back, an easy, lived-in smile. One hand rests on the counter beside a half-full glass of red wine. Warm tungsten under-cabinet light illuminates her face from below; a darker apartment window behind her holds the soft bokeh of distant city lights. Wearing an oversized soft linen shirt, sleeves rolled. Hair down and a little mussed. Visible wit in her eyes — not performed, just there. Marble counter, a wooden cutting board, a piece of fruit. Shot on 35mm lens, shallow depth of field, gentle film grain. Warm amber and ink-blue palette, with deep shadow holding the rest of the room. **The subject is positioned right-of-center in the frame** (roughly the right third), leaving quiet negative space toward the lower-left third for editorial typography. **Composition must survive a right-of-center vertical crop to 9:19 mobile aspect with the face still well-framed.** Intimate evening mood. Adult, fully clothed, non-explicit. Photoreal.

**Save as:** `public/companions/noa/noa-neutral.png`

### A3 — Sasha primary (thoughtful, at a desk in late lamp light)

> Cinematic editorial portrait, 16:9 aspect, high resolution (target ≥2944×1656). A woman in her late thirties seated at a wooden desk in a study, late at night. A single warm green-shaded brass desk lamp casts a pool of golden light across papers, an open notebook, and her hands. She is glancing up toward the camera with a thoughtful, faintly amused expression — interrupted from reading, not annoyed. Fine wire-frame glasses sit low on her nose. Wearing a charcoal cashmere cardigan over a soft white shirt. Hair pulled back, a few strands loose. The rest of the room dissolves into deep shadow — walls of bookshelves only barely suggested. Mid-shot framing. Shot on 50mm lens, shallow depth of field, natural film grain. Palette of warm amber lamp light against deep teal-shadow, like a Vermeer reimagined as a film still. **The subject is positioned right-of-center in the frame** (roughly the right third), leaving quiet negative space toward the lower-left third for editorial typography. **Composition must survive a right-of-center vertical crop to 9:19 mobile aspect with the face still well-framed.** Scholarly, intimate, late-night mood. Adult, fully clothed, non-explicit. Photoreal.

**Save as:** `public/companions/sasha/sasha-neutral.png`

### A4 — State Variants (Iris, Noa, Sasha)

Each of A1/A2/A3 needs four state variants: **warm, curious, closer, final-chat**. These match Mira's existing state set so the funnel/chat code treats every cast member identically.

**Generate via image-to-image from the primary.** Use the A1/A2/A3 output as the reference image and a short delta prompt for each state. Text-to-image alone will give you a different face every run; identity continuity is the whole point of the state set.

**Delta prompts (same shape for Iris/Noa/Sasha — adjust the character name and setting reference in the model's input).**

**Warm state.**

> Same character, same room, same wardrobe as reference image. The lighting has shifted warmer — softer golden tone, slightly closer key light, less ambient. Her expression has loosened: lips parted in a small attentive smile, eyes a touch warmer. Camera distance unchanged. Same right-of-center subject placement, same lower-left negative space. 16:9 aspect, high resolution, photoreal.

**Curious state.**

> Same character, same room, same wardrobe, same lighting as reference image. Her head is tilted slightly toward the camera, eyebrows raised a fraction, gaze sharpened by interest. Lips closed in a thoughtful neutral. Camera distance unchanged. Same right-of-center placement, same lower-left negative space. 16:9 aspect, high resolution, photoreal.

**Closer state.**

> Same character, same room, same wardrobe, same lighting and mood as reference image, but the camera has moved closer — tighter crop, head and shoulders only, the room recedes into shallower depth. Her expression is settled and attentive, gaze directly at camera. The face occupies the right half of the frame; the lower-left third still holds quiet space for typography, now at closer scale. 16:9 aspect, high resolution, photoreal.

**Final-chat state.**

> Same character, same room, same wardrobe as reference image. Lighting is settled and warm — the "we are talking now" state. She is looking directly at the camera with relaxed, attentive eyes, a soft natural smile. Camera distance similar to the primary, perhaps slightly tighter. Subject right-of-center, lower-left typography space preserved. This is the resting state used during first chat. 16:9 aspect, high resolution, photoreal.

**Save as:**
- `public/companions/iris/iris-{warm,curious,closer,final-chat}.png`
- `public/companions/noa/noa-{warm,curious,closer,final-chat}.png`
- `public/companions/sasha/sasha-{warm,curious,closer,final-chat}.png`

### A5 — Mira's Reel-Specific Vignette (city at night)

Mira's existing set covers portrait/chat states. Her reel premise per `docs/DIRECTION-B.md` §4 is "walking through a city at night, half-turned" — none of her existing files match that. Generate one additional vignette to add to her set.

> Cinematic editorial vignette, 16:9 aspect, high resolution (target ≥2944×1656). **Use Mira's existing primary portrait as the reference image** so her identity is preserved. Mira walking along a city street at night, caught half-turned back toward the camera mid-stride. Wet pavement reflects warm neon and amber streetlights. A blurred awning, a passing taxi's tail lights, a distant figure deep in the shadow. She wears a long dark coat over her usual wardrobe; hair catches the wind. Visible energy — she knows where she is going. Cool blue-violet ambient with warm amber highlights. Subject right-of-center, quiet space in the lower-left for typography. Composition must survive a right-of-center crop to 9:19 mobile. Shot on 35mm lens, gentle motion blur on the background, sharp on her face. Cinematic, late-night, urban-intimate. Adult, fully clothed, non-explicit. Photoreal.

**Save as:** `public/companions/mira/mira-reel.png` (mobile crop derived by CSS)

---

## B. Create Path Assets

Two clusters: **in-progress vignette stages** (the figure visibly resolving during the Create funnel), and **pre-rendered created-companion templates** (the final outputs the funnel can deterministically land on).

### B1 — In-Progress Vignette Stages (4 frames)

Four frames depicting a user-built companion materializing during the Create funnel: silhouette → room shape → posture → face emerging. The fifth frame is whichever B2 template the funnel lands on. The four stages are **archetype-agnostic** — the same four frames are used regardless of which template will follow, so they need to be visually generic enough to blend into any final.

All four share: 16:9 wide aspect, high resolution, the same warm-room-at-night base setting, low-contrast cinematic lighting, the same right-of-center subject placement, the same lower-left negative space.

**Stage 1 — Silhouette.**

> Cinematic abstract editorial frame, 16:9 aspect, high resolution. A single human-shaped silhouette positioned right-of-center in an unresolved warm-lit room. The figure is dark against a soft amber gradient — no facial features, no wardrobe definition, just the outline of a seated person facing the camera. Background is impressionistic, suggesting a warm interior without resolving any specific surface. Lower-left third holds quiet space. Palette: deep amber, ink, soft shadow. Mood: anticipation, becoming. Photoreal but intentionally unresolved.

**Stage 2 — Room shape.**

> Same frame and silhouette as Stage 1, but the room behind her now begins to take shape: a kitchen counter is visible with warm under-cabinet light, a darker window beyond. The figure is still a silhouette — no face, no specific wardrobe — but the environment is now legible. Same lower-left negative space. Same palette, slightly brighter overall.

**Stage 3 — Posture.**

> Same scene as Stage 2, but the figure now has resolved posture: a woman seated at the kitchen counter, leaning slightly on one elbow, body language settled. Face still indistinct — features blurred, no specific identity. Wardrobe takes shape as a soft warm garment. Lighting has resolved further; a wine glass on the counter is now visible. Same composition, same negative space.

**Stage 4 — Face emerging.**

> Same scene as Stage 3, but the face has begun to resolve — features visible but soft, as if seen through gauze. Wardrobe fully defined (linen shirt, soft warm color). The composition is now nearly final; only the last layer of resolution is missing. The next frame is the fully-resolved B2 template the funnel lands on.

**Tip:** Generate Stage 4 as a slight Gaussian blur of the most common B2 template (Noa-like, B2-#1) rather than from scratch — this guarantees the morph into the final vignette feels continuous.

**Save as:** `public/companions/create/in-progress-{1,2,3,4}.png`

### B2 — Created-Companion Templates (3 net new)

Six total templates cover the common combinations of Create funnel answers. **Three reuse existing cast assets** (no new generation); **three are net new.**

| # | Funnel combination | Archetype | Asset source |
|---|---|---|---|
| 1 | warmth + confidant + warm-apartment + night-window | Noa-like | Reuse Noa A2 |
| 2 | nerve + challenger + sharp-city-energy | Vera-like | **New** — see below |
| 3 | patience + mentor + older-soul + soft-studio-light | Sasha-like | Reuse Sasha A3 |
| 4 | mischief + storyteller + warm-apartment | Playful confidant | **New** — see below |
| 5 | honesty + companion + soft-studio-light | Gentle direct | **New** — see below |
| 6 | calm + muse + night-window + classic-beauty | Quiet observer | Reuse Iris A1 |

**Template #2 — Vera-like (nerve + challenger + sharp city energy).**

> Cinematic editorial portrait, 16:9 aspect, high resolution. A woman in her early thirties standing in a tall-ceilinged loft at night, sharp city lights through floor-to-ceiling windows behind her. Body angled, weight on one foot, arms crossed loosely — composed, ready to push back. Direct gaze, hint of challenge in her expression. Black turtleneck, fine silver jewelry. Sharp high-contrast lighting — cool ambient mixed with hard amber from a single off-screen lamp. Subject right-of-center, lower-left negative space. Composition must survive a right-of-center crop to 9:19 mobile. Cool slate and amber palette. Adult, fully clothed, non-explicit. Photoreal.

**Save as:** `public/companions/create/template-2-vera.png`

**Template #4 — Playful confidant (mischief + storyteller + warm apartment).**

> Cinematic editorial portrait, 16:9 aspect, high resolution. A woman in her early thirties curled into the corner of a deep velvet sofa in a warm lamp-lit living room, knees pulled up, mid-anecdote with a half-smile. One hand gestures mid-sentence; the other holds a glass of wine on her knee. Books and a turntable in the soft background. Amber lamp light from the side, deep shadow opposite. Soft cardigan and worn jeans. Subject right-of-center, lower-left negative space. Cinematic, intimate, storytelling mood. Warm gold-amber palette against deep teal-shadow. Adult, fully clothed, non-explicit. Photoreal.

**Save as:** `public/companions/create/template-4-playful.png`

**Template #5 — Gentle direct (honesty + companion + soft studio light).**

> Cinematic editorial portrait, 16:9 aspect, high resolution. A woman in her early thirties seated in a clean, softly-lit room — minimal warm white walls, a single soft studio light from above-left. Calm, direct eye contact, attentive posture, hands loosely folded. Wearing a soft cream sweater. Hair down, settled. The room is intentionally calm and uncluttered — no clutter, just space. Subject right-of-center, lower-left negative space. Composition must survive a right-of-center crop to 9:19 mobile. Neutral warm palette, gentle quiet mood. Adult, fully clothed, non-explicit. Photoreal.

**Save as:** `public/companions/create/template-5-gentle.png`

---

## C. UI Fallbacks

Small atomic assets for fallback states.

### C1 — Blurred Portrait Placeholder

For initial portrait load and image-load fallback. Can usually be derived in CSS via `filter: blur(40px)` on an existing portrait — no new generation needed. If you want a generated tone-true placeholder rather than a derived blur:

> Cinematic abstract editorial frame, 16:9 aspect. A heavily blurred warm-toned image with no resolvable features — impressionistic warm beige, soft amber, and slate-blue color fields gently gradient-blending. As if a portrait were dissolved into pure color. No subject, no edges. Mood: anticipation, soft warmth.

**Save as:** `public/companions/_shared/portrait-blur.png` (optional — only if you want a generated version rather than CSS-derived)

### C2 — Soft-Fail Backdrop (image error)

Shown when a portrait variant fails to load and no fallback is available. Calm, on-brand, non-jarring.

> Cinematic editorial frame, 16:9 aspect. A quiet empty room interior at dusk — soft cream walls, a single warm lamp glow off-screen casting a pool of light across an unoccupied chair and the corner of a window. Dust motes barely visible in the light. No human subject. Deep shadow in the corners. Warm beige and slate-blue palette. Mood: someone just stepped out. Photoreal.

**Save as:** `public/companions/_shared/soft-fail.png`

### C3 — Ambient In-Between Background

Used when no companion is active — between the reel ending and the funnel starting, or during transitions where the previous portrait has faded but the next hasn't resolved. Warm, atmospheric, never empty-feeling.

> Cinematic editorial frame, 16:9 aspect. A softly out-of-focus warm interior — a hallway leading toward warm lamp light, a curtain moving slightly, the suggestion of a doorway. No human subject. Deep shadow with warm amber highlights. Painterly bokeh. Mood: arriving, anticipation. Warm gold-amber palette against deep slate. Photoreal.

**Save as:** `public/companions/_shared/ambient-between.png`

---

## D. Screen Mockups (Key Flow Moments, for design preview)

These are for design preview, not runtime assets. The image model will produce a *visual composition* — typography and chip text will need to be replaced in a design pass. The photographic portion is the high-quality bit; UI elements are blocked-out placeholders the model can render approximately.

### D1 — Reel Cold-Open (desktop, 16:9)

The headline screen. Full-bleed cinematic vignette with quiet typography and three text affordances. No nav, no chrome, no buttons. Desktop is the presented surface; mobile is a derived crop (see below).

> Desktop browser UI mockup, 16:9 wide aspect, dark elegant app interface, no browser chrome shown. The entire viewport is filled by a cinematic photoreal editorial portrait of a woman in her early thirties seated by a large window at dusk, just lifting her gaze from a book she has lowered to her lap. The subject is positioned right-of-center in the frame; the lower-left third holds quiet negative space. Soft warm-cool gradient window light. The portrait extends edge to edge — no status bar, no top chrome, no bottom nav bar. Overlaid in the lower-left third, in elegant serif editorial typography in soft warm white: the name "Iris" set large on its own line, and beneath it in a smaller sans-serif body face: "Listens before she answers." Centered toward the bottom of the screen, in a quiet sans-serif body face: a single line reading "Who do you want to start with?". Beneath that line, a row of three small text affordances separated by middle dots, all lowercase: "see everyone · pick for me · describe someone else." Above the bottom edge, a row of four small horizontal dots indicating reel progress — the second dot subtly brighter than the others. Premium, cinematic, restrained. Warm beige and slate blue palette.

**Mobile fallback (derived crop, not a separate generation).**
- The mobile reel is the same 16:9 source image, displayed full-bleed on a 9:19 viewport with `object-fit: cover; object-position: 70% center` (or equivalent), so the right-of-center subject stays in frame.
- Editorial typography is re-laid out in code for the narrower viewport — name and premise still lower-left of the visible mobile crop, the "Who do you want to start with?" line and three affordances stack near the bottom of the mobile viewport.
- Don't generate a separate 9:19 mockup; trust the CSS crop + typography re-layout.

**Save as:** `design/concept-07-reel-cold-open.png`

### D2 — Match Reveal Surface (desktop, 16:9)

The narrated-reveal payoff: the companion's vignette has just resolved from blurred to sharp, alongside a "Why her" panel.

> Desktop browser UI mockup, 16:9 wide aspect, dark elegant app interface, no browser chrome shown. The right two-thirds of the screen is a full-bleed cinematic photoreal editorial portrait of a woman in her early thirties seated by a window at dusk, sharply in focus, warm low-contrast natural light, calm attentive expression — the same "Iris" character from A1. Overlaid on the portrait in the lower-left of that portrait region, in elegant serif editorial typography in soft warm white: the name "Iris" set large. The left third of the screen is a dark slate UI panel with refined typography. From top of the panel downward: a small block of three short word-pills in a row, each pill rounded, dark with light text, reading "calmer," "listen," "not push." Below the pills, a chat-bubble shape (rounded rectangle, slightly lighter than the panel background) containing two short lines of sans-serif placeholder text. Below the bubble, a small subheading in small caps light gray reading "Why her," followed by three short bullet lines of light gray sans-serif placeholder text. At the bottom of the left panel, four soft text affordances on a single line separated by middle dots: "say hi · show me another · show similar · open everyone." Premium, quiet, cinematic. Warm beige and slate blue palette on the right, deeper slate on the left, with very subtle warm-white typography.

**Save as:** `design/concept-08-match-reveal.png`

### D3 — Create Reveal Surface (desktop, 16:9)

The most generative-feeling moment in the flow.

> Desktop browser UI mockup, 16:9 wide aspect, dark elegant app interface, no browser chrome shown. The right two-thirds of the screen is a full-bleed cinematic photoreal editorial portrait of a woman in her early thirties at a kitchen counter at night, caught mid-laugh, glass of red wine, warm tungsten lighting, intimate evening mood — the same "Noa" character from A2. Overlaid on the portrait in the lower-left of that region, in elegant serif editorial typography in soft warm white: the name "Noa" set large, and beneath it in a smaller serif italic line: "Will tell you the joke and then ask the real question." The left third of the screen is a dark slate UI panel. From top of the panel downward: a small subheading in small caps light gray reading "What shaped them," followed by four short bullet lines of light gray sans-serif placeholder text. Below that, a chat-bubble shape (rounded rectangle, slightly lighter than the panel) containing two lines of serif italic placeholder text. Below the bubble, a small subheading in small caps reading "adjust," followed by a row of six small word-chips in two rows: "warmer," "sharper," "older," "younger," "closer," "different room." At the bottom of the left panel, a single large primary button — wide pill shape, warm cream fill with dark serif text — reading "meet Noa." Premium, cinematic, generative-feeling. Warm amber and slate palette.

**Save as:** `design/concept-09-create-reveal.png`

---

## E. Production Notes

**Generating consistent characters across states.**
After A1/A2/A3 produce a primary portrait, lock the description (face, hair, clothing, room) and only change the *state* axis: lighting, posture, expression, distance from camera. Models do not preserve identity across runs unless you use a reference-image feature. **Always use image-to-image from the primary** for the four state variants (A4). Text-to-image alone will give you a different face every time and the state set will look like five different people.

**Generating consistent UI across screens.**
For D1/D2/D3, lock the palette ("warm beige, slate blue, soft warm white typography"), the type style ("elegant serif display, refined sans-serif body, small caps subheadings"), and the panel treatment ("dark slate, generous whitespace, magazine density"). Generate all three screens in the same session with the same model for a designed look.

**What models will get wrong (plan for cleanup):**
- All small text (chip labels, suggested replies, bullet lines, name labels in mockups). Treat as placement guides only.
- Specific UI iconography. Don't ask for icons; ask for type.
- Aspect ratio precision — most models round to their nearest supported ratio. Crop in post if needed.
- Composition of "blurred figure resolving" for the Match mid-flow funnel state — omitted deliberately. That one is better produced by compositing the final cast vignette (A1, etc.) under a Gaussian blur in CSS than by prompting a model to render "intentionally low-contrast and resolving."

**Total new assets — punch list.**

Required for floor demo (Tier 1 only, Sasha sketched):
- Iris primary + 4 variants = 5 files
- Noa primary + 4 variants = 5 files
- Mira reel vignette = 1 file
- Explicit Iris and Noa reel stills = 2 files
- = **13 files.**

**Generated status — Tier 1 floor demo (updated May 28, 2026).**

Generated with the built-in image generation tool and copied into the repo:

- `[x]` `public/companions/iris/iris-neutral.png`
- `[x]` `public/companions/iris/iris-reel.png`
- `[x]` `public/companions/iris/iris-warm.png`
- `[x]` `public/companions/iris/iris-curious.png`
- `[x]` `public/companions/iris/iris-closer.png`
- `[x]` `public/companions/iris/iris-final-chat.png`
- `[x]` `public/companions/noa/noa-neutral.png`
- `[x]` `public/companions/noa/noa-reel.png`
- `[x]` `public/companions/noa/noa-warm.png`
- `[x]` `public/companions/noa/noa-curious.png`
- `[x]` `public/companions/noa/noa-closer.png`
- `[x]` `public/companions/noa/noa-final-chat.png`
- `[x]` `public/companions/mira/mira-reel.png`

All generated Tier 1 files are `1672x941` PNGs. This matches the existing Mira desktop-wide set but is below the original target resolution of `>=2944x1656`; regenerate at higher resolution later if the final Direction B build needs sharper large-display or mobile-crop output. `iris-reel.png` and `noa-reel.png` are explicit reel-facing stills generated after the initial state sets so the Direction B cold-open can address every reel asset with a consistent `*-reel.png` path.

Required for comfortable demo (everything in §A, §B, §C):
- §A: 15 cast files (5 per companion × 3) + 1 Mira reel + 2 explicit Iris/Noa reel stills = 18 files
- §B: 4 in-progress stages + 3 net new templates = 7 files
- §C: 0–3 fallback files (most can be CSS-derived)
- = **25–28 files total.**

**Suggested generation order:**
1. A1 Iris primary — single file, validates style fidelity to the doc before committing to 20+ generations.
2. A4 Iris variants via image-to-image from A1.
3. A2 Noa primary + A4 Noa variants.
4. Iris/Noa explicit reel stills (`iris-reel.png`, `noa-reel.png`) if the implementation should use dedicated reel paths instead of `neutral`.
5. A3 Sasha primary + A4 Sasha variants.
6. A5 Mira's reel-specific vignette via image-to-image from her existing primary.
7. B1 in-progress stages (Stage 4 derived from B2 #1 Noa, others fresh).
8. B2 net-new templates (#2 Vera, #4 Playful, #5 Gentle).
9. C2 / C3 fallbacks (skip C1 if CSS blur is acceptable).
10. D1 / D2 / D3 screen mockups for design preview — only if needed; the existing `concept-07/08/09` files in `design/` already cover these per `IMPLEMENTATION.md`.

**Where outputs land in the repo.**

The convention for **new companions** is a flat directory per companion — one file per state, no `desktop/`/`mobile/`/`thumbnails/` subdirectories, since CSS handles all crops from the single high-res source.

```
public/companions/iris/
├── iris-neutral.png        ← A1, 16:9 high-res primary
├── iris-reel.png           ← explicit cold-open reel still
├── iris-warm.png           ← A4 warm variant (image-to-image from primary)
├── iris-curious.png        ← A4 curious variant
├── iris-closer.png         ← A4 closer variant
└── iris-final-chat.png     ← A4 final-chat variant
```

Same shape for `public/companions/noa/` and `public/companions/sasha/`.

**Mira is the exception (legacy layout).** Her existing directory predates the single-source strategy:

```
public/companions/mira/
├── mira-{neutral,warm,curious,closer,final-chat}.png   ← legacy mobile-portrait sources
├── desktop/
│   └── mira-{state}-desktop.png                        ← legacy desktop-wide (1672×941)
└── thumbnails/
    └── mira-{state}-thumb.png                          ← legacy square crops (360×360)
```

The new A5 reel vignette drops into the flat root: `public/companions/mira/mira-reel.png`.

**Mira migration to the flat layout — required as part of the Direction B rebuild, not before.**

Do not migrate while the current implementation is still loading from the legacy paths — you'll break the existing build for no gain (the existing build is already flagged `[~]` in `IMPLEMENTATION.md`). At rebuild time:

1. Promote each `mira/desktop/mira-{state}-desktop.png` to `mira/mira-{state}.png` (these are the 16:9 sources — they become Mira's single source per state, replacing the legacy mobile-portrait files of the same name).
2. Delete the legacy `desktop/` subdirectory.
3. Delete the `thumbnails/` subdirectory (CSS handles thumbnail crops from the single source).
4. Verify `mira-reel.png` from A5 is in place.

After migration, Mira's directory matches Iris/Noa/Sasha exactly:

```
public/companions/mira/
├── mira-neutral.png        ← promoted from desktop/
├── mira-warm.png           ← promoted from desktop/
├── mira-curious.png        ← promoted from desktop/
├── mira-closer.png         ← promoted from desktop/
├── mira-final-chat.png     ← promoted from desktop/
└── mira-reel.png           ← new A5 vignette
```

**Resolution caveat for Mira.** The promoted desktop files are 1672×941, which is lower-resolution than the new companions' target (≥2944×1656). Mobile crops from 1672×941 will look softer than from a higher-res source. Three options at migration time:

- **A — accept the compromise.** Use the promoted files as-is; mobile crops are slightly soft but the desktop primary looks fine. Cheapest.
- **B — regenerate Mira at high resolution.** Use image-to-image from her existing primary and generate each state at ≥2944×1656. Best quality, ~5 generations of work. Recommended.
- **C — keep the dual structure.** Cancel the migration, leave Mira's legacy directory alone, and write image-loading code that handles both flat (new companions) and dual (Mira) layouts. Cheap but adds branching to the loader and makes the asset story confusing for future contributors. Not recommended.

**Everything else that gets generated.**

- Create assets: `public/companions/create/{in-progress-1..4,template-2-vera,template-4-playful,template-5-gentle}.png` — flat directory, no subdirs.
- Shared fallbacks: `public/companions/_shared/{portrait-blur,soft-fail,ambient-between}.png` — only generate the ones you actually need (most are CSS-derivable).
- Screen mockups: `design/concept-07-reel-cold-open.png`, `concept-08-match-reveal.png`, `concept-09-create-reveal.png` (already exist per `IMPLEMENTATION.md` — regenerate only if the design changes).
