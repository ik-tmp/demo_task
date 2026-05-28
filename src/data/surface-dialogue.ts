import type { Companion } from "@/types/companion";

export const surfaceDialogue = {
  common: {
    back: "back",
    reel: "reel",
    continue: "keep going",
    defaultSkip: "meet her now",
    freeTextPlaceholder: "type your answer",
    sendAria: "send",
  },

  reel: {
    prompt: "Who do you want to talk to first?",
    actions: {
      seeEveryone: "show all companions",
      pickForMe: "choose someone for me",
      describeSomeoneElse: "describe who you want",
    },
    openAria: (name: string) => `Open ${name}`,
  },

  browse: {
    actions: {
      sayHi: (name: string) => `say hi to ${name}`,
      tellMore: "show first messages",
      seeEveryone: "show all companions",
      showSofter: "show me softer",
      showSharper: "show me sharper",
    },
    samplesIntro: "Here are a few ways she might start.",
    voicePrompt: (voice: string) =>
      `Her voice is ${voice}. Ask one question before you choose.`,
    askPlaceholder: (name: string) => `ask ${name} something`,
    qaLimitPrompt: "You can keep talking with her in chat. Want to say hi?",
    hostIntro: (c: Companion) => {
      switch (c.energy) {
        case "listener":
          return `${c.name} listens first. She asks gentle questions and gives you time to answer.`;
        case "provoker":
          return `${c.name} keeps things light, then asks what is really going on.`;
        case "guide":
          return `${c.name} asks direct questions and helps you think clearly.`;
        case "confidant":
          return `${c.name} gives you time to explain and helps you sort it out.`;
      }
    },
  },

  gallery: {
    back: "reel",
    searchPlaceholder: "Describe who you want to talk to.",
    searchAria: "Search companions",
    submit: "search",
    previousAria: "previous",
    nextAria: "next",
    why: (reason: string) => `You asked for ${reason}. This is the closest match.`,
    sayHi: (name: string) => `say hi to ${name}`,
  },

  chat: {
    conversationAria: "conversation",
    typing: (name: string) => `${name.toLowerCase()} is typing...`,
    inputLocked: "Subscribe to keep chatting",
    inputPlaceholder: (name: string) => `say something to ${name}`,
    inputAria: "say something",
    sendAria: "send",
    unlockedAck: "Mm. Tell me more — I'm listening.",
    prelude: {
      nameHost: "Before she says hello, what should she call you?",
      namePlaceholder: "type your name or alias",
      nameChoices: [
        { label: "call me stranger", value: "stranger", mode: "alias" as const },
        { label: "do we need names to talk?", value: "stranger", mode: "unnamed" as const },
      ],
      contextHost: "Tell her one thing before she says hello.",
      contextPlaceholder: "a mood, a situation, or one sentence",
      contextChoices: [
        { label: "long day", value: "It has been a long day." },
        { label: "keep it light", value: "Keep the first hello light." },
        { label: "just curious", value: "I am just curious and feeling this out." },
      ],
      loading: "getting the chat ready...",
    },
  },

  paywall: {
    eyebrow: "Preview ended",
    title: (name: string) => `Keep talking with ${name}`,
    body: "Unlimited messages, voice, and memory.",
    plans: [
      { id: "monthly", name: "Monthly", perMonth: "$12/mo", billed: "billed monthly", save: null, best: null },
      { id: "quarter", name: "3 months", perMonth: "$10/mo", billed: "$30 every 3 months", save: "Save 17%", best: null },
      { id: "yearly", name: "12 months", perMonth: "$8/mo", billed: "$96 a year", save: "Save 33%", best: "Best value" },
    ] as const,
    defaultPlan: "yearly" as const,
    footnote: "Cancel anytime.",
    closeAria: "Dismiss",
    dismissedTitle: "Preview paused",
    dismissed: "Unlock anytime to keep talking.",
    success: "You're in — premium unlocked.",
    actions: {
      continue: "Unlock unlimited",
      unlock: "Unlock",
    },
  },
};
