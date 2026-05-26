# AI Companion — Entry Experience

A plan for the path from app-open to first conversation. Frontend-only v1; every "AI" behavior is a deterministic function of user input so the flow can be judged on product design, not model quality.

---

## 0. Context

Take-home assignment for [get-honey.today](https://get-honey.today/). The product is an AI companion app, so the assignment surface (entry → first conversation) is directly relevant to their actual product. I've looked at the live site to understand the category and the implicit bar for polish.

Deliberate non-goal: **do not overfit to get-honey's current implementation.** This is judged as a product engineer's submission, not as a redesign of their site. Where their existing flow makes a specific choice (e.g. a particular onboarding step, a particular visual treatment), I'm free to disagree if I can justify a better one. The funnel-as-conversation premise in §1 is one of those disagreements — it's a different shape than most companion products use, and the value of the submission is in arguing for it, not in mimicking what already exists.

What I am taking from the category: warmth and intimacy over corporate polish; mobile-first; chat is the product; characters need personality, not feature lists.

---

## 1. The bet

The entry experience itself is conversational. A chat-styled funnel asks framed questions, the user answers with predefined chips, and the surrounding UI morphs in response — background hue, accent color, side panel, preview card. The funnel is the headline interaction.

Why this beats a normal onboarding form:

- It demos the core product (chat with predefined-feeling exchanges) before the user has committed to a character.
- Every chip is a small act of authorship — by the time the user lands in their first conversation, they've already had four or five micro-interactions that felt like dialogue.
- It collapses the three intents (browse / match / create) into one interaction language, so the user only has to learn the funnel once.
- It gives the morphing UI somewhere to live — the responsiveness of the surface to the user's selections is what makes the product feel alive vs feeling like a directory.

The risk: a user who knows exactly what they want resents being funneled. Mitigation: a persistent "skip to browse" affordance from the opening question onward, and the opening question is always one chip away from each branch — no multi-step lock-in.

---

## 2. Information architecture

```
/                    Funnel entry — opening question
/browse              Discovery grid (search, filter, sort)
/c/[id]              Character detail
/match               Match flow (3–4 questions → match reveal)
/create              Creator flow (archetype → traits → voice → name/avatar → optional freeform)
/chat/[id]           Conversation (the terminus for all three branches)
```

Funnel state (current step, prior selections, branch) lives in Zustand and is mirrored to `sessionStorage` so refresh restores position. Back button preserves selections.

Branch transitions are not hard route changes — they're shared-layout transitions within a single shell, so the morphing background carries continuity from question to question and from funnel into the destination surface.

---

## 3. The opening question

> **"Hey. Who do you want to meet?"**
>
> - Just looking around → `/browse`
> - Match me with someone → `/match`
> - I have someone in mind → `/create`
>
> (Small link, bottom of viewport) _Skip and just show me everyone_

Design notes:

- Greeting is lowercase-warm, not corporate. No logo lockup above it; the question is the hero.
- The three chips are visually equal weight. No "recommended" pip — we don't yet know enough about the user to recommend.
- The "Skip" link exists for repeat visitors, power users, and anyone who hates being funneled. Click rate on this link is something I'd want to track in a real product to know whether the funnel is paying for itself.
- Background is a soft gradient that subtly shifts when the user hovers each chip — a preview of the morphing pattern.

---

## 4. Branch A — Browse (discovery)

The largest surface and the path most casual users will take.

**Discovery grid**

- Card-based, 3 across desktop / 1 across mobile.
- Each card: avatar, name, one-line bio, two tag pills, opening-line snippet that fades in on hover (desktop) / always shown (mobile).
- Sticky top bar: search input, filter button, sort selector.

**Filters**

- Tags (multi-select chips): mood, role, format. Example tags: cozy, witty, mentor, roleplay, listener, mysterious, sharp.
- Filter sheet slides up from the bottom on mobile; left rail on desktop.
- Applied filters appear as removable chips above the grid.

**Sort**

- Popular today (default for cold start)
- New
- Recommended for you (only shown if user came through Match or Create — keyed to their selections)

**Search**

- Instant filter, no submit. Matches name, tags, and bio keywords.
- Empty input shows the grid normally. Typing collapses the grid into matches.

**Character detail (`/c/[id]`)**

- Hero: large avatar, name (editorial serif), one-paragraph bio, tag pills.
- Sample messages: three example exchanges showing the character's voice — these are the "test drive" before committing.
- Related characters: three cards by tag overlap.
- Primary CTA: "Start chatting" — large, anchored bottom on mobile, inline below sample messages on desktop.

**States**

- Empty grid (no filter matches): "Nothing matches all of that. Try fewer filters?" with one-tap "clear filters" button.
- Image load failure on a card: avatar falls back to a tinted initials disc, not a broken-image icon.
- Slow load: skeleton cards with the same spacing as real cards so layout doesn't shift.

---

## 5. Branch B — Match (quick match)

For the user who doesn't want to make a lot of decisions.

**Questions (3–4)**

Each question is one screen in the funnel shell. Chips, morphing background tied to selection.

1. **"What kind of company are you after?"** — Cozy / Playful / Sharp / Mysterious / Anything goes
2. **"And what should they be doing?"** — Listening / Bantering / Telling stories / Helping me think / Surprise me
3. **"Tone-wise?"** — Warm / Sly / Soft / Bold
4. _(Optional 4th if first three were ambiguous)_ — A tiebreaker question synthesized from collisions in tag space.

Each question accepts "Anything" / "Skip" as a chip, so the user can race through.

**The matching moment**

This is the moment where the product has to feel intelligent even though it's a pure function. A naive implementation flashes a spinner and reveals — that's a wasted opportunity.

Instead: a narrated interstitial that types itself out, referencing the user's actual selections:

> _Looking for someone who's cozy and a great storyteller…_
> _…and warm without being soft._
> _I think you'd like Iris._

The reveal lands with the character's avatar scaling in, name in serif, and a "Here's why" expandable panel showing the tag overlap that drove the pick.

**Reveal CTAs**

- "Start chatting" (primary)
- "Show me someone else" (re-runs the matcher excluding the prior pick)
- "Let me see all of them" (escape to `/browse` with the user's tags pre-applied as filters)

This third option is critical. Without it, a bad match is a dead-end. With it, Match degrades gracefully into Browse — same answers, different surface.

**Scoring function (faked)**

```
score(character) = sum(weight[tag] for tag in character.tags ∩ user.selections)
```

Light randomization to break ties. Excludes characters from prior reveal in the same session.

**States**

- All "Anything" selections: skip the narrated interstitial, go straight to a popular character with a different "you didn't tell me much — here's someone everyone likes" rationale. This is the empty-input case for the matcher.
- Re-run with no remaining candidates: "I'm out of ideas. Want to look through everyone?" → Browse.

---

## 6. Branch C — Create

For the user with a specific vision. Hardest to scope.

**Approach: progressive disclosure as conversation**

Reuse the funnel shell so the interaction language is consistent. Each step is a chip-based question with a live preview side panel.

1. **Archetype** (single-select): Companion / Mentor / Sidekick / Antagonist / Muse / Stranger
2. **Traits** (multi-select, 2–4): Witty / Warm / Blunt / Dreamy / Sarcastic / Earnest / Sharp / Soft (8 chips, pick a few)
3. **Voice** (single-select): three sample dialogue snippets showing different voices for the archetype+traits combo so far. The user picks the one that sounds right. This is the most "AI shows up in the creator" moment.
4. **Name & avatar**: name is a freeform input; avatar is a curated grid of 6 options keyed to the archetype + first trait. "Generate another set" reshuffles within the keying.
5. **Anything else?** (optional, gated): single freeform textarea. "Backstory, quirks, things they care about — or skip." This serves the user who has something specific they need to say. Cap at ~280 characters to keep it focused.

**Live preview panel**

Right side on desktop, sticky bottom on mobile. As selections accrue, the preview assembles:

- Avatar appears at step 4.
- One-line bio is templated from archetype + traits ("a warm, witty companion who listens more than talks").
- Sample opener appears at step 3, swapping to match the chosen voice.

The user sees their character becoming real in real time. That's the emotional payoff of Create.

**Finish**

"Meet [name]" → transition into chat. The character's first message is a templated opener keyed to their archetype + voice, with [name]-personalization. For the v1 demo, generated-feeling content is represented by deterministic templates so the product flow can be evaluated without model calls — the seams are sized for a real model to slot in later.

**States**

- Back from any step: prior selections preserved.
- Refresh: full state restored from sessionStorage.
- User abandons mid-create: next visit, the funnel offers "Pick up where you left off?" as a fourth chip on the opening question.
- Name collision with seed character: allowed; we're not policing.

---

## 7. Chat (the terminus)

A thin shell — enough to feel like an ending, not a destination. Real chat product would dwarf this; we deliberately don't build it.

- Header: character avatar (small), name, "..." menu (regenerate response, end chat, share — non-functional but designed).
- Message list with the character's first message already present.
- Typing indicator with a slight delay before each character reply (canned, picked by light keyword matching on user input).
- Input box: textarea, send button (Enter to send, Shift+Enter for newline).
- Three suggested-reply chips below the input — these continue the chip metaphor from the funnel into the chat itself.

**Arrival-aware opening (the first 30 seconds)**

The chat is thin by design, but the first ~30 seconds should feel alive. Three branches feed off a single seam — how the user arrived:

- **From Match**: the opener references the rationale tags. _"Heard you were after someone cozy. I can do cozy."_
- **From Create**: the opener pulls from the chosen archetype + first trait + name. _"So I'm [name]. You picked sharp and earnest — let's see what happens."_
- **From Browse**: a canned per-character opener (already in seed data).

Suggested replies branch the same way — Match-arrivals get chips that continue the rationale thread; Create-arrivals get chips that test the traits they chose; Browse-arrivals get neutral starters.

One more designed turn after that: a light keyword matcher on the user's first reply maps to 2–3 branches per character, producing a believable second character message. After that exchange, suggested replies become generic and replies pool-sample. The conversation degrades visibly rather than breaks — the user feels the seam, but only after the first 30 seconds have already done their job.

**States**

- Send failure (simulated 1-in-N): inline retry on the failed message, no toast.
- Long messages: auto-grow input up to 6 lines, scroll within.
- Empty input: send button disabled but visible.

---

## 8. Where "AI" shows up (and how it's faked)

The assignment specifically asks about this. The design assumes a real model lives at each of these seams; the v1 stubs are localized so swapping them out later is a small change.

| Surface               | What it looks like                                | What it actually is in v1                                                                                                                |
| --------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Discovery ranking     | "Recommended for you" sort                        | Tag-overlap score with funnel selections; falls back to popularity                                                                       |
| Match scoring         | Picks one character from chip answers             | Weighted tag intersection + light randomization                                                                                          |
| Match rationale       | Narrated "why this one"                           | Template populated with the tags that overlapped                                                                                         |
| Creator voice preview | Three sample dialogues per archetype/traits combo | Lookup table                                                                                                                             |
| Creator bio assembly  | One-line bio updates as chips are picked          | String template from selection slots                                                                                                     |
| Chat opener           | Character's first message in chat                 | Branches on arrival: Match → references rationale tags; Create → templated from archetype + traits + name; Browse → canned per character |
| Suggested replies     | Three chips under the chat input                  | Arrival-aware on first turn (Match/Create/Browse-keyed); static-set + keyword swap after                                                 |
| Chat continuity       | Character responds to what I said                 | First-reply keyword match → 2–3 branches per character; subsequent replies pool-sample                                                   |

Each is a pure function of user input. Determinism makes the demo reliable and makes the architecture honest about where the real model would plug in.

---

## 9. Design system

- **Type**: editorial serif for character names and display headings (gives characters gravitas); humanist sans for UI and body. No system font.
- **Color**: dark base, never pure black. One accent per character (stored in their data). The funnel's morphing background pulls from the accent of the most recent chip-driven selection.
- **Spacing**: generous around chips and chat bubbles; tighter in discovery so cards breathe but the grid feels populated.
- **Components**: hand-rolled primitives (Button, Chip, Card, Field, Avatar, MessageBubble, Step). No shadcn defaults — the product needs visual identity, not the generic component-library look.
- **Iconography**: minimal. Skip icons that don't carry weight. One icon set throughout.
- **Motion**: shared-layout transitions on the funnel; ease-out on entries, no bouncy springs.

---

## 10. Copy principles

- Lowercase warmth, never corporate. "Hey." beats "Welcome to AI Companion."
- No verb-noun button labels for emotional moments. "Start chatting" not "Submit". "Show me someone else" not "Try again".
- Empty and error states use the same voice as the rest of the product, not a debug voice.
- The product never refers to itself in the third person. There is no brand; there is just the conversation.
- Numbers and progress indicators are avoided in the funnel (no "Step 2 of 4") — they make a conversation feel like a form.

A few sample strings I'd want to land:

- Funnel open: _"Hey. Who do you want to meet?"_
- Match narration: _"Looking for someone who's [tag] and [tag]…"_
- Match reveal: _"I think you'd like [name]."_
- Empty discovery: _"Nothing matches all of that. Try fewer filters?"_
- Chat error: _"That didn't go through."_ (with inline retry)
- Create handoff: _"Meet [name]."_

---

## 11. Tech stack

- **Next.js (App Router) + TypeScript** — file-based routing fits the IA above; App Router's layouts cleanly support the shared funnel shell.
- **Tailwind** with a custom token layer — speed without giving up the bespoke look. Component classes via `clsx`-style composition; no `@apply` soup.
- **Framer Motion** — shared-layout transitions and gesture support for the mobile filter sheet.
- **Zustand** — funnel/selection state, persisted to `sessionStorage` via the middleware.
- **Static JSON** in `/data/characters.json` — ~14 hand-written characters with full metadata. No backend. No fetch waterfalls.
- **No auth, no real persistence** beyond a session.

The whole thing should boot in <100ms on a refresh; the morphing UI demands no perceptible jank between steps.

---

## 12. Surface allocation (the trade-off)

Polished depth across surfaces, in order of investment:

1. **Funnel shell + morphing UI** — the headline interaction. If this feels good, the demo lands. If it feels off, nothing else saves it.
2. **Match** — the most opinionated surface and the one that best demonstrates "AI showing up". Narrated interstitial, rationale, graceful degradation to Browse.
3. **Browse** — broad but shallow polish. Grid, filters, search, character page, chat handoff. Don't over-engineer filter combinations.
4. **Create** — full end-to-end but with deliberately capped depth (one archetype list, one trait list, one freeform field). The progressive disclosure pattern matters more than the breadth of options.
5. **Chat** — intentionally thin. It's the terminus, not the product.

**Justification I'll write in the submission:**

A real product would A/B Browse vs Match as the default and likely find Match converts better for newcomers and Browse for returners. Match is therefore the surface where polished AI-feel pays back the most per hour of work. Browse is wide but most of its problems (real search ranking, infinite scroll, recommendations) are out of reach without a real model and a real corpus, so going deep there in v1 would be vanity. Create is a long-tail surface — most users will never finish it — but its existence and quality signal whether the product respects users who arrive with specific intent. Shipping it end-to-end at modest depth is the right shape.

---

## 13. States, the comprehensive list

| Surface        | Empty                                                 | Loading                                       | Error                                                                 | Edge                                        |
| -------------- | ----------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------- |
| Funnel         | n/a                                                   | step transitions animate, never spin          | n/a                                                                   | refresh restores; back preserves selections |
| Discovery      | "no matches" with clear-filters CTA                   | skeleton cards                                | image fallback to tinted initials                                     | very long bios truncate with fade           |
| Character page | n/a                                                   | hero skeleton                                 | character not found → soft 404 with "back to browse"                  | very long name wraps to two lines           |
| Match          | all "Anything" → popular pick with adjusted rationale | narrated interstitial (not a spinner)         | no candidates left → "out of ideas" escape to Browse                  | re-runs preserve prior tags                 |
| Create         | preview empty until first selection                   | step transitions; voice preview swap animates | name collision allowed; profanity not policed in v1 (note in writeup) | abandon → resume on next visit              |
| Chat           | "Say hi" placeholder in input                         | typing indicator (delay then bubble)          | send failure → inline retry on bubble                                 | very long replies scroll within bubble      |

---

## 14. Mobile

The funnel is mobile-first. AI companion traffic skews mobile heavily — desktop is the afterthought, not the inverse.

- Funnel chips: full-width, comfortable tap targets, stacked vertically.
- Morphing background: same effect, lower-frequency animation budget.
- Discovery: single column, bottom-anchored search bar, filter sheet slides up.
- Character page: hero scrolls under a sticky "Start chatting" button.
- Creator preview: collapses to a peek at the bottom; tap to expand.
- Chat: standard mobile chat layout, suggested replies above keyboard.

---

## 15. Build order

1. Design tokens, font loading, primitives (Button, Chip, Card, Field, Avatar). Storybook-style demo page to spot-check.
2. Character seed data (~14 characters, full metadata, opening lines, sample dialogues, accents).
3. Funnel shell: opening question, chip selection, morphing background, step transition. Get the headline interaction working end-to-end with one branch wired (Browse, easiest).
4. Discovery grid + filters + search + sort + character page + chat shell. End-to-end Browse path complete.
5. Match flow: questions, scoring, narrated interstitial, reveal, rationale, re-run, fallback to Browse.
6. Create flow: archetype, traits, voice, name/avatar, optional freeform, live preview, handoff to chat.
7. States pass: every empty, loading, and error state listed in §13.
8. Copy pass: every string in the product. No "Submit" anywhere.
9. Mobile pass: full walk-through on a real phone, fix what jars.
10. Motion pass: tighten shared-layout transitions and kill anything that distracts.
11. Demo polish: refresh restore, back preservation, abandon-resume.

If time pressure forces a cut, the order also doubles as the cut order: drop step 11, then 6 down to skeleton, then 5 down to skeleton — never cut from the funnel shell or Browse, because without those there's no product to show.

---

## 16. Out of scope (will be stated explicitly in submission)

- Auth, accounts, persistence beyond a session.
- Real model calls. Architecture is shaped to drop them in cleanly at the seams in §8.
- Voice, image upload, user-uploaded avatars.
- Multi-character chats, group conversations.
- Settings, preferences, content controls.
- Safety / moderation surfaces (huge in a real product; v1 deliberately doesn't pretend).
- Analytics or A/B harness. I'll annotate where I'd wire them.
- Internationalization.

---

## 17. Open questions

1. **Does Browse skip the funnel entirely?** Leaning: keep the one-question intro for the conversational tone, but a "skip" link is always visible from frame one. The opening question is one chip and ~3 seconds — cheap enough to be worth the framing.
2. **Creator depth: chips only, or a freeform "anything else?" field?** Leaning: include it, gated at the end, capped at ~280 chars. Without it, Create collapses to Match-with-more-steps. With it, the user who arrived with a specific vision gets a real canvas without the surface ballooning.
3. **Is the Match reveal re-runnable?** Leaning: yes, with "Show me someone else" and "Let me see all of them" as parallel CTAs to the primary "Start chatting".
4. **Does the chat have suggested-reply chips?** Leaning: yes — it continues the funnel's chip metaphor into the chat itself, and gives the user a soft on-ramp when they don't know what to say. Cost is low; payoff for the demo is high.
5. **Should anonymous-session characters created in Create survive a refresh?** Leaning: yes, via sessionStorage. Across days, no — out of scope.

I'd want to commit to these answers before I start building. Any of them is reversible later if the build reveals they're wrong.
