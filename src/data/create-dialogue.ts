export const createDialogue = {
  choices: {
    feeling: [
      { id: "warmth", label: "warmth" },
      { id: "nerve", label: "directness" },
      { id: "patience", label: "patience" },
      { id: "mischief", label: "playfulness" },
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
      { id: "soft-studio-light", label: "soft lighting" },
      { id: "night-window", label: "city at night" },
      { id: "sharp-city-energy", label: "direct city energy" },
      { id: "warm-apartment", label: "warm apartment" },
      { id: "older-soul", label: "older feel" },
      { id: "classic-beauty", label: "classic look" },
      { id: "unusual-but-grounded", label: "unusual but believable" },
    ],
    pace: [
      { id: "quick", label: "quick" },
      { id: "unhurried", label: "unhurried" },
    ],
    boundaries: [
      { id: "slow-trust", label: "earn closeness slowly" },
      { id: "not-flirty", label: "stay warm without flirting" },
      { id: "gentle-push", label: "challenge me gently" },
      { id: "no-roleplay", label: "avoid roleplay" },
      { id: "no-fake-history", label: "avoid fake shared history" },
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
    feelingHost: "Describe the person you wanted to meet.",
    feelingQuestion: "What should talking to her feel like?",
    roleQuestion: "What should she help with most?",
    voiceHost: "Choose the first message that sounds closest.",
    voicePlaceholder: "or describe her voice",
    paceHost: "That mix can work. Choose the pace that feels more natural.",
    paceQuestion: "Quick or unhurried?",
    lookQuestion: "What kind of setting fits her?",
    boundariesQuestion: "Anything she should avoid?",
    boundariesPlaceholder: "type your answer",
    boundaryTextReaction: "Okay. I will keep that out of the first message.",
    contextHost: "Tell her one thing before she says hello.",
    contextQuestion: "This can be your mood, situation, or one sentence about you.",
    contextPlaceholder: "type a note or skip",
    contextSkip: "skip ahead",
    nameHost: "What should we call her?",
    customNamePlaceholder: "or name her yourself",
    loading: "getting her ready...",
  },

  revealLabels: {
    whatShapedThem: "What you asked for",
    firstMessage: "First message",
    meet: "meet",
  },

  shapedLine: {
    feelings: (feeling: string) => `She should feel ${feeling}.`,
    role: (role: string) => `She should act as a ${role}.`,
    voice: (voice: string) => `Her voice should be ${voice}.`,
    looks: (looks: string) => `Setting: ${looks}.`,
    pace: (pace: string) => `Pace: ${pace}.`,
    boundaries: (boundary: string) => `Rule: ${boundary}.`,
    context: (context: string) => `She should know this before saying hello: ${context}.`,
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
      confidant: "She should give you time to explain.",
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
