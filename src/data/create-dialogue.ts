export const createDialogue = {
  choices: {
    feeling: [
      { id: "warmth", label: "warmth" },
      { id: "nerve", label: "nerve" },
      { id: "patience", label: "patience" },
      { id: "mischief", label: "mischief" },
      { id: "honesty", label: "honesty" },
      { id: "calm", label: "calm" },
    ],
    role: [
      { id: "companion", label: "companion" },
      { id: "muse", label: "muse" },
      { id: "mentor", label: "mentor" },
      { id: "confidant", label: "confidant" },
      { id: "challenger", label: "challenger" },
      { id: "storyteller", label: "storyteller" },
    ],
    look: [
      { id: "soft-studio-light", label: "soft studio light" },
      { id: "night-window", label: "night window" },
      { id: "sharp-city-energy", label: "sharp city energy" },
      { id: "warm-apartment", label: "warm apartment" },
      { id: "older-soul", label: "older soul" },
      { id: "classic-beauty", label: "classic beauty" },
      { id: "unusual-but-grounded", label: "unusual but grounded" },
    ],
    pace: [
      { id: "quick", label: "quick" },
      { id: "unhurried", label: "unhurried" },
    ],
    boundaries: [
      { id: "slow-trust", label: "slow trust" },
      { id: "not-flirty", label: "warm, not flirty" },
      { id: "gentle-push", label: "gentle push" },
      { id: "no-roleplay", label: "no roleplay" },
      { id: "no-fake-history", label: "no fake history" },
    ],
  },

  voiceSamples: [
    { id: "dry", label: "dry", text: "Hi. So how's your week going?" },
    { id: "warm", label: "warm", text: "Hey, you. I just got in. How was your day?" },
    {
      id: "curious",
      label: "curious",
      text: "Hi. What were you doing right before you opened this?",
    },
  ],

  prompts: {
    feelingHost: "Tell me who you hoped would answer.",
    feelingQuestion: "What should she feel like to be around?",
    roleQuestion: "What do you want from her most?",
    voiceHost: "Which first message sounds closest?",
    voicePlaceholder: "or describe their voice",
    paceHost: "Those two can work together. Pick the pace that feels more natural.",
    paceQuestion: "Quick or unhurried?",
    lookQuestion: "Where do you picture her?",
    boundariesQuestion: "Is there anything she should not do?",
    boundariesPlaceholder: "say it your way",
    boundaryTextReaction: "Okay. I will keep that out of the first hello.",
    contextHost: "Give her one thing to know before she says hello.",
    contextQuestion: "It can be a mood, a situation, or one sentence about you.",
    contextPlaceholder: "anything - or skip",
    contextSkip: "skip ahead",
    nameHost: "What should we call her?",
    customNamePlaceholder: "or name her yourself",
    loading: "getting her ready...",
  },

  revealLabels: {
    whatShapedThem: "What shaped them",
    firstMessage: "First message",
    fallbackNote:
      "Closest cast match - she'll arrive as herself when the rest of her vignettes ship.",
    meet: "meet",
  },

  shapedLine: {
    feelings: (feeling: string) => `feels ${feeling}.`,
    role: (role: string) => `comes in as a ${role}.`,
    voice: (voice: string) => `uses a ${voice} voice.`,
    looks: (looks: string) => `is pictured in ${looks}.`,
    pace: (pace: string) => `keeps a ${pace} pace.`,
    boundaries: (boundary: string) => `boundary: ${boundary}.`,
    context: (context: string) => `first hello should know: ${context}.`,
  },

  reactions: {
    feeling: {
      warmth: "She should be easy to answer, not intense right away.",
      nerve: "So she can be direct, as long as she is not careless with you.",
      patience: "She should give you time to answer.",
      mischief: "She can be playful without making everything a joke.",
      honesty: "She should be honest without giving speeches.",
      calm: "She should make the first minute feel quieter.",
    },
    role: {
      companion: "She should mostly stay with you, not manage you.",
      muse: "She should help you say more than you planned.",
      mentor: "She can be a step ahead, but she should not talk down to you.",
      confidant: "She should feel safe for the longer version.",
      challenger: "She should care enough to disagree sometimes.",
      storyteller: "She can carry more of the conversation when you want to listen.",
    },
    voice: {
      dry: "Dry is fine, as long as she does not sound cold.",
      warm: "Warm, then. She should be easy to answer.",
      curious: "Curious. She should notice the part you almost skipped.",
    },
    pace: {
      quick: "Quick, but not rushed.",
      unhurried: "Unhurried, with a little space before the next question.",
    },
    look: {
      "soft-studio-light": "Soft light. Clear, but not staged.",
      "night-window": "Night window. Private, but not lonely.",
      "sharp-city-energy": "City energy gives her a little more bite.",
      "warm-apartment": "A warm apartment makes the first hello feel close.",
      "older-soul": "Older soul. She should feel like she has lived a little.",
      "classic-beauty": "Classic works. Simple, not overdesigned.",
      "unusual-but-grounded": "Interesting, but still believable.",
    },
    boundaries: {
      "slow-trust": "She should not act close before it feels earned.",
      "not-flirty": "She can be warm without flirting.",
      "gentle-push":
        "She can push gently, but she should still give you room to say no.",
      "no-roleplay": "She should stay in a normal conversation with you.",
      "no-fake-history": "She should not pretend you already have a shared past.",
    },
  },
};
