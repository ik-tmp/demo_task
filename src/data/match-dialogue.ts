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
      { id: "lead", label: "lead" },
      { id: "listen", label: "listen" },
      { id: "tease", label: "tease" },
      { id: "ask", label: "ask" },
      { id: "i-dont-know", label: "I don't know yet" },
    ],
    texture: [
      { id: "quiet-close", label: "quiet and close" },
      { id: "quick-spark", label: "quick spark" },
      { id: "honest-mirror", label: "honest mirror" },
      { id: "slow-burn", label: "slow burn" },
    ],
    avoid: [
      { id: "not-fix", label: "not fix" },
      { id: "not-push", label: "not push" },
      { id: "not-flirt", label: "not flirt" },
      { id: "not-perform", label: "not perform" },
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
    feeling: "When she answers, what should feel different?",
    roleWithFeeling: "What should she do first?",
    roleFallback: "Should they ask first, or just be there?",
    texture: "What should the first few messages feel like?",
    avoid: "What would turn you off?",
    familiarity: "Should she feel familiar, surprising, or a little risky?",
    loading: "putting it together...",
    freeTextReaction:
      "That helps. I will use what you wrote instead of forcing it into a preset answer.",
    freeTextPlaceholder: "say it your way",
    rejectionDiagnostic: "Good. That helps. Was it the look, the voice, or the energy?",
    createHandoff: "That's two passes. Want to describe them instead?",
  },

  actions: {
    start: "start",
    skip: "just meet them",
    sayHi: "say hi",
    showAnother: "show me another",
    openEveryone: "open everyone",
    describeSomeone: "describe someone",
    oneMoreTry: "one more try",
    seeEveryone: "see everyone",
  },

  revealLabels: {
    whyHer: "Why her",
    firstMessage: "First message",
  },

  reveal: {
    feelingPhrase: {
      calmer: "calm",
      wanted: "wanted",
      challenged: "challenged",
      entertained: "lit-up",
      understood: "understood",
    },
    feelingCounterweight: {
      calmer: "Not flat.",
      wanted: "Not needy.",
      challenged: "Not combative.",
      entertained: "Not loud for no reason.",
      understood: "Not patronising.",
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
      "quick-spark": "She can make the first message feel alive.",
      "honest-mirror": "She can be honest without making you feel judged.",
      "slow-burn": "She will not try to be close too fast.",
    },
    textureShort: {
      "quiet-close": "something quiet and close",
      "quick-spark": "a quick spark",
      "honest-mirror": "honesty without judgement",
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
      dangerous: "A little edge is okay, as long as it still feels safe to answer.",
    },
  },
};
