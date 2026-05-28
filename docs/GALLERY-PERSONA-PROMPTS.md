# Gallery Persona Imagegen Prompts

These prompts define eight gallery-only companion portraits for the locked cast
shown behind the mock paywall. They are not launch companions yet: keep them out
of `src/data/companions.json`, reel ranking, quick match, create templates, and
preview chat until the product plan explicitly promotes them.

The first three personas match the placeholder ids already in
`src/data/gallery-placeholders.ts`. The remaining five are net-new locked-cast
concepts that can be added to that module later.

## Generation Rules

- Use case: `photorealistic-natural`.
- Asset type: single locked-gallery portrait tile.
- Generate one high-resolution 16:9 source per persona. Target 2944x1656 or
  larger when the tool supports it; the current prototype can downsample.
- Save under `public/companions/gallery/{id}.png` for now.
- One adult subject only, fully clothed, non-explicit.
- Photoreal cinematic editorial still, natural skin texture, subtle film grain.
- No text, logos, watermarks, UI, fantasy effects, or extra people.
- Keep the face in the upper/right-center region, with the eyes near the upper
  third. Leave the lower-left and lower edge calm enough for a name and premise
  overlay in the gallery tile.
- Compose so the image still works if later cropped right-of-center for a mobile
  portrait surface, even though these are gallery-only for now.
- Let the UI apply blur, dimming, lock badges, and paywall treatment. Generate
  clean portraits, not pre-blurred placeholders.

## Persona Queue

| ID      | Name  | Gallery vibe           | Accent    | Save as                               |
| ------- | ----- | ---------------------- | --------- | ------------------------------------- |
| `elias` | Elias | slow-burning warmth    | `#62d2c6` | `public/companions/gallery/elias.png` |
| `juno`  | Juno  | bright and mischievous | `#f5be58` | `public/companions/gallery/juno.png`  |
| `rafa`  | Rafa  | calm, grounded nights  | `#c99cff` | `public/companions/gallery/rafa.png`  |
| `leila` | Leila | precise and generous   | `#ff7f6e` | `public/companions/gallery/leila.png` |
| `theo`  | Theo  | practical kindness     | `#8ed4ff` | `public/companions/gallery/theo.png`  |
| `amara` | Amara | soft intensity         | `#b5d66f` | `public/companions/gallery/amara.png` |
| `soren` | Soren | dry, lucid calm        | `#d7b7ff` | `public/companions/gallery/soren.png` |
| `valen` | Valen | late-night levity      | `#ffb29f` | `public/companions/gallery/valen.png` |

## Prompts

### 1. Elias

```text
Use case: photorealistic-natural
Asset type: locked-gallery companion portrait, single 16:9 source
Primary request: Cinematic editorial portrait of Elias, an adult man in his late thirties with slow-burning warmth and an attentive, unhurried presence.
Scene/backdrop: A quiet brownstone living room at blue hour, vinyl records stacked near a low shelf, a small table lamp glowing warm against deep teal evening shadows, rain-soft city light through a window in the background.
Subject: Elias sits at the edge of a worn leather chair, leaning forward slightly as if he has just paused a record to listen. Calm direct gaze, faint half-smile, relaxed shoulders. Wearing a textured dark knit sweater over a soft white T-shirt, simple watch, no visible logos.
Composition: 16:9 wide frame, high resolution. One adult subject only. Face and upper torso placed right-of-center, eyes around the upper third. Lower-left and lower edge remain calm, darker, and uncluttered for gallery typography. Must still work if cropped right-of-center for a future mobile portrait.
Lighting/palette: Warm amber lamp key light with cool blue-green window fill, shallow depth of field, 50mm lens, subtle natural film grain, real skin texture.
Avoid: No text, logos, watermarks, UI, extra people, nudity, fantasy styling, heavy retouching, exaggerated smile, or pre-applied blur.
Save as: public/companions/gallery/elias.png
```

### 2. Juno

```text
Use case: photorealistic-natural
Asset type: locked-gallery companion portrait, single 16:9 source
Primary request: Cinematic editorial portrait of Juno, an adult woman in her early thirties with bright, mischievous energy and quick warmth.
Scene/backdrop: A late-night diner booth after the rush, chrome edges, soft red vinyl, one glass of water, a napkin with an absent-minded fold, warm counter light mixing with gold streetlight outside the window.
Subject: Juno sits sideways in the booth, one elbow on the table, looking toward the camera like she is about to say the funny thing first and the honest thing next. Lively eyes, half-grin, hair loosely clipped back. Wearing a mustard cardigan over a simple black top, fully clothed, no visible logos.
Composition: 16:9 wide frame, high resolution. One adult subject only. Face right-of-center, upper torso visible, no face overlap with the bottom third. Lower-left stays darker and simple for gallery name copy. Preserve enough space around the head for responsive crop.
Lighting/palette: Warm diner gold, muted red, soft black shadows, a small cool reflection from the window, 35mm lens, shallow depth of field, subtle film grain and natural texture.
Avoid: No text, logos, watermarks, UI, extra people, explicit styling, childish presentation, distorted hands, or pre-applied blur.
Save as: public/companions/gallery/juno.png
```

### 3. Rafa

```text
Use case: photorealistic-natural
Asset type: locked-gallery companion portrait, single 16:9 source
Primary request: Cinematic editorial portrait of Rafa, an adult man in his early forties with calm, grounded night energy.
Scene/backdrop: A rooftop garden just after rain, city skyline far behind him, wet planters catching small points of light, a thermos and folded jacket on a bench, quiet night air.
Subject: Rafa stands beside the bench with one hand resting on the back rail, turned slightly toward camera. Patient expression, steady eye contact, understated warmth. Wearing a deep olive chore jacket over a dark shirt, fully clothed, no visible logos.
Composition: 16:9 wide frame, high resolution. One adult subject only. Face and torso placed right-of-center, eyes near upper third. Keep lower-left negative space open and low-detail for tile text. The head must not touch the top edge and must survive a right-of-center mobile crop.
Lighting/palette: Cool violet-blue night ambient with soft warm practical light from a nearby doorway, wet surfaces with restrained highlights, 50mm lens, shallow depth, natural film grain.
Avoid: No text, logos, watermarks, UI, extra people, dramatic superhero pose, pre-applied blur, or over-saturated neon.
Save as: public/companions/gallery/rafa.png
```

### 4. Leila

```text
Use case: photorealistic-natural
Asset type: locked-gallery companion portrait, single 16:9 source
Primary request: Cinematic editorial portrait of Leila, an adult woman in her late thirties with precise, generous energy.
Scene/backdrop: A quiet architecture studio at night, drafting table, vellum sheets, a brass task lamp, a model building softly out of focus, large dark windows behind the room.
Subject: Leila sits at the drafting table with a pencil resting between her fingers, looking up from a drawing with a composed, open expression. Intelligent direct gaze, calm posture. Wearing a charcoal turtleneck and tailored overshirt, simple earrings, fully clothed, no visible logos.
Composition: 16:9 wide frame, high resolution. One adult subject only. Place face right-of-center, upper torso visible, drafting table leading lines kept below face. Leave lower-left and bottom edge quiet enough for gallery typography. Composition should survive a later right-of-center vertical crop.
Lighting/palette: Warm brass task light on face and hands, cool graphite shadows, muted coral note from a pencil or paper edge, 50mm lens, shallow depth, natural skin texture and fine film grain.
Avoid: No text, logos, watermarks, UI, extra people, hard corporate stock-photo look, glossy over-retouching, or pre-applied blur.
Save as: public/companions/gallery/leila.png
```

### 5. Theo

```text
Use case: photorealistic-natural
Asset type: locked-gallery companion portrait, single 16:9 source
Primary request: Cinematic editorial portrait of Theo, an adult man in his early fifties with practical kindness and steady humor.
Scene/backdrop: A small ceramics and repair workshop in the evening, shelves of simple bowls, a wooden workbench, tools arranged naturally, warm work light fading into deep blue-gray shadow.
Subject: Theo stands at the workbench with one hand resting beside a half-finished ceramic cup, looking toward camera with a slight knowing smile. Relaxed, grounded, capable. Wearing a faded indigo overshirt over a soft gray tee, sleeves rolled, fully clothed, no visible logos.
Composition: 16:9 wide frame, high resolution. One adult subject only. Face right-of-center, shoulders and hands visible but hands not dominant. Keep lower-left area calm and low-contrast for overlay text. Preserve headroom and side space for responsive crop.
Lighting/palette: Warm amber work lamp, cool blue-gray room shadows, clay neutrals, restrained teal accent from a glazed bowl, 35mm lens, shallow depth of field, subtle film grain, realistic skin and fabric texture.
Avoid: No text, logos, watermarks, UI, extra people, fantasy craftsman costume, exaggerated grin, dirty or unsafe workbench clutter, or pre-applied blur.
Save as: public/companions/gallery/theo.png
```

### 6. Amara

```text
Use case: photorealistic-natural
Asset type: locked-gallery companion portrait, single 16:9 source
Primary request: Cinematic editorial portrait of Amara, an adult Black woman in her mid-thirties with soft intensity and emotionally perceptive calm.
Scene/backdrop: An empty music rehearsal room after hours, upright piano in soft focus, a few stacked chairs, velvet acoustic panels, one tall window holding the last cool light outside.
Subject: Amara sits sideways on a piano bench, turned toward the camera with relaxed direct eye contact and a quiet, knowing half-smile. One hand rests lightly on the closed piano fallboard. Wearing a deep plum blouse under a dark blazer, fully clothed, no visible logos.
Composition: 16:9 wide frame, high resolution. One adult subject only. Face and upper body right-of-center, eyes around upper third. Lower-left and lower edge stay uncluttered and slightly darker for gallery text. Keep face clear of any future tile badges or bottom gradient.
Lighting/palette: Soft warm overhead practical mixed with cool window fill, plum, ink, muted green panel accents, 50mm lens, shallow depth of field, natural skin texture, subtle film grain.
Avoid: No text, logos, watermarks, UI, extra people, microphone performance pose, glamour retouching, theatrical spotlight, or pre-applied blur.
Save as: public/companions/gallery/amara.png
```

### 7. Soren

```text
Use case: photorealistic-natural
Asset type: locked-gallery companion portrait, single 16:9 source
Primary request: Cinematic editorial portrait of Soren, an androgynous adult in their early thirties with dry, lucid calm and a quietly observant presence.
Scene/backdrop: A modest roadside motel room at dawn after rain, curtains half open, pale sky outside, a small suitcase near the wall, an old camera on a table, clean but lived-in atmosphere.
Subject: Soren stands near the window with one shoulder angled toward camera, holding a ceramic mug low at their side. Neutral, alert expression with a small trace of dry humor. Short dark hair, minimal styling. Wearing a crisp white shirt under a soft black cardigan, fully clothed, no visible logos.
Composition: 16:9 wide frame, high resolution. One adult subject only. Face right-of-center and high enough that the bottom third can carry tile copy. Keep lower-left negative space simple, with soft shadows and no busy props. Leave generous headroom for future crop safety.
Lighting/palette: Pale blue dawn fill through curtains with a small warm bedside lamp, clean gray, white, and ink palette with faint orchid shadow, 50mm lens, shallow depth, subtle film grain and realistic texture.
Avoid: No text, logos, watermarks, UI, extra people, noir detective costume, melodrama, explicit styling, or pre-applied blur.
Save as: public/companions/gallery/soren.png
```

### 8. Valen

```text
Use case: photorealistic-natural
Asset type: locked-gallery companion portrait, single 16:9 source
Primary request: Cinematic editorial portrait of Valen, an adult Filipino man in his early thirties with late-night levity and easy, conversational warmth.
Scene/backdrop: A quiet laundromat near closing time, rows of machines fading into soft focus, warm fluorescent light softened by a coral neon sign outside the window, folded clothes on a clean counter.
Subject: Valen leans against the folding counter, turned toward camera with a relaxed, amused expression as if he is about to make the ordinary moment feel less heavy. Wearing a soft navy sweatshirt and light jacket, fully clothed, no visible logos.
Composition: 16:9 wide frame, high resolution. One adult subject only. Face and upper torso right-of-center, eyes near upper third. Keep the bottom-left area calm and darker for gallery name and vibe copy. Do not place machines or bright signage behind the face.
Lighting/palette: Soft warm fluorescent practicals, coral reflection from outside, deep navy and cream tones, 35mm lens, shallow depth of field, natural skin texture, subtle film grain.
Avoid: No readable text on signs, logos, watermarks, UI, extra people, exaggerated comedy pose, messy clutter, or pre-applied blur.
Save as: public/companions/gallery/valen.png
```

## Wiring Notes For Later

- To keep a portrait locked, add its `asset` path to `src/data/gallery-placeholders.ts`
  and leave `locked: true`.
- To make a portrait selectable but still gallery-only, keep it in the gallery
  placeholder module and update the gallery tile renderer. Do not add it to
  `companions.json` unless it should enter reel, match, create, and chat logic.
- To promote any persona into the launch cast, generate the full state set first:
  `reel`, `neutral`, `warm`, `curious`, `closer`, and `final-chat`.
