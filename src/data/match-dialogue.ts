export const matchDialogue = {
  choices: {
    feeling: [
      { id: "calmer", label: "calmer" },
      { id: "wanted", label: "wanted" },
      { id: "challenged", label: "challenged" },
      { id: "entertained", label: "entertained" },
      { id: "understood", label: "understood" },
    ],
    role: [
      { id: "lead", label: "take the lead" },
      { id: "listen", label: "listen first" },
      { id: "tease", label: "tease kindly" },
      { id: "ask", label: "ask questions" },
      { id: "i-dont-know", label: "I don't know yet" },
    ],
    texture: [
      { id: "quiet-close", label: "quiet and close" },
      { id: "quick-spark", label: "quick energy" },
      { id: "honest-mirror", label: "honest feedback" },
      { id: "slow-burn", label: "slow start" },
    ],
    avoid: [
      { id: "not-fix", label: "no quick advice" },
      { id: "not-push", label: "don't push me" },
      { id: "not-flirt", label: "don't flirt" },
      { id: "not-perform", label: "don't act fake" },
      { id: "nothing-specific", label: "nothing specific" },
    ],
    familiarity: [
      { id: "familiar", label: "familiar" },
      { id: "surprising", label: "surprising" },
      { id: "dangerous", label: "a little dangerous" },
    ],
    rejectionAxis: [
      { id: "look", label: "look" },
      { id: "voice", label: "voice" },
      { id: "energy", label: "energy" },
      { id: "all", label: "all of it" },
      { id: "choices", label: "show me choices" },
    ],
  },

  prompts: {
    intro:
      "I can pick someone faster if you tell me how the first message should feel.",
    feeling: "How should the first message make you feel?",
    roleWithFeeling: "What should she do at the start?",
    roleFallback: "Should she ask first, or just be there?",
    texture: "What should the first few messages feel like?",
    avoid: "What would turn you off?",
    familiarity: "Should she feel familiar, surprising, or a little dangerous?",
    loading: "putting it together...",
    freeTextReaction:
      "Got it. I will use your words for the match.",
    freeTextPlaceholder: "type your answer",
    rejectionDiagnostic: "What was wrong: the look, the voice, or the energy?",
    createHandoff: "That's two misses. Want to describe who you want instead?",
  },

  actions: {
    start: "answer a few questions",
    skip: "meet her now",
    sayHi: "say hi",
    showAnother: "choose someone else",
    openEveryone: "show all companions",
    describeSomeone: "describe who you want",
    oneMoreTry: "try one more match",
    seeEveryone: "show all companions",
  },

  revealLabels: {
    whyHer: "Why this match",
    firstMessage: "First message",
  },

  reveal: {
    feelingPhrase: {
      calmer: "someone calm",
      wanted: "someone who is glad you showed up",
      challenged: "someone who challenges you",
      entertained: "someone who keeps it lively",
      understood: "someone who understands you",
    },
    feelingCounterweight: {
      calmer: "Not flat.",
      wanted: "Not needy.",
      challenged: "Not combative.",
      entertained: "Not loud for no reason.",
      understood: "Not patronizing.",
    },
    rolePhrase: {
      lead: "She can lead without taking over.",
      listen: "She listens before she tries to impress you.",
      tease: "She can tease without turning it into a routine.",
      ask: "She asks first and gives you space to answer.",
      "i-dont-know": "She does not need you to know what you want immediately.",
    },
    texturePhrase: {
      "quiet-close": "She is comfortable with quiet.",
      "quick-spark": "She can bring energy without overwhelming you.",
      "honest-mirror": "She can give honest feedback without making you feel judged.",
      "slow-burn": "She will not try to get close too fast.",
    },
    textureShort: {
      "quiet-close": "something quiet and close",
      "quick-spark": "quick energy",
      "honest-mirror": "honest feedback without judgment",
      "slow-burn": "a slower start",
    },
    avoidRationale: {
      "not-fix": "asks before she suggests",
      "not-push": "lets you set the pace",
      "not-flirt": "can be warm without steering everything toward flirting",
      "not-perform": "does not turn the conversation into a routine",
      "nothing-specific": "is easy to start with",
    },
  },

  reactions: {
    feeling: {
      calmer:
        "Okay. She should help you settle, not make you work for the conversation.",
      wanted: "You want her to make it clear she is glad you showed up.",
      challenged: "You want someone who will push back a little, but not pick a fight.",
      entertained: "You want the first messages to have some life in them.",
      understood:
        "You want her to understand you without making you explain every sentence.",
    },
    role: {
      lead: "She can lead a little, but she should not take over.",
      listen: "She should listen first and not rush to prove she is clever.",
      tease: "A little teasing is fine, as long as it feels kind.",
      ask: "She should ask good questions before she gives opinions.",
      "i-dont-know": "That is okay. The first conversation can tell us more.",
    },
    texture: {
      "quiet-close": "I will look for someone who is comfortable with quiet.",
      "quick-spark": "The first message should have some momentum.",
      "honest-mirror": "She should be honest without making you feel judged.",
      "slow-burn": "She should not try to be intimate too fast.",
    },
    avoid: {
      "not-fix": "She should not turn your first answer into advice.",
      "not-push": "She can ask, but she should let you set the pace.",
      "not-flirt": "She can be warm without steering everything toward flirting.",
      "not-perform": "She should not sound like she is doing a routine.",
      "nothing-specific": "Okay. I will pick someone easy to start with.",
    },
    familiarity: {
      familiar: "She should feel easy to talk to quickly.",
      surprising: "She should have a little surprise, but not feel random.",
      dangerous: "A little danger is okay, as long as it still feels safe to answer.",
    },
  },
};
