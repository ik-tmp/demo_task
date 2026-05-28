import type { Companion } from "@/types/companion";

export const surfaceDialogue = {
  common: {
    back: "back",
    reel: "reel",
    continue: "continue",
    defaultSkip: "just meet them",
    freeTextPlaceholder: "say it your way",
    sendAria: "send",
  },

  reel: {
    prompt: "Who do you want to start with?",
    actions: {
      seeEveryone: "see everyone",
      pickForMe: "pick for me",
      describeSomeoneElse: "describe someone else",
    },
    openAria: (name: string) => `Open ${name}`,
  },

  browse: {
    actions: {
      sayHi: (name: string) => `say hi to ${name}`,
      tellMore: "tell me more",
      seeEveryone: "see everyone",
      showSofter: "show me softer",
      showSharper: "show me sharper",
    },
    samplesIntro: "Three things she might open with.",
    voicePrompt: (voice: string) =>
      `Her voice is ${voice}. Ask her something before you decide.`,
    askPlaceholder: (name: string) => `ask ${name} something`,
    qaLimitPrompt: "She'll tell you the rest herself. Want to say hi?",
    hostIntro: (c: Companion) => {
      switch (c.energy) {
        case "listener":
          return `${c.name} reads more than she talks. She asks good questions and waits for the answer.`;
        case "provoker":
          return `${c.name} is quick. She finds the part of the story you were about to skip, then makes room for it.`;
        case "guide":
          return `${c.name} knows where she's going. She walks beside you and skips the small talk.`;
        case "confidant":
          return `${c.name} wants the long version. She keeps track when the story gets messy.`;
      }
    },
  },

  gallery: {
    back: "reel",
    searchPlaceholder: "Describe who you want to meet.",
    searchAria: "Search companions",
    submit: "go",
    previousAria: "previous",
    nextAria: "next",
    why: (reason: string) => `Why you're seeing this: matched on ${reason}.`,
    sayHi: (name: string) => `say hi to ${name}`,
  },

  chat: {
    conversationAria: "conversation",
    typing: (name: string) => `${name.toLowerCase()} is typing...`,
    inputPreviewFull: "preview is full",
    inputPlaceholder: (name: string) => `say something to ${name}`,
    inputAria: "say something",
    sendAria: "send",
  },

  paywall: {
    dismissed: "No problem. This chat stays in preview.",
    success: "You're in. Keep going.",
    error: "That didn't go through. Nothing changed.",
    title: (name: string) => `Keep talking with ${name}?`,
    body: "Your preview is ready to continue.",
    actions: {
      continue: "continue",
      notNow: "not now",
      trySomeoneElse: "try someone else",
      restoreAccess: "restore access",
      tryAgain: "try again",
    },
  },
};
