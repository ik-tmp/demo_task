# Direction B — Casting Hall (with Funnel)

This document is the detailed product/design spec for the chosen direction from `docs/PROPOSAL.md`: **Option B (Casting Hall)**, adapted with three deliberate changes:

1. **Multi-step funnel scaffolding** layered after the cold-open reel, so the experience has the forward motion of a web funnel rather than ending at "pick a tile."
2. **A deep create path** — multi-step (mood → role → voice → look → name), composing a generated vignette of its own, not a one-shot description box.
3. **No default companion.** The reel introduces multiple presences before the user is asked anything. The "meet Mira first" framing from `docs/PLAN.md` is retired.

The deliverable is still the assignment's brief: a polished entry experience that handles browse, quick match, and create, surfaces AI in legible ways, and ends in the user's first conversation. This doc supersedes `docs/PLAN.md` as the active direction. `PLAN.md` is retained as a reference for the prior framing.

---

## 1. The Pitch (30 Seconds)

The app opens like the cold open of a film. Before the user does anything, a reel of three or four companions plays: one reading by a window, one mid-laugh, one walking through a city at night, one looking up from a desk. Each vignette holds for about three seconds. Names, in editorial type, appear briefly with a one-line premise. The reel is full-bleed. There is no header, no nav, no "Get Started."

Beneath the reel, one quiet line waits:

> Who do you want to start with?

Below that, three soft affordances: **tap any face**, **pick for me**, or **describe someone else.** The user can interrupt the reel at any moment by tapping. The reel is not a sales pitch — it is the cast list.

From the user's tap, a short multi-step funnel begins. It feels like a conversation, but it has clear forward motion. Each step changes the visible vignette. The funnel ends in a first conversation with a companion who has been introduced cinematically, then narrowed to fit.

**The reviewer's first 30 seconds:** *"This feels like watching a trailer. I want to keep watching."*

---

## 2. What Changes from `docs/PLAN.md`

`PLAN.md` opened with a single default companion (Mira) already on screen, asking the user a question. That direction had a quiet emotional first impression but two weaknesses: it asked the user to meet a specific stranger before being asked what they wanted, and discovery felt secondary.

This direction reverses that:

| | `PLAN.md` (Direction A) | `DIRECTION-B.md` (this doc) |
|---|---|---|
| First screen | One default companion, one question | Cinematic reel of 3–4 companions, then one question |
| Browse weight | Escape hatch | First thing the user sees |
| Match weight | Strong | Strong |
| Create framing | "I'm waiting for someone else" | "Describe someone else" — same intent, framed against the cast |
| Default companion | Yes (Mira) | None — every companion is introduced equally |
| AI legibility | Portrait state changes | Reel ranking + portrait state + vignette composition |
| First impression | Quiet, intimate | Cinematic, then intimate |
| Asset ceiling | One companion set is enough | 3–4 companion vignettes raise the demo significantly |
| Asset floor | One companion set works | One full vignette + sketched reel works for the demo |

The funnel scaffolding, narrated reveal, conversational refinements, best-fit fallback, first-chat handoff, and mock paywall all carry over from `PLAN.md`. The change is at the entry surface and the create path, not in the funnel philosophy.

---

## 3. Core Bet

Most companion products open with a marketplace grid. `PLAN.md` opened with one face. This direction opens with **a cast.**

The bet is that a reel of distinct, cinematic presences does three things that neither grid nor single-face entry can do alone:

1. **Answers "what is this?" instantly.** A reviewer sees four faces with names and one-liners and immediately understands: this is a companion product with real characters, not a chatbot.
2. **Makes browse the first experience, not a secondary tab.** The reel *is* browse. No separate surface needed for the discovery requirement.
3. **Sets the production value bar.** The first ten seconds of cinematic vignettes carry the polish requirement of the brief on their own. The funnel that follows benefits from the trust the reel earns.

The funnel scaffolding then earns the rest of the brief: match (a narrated reveal after a few short questions), create (a multi-step composition that builds a new vignette), and AI legibility (ranking, matching, suggestions, generation each visible in a distinct moment).

The promise is no longer "meet someone who feels like they were waiting for this conversation." It is **"meet the cast, then narrow to the one who fits."**

---

## 4. App Open and the Reel

### Layout

**Desktop.** Full-bleed reel occupies the viewport. Each vignette is a still or short looped clip (4–6 seconds, no audio). Editorial typography sits in the lower-left corner of the active vignette: **Name** in display face, **one-line premise** beneath in body face. A subtle progress dotline at the bottom indicates how many vignettes are in the reel and which is current. A single soft line above the dotline reads *"Who do you want to start with?"*. Below the line, three affordances rendered as quiet text buttons (not big CTAs): **see everyone · pick for me · describe someone else.**

**Mobile.** Same full-bleed treatment, portrait orientation. Reel auto-advances. Tap-and-hold pauses. Swipe up reveals the same three affordances as a thumb-reachable sheet. The cast progress dots sit just above the home indicator.

### Reel Pacing

- 3–4 vignettes in the reel.
- ~3 seconds per vignette, ~500ms cross-fade.
- Reel auto-advances on first load, then loops once before settling on the highest-ranked vignette and going still.
- Tapping any vignette interrupts the reel, freezes that vignette, and begins the funnel for that companion (treated as a Browse entry — see §6).
- Tapping **pick for me** interrupts the reel and begins the Match funnel (see §7).
- Tapping **describe someone else** interrupts the reel and begins the Create funnel (see §8).
- Tapping **see everyone** opens the gallery (still richer than a grid — see §6).

### What's in the Reel

Each vignette is a single companion in a specific moment, lit cinematically. Examples:

| Companion | Vignette | One-line premise |
|---|---|---|
| Iris | Reading by a window at dusk, looking up | "Listens before she answers." |
| Noa | Mid-laugh at a kitchen counter, glass of wine | "Will tell you the joke and then ask the real question." |
| Mira | Walking through a city at night, half-turned | "Knows the streets you don't." |
| Sasha | At a desk, late lamp light, glancing up | "Cares about the long version." |

The vignettes are not interchangeable beauty shots. Each one carries a distinct *energy* — a listener, a provoker, a guide, a confidant. The reel is a casting tape, not a lookbook.

### Reel Ranking (Visible AI)

The order of the reel is not random. Ranking signals for the demo:

- Time of day (evening favors warmer vignettes; afternoon favors sharper).
- Referrer or query parameter, if present (e.g., `?from=quiet` weights toward listener-type vignettes).
- Prior session memory in `sessionStorage` (if the user returns after rejecting Iris, she does not lead the reel).
- A small randomized component, so returning users see something new.

The ranking is invisible-but-visible: the reviewer can refresh and see the order change, or pass `?from=…` and watch a different vignette lead. There is no "Why this order?" affordance on the reel itself — the reel should feel like a film, not a settings panel — but the order is real, and we can mention this explicitly in the demo writeup.

### Layout Constraints (Cross-Surface)

These rules apply to **every surface with a companion portrait** — reel, funnel shell, reveal surfaces, first chat. They are hard requirements, not polish.

**Face-safe region.** Every portrait has a designated face region (roughly the upper third of the visible portrait area, adjusted per crop). **No UI element — chat sheet, chip row, pill, modal, header, paywall, input bar — may ever overlap this region at any viewport size.** The portrait is the emotional anchor of the product; covering the face breaks the core promise. Treat the face-safe region as a CSS-enforced invariant, not a designer's hope.

**Mobile chat must be responsive.**
- The chat sheet sizes **fluidly to content.** One chat bubble + chip row must not reserve the same vertical space as four exchanges of dialog. Empty space below the active content is not allowed.
- The sheet has a **max-height capped by the face-safe region.** When content would exceed that height, the sheet scrolls *internally*; it never pushes the portrait off-screen and never covers the face.
- Sheet transitions between sizes are **smooth and continuous.** Snapping between fixed heights reads as broken UI.
- The sheet's resting state on the reel and first surface is **minimal** — just enough room for the active line of host copy and the affordances. It only grows when the conversation deepens.

**Chat sheet edge treatment (top blend).**
- The top edge of the chat sheet uses a short opaque-to-transparent gradient (~24–40px tall) so the sheet **blends into the portrait** rather than cutting it with a hard horizontal line. This is a polish layer that softens the "modal cutoff" feeling chat sheets otherwise have.
- All **text, chips, pills, suggested replies, and tap targets must sit below the fully-opaque portion of the sheet.** The gradient zone is decorative only — never place legible content inside it.
- Apply a subtle **backdrop-blur (~8–12px) behind the gradient zone** so busy portrait content (hair, patterned fabric, bright highlights) doesn't smear into the legible text just below. Without the blur, the gradient zone reads as a smudge against complex portrait areas.
- **The blend does not relax the face-safe region rule.** The transparent top of the gradient counts toward the sheet's height for the purpose of the face-safe cap — blending is a visual softening, not a way to push the sheet higher into the portrait. If the gradient's top edge would enter the face-safe region, the sheet is already too tall and must shrink (or scroll internally) regardless of the gradient.
- The same treatment applies to the desktop chat column's top edge if it overlays portrait pixels; on a true side-by-side split where the chat column has its own background, the gradient is unnecessary.

**Desktop split layout.**
- The portrait deserves **more bleed than the existing implementation gives it** — target 60–70% of viewport width on the portrait side, with the chat/UI column fixed and narrower (rather than the current near-50/50 split that leaves the portrait feeling cramped).
- The chat column, any overlay element (paywall modal, host bubble), and the portrait state strip must all clear the face-safe region.
- Column widths are **stable across the funnel.** Once the split is committed at app open, only the content inside each column changes — widths do not animate as the user moves between steps.
- Vignette cropping is responsive to viewport aspect: ultra-wide viewports should not stretch the portrait; portrait-side gutter is acceptable to preserve composition.

**Why these are hard rules.** The currently implemented layout (`src/components/funnel-entry.tsx` and the route wrappers as of 2026-05-27) fails on both axes: the mobile chat sheet sometimes covers the companion's face, and the desktop split is not ideal. The Direction B rebuild treats these as fixed constraints from the start, not as items to fix in a polish pass. Verify with Playwright screenshots at multiple viewport sizes (≥360w mobile, ≥768w tablet, ≥1280w desktop, ≥1920w widescreen) before reporting any layout work as done.

---

## 5. The Funnel (Multi-Step Scaffolding)

Once the user interrupts the reel — by tapping a face, by tapping "pick for me," or by tapping "describe someone else" — a multi-step funnel begins. The funnel is the same shell across all three paths; the steps differ.

### Shell

- The chosen vignette (or in-progress composed vignette) stays large on the right (desktop) or top (mobile).
- A chat panel sits beneath or beside it. **The chat panel must obey the face-safe region rules in §4 Layout Constraints — it never covers the companion's face, and it sizes fluidly to its content on mobile.**
- Each step is one short question, one to five chip replies, an always-available free text input, and a small "back" affordance.
- Above the input is a small *step indicator* — not "Step 2 of 5", but a soft trail of dots filling in as the user moves forward. The dots are inferred, not labeled. Reviewers should read "this has shape" without feeling like they are filling a form.
- A subtle "skip ahead" / "just meet them" link sits at the very bottom of the chat panel. The funnel must always have an escape.

### Forward Motion

A web funnel feels different from an open chat because each turn is consequential — the screen changes meaningfully, and the user can see they are moving toward something. We get this feel from four mechanics:

1. **Visible step progression** — the dot trail, plus the vignette changing on every answer.
2. **Narrative loading between steps** — small italic lines like *"asking around…"* or *"trying a warmer room…"* that bridge two steps with timing rather than blanks.
3. **Confirmation moments** — chosen chips animate, ghost briefly, and persist as small pill-shaped summary tags above the chat ("calm · listener · evening").
4. **Reveal at the end** — every funnel ends in a narrated reveal of the companion before the first chat opens. The reveal is the payoff. Without it, the funnel feels like it just stopped.

### Branching

Funnels branch based on answers. Examples:

- Match path: if the user picks "challenged" as the desired feeling, the third question becomes "Do you want them to push, provoke, or argue?" instead of the gentler default.
- Create path: if the user describes a clear role in free text (e.g., "older mentor who doesn't flirt"), the funnel skips the role/voice/boundaries chip questions and jumps to look + name.
- Browse path: if the user opens a vignette, asks two follow-ups, and then says "show me another like her," the funnel returns them to the gallery with the relevant chips pre-applied ("listener · evening").

The user should never feel they answered a question the product already had the answer to.

### Rejection as Signal

If the user rejects a reveal at the end of Match or a candidate during Browse, the funnel does not restart. It asks one diagnostic question:

> Was it the look, the voice, or the energy?

The next reveal addresses the named axis explicitly. Two rejections in a row offer a clean handoff to Create:

> Want to describe them instead?

This is the same rejection logic as `PLAN.md`, kept verbatim.

---

## 6. Path 1 — Browse / Discovery

Browse is reached three ways: tapping any face in the reel, tapping **see everyone**, or being routed there from a rejected Match.

### Entering from the Reel (Most Common)

Tapping a face freezes that vignette and opens a **vignette-funnel** for that companion:

1. **Vignette stays large.** No card layout, no chrome.
2. **Two-line companion profile** appears beneath the name: premise + a sample first line in their voice.
3. **Two chips:** *say hi* (jump to first chat — see §11) and *tell me more* (continue funnel).
4. **Free text always available:** the user can type a question about this companion ("is she playful?") and get a one-line in-voice answer from the host.

The vignette-funnel is intentionally short — at most three turns — because Browse users want to see, not be interviewed. The funnel exists so the user has something to do other than just clicking a portrait.

### Entering from "See Everyone" — the Gallery

The gallery is **not** a card grid. It is a vertically-paged stack of vignette-sized presences on mobile, and a horizontally-paged carousel on desktop. Each gallery item is the same kind of cinematic still as the reel. The reviewer should feel they are flipping through a magazine of people, not browsing a catalog.

- Each gallery item has: large vignette, name in editorial type, one-line premise, three sample first lines, three short trait tags.
- Paging is keyboard-arrow on desktop, swipe on mobile.
- Above the gallery: a single conversational input field. *"Describe what you want to see."* Submissions parse to filters and reorder the gallery with a visible animation.
- Below the gallery: a row of conversational chips: *softer · sharper · older · younger · more direct · less polished · stranger.* Each chip is additive; chips persist as removable pills.
- The active chips also show a *"Why you're seeing this"* line at the bottom of the active vignette: *"You asked for softer and someone who listens. She is the listener with the warmest delivery."*

### Search

Search lives inside the same input. Typing "quiet" matches companions tagged calm, gentle, listener. Typing "someone older who doesn't fix things" parses tone + role + boundary and reorders. The parse is deterministic in the demo (keyword → tag map) but presented as a sentence-level understanding.

### Filters

The chip row is the filter row. There is no left-rail checkbox panel. Filters are conversational refinements of the gallery, and they map to the same tag axes used by Match:

- **vibe**: calm, playful, sharp, dreamy, mysterious, grounded
- **role**: companion, muse, mentor, confidant, challenger, storyteller
- **energy**: quiet, flirty, witty, intense, gentle, chaotic
- **pace**: slow, immediate, teasing, reflective
- **format**: text-first, image-rich, voice-ready, short replies, long replies
- **boundaries**: light, romantic, supportive, roleplay, practical

The chip row exposes 6–8 of these at a time, rotated by which axis the user has touched least.

### Best-Fit Fallback

If filters overconstrain, the gallery silently broadens and labels the active item:

> Closest to what you asked for.

The gallery never empties. There is no "no results" state.

### From Gallery to First Chat

Any gallery item has a primary action: **say hi to [name].** This routes into First Conversation (see §11). The active filter set is carried into the first message as context ("You found me through the quiet ones…").

---

## 7. Path 2 — Match (Quick)

Match is reached by tapping **pick for me** on the reel, or by tapping the same affordance from the gallery footer.

### Funnel Shape

Match asks **three core questions**, with **one dynamic fourth** that only appears if prior answers conflict or are too broad. The portrait area to the right (desktop) or above (mobile) holds a *soft, unresolved presence* — a blurred figure, low contrast, generic room — that visibly resolves with each answer. The reviewer sees the AI "narrowing in."

**Q1 — Feeling.** *"When they answer, what should you feel?"*
Chips: *calmer · wanted · challenged · entertained · understood.*
Free text accepted.

**Q2 — Role.** *"Should they lead, listen, tease, or ask?"*
Chips: *lead · listen · tease · ask · I don't know yet.*
"I don't know yet" branches to Q3a (a softer clarifying question) instead of Q3.

**Q3 — Avoidances.** *"What should the first conversation not do?"*
Chips: *not fix · not push · not flirt · not perform · nothing specific.*
Multi-select allowed.

**Q4 — (Dynamic) Familiarity.** *"Do you want familiar, surprising, or a little dangerous?"*
Only shown if Q1+Q2+Q3 are not enough to distinguish 2+ candidates. Otherwise skipped silently.

Each answer:
- Persists as a removable pill above the chat.
- Triggers a visible portrait shift (lighting warms or sharpens; the figure becomes less blurred).
- Triggers a narrated loading line for ~600ms (*"checking who fits that pace…"*).

### Narrated Reveal

After the final question, the reveal is **a sequence of three lines** that arrive over ~2 seconds while the portrait resolves into the matched companion's vignette:

> *Looking for someone calm but not soft…*
>
> *…attentive without making it heavy…*
>
> *I think you should meet Iris.*

The vignette finishes its resolution — soft focus → sharp — exactly as the third line lands. No spinner. No score. No "98% match."

### Reveal Surface

- Large final vignette (the companion's primary still).
- Companion name in editorial type.
- First message preview in chat-bubble style.
- *"Why her"* panel: three short rationale bullets matched to the user's answers. *"You wanted calmer — she leads with stillness." / "You said don't fix — she asks before suggesting." / "You asked for unrushed — her pace is slow on purpose."*
- Actions: **say hi · show me another · show similar · open everyone.**

### Bad-Match Recovery

If the user taps **show me another**:

> Good. That helps. Was it the look, the voice, or the energy?

Chips: *look · voice · energy · all of it · show me choices.*

The next reveal addresses the named axis. Two rejections offer Create handoff:

> Want to describe them instead?

---

## 8. Path 3 — Create (Deep)

Create is reached by tapping **describe someone else** on the reel, or by being routed there after two Match rejections.

The framing is **"describe someone else"** — the user is describing who they were hoping to see in the cast, not building a profile from scratch. The result is a new vignette, played in the same cinematic style as the reel, with the new companion's name and one-line premise.

### Funnel Shape

Create is the longest funnel — five core steps, three optional — and the most visibly generative. The portrait area shows an **in-progress vignette** that fills in as the user answers.

The order is **feeling → role → voice → look → name**, with optional **pace**, **boundaries**, and **context** appended only if the user volunteers signal that needs them.

**Step 1 — Feeling.** *"Start with the feeling. What should they bring into the room?"*
Chips: *warmth · nerve · patience · mischief · honesty · calm.*
Multi-select up to 2.
Effect: the in-progress vignette gets a lighting/mood pass. Warmth → golden lamp light. Nerve → sharper contrast. Patience → still room. Etc.

**Step 2 — Role.** *"Who are they to you?"*
Chips: *companion · muse · mentor · confidant · challenger · storyteller.*
Effect: the in-progress vignette gets a posture/distance pass. Mentor → seated, further from camera. Companion → closer crop. Challenger → standing, half-turned.

**Step 3 — Voice.** *"How do they sound? Pick the one that sounds right."*
Three sample first lines appear as chat bubbles in three different voices:

> *"Hi. So how's your week going?"*
>
> *"Hey, you. I just got in — how was your day?"*
>
> *"Hi. What were you doing right before you opened this?"*

The user taps one. The selected line becomes the seed of the companion's voice profile and appears as a pill (e.g., "voice: dry" for the first, "voice: warm" for the second, "voice: curious" for the third).

**Step 4 — Look.** *"Pick a room and a light."*
Six mood-led chips: *soft studio light · night window · sharp city energy · warm apartment · older soul · classic beauty · unusual but grounded.* Multi-select up to 2.
Effect: the vignette completes — the room and lighting are now in the final state. Distance and pose were set in Step 2; this step decides the rest.

**Step 5 — Name.** *"Who is this?"*
Three AI-suggested names appear as chips, plus a free text field. Names are not random — they reflect the chosen feeling and look (warmth + warm apartment → Noa, Mira, Sasha; nerve + sharp city energy → Iris, Vera, Quinn). The user can also type their own.

**Optional Steps (only if signal demands).**

- **Pace.** Only asked if the user picked conflicting feelings (e.g., mischief + patience). *"Quick or unhurried?"*
- **Boundaries.** Only asked if the user wrote free text that implied a boundary (e.g., "doesn't flirt"). *"Anything they should avoid?"*
- **Context.** Always offered as the last optional turn. *"What should they know before they say hello?"* Free text. The answer becomes the seed of the first message.

### The Vignette Resolves

After Name, the in-progress vignette becomes a **playable vignette**: a short 3-second loop in the same cinematic style as the reel. The new companion is now part of the cast — in the demo, they are added to a transient `sessionStorage` "your cast" set and would persist if the demo had a backend.

The vignette plays once on the reveal surface alongside:

- The companion's name (large, editorial).
- Their one-line premise, composed from the user's feeling + role choices ("Tells you the joke, then asks the real question.").
- A *"what shaped them"* panel: a plain-language list of the user's choices ("You asked for warmth and mischief, a confidant who'll mostly listen, a kitchen at night, and a dry voice.").
- A first message preview.
- One last *"adjust"* affordance — a small chip row of common tweaks (*warmer · sharper · older · younger · closer · different room*) — before the chat opens.

### Free-Text Skip

If the user enters Create and immediately types in free text — e.g., *"I want a dry, older mentor who checks in after work and doesn't flirt"* — the funnel parses the description and skips directly to Step 4 (Look) or Step 5 (Name). The pills above the chat fill in retroactively (*role: mentor · voice: dry · boundary: no flirt*), so the user can see what was inferred. This is the same skip behavior as in `PLAN.md`, but here it lands in the vignette-resolution surface, not a profile preview.

---

## 9. How AI Shows Up

The brief asks for AI to be visible inside the experience. This direction surfaces four distinct AI techniques, each in the path where it is most legible:

### 1. Ranking — in the Reel and Gallery

- The reel order is personalized (time of day, referrer, prior session). Reviewer can refresh or change `?from=` and see the order change.
- The gallery reorders under conversational refinements with visible animation. The active vignette has a *"Why you're seeing this"* line.

### 2. Matching — in the Match Funnel

- A narrated reveal explains fit in human language with three named traits matched to the user's answers.
- Rejection asks "look / voice / energy" — the next reveal addresses the named axis.
- The portrait visibly resolves from blurred → sharp across the funnel, giving the user "I am narrowing this person down" as a felt experience.

### 3. Suggestions — in the Create Funnel

- Voice is demonstrated, not described — three sample lines, the user picks.
- Names are suggested from prior choices, not randomly.
- After Step 1 (Feeling), if the user picked something specific, an inline suggestion appears: *"You said mischief. Do you want it light, or with an edge?"* The suggestion is the AI being a co-writer, not a form validator.
- Optional steps (Pace, Boundaries) only appear when prior answers create ambiguity.

### 4. Generation — Across All Three Paths

- The reel itself is generated cinematic content.
- The Match funnel's portrait visibly resolves across turns.
- The Create funnel's in-progress vignette assembles in front of the user, then plays as a finished loop. This is the most explicit "you can see the generation happening" moment.
- First messages are arrival-aware and reference the path: Browse first messages cite the filters, Match first messages cite the rationale, Create first messages cite the user's described intent.

### What the Reviewer Sees

A reviewer should be able to point at each of these four techniques in the place where it lives. The doc's success criterion is that a reviewer says: *"Ranking is the reel. Matching is the narrated reveal. Suggestions are the voice samples and inline prompts. Generation is the vignette assembling."*

For the demo, all AI behavior is deterministic — keyword maps, branch tables, pre-generated image sets. The goal is the *idea* being visible, not real model calls.

---

## 10. Three Full Conversation Scripts

These scripts cover the three paths from app open to first chat message. Each is one full happy-path run with branches noted inline. The voice is a notional **Host** (small text-only presence — no avatar, intentionally less photoreal than the companions — see §11 for layout). User actions are in `[brackets]`. Vignette/portrait state changes are in *italics*.

---

### 10.1 Browse Script

*App loads. Reel auto-plays: Iris reading by a window (~3s), Noa mid-laugh at a kitchen counter (~3s), Mira walking through a city at night (~3s), Sasha at a lamp-lit desk (~3s). Reel loops once. On second pass, the reel settles on Iris (today's top-ranked) and goes still.*

**Host (line beneath the reel):**
> Who do you want to start with?

**(soft text affordances: see everyone · pick for me · describe someone else)**

`[user taps Iris's vignette]`

*Reel freezes on Iris's still. The vignette stays full-bleed; her name appears in display type lower-left: "Iris." Beneath: "Listens before she answers."*

**Host:**
> Iris. Reads a lot, talks slow. Asks good questions and actually waits for the answer.

**(chips appear: say hi · tell me more · show me someone else)**

`[user taps "tell me more"]`

*Iris's vignette pulls back slightly to make room for a chat panel on the left (desktop) or bottom (mobile). Three sample first lines appear in chat bubbles, styled like quotes from her, not chips:*

> *"Hey. What are you reading these days?"*
>
> *"Hi. How was today?"*
>
> *"Hey. Where are you, what's it like there?"*

**Host:**
> She'll listen more than she talks. You can interrupt her any time.

**(chips: say hi · ask her something · show me softer · show me sharper)**

`[user taps "show me softer"]`

*Iris's vignette gently slides off to the left, replaced by a new vignette: a different listener. Below: "Closest to what you asked for." A pill appears above the chat: "softer."*

**Host:**
> Try Noa. A bit more energy than Iris, but she won't rush you.

**(chips: say hi to Noa · go back to Iris · see everyone)**

`[user taps "say hi to Noa"]`

*Vignette transitions to Noa's final-chat state. Chat panel expands. The first message arrives over ~1.5s, character by character.*

**Noa (first chat message):**
> Hey. You came in looking for quiet — I can do quiet. How's your night?

**(suggested replies above input: "Long one" · "Tell me about you" · "Not sure yet")**

End of Browse script. The user is now in First Conversation (§11).

**Branch notes for Browse:**
- If the user taps "see everyone" from the reel: opens Gallery (§6). Gallery is a horizontally-paged carousel of vignettes with the conversational input + chip row.
- If the user types free text in the vignette-funnel ("does she ever laugh?"): the Host answers in one in-voice line ("Yeah, usually at herself."), then the chips re-appear.
- If the user rejects two companions in a row in Browse: Host offers Create handoff ("Want to describe someone instead?").

---

### 10.2 Match Script

*App loads. Reel plays as in §10.1.*

**Host:**
> Who do you want to start with?

`[user taps "pick for me"]`

*Reel fades to a single soft, unresolved presence — a blurred figure in a generic warm-lit room, low contrast. The chat panel expands. A small dot trail appears above the input, showing the funnel has shape.*

**Host:**
> Okay. A few quick things first.

**Host:**
> When they answer, what should you feel?

**(chips: calmer · wanted · challenged · entertained · understood)**
**(free text always available)**

`[user taps "calmer"]`

*Pill appears above the chat: "calmer." The blurred figure's lighting warms — golden, softer. Dot trail advances.*

**Host (narrated load, ~600ms italic):**
> *trying a warmer room…*

**Host:**
> Should they lead, listen, tease, or ask?

**(chips: lead · listen · tease · ask · I don't know yet)**

`[user taps "listen"]`

*Pill: "listen." Figure's posture shifts — seated, slightly turned toward camera. Dot trail advances.*

**Host:**
> *checking who fits that pace…*

**Host:**
> What should the first conversation not do?

**(chips: not fix · not push · not flirt · not perform · nothing specific — multi-select)**

`[user taps "not fix" and "not push"]`

*Pills: "not fix" "not push." Figure becomes a little less blurred — features start to suggest a specific person. Dot trail advances. The funnel has enough signal; the dynamic Q4 (familiarity) is skipped silently.*

**Host (narrated reveal, three lines arrive ~600ms apart):**
> *Looking for calm. Not fragile.*

> *Attentive, not too much.*

> *I think you should meet Iris.*

*During those three lines, the blurred figure resolves into Iris's primary vignette. Sharp by the third line.*

**Reveal surface:**
- Iris's vignette, large.
- Name: **Iris.**
- First message preview (in a chat bubble shape):
  > *"Hi. No fixing, got it. So — how was your day?"*
- **Why her** panel:
  > You wanted calmer — she's quiet by default.
  > You said don't fix — she asks before she tries to help.
  > You said don't push — she takes her time on purpose.

**(actions: say hi · show me another · show similar · open everyone)**

`[user taps "say hi"]`

*Iris's vignette transitions to her final-chat state. Chat panel takes over the screen (mobile) or expands (desktop). First message arrives character by character.*

**Iris (first chat message):**
> Hi. No fixing, got it. So — how was your day?

**(suggested replies: "tired" · "okay-ish" · "I don't know")**

End of Match script.

**Branch notes for Match:**
- If the user taps "show me another": Host asks "Was it the look, the voice, or the energy?" → next reveal addresses the named axis with a different vignette.
- If the user rejects twice: Host offers "Want to describe them instead?" → routes into Create with prior answers carried as pills.
- If Q1+Q2+Q3 leave 2+ candidates indistinguishable: Q4 (Familiarity) fires automatically.
- If user picks "I don't know yet" at Q2: Q2 is replaced with a softer "Should they ask first, or just be there?" — same effect, gentler chips.
- If user writes free text instead of chips at any step: the parse fills in implicit answers and the funnel skips forward.

---

### 10.3 Create Script

*App loads. Reel plays as in §10.1.*

**Host:**
> Who do you want to start with?

`[user taps "describe someone else"]`

*Reel fades to an in-progress vignette: a soft silhouette in an undefined room, low light, no face yet. Chat panel expands. Dot trail appears — longer than Match's (5 dots, with possible extras).*

**Host:**
> Tell me who you were hoping would answer. Start with the feeling.

**Host:**
> What should they bring into the room?

**(chips, multi-select up to 2: warmth · nerve · patience · mischief · honesty · calm)**
**(free text always available)**

`[user taps "warmth" and "mischief"]`

*Pills: "warmth" "mischief." The in-progress vignette gets a lighting pass: golden lamp light replaces the cool ambient. The room takes shape — a kitchen counter with a glass on it. Silhouette still no face. Dot trail advances.*

**Host (inline suggestion, AI-as-co-writer):**
> You said mischief. Light, or with an edge?

**(chips: light · with an edge · either is fine)**

`[user taps "with an edge"]`

*Pill: "edge." Lighting sharpens a touch. Dot trail unchanged — this was a sub-question, not a new step.*

**Host:**
> Who are they to you?

**(chips: companion · muse · mentor · confidant · challenger · storyteller)**

`[user taps "confidant"]`

*Pill: "confidant." Silhouette posture shifts: seated at the kitchen counter, slightly turned toward the viewer, closer crop. Dot trail advances.*

**Host:**
> How do they sound? Pick the one that sounds right.

**(three sample first lines appear as chat bubbles — not chips, full-width quotes in different voices):**

> *"Hi. So how's your week going?"*

> *"Hey, you. I just got in — how was your day?"*

> *"Hi. What were you doing right before you opened this?"*

`[user taps the first line]`

*Pill: "voice: dry." The silhouette gets a faint suggestion of a face — features start to emerge. Dot trail advances.*

**Host (inline suggestion):**
> Dry fits the edge you picked. Should they soften when it matters, or stay sharp the whole way?

**(chips: soften when it matters · stay sharp · don't decide yet)**

`[user taps "soften when it matters"]`

*Pill: "softens when it counts." No vignette change — this is voice nuance.*

**Host:**
> Pick a room and a light.

**(chips, multi-select up to 2: soft studio light · night window · sharp city energy · warm apartment · older soul · classic beauty · unusual but grounded)**

`[user taps "warm apartment" and "night window"]`

*Pills: "warm apartment" "night window." The vignette completes: kitchen counter becomes an apartment window in the background, night outside. Face resolves — a woman in her thirties, leaning on one elbow, half-smiling. Dot trail advances.*

**Host:**
> Who is this?

**(suggested names as chips: Noa · Sasha · Vera · ✏ name them yourself)**

`[user taps "Noa"]`

*Pill: "Noa." Name appears in display type lower-left of the vignette: "Noa." The dot trail fills.*

**Host (narrated load, ~1s italic, while the vignette transitions from a still to a playing 3s loop):**
> *putting her together…*

*The vignette plays its short loop: Noa, mid-laugh, glass of wine, kitchen at night, looking up.*

**Reveal surface:**
- Noa's playing vignette, large.
- Name: **Noa.**
- One-line premise (composed from feeling + role): *"Will tell you the joke and then ask the real question."*
- **What shaped them** panel:
  > Warmth and mischief, with an edge.
  > A confidant who'll mostly listen.
  > A dry voice that softens when it counts.
  > A warm apartment at night.
- First message preview (chat bubble):
  > *"Hey. Warm and a little sharp, you said — got it. So tell me, how was your day?"*

**(one last adjust row: warmer · sharper · older · younger · closer · different room)**
**(primary action: meet Noa)**

`[user taps "meet Noa"]`

*Noa's vignette transitions from the loop to her final-chat state — same room, lighting settled, looking directly at viewer. Chat panel takes over the screen (mobile) or expands (desktop). First message arrives character by character.*

**Noa (first chat message):**
> Hey. Warm and a little sharp, you said — got it. So tell me, how was your day?

**(suggested replies: "Long one, honestly" · "Don't really know" · "Tell me about yours first")**

End of Create script.

**Branch notes for Create:**
- **Free-text skip.** If the user types in free text after the reel (e.g., *"I want a dry, older mentor who checks in after work and doesn't flirt"*), the funnel parses → pills fill in retroactively (role: mentor · voice: dry · boundary: no flirt · pace: end-of-day) → funnel jumps to Step 4 (Look). The vignette's in-progress state updates accordingly.
- **Conflicting feelings (Pace prompt).** If the user picks "mischief" + "patience" at Step 1, Pace fires as an extra step after Voice: *"Quick or unhurried?"*
- **Implied boundary (Boundaries prompt).** If free text contains words like "doesn't flirt" or "no roleplay," Boundaries fires as an extra step after Look: *"Anything they should avoid?"*
- **Context offer.** Always offered as the last optional step before the reveal: *"What should they know before they say hello?"* Free text only. The answer seeds the first message.
- **Adjust loop.** If the user uses the adjust row on the reveal surface, the vignette re-renders with the tweak and the user lands back on the reveal surface. No funnel restart.

---

## 11. First Conversation

The first chat is the destination. It should feel earned by the funnel.

### Layout

All layout here is bound by the cross-surface rules in §4 Layout Constraints. Specifically: the chat sheet on mobile must never cover the companion's face, must size fluidly to message volume, and must scroll internally rather than push the portrait off-screen. On desktop, the portrait keeps the wider column (60–70% of viewport), with the chat as the fixed-narrower side.

**Desktop:**
- Left: chat column (fixed narrower width).
- Right: large vignette in final-chat state (wider column, more bleed than the existing implementation).
- Optional slim strip beneath the vignette: portrait state thumbnails (warm / closer / curious) the user can tap to nudge mood during chat. Tapping warms the lighting or shifts the crop subtly. Not a feature — a polish moment. The state strip must not visually compete with the face.

**Mobile:**
- Top: vignette, sized so the face sits comfortably above the chat sheet's max-height boundary. The vignette is slightly smaller than reel-size but still dominant.
- Bottom: chat sheet with suggested replies above the input. The sheet starts at minimum height (room for the active companion message + replies + input only) and grows as messages accumulate, up to the face-safe cap. Past the cap, the sheet scrolls internally.
- Input always reachable.

### The Host

The Host (the same text-only voice that ran the funnel) does not appear in the first chat. The first chat is between the user and the companion. The Host returns only if the user backs out of chat to switch companions, where they re-introduce the gallery or run a fresh funnel.

The Host is rendered as a small typeface block at the top of the funnel shell — no avatar, intentionally less photoreal than the companions, so the companions stay the emotional center. (This is the same design tension Option C in `PROPOSAL.md` flagged; we resolve it by making the Host quiet text, not a character.)

### Arrival-Aware First Messages

The first message references how the user arrived:

- **From Browse:** *"Hey. You came in looking for quiet — I can do quiet. How's your night?"*
- **From Match:** *"Hi. No fixing, got it. So — how was your day?"*
- **From Create:** *"Hey. Warm and a little sharp, you said — got it. So tell me, how was your day?"*

The reviewer should feel the first message *knows* the path. This is the payoff of the funnel.

### First Chat Depth

The first chat does not need to support deep conversation forever. It needs the first 30–60 seconds to feel alive:

- Companion responds to the user's first reply with one in-voice line.
- Suggested replies update based on what the companion just said.
- After ~3 exchanges, the mock paywall (§12) can appear.

The chat replies in the demo are deterministic — a small set of canned in-voice responses per companion. The illusion holds because each companion has a distinct voice.

---

## 12. Mock Paywall

The paywall is for **continuing beyond the preview conversation**, not for starting it. Same gate as `PLAN.md`.

### When It Appears

- After ~3 exchanges in the first chat, or when the user sends a 4th message.
- Never before the first message has arrived.
- Never during the funnel.

### Surface

A modal-like overlay that does not dim the vignette — the companion stays visible, the chat stays visible behind. Quiet.

**Title:**
> Keep talking with Noa?

**Body:**
> Your preview is ready to continue.

**Actions:**
- **continue** — opens mocked premium success.
- **not now** — keeps the user in preview mode (chat continues, but no new messages from the companion until they continue).
- **try someone else** — returns to the reel.

### States

- **Dismissed (not now):** *"No problem. This chat stays in preview."*
- **Mock success:** *"You're in. Keep going."*
- **Error:** *"That didn't go through. Nothing changed."* Inline, calm. No red.

No real payment, no account setup, no checkout fields.

---

## 13. States and Edge Cases

### Loading

- Funnel steps use narrative loading: *"trying a warmer room…", "checking who fits that pace…", "asking around…"*. Italic, ~600ms, then dissolves.
- Reel never shows a spinner — if assets aren't ready, the first vignette holds longer with a subtle Ken Burns.
- Reveal portrait transitions cover the "match calculation" time. No spinner needed.

### Empty / Best Fit

- Gallery never empties under filters. Silently broadens and labels active item *"Closest to what you asked for."*
- Match low-confidence: still produces a reveal. The narrated lines are gentler ("Hard call, but here's who I'd start with…") and the actions row includes "show me another" prominently.
- Reel with fewer than 4 vignettes: pace stays the same; reel just loops sooner.

### Errors

- Image generation/load failure: keep the best current portrait. *"That look didn't come together. Your choices are saved."*
- Chat send failure: *"That didn't go through."* (inline, retry chip.)
- Paywall error: *"That didn't go through. Nothing changed."*

### Indecision

- User repeatedly picks "either is fine" / "I don't know" / skips: Host short-circuits — *"I can choose. I'll keep it easy."* — and runs to a confident low-risk reveal (Iris is the default safe pick for the demo).

### Rejection

- One rejection in Match: diagnostic question (look / voice / energy).
- Two rejections in Match: Create handoff offer.
- One rejection in Browse vignette-funnel: gallery shifts to "softer / sharper" of the same axis.
- Two rejections in Browse: Create handoff offer.

### Sensitive Input

- If user writes something outside scope in free text: *"I can't build that here. Want to keep it adult, respectful, and fictional?"* Offer two adjacent chip choices to bring the user back.

### Back Behavior

- Back in the funnel restores the previous step *with the chosen pills intact*. The user can change one answer without re-running the whole funnel.
- Back from First Chat re-enters the reveal surface (so the user can pick "show me another" or "open everyone" without losing chat context).
- Back from the reel goes nowhere — it is the first surface. (Browser back exits the demo.)

### Layout Failure Modes (Testable)

The face-safe region rules in §4 are testable, not aspirational. Treat the following as bugs, not polish:

- **Chat sheet overlaps the face on mobile** at any viewport ≥360w. Bug.
- **Chat sheet jumps between fixed heights** rather than animating smoothly to content. Bug.
- **Portrait crops out the face** because the chat sheet grew too tall. Bug — the sheet must scroll internally before reaching that point.
- **Desktop columns animate width** during a funnel step transition. Bug — only content inside columns changes, never widths.
- **Paywall modal, host bubble, or any overlay covers the face.** Bug.
- **Portrait stretches on ultra-wide viewports** instead of holding aspect with a gutter. Bug.

These are the screenshot review checklist for any layout work. Playwright should fail if any of them is observed across the breakpoints in §4 Layout Constraints.

---

## 14. Asset Plan

The reel is the highest-leverage asset surface. Asset cost is higher than `PLAN.md` (which got away with one companion set) but bounded.

### Required for Demo

**Reel (cold open).**
- 4 companions: Iris, Noa, Mira, Sasha.
- Each: one ~3s looping vignette (or a high-quality still with subtle Ken Burns motion).
- Each: a name in display typography, a one-line premise.

**Per Companion (Iris, Noa, Mira, Sasha).**
- Primary vignette (reel still).
- 2–3 portrait state variants: warm, curious, closer.
- Final-chat state (looking toward camera).
- One thumbnail/crop for the state strip.

**For Create.**
- 3–4 in-progress vignette stages: silhouette → room shape → posture → face resolution.
- Pre-rendered final vignettes for ~6 created-companion templates (combinations of feeling+role+look that the funnel can deterministically land on). These are the "generated" outputs the user gets when they finish Create.

**For UI.**
- Blurred portrait placeholders.
- Soft room/background variants for the in-progress create vignette.
- One soft-fail backdrop for image errors.

### What Can Be Sketched

If the budget tightens:

- Reel can launch with only 2 high-quality vignettes (Iris, Noa) + 2 sketched placeholders that hold for less time. Better four real than four embarrassing.
- Create vignette can use a smaller library of final outputs (3 templates) and rely on the "what shaped them" panel to feel specific.
- Mira's existing asset set from `PLAN.md` already covers one companion — Iris/Noa/Sasha are the new asks.

### Asset Floor

If we can only ship one new companion: keep Mira from `PLAN.md`, generate Iris (the listener — easiest to script), use 2 sketched placeholders in the reel, and lean on funnel quality for the rest. Not ideal, but viable.

### Asset Ceiling

If we can generate liberally: 4 companions × 5 states each (20 stills) + 4 reel loops + 6 create templates × 1 vignette each = ~30 generated images. Bounded by an evening of generation if assets are cheap.

---

## 15. Demo Scope

The demo proves the product idea:

1. App opens directly into the reel — no landing page.
2. Reel auto-plays 3–4 cinematic vignettes.
3. User can tap any face → vignette-funnel → first chat (Browse path).
4. User can tap "pick for me" → 3–4 question Match funnel → narrated reveal → first chat (Match path).
5. User can tap "describe someone else" → 5–step Create funnel → vignette resolution → first chat (Create path).
6. Each funnel produces visible portrait/vignette changes after answers.
7. First message in chat references the user's path.
8. Mock paywall appears after ~3 chat exchanges.
9. Loading, empty, error, rejection, sensitive-input, and back behavior all designed.
10. Mobile portrait-first layout for all of the above.

### What Can Stay Fake

- Real model calls.
- Runtime image generation (pre-generated assets only).
- Real payment.
- Account creation.
- Long-term persistence beyond `sessionStorage`.
- Deep chat intelligence past the first ~3 turns.

### What Must Feel Real

- The reel — pace, ordering, vignette quality.
- The funnel forward motion — dot trail, pills, narrated loading.
- Match's portrait resolution from blurred → sharp.
- Create's in-progress vignette assembling visibly.
- The narrated reveal in Match (the three-line cadence).
- The arrival-aware first message in chat.
- The paywall as a continuation gate, not an entry block.

---

## 16. Open Questions

These are the choices left to lock before implementation:

1. **Reel length and content.** Four vignettes or three? Cast composition — do we want one mentor-type, one listener, one provoker, one storyteller, or a different mix? Cast affects the "Why her" rationale variety the Match funnel can offer.
2. **Vignette format.** Still with Ken Burns motion (cheap, reliable) or short looping video (richer, but heavier and harder to keep consistent)? My recommendation is high-quality still + 4–6s subtle motion treatment, since runtime cost is irrelevant for the demo but consistency across companions matters.
3. **Host voice.** Quiet and minimal (current spec) or slightly more present (e.g., names itself, has a small editorial signature)? Risk of more present: Host competes with companions. Risk of more minimal: funnel feels less guided.
4. **Create template count.** How many pre-rendered "created companion" outputs do we need before the demo feels generative rather than canned? 3 is the floor; 6 is comfortable; 10+ is luxurious.
5. **Where the gallery sits.** As a swipe-up sheet from the reel, or as a separate full-screen surface reached by "see everyone"? Sheet feels more continuous; full-screen gives the gallery more breathing room.

A short answer to each of these is enough to move into implementation.

---

## 17. Relationship to `docs/PLAN.md`

`PLAN.md` and `docs/IMPLEMENTATION.md` describe the prior direction (Direction A). The code in `src/components/funnel-entry.tsx` was built for that direction.

This document supersedes `PLAN.md` as the active design. The implementation tracker (`IMPLEMENTATION.md`) should be rewritten against this doc once the open questions in §16 are answered. Much of the existing implementation is reusable:

- The funnel shell (chat + portrait) maps directly to the post-reel funnel shell here.
- The narrated reveal logic in Match is unchanged.
- The best-fit fallback, rejection-as-signal, and arrival-aware first message all carry over.
- The mock paywall is unchanged.

What needs to change:

- The app open: replace the default-companion-and-question screen with the reel.
- The Create framing: from "I'm waiting for someone else" to "describe someone else," with the deeper multi-step shape in §8 and the vignette-resolution surface as the reveal.
- The Browse entry: from chat-driven "show me who's here" to reel-driven tap-a-face, with the gallery as the secondary surface.

The Mira asset set is still useful — she becomes one of the four cast members in the reel.
