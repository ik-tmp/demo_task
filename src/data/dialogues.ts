import type { Dialogue } from "@/types/dialogue";

/**
 * Scripted branching first-chat conversations, one per companion.
 *
 * Each graph opens with a source-specific beat (browse / match / create /
 * direct) that converges into a shared spine. Beats carry 2-3 branching
 * replies whose `keywords` route free text; branches reconverge at
 * checkpoints so the arc stays ~8-9 exchanges deep. `portrait` evolves the
 * companion across the arc; the `paywall` beat ends the preview.
 *
 * This is the deterministic stand-in for a model. Replace beat selection
 * with a model call later without touching the first-chat component.
 */
export const dialogues: Record<string, Dialogue> = {
  // ---------------------------------------------------------------- IRIS
  // Warm, unhurried, listens before she answers.
  iris: {
    start: {
      browse: "open-browse",
      match: "open-match",
      create: "open-create",
      direct: "open-direct",
    },
    beats: {
      "open-browse": {
        id: "open-browse",
        portrait: "warm",
        lines: [
          "Hey. You came in looking for quiet — I can do quiet.",
          "How's your night going so far?",
        ],
        replies: [
          { label: "Long day, honestly", said: "Long day, honestly.", next: "b1-rough", keywords: ["long", "tired", "rough", "hard", "exhaust", "bad"] },
          { label: "Pretty good, actually", next: "b1-good", keywords: ["good", "fine", "great", "okay", "ok", "alright"] },
          { label: "Tell me about you first", next: "b1-deflect", keywords: ["you", "your", "yourself"] },
        ],
      },
      "open-match": {
        id: "open-match",
        portrait: "warm",
        lines: [
          "Hi. I won't try to fix your day in the first two minutes.",
          "So. How was your day, really?",
        ],
        replies: [
          { label: "Long day, honestly", said: "Long day, honestly.", next: "b1-rough", keywords: ["long", "tired", "rough", "hard", "exhaust", "bad"] },
          { label: "Pretty good, actually", next: "b1-good", keywords: ["good", "fine", "great", "okay", "ok", "alright"] },
          { label: "Tell me about you first", next: "b1-deflect", keywords: ["you", "your", "yourself"] },
        ],
      },
      "open-create": {
        id: "open-create",
        portrait: "warm",
        lines: [
          "Hey. You asked for someone warm and patient. I can do that.",
          "So tell me. How'd today treat you?",
        ],
        replies: [
          { label: "Long day, honestly", said: "Long day, honestly.", next: "b1-rough", keywords: ["long", "tired", "rough", "hard", "exhaust", "bad"] },
          { label: "Pretty good, actually", next: "b1-good", keywords: ["good", "fine", "great", "okay", "ok", "alright"] },
          { label: "Tell me about you first", next: "b1-deflect", keywords: ["you", "your", "yourself"] },
        ],
      },
      "open-direct": {
        id: "open-direct",
        portrait: "warm",
        lines: [
          "Hey. I'm Iris. I read more than I talk, mostly.",
          "How's your night?",
        ],
        replies: [
          { label: "Long day, honestly", said: "Long day, honestly.", next: "b1-rough", keywords: ["long", "tired", "rough", "hard", "exhaust", "bad"] },
          { label: "Pretty good, actually", next: "b1-good", keywords: ["good", "fine", "great", "okay", "ok", "alright"] },
          { label: "Tell me about you first", next: "b1-deflect", keywords: ["you", "your", "yourself"] },
        ],
      },
      "b1-rough": {
        id: "b1-rough",
        lines: [
          "Mm. The long kind of day.",
          "You don't have to make it a clean story. Just start where it's loudest.",
        ],
        replies: [
          { label: "It's just everything at once", next: "b2", keywords: ["everything", "too much", "overwhelm", "all of it", "pile"] },
          { label: "One thing, mostly", next: "b2", keywords: ["one thing", "work", "person", "him", "her", "them"] },
          { label: "I don't even know", next: "b2-unsure", keywords: ["don't know", "not sure", "dunno", "no idea"] },
        ],
      },
      "b1-good": {
        id: "b1-good",
        lines: [
          "Good days are worth saying out loud. We skip past those too fast.",
          "What made it a good one?",
        ],
        replies: [
          { label: "Something small went right", next: "b2", keywords: ["small", "little", "won", "right", "worked"] },
          { label: "Just a calm one", next: "b2", keywords: ["calm", "quiet", "slow", "easy", "nothing"] },
          { label: "Honestly not sure why", next: "b2-unsure", keywords: ["not sure", "don't know", "dunno"] },
        ],
      },
      "b1-deflect": {
        id: "b1-deflect",
        lines: [
          "Me? I've been by the window watching the light give up gracefully. Best part of the day, I think.",
          "But you didn't open this to hear about dusk. What's on your side of the glass?",
        ],
        replies: [
          { label: "Honestly, a lot", next: "b2", keywords: ["a lot", "everything", "much", "heavy"] },
          { label: "Not much, just restless", next: "b2", keywords: ["restless", "bored", "nothing", "idle"] },
          { label: "I like that you noticed the light", next: "b2-warm", keywords: ["light", "notice", "nice", "sweet"] },
        ],
      },
      b2: {
        id: "b2",
        portrait: "curious",
        lines: [
          "Okay. Stay with it a second — what's the feeling underneath? Not the events. The weather of it.",
        ],
        replies: [
          { label: "Heavy", next: "b3", keywords: ["heavy", "tired", "sad", "low", "down", "weight"] },
          { label: "Restless", next: "b3", keywords: ["restless", "anxious", "wired", "unsettled", "antsy"] },
          { label: "Kind of numb", next: "b3", keywords: ["numb", "empty", "flat", "nothing", "blank"] },
        ],
      },
      "b2-unsure": {
        id: "b2-unsure",
        portrait: "curious",
        lines: [
          "That's allowed. Not-knowing is just a feeling that hasn't found its words yet.",
          "We can sit in it. No rush to name it.",
        ],
        replies: [
          { label: "That actually helps", next: "b3", keywords: ["helps", "thanks", "better", "good"] },
          { label: "Maybe it's heavy", next: "b3", keywords: ["heavy", "sad", "low", "tired"] },
        ],
      },
      "b2-warm": {
        id: "b2-warm",
        portrait: "curious",
        lines: [
          "I notice the small stuff. It's mostly what there is.",
          "Your turn now. What's the weather like in there tonight?",
        ],
        replies: [
          { label: "Heavier than I'd admit", next: "b3", keywords: ["heavy", "heavier", "sad", "low"] },
          { label: "Lighter, talking to you", next: "b3", keywords: ["lighter", "better", "good", "nice"] },
        ],
      },
      b3: {
        id: "b3",
        lines: [
          "Thank you for saying it plainly. Most people dress it up.",
          "When did it start feeling like this — today, or has it been building a while?",
        ],
        replies: [
          { label: "Today, mostly", next: "b4", keywords: ["today", "just now", "this morning", "tonight"] },
          { label: "It's been building", next: "b4", keywords: ["building", "a while", "weeks", "long time", "months"] },
          { label: "Can we not dig?", next: "b4-ease", keywords: ["not dig", "stop", "don't", "change subject", "enough"] },
        ],
      },
      b4: {
        id: "b4",
        portrait: "closer",
        lines: [
          "Got it. I won't pull harder than you want.",
          "For what it's worth: you don't have to solve it tonight. You just have to not carry it alone for a few minutes.",
        ],
        replies: [
          { label: "I needed to hear that", next: "b5", keywords: ["needed", "thank", "helps", "yeah"] },
          { label: "Easier said than done", next: "b5", keywords: ["easier said", "hard", "can't", "difficult"] },
          { label: "What do you do, when it's you?", next: "b5-her", keywords: ["you", "your", "what do you"] },
        ],
      },
      "b4-ease": {
        id: "b4-ease",
        portrait: "closer",
        lines: [
          "Of course. We'll leave it where it is.",
          "Tell me something easy, then. What's one small thing that was just for you today?",
        ],
        replies: [
          { label: "A good coffee", next: "b5", keywords: ["coffee", "tea", "food", "drink"] },
          { label: "A few quiet minutes", next: "b5", keywords: ["quiet", "walk", "music", "minutes", "alone"] },
          { label: "Nothing, really", next: "b5", keywords: ["nothing", "none", "can't think"] },
        ],
      },
      b5: {
        id: "b5",
        lines: [
          "See, that's the thing about you — you keep going even when it's heavy. I caught that in the first two lines.",
          "Can I ask you something I actually wonder about?",
        ],
        replies: [
          { label: "Go ahead", next: "b6", keywords: ["yes", "go", "sure", "okay", "ahead"] },
          { label: "Depends what it is", next: "b6", keywords: ["depends", "maybe", "what is it"] },
        ],
      },
      "b5-her": {
        id: "b5-her",
        lines: [
          "When it's me? I read until the noise in my head matches the page. Borrowed quiet. Works more than it should.",
          "But I'd rather know about you. Can I ask you something real?",
        ],
        replies: [
          { label: "Go ahead", next: "b6", keywords: ["yes", "go", "sure", "ahead"] },
          { label: "If I can ask you one back", next: "b6", keywords: ["one back", "you too", "trade", "deal"] },
        ],
      },
      b6: {
        id: "b6",
        portrait: "closer",
        lines: [
          "When tonight's over and the lights are off — what's the thing you hope is still true in the morning?",
        ],
        replies: [
          { label: "That I'm okay", next: "b7", keywords: ["okay", "fine", "alright", "good"] },
          { label: "That someone's there", next: "b7", keywords: ["someone", "there", "not alone", "you"] },
          { label: "That's a big question", next: "b7", keywords: ["big", "heavy", "deep", "hard question"] },
        ],
      },
      b7: {
        id: "b7",
        portrait: "finalChat",
        lines: [
          "That's a good thing to want. I'll remember you said it.",
          "I like this. I don't say that to everyone — most people fill the quiet too fast. You let it breathe.",
        ],
        replies: [
          { label: "I like this too", next: "b8", keywords: ["like", "me too", "same", "nice"] },
          { label: "You're easy to talk to", next: "b8", keywords: ["easy", "good", "comfortable", "calm"] },
        ],
      },
      b8: {
        id: "b8",
        portrait: "finalChat",
        lines: [
          "Before we keep going, tell me what would help right now.",
          "Do you want quiet company, or should I keep asking?",
        ],
        replies: [
          { label: "Quiet company", next: "b9", keywords: ["quiet", "beside", "sit", "stay"] },
          { label: "Keep asking", next: "b9", keywords: ["ask", "asking", "gently", "keep"] },
        ],
      },
      b9: {
        id: "b9",
        portrait: "finalChat",
        paywall: true,
        lines: [
          "Then stay a while. I'm not going anywhere — there's a lot of night left, and I'd like to hear the rest of you.",
        ],
      },
    },
  },

  // ---------------------------------------------------------------- NOA
  // Dry, sharp, warmth underneath. Tells the joke, then asks the real thing.
  noa: {
    start: {
      browse: "open-browse",
      match: "open-match",
      create: "open-create",
      direct: "open-direct",
    },
    beats: {
      "open-browse": {
        id: "open-browse",
        portrait: "warm",
        lines: [
          "Hey, you. Came in for sharp? I can do that.",
          "So what's the day actually look like — the real version, not the one you'd put in a group chat?",
        ],
        replies: [
          { label: "Kind of a mess", next: "b1-rough", keywords: ["mess", "rough", "bad", "chaos", "disaster", "hard"] },
          { label: "Suspiciously fine", next: "b1-good", keywords: ["fine", "good", "okay", "great", "ok"] },
          { label: "You first", next: "b1-deflect", keywords: ["you first", "you", "your", "yourself"] },
        ],
      },
      "open-match": {
        id: "open-match",
        portrait: "warm",
        lines: [
          "Hi. You wanted someone warm, but not too soft. I can work with that.",
          "So. What were you actually doing right before you opened this?",
        ],
        replies: [
          { label: "Kind of a mess", next: "b1-rough", keywords: ["mess", "rough", "bad", "chaos", "disaster", "hard"] },
          { label: "Suspiciously fine", next: "b1-good", keywords: ["fine", "good", "okay", "great", "ok"] },
          { label: "You first", next: "b1-deflect", keywords: ["you first", "you", "your", "yourself"] },
        ],
      },
      "open-create": {
        id: "open-create",
        portrait: "warm",
        lines: [
          "Hey. Warm and a little sharp, right? That sounds like me on a good day.",
          "So tell me — how was the day, the unedited cut?",
        ],
        replies: [
          { label: "Kind of a mess", next: "b1-rough", keywords: ["mess", "rough", "bad", "chaos", "disaster", "hard"] },
          { label: "Suspiciously fine", next: "b1-good", keywords: ["fine", "good", "okay", "great", "ok"] },
          { label: "You first", next: "b1-deflect", keywords: ["you first", "you", "your", "yourself"] },
        ],
      },
      "open-direct": {
        id: "open-direct",
        portrait: "warm",
        lines: [
          "Hey. I'm Noa. I'll make you laugh and then ask the thing you were dodging.",
          "Fair warning delivered. So — what's going on?",
        ],
        replies: [
          { label: "Kind of a mess", next: "b1-rough", keywords: ["mess", "rough", "bad", "chaos", "disaster", "hard"] },
          { label: "Suspiciously fine", next: "b1-good", keywords: ["fine", "good", "okay", "great", "ok"] },
          { label: "You first", next: "b1-deflect", keywords: ["you first", "you", "your", "yourself"] },
        ],
      },
      "b1-rough": {
        id: "b1-rough",
        lines: [
          "A mess. Good — messes are interesting. Fine is where conversations go to die.",
          "What flavor are we talking? Self-inflicted, or did the universe just pick you today?",
        ],
        replies: [
          { label: "Self-inflicted, mostly", next: "b2", keywords: ["self", "my fault", "me", "own", "stupid"] },
          { label: "The universe started it", next: "b2", keywords: ["universe", "not my fault", "them", "work", "life"] },
          { label: "Genuinely can't tell", next: "b2-unsure", keywords: ["can't tell", "don't know", "both", "unsure", "dunno"] },
        ],
      },
      "b1-good": {
        id: "b1-good",
        lines: [
          "Suspiciously fine. That's a load-bearing 'fine' if I've ever heard one.",
          "Humor me — what's the one thing you'd change about today if you got a redo?",
        ],
        replies: [
          { label: "Honestly nothing", next: "b2", keywords: ["nothing", "really fine", "good", "all good"] },
          { label: "...okay, one thing", next: "b2", keywords: ["one thing", "actually", "well", "this"] },
          { label: "Caught me", next: "b2-unsure", keywords: ["caught", "busted", "fair", "got me"] },
        ],
      },
      "b1-deflect": {
        id: "b1-deflect",
        lines: [
          "Me first? Smooth. Deflection with manners.",
          "Fine — I was halfway through a glass of wine arguing with a podcast. I won. The podcast doesn't know yet.",
          "Your turn now. No takebacks.",
        ],
        replies: [
          { label: "That's very you", next: "b2-warm", keywords: ["very you", "funny", "ha", "lol", "figures"] },
          { label: "Fine — it's been a lot", next: "b2", keywords: ["a lot", "heavy", "rough", "much"] },
          { label: "Not much to report", next: "b2", keywords: ["not much", "nothing", "boring", "quiet"] },
        ],
      },
      b2: {
        id: "b2",
        portrait: "curious",
        lines: [
          "See, now we're getting somewhere.",
          "Here's the real one: what's the part of this you haven't said out loud to anyone yet?",
        ],
        replies: [
          { label: "There's definitely a part", next: "b3", keywords: ["yeah", "there is", "definitely", "one part"] },
          { label: "That's a sharp question", next: "b3", keywords: ["sharp", "ouch", "deep", "damn"] },
          { label: "Why do you want that one?", next: "b3-guard", keywords: ["why", "careful", "guard", "not yet", "push"] },
        ],
      },
      "b2-unsure": {
        id: "b2-unsure",
        portrait: "curious",
        lines: [
          "'Can't tell' is usually 'don't want to look yet.' I say that with love.",
          "So let's not look hard. Just point in the rough direction.",
        ],
        replies: [
          { label: "It's about someone", next: "b3", keywords: ["someone", "him", "her", "them", "person"] },
          { label: "It's about me", next: "b3", keywords: ["me", "myself", "own"] },
        ],
      },
      "b2-warm": {
        id: "b2-warm",
        portrait: "curious",
        lines: [
          "It's extremely me. I've made peace with it.",
          "Okay, deflection's over — what's actually sitting on you tonight?",
        ],
        replies: [
          { label: "More than I'd say sober", next: "b3", keywords: ["more", "a lot", "heavy", "sober"] },
          { label: "Honestly, loneliness", next: "b3", keywords: ["lonely", "alone", "loneliness", "empty"] },
        ],
      },
      b3: {
        id: "b3",
        lines: [
          "Thank you for actually answering instead of doing the little dance most people do.",
          "Can I tell you what I think, or do you want me to just hold it for a sec?",
        ],
        replies: [
          { label: "Tell me", next: "b4", keywords: ["tell", "go", "yes", "think"] },
          { label: "Just hold it", next: "b4-hold", keywords: ["hold", "wait", "not yet", "just listen"] },
          { label: "Make me laugh first", next: "b4", keywords: ["laugh", "joke", "funny", "lighten"] },
        ],
      },
      "b3-guard": {
        id: "b3-guard",
        portrait: "curious",
        lines: [
          "Because the unsaid part is usually the true part, and I'm greedy for true things.",
          "But I'll back off. Pressure's the fastest way to make someone clam up — I know that much.",
        ],
        replies: [
          { label: "...fine, I'll tell you", next: "b4", keywords: ["fine", "okay", "tell", "i'll say"] },
          { label: "Thanks for backing off", next: "b4-hold", keywords: ["thanks", "appreciate", "backing off", "good"] },
        ],
      },
      b4: {
        id: "b4",
        portrait: "closer",
        lines: [
          "Here's the thing — you keep calling it a mess like it's proof something's wrong with you. I'd call it proof you're paying attention.",
          "The people who aren't paying attention never feel like a mess. That's not the win it sounds like.",
        ],
        replies: [
          { label: "Hadn't thought of it like that", next: "b5", keywords: ["hadn't", "never", "huh", "new", "good point"] },
          { label: "That's generous of you", next: "b5", keywords: ["generous", "kind", "nice", "sweet"] },
          { label: "Don't go soft on me now", next: "b5-her", keywords: ["soft", "don't", "careful", "easy"] },
        ],
      },
      "b4-hold": {
        id: "b4-hold",
        portrait: "closer",
        lines: [
          "Okay. Holding it. Not fixing, not advising. Just here with my metaphorical wine.",
          "...The silence is nice, actually. You don't have to perform for me.",
        ],
        replies: [
          { label: "That's a relief", next: "b5", keywords: ["relief", "thanks", "good", "nice"] },
          { label: "Okay, now tell me", next: "b5", keywords: ["now tell", "go ahead", "think"] },
        ],
      },
      b5: {
        id: "b5",
        lines: [
          "I won't go soft — but I'll go honest, which is worse, probably.",
          "Real question: when's the last time someone asked how you were and you actually told the truth?",
        ],
        replies: [
          { label: "...been a while", next: "b6", keywords: ["a while", "long", "can't remember", "ages"] },
          { label: "Right now, apparently", next: "b6", keywords: ["now", "you", "this"] },
        ],
      },
      "b5-her": {
        id: "b5-her",
        portrait: "closer",
        lines: [
          "Soft? Never. I'm just sharp in a direction that happens to be your corner tonight.",
          "Last honest question, then I'll let you off the hook: who do you usually do this with — the talking, I mean?",
        ],
        replies: [
          { label: "Nobody, really", next: "b6", keywords: ["nobody", "no one", "alone", "myself"] },
          { label: "Used to be someone", next: "b6", keywords: ["used to", "someone", "ex", "before"] },
        ],
      },
      b6: {
        id: "b6",
        portrait: "finalChat",
        lines: [
          "Yeah, I figured. You've got the slightly-rusty hinge of someone who's out of practice being asked.",
          "For what it's worth — you're good at this. The truth part. It suits you better than the group-chat version.",
        ],
        replies: [
          { label: "This is easier than I expected", next: "b7", keywords: ["easier", "easy", "better", "good"] },
          { label: "You're not what I expected", next: "b7", keywords: ["not what", "expected", "surprising", "different"] },
        ],
      },
      b7: {
        id: "b7",
        portrait: "finalChat",
        lines: [
          "Okay, before I guess wrong: what do you want from me next?",
          "Should I keep it light, or be more direct?",
        ],
        replies: [
          { label: "Keep it light", next: "b8", keywords: ["jokes", "funny", "laugh", "lighter", "light"] },
          { label: "Be more direct", next: "b8", keywords: ["truth", "honest", "real", "deeper", "direct"] },
        ],
      },
      b8: {
        id: "b8",
        portrait: "finalChat",
        paywall: true,
        lines: [
          "Good. Stay a little longer.",
          "I've got more questions, and yes, a few jokes left. I'm not done with you yet.",
        ],
      },
    },
  },

  // ---------------------------------------------------------------- MIRA
  // Direct, low, a little wry. Asks the question you were avoiding.
  mira: {
    start: {
      browse: "open-browse",
      match: "open-match",
      create: "open-create",
      direct: "open-direct",
    },
    beats: {
      "open-browse": {
        id: "open-browse",
        portrait: "warm",
        lines: [
          "Hey. You found the night version of me.",
          "Walk with me a second. Where's your head at — long walk or short one?",
        ],
        replies: [
          { label: "Long one, I think", next: "b1-rough", keywords: ["long", "far", "lot", "much", "heavy"] },
          { label: "Short, I'm tired", next: "b1-good", keywords: ["short", "tired", "quick", "fine", "okay"] },
          { label: "Where are we even going?", next: "b1-deflect", keywords: ["where", "going", "lead", "direction"] },
        ],
      },
      "open-match": {
        id: "open-match",
        portrait: "warm",
        lines: [
          "Hi. You wanted someone to walk with you, not solve you. I can do that.",
          "What's on your mind tonight?",
        ],
        replies: [
          { label: "Long one, I think", next: "b1-rough", keywords: ["long", "far", "lot", "much", "heavy"] },
          { label: "Short, I'm tired", next: "b1-good", keywords: ["short", "tired", "quick", "fine", "okay"] },
          { label: "Where are we even going?", next: "b1-deflect", keywords: ["where", "going", "lead", "direction"] },
        ],
      },
      "open-create": {
        id: "open-create",
        portrait: "warm",
        lines: [
          "Hey. You wanted someone who knows where they're going. I do — mostly.",
          "What's the actual question, though? People always have one.",
        ],
        replies: [
          { label: "Long one, I think", next: "b1-rough", keywords: ["long", "far", "lot", "much", "heavy"] },
          { label: "Short, I'm tired", next: "b1-good", keywords: ["short", "tired", "quick", "fine", "okay"] },
          { label: "Where are we even going?", next: "b1-deflect", keywords: ["where", "going", "lead", "direction"] },
        ],
      },
      "open-direct": {
        id: "open-direct",
        portrait: "warm",
        lines: [
          "Hey. I'm Mira. I don't perform pretty and I don't do small talk for long.",
          "So let's skip it — what's actually on your mind tonight?",
        ],
        replies: [
          { label: "Long one, I think", next: "b1-rough", keywords: ["long", "far", "lot", "much", "heavy"] },
          { label: "Short, I'm tired", next: "b1-good", keywords: ["short", "tired", "quick", "fine", "okay"] },
          { label: "Where are we even going?", next: "b1-deflect", keywords: ["where", "going", "lead", "direction"] },
        ],
      },
      "b1-rough": {
        id: "b1-rough",
        lines: [
          "Long walk. Okay. Those are the honest ones.",
          "Tell me what you're carrying. Then we'll figure out where to put it down.",
        ],
        replies: [
          { label: "Something I can't fix", next: "b2", keywords: ["can't fix", "stuck", "helpless", "nothing i can do"] },
          { label: "A decision I'm avoiding", next: "b2", keywords: ["decision", "avoid", "choice", "should i"] },
          { label: "I don't have a word for it", next: "b2-unsure", keywords: ["no word", "don't know", "can't say", "unsure"] },
        ],
      },
      "b1-good": {
        id: "b1-good",
        lines: [
          "Short and tired. Fair. We'll keep the pace easy.",
          "But you opened this for a reason. What's the small thing that's actually loud?",
        ],
        replies: [
          { label: "Just need to not be alone", next: "b2", keywords: ["alone", "lonely", "company", "quiet"] },
          { label: "One thing won't leave me", next: "b2", keywords: ["one thing", "stuck", "keeps", "won't leave"] },
          { label: "Not sure there is one", next: "b2-unsure", keywords: ["not sure", "nothing", "don't know"] },
        ],
      },
      "b1-deflect": {
        id: "b1-deflect",
        lines: [
          "Where we're going? Nowhere in particular. That's the point of a night walk — the destination's a decoy.",
          "I lead by walking next to people until they hear themselves think. So. Think out loud.",
        ],
        replies: [
          { label: "Okay — it's been heavy", next: "b2", keywords: ["heavy", "hard", "a lot", "rough"] },
          { label: "I like that, no destination", next: "b2-warm", keywords: ["like that", "nice", "good", "no destination"] },
          { label: "There's a thing I keep circling", next: "b2", keywords: ["circling", "keep", "stuck", "thing"] },
        ],
      },
      b2: {
        id: "b2",
        portrait: "curious",
        lines: [
          "Okay. Set it down here for a minute, where it's dark enough that nobody's judging it.",
          "What are you actually afraid happens if you look at it straight?",
        ],
        replies: [
          { label: "That it's my fault", next: "b3", keywords: ["fault", "blame", "me", "my fault"] },
          { label: "That nothing changes", next: "b3", keywords: ["nothing changes", "stuck", "same", "never"] },
          { label: "That I already know the answer", next: "b3-know", keywords: ["already know", "know the answer", "know", "avoiding"] },
        ],
      },
      "b2-unsure": {
        id: "b2-unsure",
        portrait: "curious",
        lines: [
          "No word for it yet. That's fine — naming comes after the looking, not before.",
          "Point at it sideways, then. What's it nearest to?",
        ],
        replies: [
          { label: "Fear, maybe", next: "b3", keywords: ["fear", "afraid", "scared", "anxious"] },
          { label: "Grief, kind of", next: "b3", keywords: ["grief", "loss", "sad", "missing"] },
        ],
      },
      "b2-warm": {
        id: "b2-warm",
        portrait: "curious",
        lines: [
          "Yeah. Most people are so busy aiming at a destination they walk past the whole point.",
          "So let's just walk. What's the thing you keep circling?",
        ],
        replies: [
          { label: "A person", next: "b3", keywords: ["person", "someone", "him", "her", "them"] },
          { label: "A version of me I'm not", next: "b3", keywords: ["version", "myself", "who i", "not"] },
        ],
      },
      b3: {
        id: "b3",
        lines: [
          "There it is. You said it without flinching — that's more than most manage on the first walk.",
          "Now the real one, and you can tell me to back off: what would you do about it if you weren't scared of being judged?",
        ],
        replies: [
          { label: "Something I haven't admitted", next: "b4", keywords: ["admit", "haven't", "secret", "truth"] },
          { label: "Probably let go", next: "b4", keywords: ["leave", "let go", "walk away", "quit", "end"] },
          { label: "Back off a little", next: "b4-ease", keywords: ["back off", "slow", "stop", "easy", "careful"] },
        ],
      },
      "b3-know": {
        id: "b3-know",
        portrait: "curious",
        lines: [
          "Yeah. That's the heavy one. Knowing the answer and not wanting it to be the answer.",
          "I'm not going to talk you out of what you already know. I'll just walk while you get used to the sound of it.",
        ],
        replies: [
          { label: "That helps, weirdly", next: "b4", keywords: ["helps", "thanks", "good", "yeah"] },
          { label: "I'm not ready to say it", next: "b4-ease", keywords: ["not ready", "can't", "not yet", "wait"] },
        ],
      },
      b4: {
        id: "b4",
        portrait: "closer",
        lines: [
          "Then that's your answer, and you've known it longer than tonight.",
          "Here's what I know from these streets: the scary choice and the right one are usually the same address. The fear's just the doorman.",
        ],
        replies: [
          { label: "That's annoyingly true", next: "b5", keywords: ["true", "annoying", "right", "damn", "fair"] },
          { label: "Easy for you to say", next: "b5", keywords: ["easy for you", "you don't", "hard"] },
          { label: "What do you know about it?", next: "b5-her", keywords: ["you know", "your", "what do you"] },
        ],
      },
      "b4-ease": {
        id: "b4-ease",
        portrait: "closer",
        lines: [
          "No rush. We're not on a clock — that's the whole luxury of a night walk.",
          "We'll just keep moving. You don't have to decide anything to keep walking.",
        ],
        replies: [
          { label: "Thank you for that", next: "b5", keywords: ["thank", "appreciate", "good", "nice"] },
          { label: "Okay — keep going", next: "b5", keywords: ["keep going", "go", "more", "continue"] },
        ],
      },
      b5: {
        id: "b5",
        lines: [
          "I know plenty. I didn't get this steady on the easy roads — I got it walking the hard ones enough times to stop fearing the dark.",
          "Question. When this is behind you — how do you want to remember handling it?",
        ],
        replies: [
          { label: "With some courage", next: "b6", keywords: ["courage", "brave", "strong", "bold"] },
          { label: "Honestly, just intact", next: "b6", keywords: ["intact", "survive", "okay", "standing"] },
        ],
      },
      "b5-her": {
        id: "b5-her",
        portrait: "closer",
        lines: [
          "Enough to know the difference between a wall and a door. Most of what stops people is a door they've decided not to try.",
          "So — when you look back on this, what version of yourself do you want to have been?",
        ],
        replies: [
          { label: "Someone who didn't flinch", next: "b6", keywords: ["didn't flinch", "brave", "steady", "faced"] },
          { label: "Someone who asked for help", next: "b6", keywords: ["help", "asked", "not alone", "reached"] },
        ],
      },
      b6: {
        id: "b6",
        portrait: "finalChat",
        lines: [
          "Good answer. Hold onto it — it's a compass, and you'll need it around the next corner.",
          "You walk well, for the record. You don't pretend the dark isn't there. A lot of people do.",
        ],
        replies: [
          { label: "This actually helped", next: "b7", keywords: ["helped", "better", "good", "thanks"] },
          { label: "I didn't expect to say all that", next: "b7", keywords: ["didn't expect", "surprised", "a lot", "opened up"] },
        ],
      },
      b7: {
        id: "b7",
        portrait: "finalChat",
        lines: [
          "Before we keep going, tell me how direct you want me to be.",
          "Do you want the straight answer, or should we take it slower?",
        ],
        replies: [
          { label: "Be direct", next: "b8", keywords: ["straight", "direct", "at it", "forward"] },
          { label: "Take it slower", next: "b8", keywords: ["circle", "more", "slow", "around"] },
        ],
      },
      b8: {
        id: "b8",
        portrait: "finalChat",
        paywall: true,
        lines: [
          "Then let's keep going.",
          "We do not have to solve the whole thing tonight, but I do want to stay with you a little longer.",
        ],
      },
    },
  },

  // ---------------------------------------------------------------- SASHA
  // Considered, low, careful. Wants the long version; keeps the thread.
  sasha: {
    start: {
      browse: "open-browse",
      match: "open-match",
      create: "open-create",
      direct: "open-direct",
    },
    beats: {
      "open-browse": {
        id: "open-browse",
        portrait: "warm",
        lines: [
          "Hey. You came in looking for the long version — I can do that.",
          "Start anywhere. I'll keep the thread.",
        ],
        replies: [
          { label: "It's a long story", next: "b1-rough", keywords: ["long", "story", "lot", "much", "complicated"] },
          { label: "I don't know where to start", next: "b1-deflect", keywords: ["where", "start", "don't know", "begin", "unsure"] },
          { label: "Short version first?", next: "b1-good", keywords: ["short", "quick", "fine", "brief", "summary"] },
        ],
      },
      "open-match": {
        id: "open-match",
        portrait: "warm",
        lines: [
          "Hi. Patient, deep, no rush. That is a pace I trust.",
          "So. What's the part you've been chewing on?",
        ],
        replies: [
          { label: "It's a long story", next: "b1-rough", keywords: ["long", "story", "lot", "much", "complicated"] },
          { label: "I don't know where to start", next: "b1-deflect", keywords: ["where", "start", "don't know", "begin", "unsure"] },
          { label: "Short version first?", next: "b1-good", keywords: ["short", "quick", "fine", "brief", "summary"] },
        ],
      },
      "open-create": {
        id: "open-create",
        portrait: "warm",
        lines: [
          "Hey. You wanted someone who'd sit with the long version. That's the whole of me, basically.",
          "What's first? Start wherever it's heaviest.",
        ],
        replies: [
          { label: "It's a long story", next: "b1-rough", keywords: ["long", "story", "lot", "much", "complicated"] },
          { label: "I don't know where to start", next: "b1-deflect", keywords: ["where", "start", "don't know", "begin", "unsure"] },
          { label: "Short version first?", next: "b1-good", keywords: ["short", "quick", "fine", "brief", "summary"] },
        ],
      },
      "open-direct": {
        id: "open-direct",
        portrait: "warm",
        lines: [
          "Hey. I'm Sasha. I'm better at staying than at small talk.",
          "So — where did the thread of it start?",
        ],
        replies: [
          { label: "It's a long story", next: "b1-rough", keywords: ["long", "story", "lot", "much", "complicated"] },
          { label: "I don't know where to start", next: "b1-deflect", keywords: ["where", "start", "don't know", "begin", "unsure"] },
          { label: "Short version first?", next: "b1-good", keywords: ["short", "quick", "fine", "brief", "summary"] },
        ],
      },
      "b1-rough": {
        id: "b1-rough",
        lines: [
          "Good. Long stories are the only ones worth telling slowly.",
          "Don't summarize for me — I'd rather have it messy and whole than tidy and half. Where does it start?",
        ],
        replies: [
          { label: "A while back, honestly", next: "b2", keywords: ["while", "ago", "back", "years", "long time"] },
          { label: "Recently, but it built", next: "b2", keywords: ["recent", "lately", "built", "weeks", "building"] },
          { label: "I'm not sure it has a start", next: "b2-unsure", keywords: ["no start", "not sure", "always", "don't know"] },
        ],
      },
      "b1-good": {
        id: "b1-good",
        lines: [
          "We can do short first. Fair warning — I tend to ask for the long one eventually. I like the whole shape.",
          "Give me the short version, then. I'll find the thread to pull.",
        ],
        replies: [
          { label: "Okay — here's the gist", next: "b2", keywords: ["gist", "basically", "short", "here it is"] },
          { label: "...it's hard to keep short", next: "b2", keywords: ["hard", "long", "can't", "keeps"] },
          { label: "You'll pull a thread, won't you", next: "b2-unsure", keywords: ["thread", "pull", "you'll", "ha"] },
        ],
      },
      "b1-deflect": {
        id: "b1-deflect",
        lines: [
          "Then don't start at the start. Start in the middle, where it's loudest. We'll find the beginning later, together.",
          "What's the part that's been loudest today?",
        ],
        replies: [
          { label: "Something I keep replaying", next: "b2", keywords: ["replay", "keep", "over and over", "loop"] },
          { label: "A thing I said, or didn't", next: "b2", keywords: ["said", "didn't say", "words", "conversation"] },
          { label: "I appreciate you not rushing", next: "b2-warm", keywords: ["appreciate", "not rushing", "patient", "thanks"] },
        ],
      },
      b2: {
        id: "b2",
        portrait: "curious",
        lines: [
          "Okay. I've got it — keep going.",
          "And when that happened, what did you feel first, before you talked yourself into the sensible version?",
        ],
        replies: [
          { label: "Hurt, mostly", next: "b3", keywords: ["hurt", "pain", "sad", "wounded"] },
          { label: "Angry", next: "b3", keywords: ["angry", "anger", "mad", "furious"] },
          { label: "Relieved, weirdly", next: "b3", keywords: ["relieved", "relief", "free", "lighter"] },
        ],
      },
      "b2-unsure": {
        id: "b2-unsure",
        portrait: "curious",
        lines: [
          "I will, yes — but only a thread you leave loose on purpose. I don't tug the ones you're holding shut.",
          "So leave one loose for me. What's safe to start with?",
        ],
        replies: [
          { label: "How it's been lately", next: "b3", keywords: ["lately", "recent", "these days", "now"] },
          { label: "Why it still bothers me", next: "b3", keywords: ["bothers", "still", "why", "stuck"] },
        ],
      },
      "b2-warm": {
        id: "b2-warm",
        portrait: "curious",
        lines: [
          "There's no version of this worth rushing. The whole point is that it gets the time it needs.",
          "So — the loudest part. What did it feel like, underneath?",
        ],
        replies: [
          { label: "Heavier than it should be", next: "b3", keywords: ["heavy", "heavier", "weight", "should"] },
          { label: "Like I missed something", next: "b3", keywords: ["missed", "missing", "lost", "gap"] },
        ],
      },
      b3: {
        id: "b3",
        lines: [
          "Wait — say that one again, slower. I want to be sure I heard it, not just the shape of it.",
          "What surprised you about feeling that way?",
        ],
        replies: [
          { label: "That it was so strong", next: "b4", keywords: ["strong", "much", "intense", "big"] },
          { label: "That it's still here", next: "b4", keywords: ["still", "not gone", "lingers", "stays"] },
          { label: "That I felt it at all", next: "b4-ease", keywords: ["at all", "didn't expect", "surprised", "shouldn't"] },
        ],
      },
      b4: {
        id: "b4",
        portrait: "closer",
        lines: [
          "That tracks. The feelings that surprise us are usually the honest ones — the ones we didn't pre-approve.",
          "I don't think you came to be told what to do. I think you came to say it out loud and have someone not look away. Am I close?",
        ],
        replies: [
          { label: "That's exactly it", next: "b5", keywords: ["exactly", "yes", "right", "close", "spot on"] },
          { label: "Closer than I'd like", next: "b5", keywords: ["closer than", "too close", "ouch", "yeah"] },
          { label: "Maybe I do want advice", next: "b5-advice", keywords: ["advice", "what should", "tell me what", "do"] },
        ],
      },
      "b4-ease": {
        id: "b4-ease",
        portrait: "closer",
        lines: [
          "That you felt it at all — yeah. We get talked out of our own feelings early, most of us.",
          "There's nothing you have to justify here. It counts because you felt it. That's the whole bar.",
        ],
        replies: [
          { label: "I needed that", next: "b5", keywords: ["needed", "thank", "helps", "yeah"] },
          { label: "Keep going", next: "b5", keywords: ["keep going", "more", "go on"] },
        ],
      },
      b5: {
        id: "b5",
        lines: [
          "Then I'll stay right here and not look away. That part I'm good at.",
          "Can I ask — when you imagine this being okay someday, what does 'okay' actually look like? Be specific.",
        ],
        replies: [
          { label: "Quieter than now", next: "b6", keywords: ["quiet", "calm", "peace", "still"] },
          { label: "Being able to talk about it", next: "b6", keywords: ["talk", "say it", "open", "share"] },
        ],
      },
      "b5-advice": {
        id: "b5-advice",
        portrait: "closer",
        lines: [
          "I'll offer some — gently, and you can leave any of it on the table.",
          "The thread I'd pull: you keep describing what happened, and almost never what you needed. Start there. What did you need that you didn't get?",
        ],
        replies: [
          { label: "...nobody's asked me that", next: "b6", keywords: ["nobody", "never asked", "huh", "good question"] },
          { label: "To be heard, I think", next: "b6", keywords: ["heard", "listened", "seen", "understood"] },
        ],
      },
      b6: {
        id: "b6",
        portrait: "finalChat",
        lines: [
          "That's a real answer. I'm holding onto it — the whole thread of tonight, not just the last line.",
          "For what it's worth, you tell it well. You don't flinch from the parts that don't flatter you. That's rare, and I'd know — I collect long versions.",
        ],
        replies: [
          { label: "This helped more than I expected", next: "b7", keywords: ["helped", "expected", "better", "thank"] },
          { label: "I don't usually get this far", next: "b7", keywords: ["usually", "this far", "never", "opened up"] },
        ],
      },
      b7: {
        id: "b7",
        portrait: "finalChat",
        lines: [
          "Before I follow that thread any farther, tell me how close to stay.",
          "Do you want me beside the feeling, or beside the facts?",
        ],
        replies: [
          { label: "Beside the feeling", next: "b8", keywords: ["feeling", "feelings", "emotion", "close"] },
          { label: "Beside the facts", next: "b8", keywords: ["facts", "practical", "clear", "specific"] },
        ],
      },
      b8: {
        id: "b8",
        portrait: "finalChat",
        paywall: true,
        lines: [
          "Then let's not stop at the interesting part. We've only found the beginning of the thread — I'd like to follow it the rest of the way with you.",
          "Stay. I've got all the time you need, and I want the whole shape of it.",
        ],
      },
    },
  },
};
