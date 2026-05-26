# AI Companion Entry Experience - Product And Design Plan

This plan reorients the project around a conversational web funnel for an AI companion product. The goal is still the original assignment: build the path a new user takes from app open to first conversation with a character. The direction changes from a mostly browse/match/create app surface into a richer, more intimate first-meeting experience.

The product should feel like someone is slowly becoming real beside the user. The user is not filling out a form. They are having a guided conversation, and every answer changes the companion presence: what the app infers, what it recommends, how the portrait looks, and how the first chat begins.

This document is intentionally product- and design-focused. Existing code can be reused where it helps, but the new direction should not be constrained by the current UI or route structure. If starting from scratch produces a stronger product, start from scratch.

---

## 1. Assignment Frame

The assignment asks for an end-to-end entry experience for an AI companion product. A new user may arrive with three different needs:

- They want to browse what already exists.
- They want to be matched quickly without making many decisions.
- They want to create something specific to them.

The deliverable should feel like a polished product, not a wireframe. It needs considered copy, transitions, empty and error states, and a clear answer for how AI appears in the experience: suggestions, ranking, matching, generated content, and personalization.

Our answer is a web funnel, but not a classical funnel. There are no obvious step counters, no corporate onboarding cards, and no long form. The funnel is a chat. The user answers in small conversational turns. The interface responds visually. The path branches based on intent. The companion portrait changes alongside the conversation until the user arrives in the first chat with a character who already feels selected, shaped, or discovered for them.

---

## 2. Core Bet

The entry experience should be a first conversation.

Most AI companion products start with a marketplace: rows of attractive avatars, search filters, likes, premium labels, and "chat now" buttons. That solves inventory discovery, but it does not create intimacy. It makes companions feel interchangeable.

This product should begin with presence instead:

- A large realistic portrait is visible from the first screen.
- The chat asks one emotionally legible question at a time.
- User answers change the portrait, tone, recommendations, and first-chat context.
- Discovery, matching, and creation all happen through the same interaction language.
- The final chat begins with context the user created during the funnel.

The product promise is not "choose from many characters." The promise is "meet someone who feels like they were waiting for this conversation."

---

## 3. Design Direction

The experience should feel intimate, cinematic, and personal. It should avoid the visual grammar of a marketplace, quiz, productivity dashboard, or dating app swipe deck.

Use the generated concepts as direction references:

- `design/concept-01-presence-split.png` - desktop split screen with chat, context, and living portrait.
- `design/concept-02-mobile-portrait-funnel.png` - mobile portrait-first funnel.
- `design/concept-03-conversational-creator.png` - companion builder through chat.
- `design/concept-04-chat-with-presence.png` - first chat with persistent portrait and carried-over context.

### Product Feeling

- Quiet instead of loud.
- Personal instead of promotional.
- Sensual in atmosphere, but not explicit.
- Warm and direct in copy.
- Premium through detail, not through clutter.
- Emotionally adaptive, even if the demo logic is deterministic.

### Visual Principles

- The portrait is the main product surface.
- Chat is the control layer.
- User choices are reflected through copy, portrait state, and first-chat context rather than a separate settings-like panel.
- Progress is implied by what the app has learned, not by numbered steps.
- Motion should feel like attention: lighting shifts, portrait state changes, panels breathe, messages arrive with natural timing.
- The UI should never feel like a traditional lead-capture funnel.

### Companion Imagery

Companions should use large realistic generated images. The image should not be a tiny avatar in a card; it should be a persistent presence.

Each companion needs multiple visual states:

- neutral first look
- warmer after trust-building choices
- curious after playful/open choices
- closer after the user commits to a direction
- final chat state

States can change through expression, distance from camera, lighting, posture, room mood, wardrobe tone, or crop. The demo does not need true image generation at runtime. Pre-generated state images are enough if the product idea is clear.

All companion imagery should be adult, fully clothed, non-explicit, and polished. The product can feel intimate without relying on explicit presentation.

---

## 4. Experience Model

The whole entry experience is one conversational shell with a changing visual companion. The shell supports three paths, but the user should not feel they are choosing a product mode. They should feel the conversation is adapting.

### Shared Shell

Every screen has the same core ingredients:

- Large companion portrait or portrait-in-progress.
- Chat history with short, natural messages.
- Reply chips for low-friction answers.
- Optional free text when specificity matters.
- A subtle escape hatch to see everyone or skip ahead.
- A primary next action only when the moment needs one.

For now, avoid a dedicated memory or "what I know" panel. The prototype should stay focused on the main assignment requirements: discovery, quick matching, specific creation, and arrival in the first conversation. Learned signals can still affect the chat copy, portrait state, and recommendations, but they do not need their own visible surface.

### Dynamic Pathing

The path changes based on the user's answers.

Example opening:

> Hey. What kind of company would feel good right now?

Reply options:

- Show me who's here.
- Choose someone for me.
- Stay with you.
- I'm waiting for someone else.

Those choices map roughly to Browse, Match, staying with the default companion, and creating someone specific, but the user never sees labels that feel like navigation. The conversation can also reroute:

- A browsing user who keeps choosing "surprise me" can be moved into Match.
- A matching user who rejects multiple reveals can be moved into Browse with filters pre-applied.
- A user who says "I'm waiting for someone else" enters a guided creation path through follow-up questions.
- A specific freeform description can jump deeper into that path.

The funnel should feel intelligent because it asks fewer questions when it already has enough signal, and asks better follow-ups when it does not.

---

## 5. App Open

The first screen should not look like a landing page. It should look like the product has already started.

### First Impression

Desktop:

- Split view.
- Left: chat surface.
- Right: large portrait area.
- The portrait can start as a default companion who is ready to talk.
- The interface makes it clear the user can either continue with this companion, ask to be matched, browse, or say they are waiting for someone else.

Mobile:

- Portrait first.
- Chat panel anchored to the bottom.
- The user immediately sees a face and a question.
- The chat panel can expand as the conversation deepens.

### Opening Copy

Options:

> Hey. What kind of company would feel good right now?

> I can stay, or I can help you find who you were hoping for.

> Tell me what you want this to feel like.

The copy should avoid "Welcome", "Get started", "Submit", "Onboarding", and "Step 1". It should sound like the first message in a conversation.

### Immediate User Control

Even though the funnel is the main idea, users need exits:

- "show everyone" as a quiet text option
- "skip" in the corner or footer
- back behavior that preserves prior answers
- free text for users who dislike chips

The escape hatches are important because intimacy becomes pressure if the user feels trapped.

---

## 6. Path A - Discover Existing Companions

Discovery should still exist because some users want to browse. The design challenge is to keep browsing from becoming a marketplace grid too early.

### Discovery Through Conversation

If the user chooses "show me who's here", the chat asks one lightweight framing question before opening the full inventory:

> Want a quick mood, or do you want to look through everyone?

Reply options:

- calm
- playful
- intense
- strange
- show everyone

If the user picks a mood, the portrait area becomes a curated stage: 3-5 large companion previews, one primary and a few alternates. The user can move between them with simple controls and see the portrait, name, one-line premise, and sample first message.

The full grid is available, but it is secondary. The product should try to make the first recommendation set feel personal before asking the user to scan inventory.

### Browse Surface

When the user opens the full browse view, it should be richer than the old card grid:

- Large portrait tiles, not tiny cards.
- One highlighted companion at a time on desktop.
- Search and filters presented as conversational refinements.
- "show me softer", "more playful", "less intense", "someone older", "someone who listens" style refinements.
- Traditional search remains available for direct users.

### Filters

Filters should map to emotional and interaction qualities:

- vibe: calm, playful, sharp, dreamy, mysterious, grounded
- role: companion, muse, mentor, confidant, challenger, storyteller
- energy: quiet, flirty, witty, intense, gentle, chaotic
- pace: slow, immediate, teasing, reflective
- format: text-first, image-rich, voice-ready, short replies, long replies
- boundaries: light, romantic, supportive, roleplay, practical

The product should not overload the user with all filters at once. A conversational refinement can set filters implicitly.

### Character Preview

Selecting an existing companion opens a preview that still sits inside the chat shell:

- Large portrait/video-still.
- Name in editorial type.
- Short premise.
- "What they notice" or "What they are good at" bullets.
- Three sample first messages.
- A "why this one" note if the user had prior answers.
- CTA: "say hi to [name]"

### Best Fit And Error States

The funnel should not dead-end when filters get too narrow. If the user's filters or answers are restrictive, the product should broaden the candidate pool silently and show the strongest available companions. The user does not need to know that the match is partial; they need a credible next person to meet.

Overconstrained browse:

> I think you might like these.

Actions:

- show me softer
- show me bolder
- show more like this

Image unavailable:

- Use a soft blurred color/initials fallback.
- Keep the chat and copy calm.
- Never show a broken image icon.

No exact search hit:

> I found a few that feel close.

---

## 7. Path B - Quick Match

Quick Match is for users who want the product to decide. It should feel like being understood quickly, not like taking a personality quiz.

### Question Strategy

Ask only enough questions to make a credible match. Start broad, then branch.

Core questions:

1. What kind of company feels right tonight?
2. Should they lead, listen, tease, or ask?
3. What should the first conversation avoid?
4. Do you want familiar, surprising, or a little dangerous?

The fourth question is dynamic. It only appears if the previous answers conflict or are too broad.

### Example Match Flow

Companion:

> I can choose. Give me a little signal first.

Question:

> When they answer, what should you feel?

Replies:

- calmer
- wanted
- challenged
- entertained
- understood

If the user chooses "calmer", the portrait lighting warms and the candidate pool shifts toward gentle/listener characters. If the user chooses "challenged", the portrait may become sharper, more direct, higher contrast.

### Matching Moment

Avoid a spinner. Use a narrated reveal:

> Looking for someone warm, unrushed, and not too polished...

> Someone who can listen without making it heavy.

> I think you should meet Iris.

During this, the portrait should transition from the generic/in-progress presence into the matched character. It can feel like the product is focusing the image.

### Match Reveal

The reveal needs enough rationale to feel intelligent:

- Large final portrait.
- Companion name.
- First message preview.
- "Why her" or "Why them" panel.
- Fit rationale shown in human language, not technical scoring.

Example:

> I picked Iris because you asked for soft, honest, and unrushed. She tends to ask one real question at a time.

Actions:

- "say hi"
- "show me another"
- "show similar"
- "open everyone"

### Bad Match Recovery

If the user rejects a match:

> Good. That helps. Was it the look, the voice, or the energy?

Reply options:

- look
- voice
- energy
- all of it
- show me choices

This turns rejection into signal. It should never feel like failure.

---

## 8. Path C - Find Someone Specific

This path is for users who do not want the default companion and are waiting for someone more specific. It still satisfies the "create your own character" requirement, but the framing should feel more emotionally real than "make someone." The user is describing who they hoped would show up, and the product shapes a companion around that.

### Specific Companion Entry

If the user chooses "I'm waiting for someone else" or writes a specific prompt, the current portrait gently recedes and the next companion starts as a soft, unresolved presence. It becomes clearer with each answer.

Opening copy:

> Tell me who you were hoping would answer.

> Start with the feeling. What should they bring into the room?

Reply options:

- warmth
- nerve
- patience
- mischief
- honesty
- calm

### Specific Companion Steps

The flow can have many steps, but they should not be presented as a checklist. Each step is a chat turn. Progress is implied by the companion becoming more visually and verbally specific.

Suggested sequence:

1. Feeling: what emotional atmosphere should they bring?
2. Role: what place do they hold in the user's life?
3. Voice: how do they speak?
4. Pace: how quickly do they get close?
5. Boundaries: what should they avoid or respect?
6. Ritual: when and how do they show up?
7. Appearance: what should they look and feel like visually?
8. Name: choose or generate a name.
9. First message: preview and adjust before entering chat.

Not every user needs every step. If someone writes "I want a dry, older mentor who checks in after work and does not flirt", the flow can skip several chip questions and move to preview.

### Voice Preview

Voice should be demonstrated, not described.

Instead of asking "choose a voice: warm, witty, poetic", show three sample replies:

- "Tell me the clean version first. Then the real one."
- "I can sit with you for a minute. No fixing."
- "You are doing that thing where you make it sound fine."

The user chooses the reply that sounds right. The selected voice becomes part of the companion profile.

### Appearance And Portrait Generation

Appearance should avoid a long checklist of body/face sliders. It should be mood-led:

- "soft studio light"
- "night window"
- "sharp city energy"
- "quiet room"
- "warm apartment"
- "older soul"
- "androgynous edge"
- "classic beauty"
- "unusual but grounded"

The portrait updates after these choices. The user can ask for variations:

- warmer
- less polished
- more direct
- softer eyes
- closer
- different room

For the demo, these can map to pre-generated image sets. The interface should make it feel generated even if it is deterministic.

### First-Chat Context

The flow can capture one or two pieces of context for the first message, but this should not become a separate profile surface yet. Keep it lightweight and tied to the handoff into chat.

Context prompts:

> What should they know before they say hello?

> Is there anything you do not want them to push on?

> What should the first message understand about you?

This is the emotional bridge into the first conversation.

### Create Finish

The final moment should not say "complete". It should feel like meeting.

Copy options:

- "meet Mira"
- "say hi to Noa"
- "let Iris in"

Before entering chat, show a concise preview:

- portrait
- name
- first message
- what shaped them
- one last option to adjust tone or image

---

## 9. Mock Paywall

A mocked paywall can be part of the web funnel, but it should not sabotage the assignment's requirement to reach a first conversation.

The paywall should be designed as a product moment, not a payment integration. No real payment, no account setup, no checkout details.

### Paywall Philosophy

The user should never feel punished for exploring. The first conversation must begin before the paywall appears. The cleanest demo gate is "continue beyond the preview conversation": the user gets a first exchange, understands the companion, and only then sees the continuation gate.

The paywall should appear when the user tries to continue after the preview conversation, not before the first chat starts.

The paywall should frame one value:

- continue beyond the preview conversation

### Recommended Demo Gate

Use a soft gate after the user has seen the companion's first message and had a short preview exchange:

Title:

> Keep talking with Mira?

Body:

> Your preview is ready to continue.

Actions:

- "continue" - opens mocked premium success
- "not now" - keeps the user in preview mode
- "try someone else" - returns to matching or browse

This lets the demo show monetization thinking without blocking the assignment's required first conversation.

### Paywall States

Dismissed:

> No problem. This chat stays in preview.

Mock success:

> You're in. Keep going.

Error:

> That did not go through. Nothing changed.

The error should be inline and calm. No scary red payment failure state.

---

## 10. First Conversation

The first conversation is the destination. It should feel earned by the funnel.

### Arrival From Browse

If the user came from Browse:

- First message uses the companion's authored opener.
- The opener can reflect any filters or refinements that led here.
- Suggested replies help the user start naturally.

Example:

> You found me through the quiet ones. Good instinct. What should we do with the silence?

### Arrival From Match

If the user came from Match:

- First message references the match rationale.
- The companion acknowledges the user's chosen tone.

Example:

> I heard you wanted honest and unrushed. I can do that. Tell me the easy version first.

### Arrival From Create

If the user came from Create:

- First message references the traits, context, and ritual the user picked.
- The portrait uses the final selected state.

Example:

> You asked me to be warm, direct, and not too eager to fix things. So I will start simple: what part of today are you still carrying?

### Chat Screen Design

The chat should keep the large portrait present.

Desktop:

- left chat
- right portrait/video-still
- optional slim strip for portrait states or suggested replies
- small controls for expression/lighting/state if useful

Mobile:

- portrait top
- chat bottom
- suggested replies above input

The first chat does not need to support deep conversation forever. It needs the first 30-60 seconds to feel alive.

---

## 11. How AI Shows Up

The demo does not need actual AI. It needs the product idea to be visible. All "AI" behavior can be deterministic, prewritten, or generated ahead of time.

### AI-Like Product Moments

Personalized question sequencing:

- The next question changes based on previous answers.
- Broad answers trigger clarifying questions.
- Specific free text skips obvious steps.

Discovery ranking:

- Companions are ranked by fit against mood, role, tone, pace, and boundaries.
- Results explain why they are shown.

Match logic:

- Match reveal references the user's actual answers.
- Rejections become signal for the next reveal.

Creator suggestions:

- The app suggests voice lines, names, rituals, and visual directions.
- Suggestions feel generated, but can come from curated templates.

Portrait generation:

- The portrait changes after answers.
- Variations imply generated images, even if pre-generated.

Context carryover:

- The app converts answers into lightweight context for reveal copy and the first message.
- There is no dedicated memory panel in this version.

First message:

- The opener is arrival-aware.
- Browse, Match, and Create produce different first messages.

The important thing is that users see cause and effect: "I said this, so the product changed that."

---

## 12. Copy Principles

The copy should be warm, direct, and emotionally literate. It should avoid generic product language.

Use:

- "tell me what you want this to feel like"
- "good. that helps."
- "want someone softer, or someone sharper?"
- "keep talking"
- "say hi"
- "show me another"
- "keep that"

Avoid:

- "submit"
- "next step"
- "complete your profile"
- "configure preferences"
- "AI-powered personalization"
- "start onboarding"
- "finish setup"

The product should not over-explain itself. Users should understand the flow by using it.

---

## 13. States And Edge Cases

The polish requirement matters. Every important state should have designed behavior.

### Loading

Avoid spinners when possible. Use narrative loading:

- "looking for the right kind of quiet..."
- "softening the voice..."
- "trying a warmer room..."
- "checking who fits that pace..."

Portrait loading can use blurred color fields, low-res previews, or a soft focus transition.

### Empty

Low-confidence match:

The product should still show someone. Broaden the candidate pool behind the scenes, pick the strongest available companion, and present them confidently.

Copy:

> I think you should meet Iris.

Variant fallback:

If a requested portrait variant is unavailable, keep the best current portrait and offer adjacent directions.

> Try this version, or we can make the room softer.

No exact search result:

> Here are a few to start with.

### Error

Image generation/mock failure:

> That look did not come together. Your choices are still saved.

Chat send failure:

> That did not go through.

Paywall mock failure:

> That did not go through. Nothing changed.

### User Indecision

If the user repeatedly chooses "anything" or skips:

> I can choose. I will keep it easy.

Then reveal a popular, low-risk companion with a confident, simple rationale:

> I think an easy start makes sense. Meet Iris.

### User Rejection

If the user rejects multiple matches:

> I am missing something. Want to show me in your own words?

Offer free text and then a broad browse view.

### Sensitive Input

The demo does not need a full moderation product, but it should avoid awkward crashes. If a user writes something outside scope:

> I cannot build that here. Want to keep it adult, respectful, and fictional?

Then offer safer adjacent choices.

---

## 14. Mobile Direction

Mobile should not be a compressed desktop design. It should be portrait-first.

### Mobile Layout

- Full-screen portrait as the emotional anchor.
- Bottom chat sheet for funnel turns.
- Reply chips stacked with large tap targets.
- Portrait state thumbnails along the side or behind the sheet.
- Input always reachable.

### Mobile Motion

- Portrait softly changes between answers.
- Chat sheet rises and settles as needed.
- Chosen answers appear as small, temporary confirmation moments.
- Avoid heavy transitions that make the app feel slow.

The mobile experience should feel like texting someone whose face is right there, not filling out a mobile form.

---

## 15. Desktop Direction

Desktop should use space to create presence and clarity.

### Desktop Layout

- Left: conversation.
- Right: large portrait.
- Optional portrait state stack.
- Minimal nav, if any.

Desktop is where the product can show the strongest visual concept: a companion who stays beside the chat from first question to first conversation.

---

## 16. Asset Plan

We can generate as many assets as needed. The asset set should support the product story.

### Required Concept Assets

For each of 3-5 seed companions:

- primary portrait
- warm state
- curious state
- closer state
- final chat state
- small thumbnail/crop variants

For creator flow:

- 2-3 base companion directions
- variation sets for mood, lighting, and distance
- generated-looking preview thumbnails

For UI:

- blurred portrait placeholders
- soft room/background variants
- empty state visual treatment

The images should be consistent enough to feel like the same companion across states. The product depends on continuity.

---

## 17. Demo Scope

The demo should be complete enough to prove the product idea:

1. App opens directly into the conversational shell.
2. User can browse existing companions and reach first chat.
3. User can get a quick match and reach first chat.
4. User can create a companion through chat and reach first chat.
5. Portrait changes during the funnel.
6. The first chat references the user's path.
7. A mocked paywall appears when the user tries to continue beyond the preview conversation.
8. Loading, empty, error, rejection, and skipped-answer states are designed.

### What Can Stay Fake

- Real AI calls.
- Runtime image generation.
- Real payment.
- Account creation.
- Long-term persistence.
- Deep chat intelligence after the first few turns.

### What Must Feel Real

- The first screen.
- The portrait changes.
- The branching conversation.
- The match rationale.
- The create preview.
- The first message in chat.
- The paywall as a continuation gate after preview.
- The copy and transitions.

---

## 18. Suggested Build Order From A Product Perspective

This is not a technical implementation plan, but it gives the product order of operations.

1. Nail the first screen: chat plus portrait presence.
2. Define the companion state model: what changes visually and emotionally after answers.
3. Write the shared conversation script and branch rules.
4. Build the Match path because it best proves personalization quickly.
5. Build the Create path because it best proves specificity.
6. Add Browse as an escape hatch and discovery mode, not as the product's first impression.
7. Add first chat arrivals for Browse, Match, and Create.
8. Add mocked paywall after the first preview exchange.
9. Add loading, empty, error, rejection, and skip states.
10. Polish mobile portrait-first flow.
11. Polish desktop split-presence flow.
12. Generate final portrait assets and state variants.

If scope gets tight, protect the first screen, Match, Create, and first chat. Browse can be narrower as long as "show everyone" and direct discovery exist.

---

## 19. Success Criteria

The work succeeds if a reviewer can understand the product idea within the first minute:

- This is a companion product, not a generic chatbot.
- The entry experience is itself conversational.
- The portrait presence makes the companion feel real.
- The user's answers visibly change the experience.
- Browse, Match, and Create are all handled.
- The first chat feels connected to the funnel.
- AI is represented through product behavior, not technical claims.
- The flow feels polished enough to be a real product direction.

The key test: after reaching the first chat, the user should feel that the companion did not come from a list. They should feel the companion emerged from what they just told the product.
