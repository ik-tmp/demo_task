# Direction Proposal

Five alternative product/demo visions for the AI companion entry experience take-home. The goal of this document is to make a deliberate choice about *what the demo is trying to be* before any more code is written. Implementation is intentionally out of scope here.

The current direction (the conversational portrait funnel in `docs/PLAN.md`) is one of the five options, included so it can be compared honestly against the alternatives instead of inherited.

---

## 1. What the Assignment Actually Rewards

Reviewers will see many submissions. The assignment names three user needs (browse, match, create) and one craft requirement (polish). It does not say each need must be a separate surface. The strongest submissions usually do one of two things:

- **Collapse the three needs into one coherent gesture** so the product feels like one idea, not three tabs.
- **Take one need extremely deep** and treat the other two as gracefully thin paths.

What reviewers feel in the first 30 seconds matters more than feature completeness. A reviewer who feels something specific within the first screen will read the rest charitably. A reviewer who sees a competent-but-familiar marketplace will not.

The choice across these options is essentially: **which feeling do we want the reviewer to have within 30 seconds**, and **which of the three needs do we use as the spine to carry the others.**

---

## 2. Honest Critique of the Current Direction

The current plan (conversational portrait funnel with a default companion named Mira) has real strengths and a few real risks worth naming before we choose.

**What it does well**

- Strong emotional first impression. A face, a question, a quiet room.
- Browse / match / create read as one interaction model, not three.
- The portrait state changes give a visible "the AI is responding to me" signal without needing real AI.
- Copy direction is specific and unusual for the category.

**Where it gets weaker on reflection**

- "Default companion is Mira" makes the first 30 seconds about one specific character, which subtly contradicts the assignment's "browse" and "match" framings. The reviewer might wonder why they are meeting a stranger before being asked what they want.
- The funnel still asks form-shaped questions, just dressed as chat. The chat is the *container*, not the *content*. A skeptical reviewer could read it as a wizard with prettier chrome.
- Discovery (browse) is the weakest of the three paths in the current plan — it lives mostly as an escape hatch. For a category that is normally marketplace-first, this is a real bet that may or may not land.
- "Portrait changes after answers" is the headline AI moment, but with one companion asset set, it can read as five expressions of the same face rather than a generative experience.

These are not fatal. They are the right things to weigh against alternatives.

---

## 3. Five Directions

Each direction is described as a product/demo vision, not an implementation plan. For each one: how the app opens, how the three needs are handled, how AI shows up, where it wins, where it risks failing.

---

### Option A — Conversational Portrait Funnel (current direction, refined)

**Pitch.** The product opens as a quiet first meeting. One face, one question, one room. Browse, match, and create are all reached by continuing the conversation, never by switching tabs. The portrait visibly reacts to user answers.

**App open.** A large realistic portrait of a default companion is already on screen, lit like a film still. A single line of chat sits beside or beneath her: *"Hey. What kind of company would feel good right now?"* Four soft replies: *show me who's here / choose someone for me / stay with you / I'm waiting for someone else.*

**How the three needs are handled.**
- *Browse.* "Show me who's here" opens a curated portrait gallery framed as "people I think you'd like," not a grid.
- *Match.* "Choose someone for me" asks 2–4 short questions and narrates a reveal.
- *Create.* "I'm waiting for someone else" reframes creation as describing who you hoped would answer, not building a profile.

**How AI shows up.** Portrait changes, narrated match reveals, arrival-aware first messages, conversational filter refinements ("show me softer"), context carryover into chat.

**Where it wins.** Strongest emotional first impression. Reads as a *product*, not a CRUD app. Copy direction is highly specific and memorable.

**Where it risks failing.** The reviewer meets a specific stranger before being asked what they want. Browse feels secondary. With one portrait asset set, the "portrait responds to me" demo is single-character.

**Demo viability.** High — partially built. Mostly a refinement of what exists.

**30-second reviewer feeling.** *"Oh, this is not a marketplace. This is something quieter."*

---

### Option B — Casting Hall (cinematic vignette reel)

**Pitch.** The product opens like a film's cold open. Before the user does anything, three or four companions appear in sequence as short cinematic vignettes — one is reading by a window, one is mid-laugh, one is walking through a city at night. The user is not browsing yet; they are being introduced. After the reel, the product asks one question: *"Who do you want to start with?"* — and everything else (matching, creation) is a deviation from that picker.

**App open.** A full-bleed video-still or slow Ken Burns reel of 3–4 companions, each labeled with name + one-line premise. Subtle pacing — each vignette holds for ~3 seconds before transitioning. The user can tap any frame to interrupt the reel and meet that person. A small line below: *"or describe someone else."*

**How the three needs are handled.**
- *Browse.* The reel itself, plus a grid behind it for users who want more.
- *Match.* "Pick for me" replaces the reel with one slowed-down vignette + rationale.
- *Create.* "Describe someone else" pulls the reel apart and assembles a new vignette from chosen mood/look/voice fragments.

**How AI shows up.** Ranking decides which 3–4 vignettes lead the reel (personalized to anything we know — referrer, time of day, prior session). Creation reuses vignette fragments to compose a custom one. Match narrates *which* of the reel candidates fits best and why.

**Where it wins.** Most cinematic first 10 seconds in the category. Discovery + matching collapse into one gesture. Showcases generated imagery as the core product, not decoration.

**Where it risks failing.** Vignettes need to land visually — bad assets sink it. The "describe someone else" path is the weakest leg unless it produces a visible vignette of its own. Heavier on assets than Option A.

**Demo viability.** Medium — needs 3–4 companion vignettes with state variants. Mostly asset and pacing work; structural code is similar to current.

**30-second reviewer feeling.** *"This feels like watching a trailer. I want to keep watching."*

---

### Option C — Concierge (one AI host throughout)

**Pitch.** The product is one persistent AI host who introduces the user to everyone else. The host is the first thing the user meets, asks one or two questions, then *summons* companions — sometimes from the existing roster, sometimes shaping one on the fly. The host stays present forever as a meta-layer above the companion chat. Discovery, matching, and creation all happen as instructions to the host.

**App open.** A small but persistent host figure (an outlined silhouette, an animated voice waveform, a sigil — deliberately less photoreal than the companions) speaks first: *"I run the front desk. Tell me what tonight is supposed to feel like, and I'll bring someone over."* Below: a freeform input plus three suggestion chips (*calm / sharp / surprise me*).

**How the three needs are handled.**
- *Browse.* "Who do you have?" prompts the host to fan out a few options as a row of portrait cards summoned into the room.
- *Match.* "Just pick" produces one candidate with the host's rationale spoken in first person.
- *Create.* "I want someone like X but Y" or freeform description → the host produces a generated companion and explains the choices they made.

**How AI shows up.** Constantly. The host *is* the AI. Every companion arrives through them, every refinement is a conversation with them, every reveal includes their rationale. This is the most AI-forward of the five.

**Where it wins.** The strongest answer to "how does AI show up?" — it is the product's main character. Browse/match/create are obviously the same gesture. The host can carry voice and personality even before companion assets exist.

**Where it risks failing.** The host competes with the companions for emotional center. If users grow attached to the host, the actual companions feel transactional. Designing a non-photoreal host that doesn't feel like Clippy is hard.

**Demo viability.** Medium — depends on nailing the host's voice and visual. Less asset-heavy than B, more copy-heavy.

**30-second reviewer feeling.** *"There is a personality running this app. That is unusual."*

---

### Option D — Workshop (browse and create are the same gesture)

**Pitch.** The user enters a space where companions are *editable from the moment they're discovered*. Every existing companion can be remixed — "more direct," "older," "different room" — and that remix becomes a real companion you can open. Discovery and creation collapse into one verb: **adjust.** Matching is just "adjust nothing and pick the top one."

**App open.** A single large portrait (a featured or randomized companion) is centered. Around or below it are six or eight subtle dials presented as words, not sliders: *warmer · sharper · older · quieter · further · stranger.* A search/freeform input is available but not the primary action. The line of copy is something like *"This is Iris. Or she can be someone else. Pull her in any direction."*

**How the three needs are handled.**
- *Browse.* Navigate sideways through the roster ("show me someone else") — each one arrives in the same dial-able state.
- *Match.* "Just pick for me" surfaces the best candidate for any dials the user has touched.
- *Create.* Drag a companion far enough from her starting state, or describe one, and she becomes a new saved companion.

**How AI shows up.** Every dial pull is a visible AI re-rendering: portrait shifts, voice line samples change, premise rewrites. The product *feels* generative because every input has an immediate visible output.

**Where it wins.** Most original answer to the create requirement. Removes the "make a profile" tax. The "AI shows up everywhere" claim is unusually credible because the user sees output change on every input.

**Where it risks failing.** Asset cost is highest of the five — every dial needs visible portrait variants for the demo to feel real. If the dials look like a slider panel, it becomes a configurator. The framing requires holding nerve to *not* add a separate "create" button.

**Demo viability.** Lower — needs the most pre-generated variants per companion. Most exciting if executed; most embarrassing if half-finished.

**30-second reviewer feeling.** *"Wait, I can just pull her in a direction? That's the whole product?"*

---

### Option E — Letter Before Meeting (quiet/literary)

**Pitch.** Before the user meets anyone, they write a short note. Two or three sentences, freeform. The AI reads it and replies: *"I think these three people would write back."* Each reply is a small written excerpt — not a card, not a portrait first — that responds in a different voice to what the user said. The user picks the voice that feels right; that's their first chat. Portraits arrive afterward.

**App open.** A nearly empty screen. A single editorial line: *"Write something. Anything. I'll find the people who'd answer."* A textarea. Optional prompt chips beneath it (*how today went / what I'm avoiding / a small confession / nothing in particular*).

**How the three needs are handled.**
- *Browse.* "I just want to see who you have" bypasses the letter and shows a curated list.
- *Match.* The default path. The letter *is* the match input.
- *Create.* "None of these are right" → the AI says *"Tell me who you imagined."* and the user describes them, getting a fourth reply written in that imagined voice.

**How AI shows up.** As written voice. The letter is parsed (deterministically, in the demo) for tone, weight, and openness; the three replies are written to match-and-contrast it. AI is invisible-but-everywhere — there are no badges, no "AI-powered" copy, just text that knows how to answer text.

**Where it wins.** Most differentiated submission. Reverses the category's portrait-first instinct. Sets a tone of intimacy that the rest of the flow can deliver on. Cheapest assets — text carries 80% of the experience.

**Where it risks failing.** A blank textarea on app open is intimidating. Users who don't want to write may bounce. Hardest path to balance — the replies need to feel genuinely different in voice, which is real writing work, not a template fill. Visual reviewers may underread it.

**Demo viability.** High — text-heavy, low asset cost, but very high writing-quality bar. The whole experience hinges on three excerpts being good.

**30-second reviewer feeling.** *"This is the only one in the pile that doesn't open with a face. Why?"*

---

### Option F — Three Rooms (deliberate triptych, all four points get real depth)

**Pitch.** Most submissions will either collapse the three needs into one gesture (Options A–E, in different ways) or treat them as three weak tabs. This option does neither: it takes the assignment's three needs as **three peer surfaces**, builds each one as a designed room with real depth, and connects them with a single quiet host who carries context between rooms. AI is treated as four distinct visible techniques — **ranking, matching, suggestions, generation** — each surfaced in the room where it is most legible.

This is the "do the assignment seriously, at quality" option. It is the least original framing on the page, but the most balanced answer to the brief as written.

**App open.** A single calm screen with three labeled entries — not as buttons in a nav, but as three deliberately framed cards or doorways. Above them, one line from the host: *"I can show you who's here, find someone for you, or help shape someone new. Where do you want to start?"* Below them, one freeform input: *"or just tell me what you want."* That input is the universal escape hatch — it routes the user into whichever room the text implies.

**Room 1 — The Roster (browse, search, filter).**

The roster is editorial, not a marketplace grid. Each companion gets a magazine-style spread: large portrait, name, a one-paragraph premise written like a profile in a real publication, three sample first lines, three short tags. Spreads flip with paging on desktop and swipe on mobile. The reviewer should feel they are reading, not shopping.

- **Search** is real and forgiving. Typing "quiet" matches companions tagged calm, gentle, listener. Typing "someone older who doesn't fix things" parses tone + role + boundary and reranks.
- **Filters** are not a left-rail checkbox list. They are a row of conversational chips at the bottom: *softer · sharper · older · younger · more direct · less polished · stranger.* Each chip rerorders the spreads with a visible animation, and any chip can be removed.
- **Ranking visibility.** Each spread has an unobtrusive "Why you're seeing this" affordance that, when opened, explains the rank in human language: *"You opened two listeners earlier — she is the listener with the sharpest voice."*
- **Empty / overconstrained state.** Filters never dead-end. If constraints are restrictive, the product silently broadens and labels the result *"Closest to what you asked for."*

**Room 2 — The Interview Booth (quick match).**

For users who do not want to browse. A small focused surface, not the whole screen. Three to five short questions with chip replies plus optional free text. The portrait area to the side shows a soft unresolved presence that **shifts in lighting and posture after each answer** — the reviewer sees cause and effect immediately.

- Questions are sequenced by prior answers. Broad answers get clarifying follow-ups; specific free text skips obvious steps.
- The reveal is **narrated**, not spinner-and-result: three lines arrive in sequence (*"Looking for someone calm but not soft…" / "…attentive without making it heavy…" / "I think you should meet Iris."*) while the portrait resolves.
- Reveal explains fit in human language with three named traits matched to the user's answers. No scores, no percentages.
- Rejection is signal, not failure. "Show me another" asks *"Was it the look, the voice, or the energy?"* and the next reveal addresses it explicitly.
- After two rejections the host offers *"Want to describe them instead?"* — a clean handoff into Room 3.

**Room 3 — The Drafting Room (create someone specific).**

A focused surface where a blank portrait silhouette fills in as the user answers a small set of mood-led questions. The order is feeling → role → voice → look → name, not appearance-first. This is where AI suggestions are most legible.

- **Real-time suggestions** appear inline as the user types or picks. *"You've described someone direct — do you want them warm or sharp?"* The suggestions are the AI being a co-writer, not a form validator.
- **Voice is demonstrated, not described.** Instead of choosing adjectives, the user picks between three sample lines written in different voices. The selected line becomes part of the companion's voice profile.
- **Look is mood-led.** Not sliders. Chips like *soft studio light · night window · sharp city energy · warm apartment · older soul · classic beauty · unusual but grounded.* Each pick visibly nudges the portrait.
- **Name** is offered by the AI with three options plus a manual field.
- **Preview before chat** shows the assembled companion: portrait, name, first message, and a short "what shaped them" panel that lists the user's choices in plain language. One last "adjust" affordance before the chat opens.

**The Host (connective tissue, not a fourth room).**

A small persistent text-only presence at the top of the shell — no face, no avatar, just a typeface and a voice. The host:

- Carries context between rooms. Going from Roster → Interview, the host might say *"You opened two listeners. Should I just pick the best one?"*
- Is the freeform-text router from the home screen.
- Is intentionally less photoreal than the companions so the companions stay the emotional center (unlike Option C, where the host competes).

**How AI shows up — four distinct visible techniques.**

This is the option's strongest answer to the assignment's fourth bullet. Each of the four AI surfaces gets its own room:

1. **Ranking — in the Roster.** Spreads reorder under conversational refinements, and "Why you're seeing this" makes the ranking inspectable.
2. **Matching — in the Interview Booth.** Narrated reveal with named traits, rejection-as-signal, and a portrait that resolves as the match crystallizes.
3. **Suggestions — in the Drafting Room.** Inline co-writer prompts as the user shapes the companion. Voice and look are AI-led but user-chosen.
4. **Generation — across all three.** Portrait state changes during the interview, generated-feeling variants in the drafting room, generated taglines and sample lines on roster spreads. The product *feels* generative because every input has a visible output.

**Where it wins.** Only option that gives all four assignment bullets equal weight. Easiest to demo end-to-end because the three needs are obvious to a reviewer — they can see them named on the first screen. Each room can be polished independently without breaking the others. AI visibility is high *and* legible (the reviewer can point to where ranking, matching, suggestions, and generation each live).

**Where it risks failing.** Least original framing on the page. A reviewer who has seen many submissions may register this as a *well-executed standard* rather than a *new idea*. The opening screen with three doors flirts with feeling like a navigation menu — the host line and the freeform input are what save it from that. Quality across three rooms requires more design and writing work than collapsing them into one.

**Demo viability.** High — each room can be built and polished in isolation, and the connective host is lightweight. Most predictable shipping path of the six options.

**30-second reviewer feeling.** *"They actually built all three. And each one is good."*

---

## 4. Comparison

| Direction | First feeling | Browse | Match | Create | AI visibility | Asset cost | Risk |
|---|---|---|---|---|---|---|---|
| A — Portrait Funnel | Quiet, cinematic | Weak | Strong | Strong | Medium | Medium | Reads as a wizard |
| B — Casting Hall | Cinematic trailer | Strong | Strong | Medium | Medium | High | Lives or dies on assets |
| C — Concierge | Personality-led | Medium | Strong | Strong | High | Low–Medium | Host steals focus |
| D — Workshop | Generative | Strong | Medium | Strong | Highest | Highest | Looks like a configurator if it slips |
| E — Letter | Literary, unusual | Weak | Strong | Medium | Low (invisible) | Lowest | Blank-page intimidation |
| F — Three Rooms | Composed, balanced | Strong | Strong | Strong | High (legible) | Medium–High | Reads as well-executed standard |

---

## 5. Recommendation

The directions split into three groups by what they are optimizing for:

- **Cover-the-brief picks** — F. Treats all four assignment bullets as peers, builds each as a designed surface, makes AI visible as four distinct techniques. Safest path to a submission that scores well on every rubric line.
- **Memorable-hook picks** — B, C. Single strong gesture. Higher ceiling on reviewer recall, narrower target on the brief.
- **High-variance picks** — D, E. Highest ceiling, highest floor risk. Only worth it with confidence in the constraint they require (portrait variant budget for D, writing quality for E).
- **Safe fallback** — A. Partially built, still good, but lacks a singular hook.

Given the user's stated emphasis on giving all four assignment points real depth, **Option F (Three Rooms)** is the cleanest match. It is the only one of the six that does not subordinate one of the three user needs to the others, and the only one that lets a reviewer point at each of the four AI techniques in the room where it lives.

If the goal shifts back toward reviewer recall over rubric coverage, **B (Casting Hall)** is the strongest upgrade path from F — Room 1 (Roster) could be replaced with the vignette reel without disturbing the other two rooms. **C (Concierge)** is a parallel upgrade if the host in F is doing well enough that we want to lean into it as the product's main character.

**A** remains a defensible fallback because of what is already built. The highest-leverage edit to A is reframing the opening so the user is not meeting a specific stranger (Mira) before being asked what they want — that's the part that quietly undercuts the assignment's framing.

**D** and **E** stay as ambitious alternatives. D demands the most assets; E demands the best writing. Neither should be picked unless we are confident in the constraint they require.

---

## 6. Open Questions for the User

Before committing, three questions decide the choice:

1. **What is our portrait-asset budget?** Generating 3–4 companions × 4–5 states each is the difference between B/D being viable vs. embarrassing. If the answer is "one companion, like today," we should not pick B or D.
2. **Are we willing to lead with text instead of a face?** This is the only thing that unlocks E.
3. **How much does originality matter vs. execution safety?** A is safest. B/C are the upside picks. E is the lottery ticket. D is the moonshot.

A short answer to each of these is enough to lock the direction in one more pass.
