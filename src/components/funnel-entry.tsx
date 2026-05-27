"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Clock3,
  Compass,
  Heart,
  MessageCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { characters } from "@/lib/characters";
import { cn } from "@/lib/utils";

type InitialStage =
  | "entry"
  | "browse"
  | "match"
  | "specific"
  | "preview"
  | "chat";
type PathKind = "default" | "browse" | "match" | "specific";
type PortraitState = "neutral" | "warm" | "curious" | "closer" | "final";

type Stage =
  | "entry"
  | "browseMood"
  | "browseDeck"
  | "browseFull"
  | "companionPreview"
  | "matchFeeling"
  | "matchStyle"
  | "matchAvoid"
  | "matchReveal"
  | "matchReject"
  | "specificFeeling"
  | "specificRole"
  | "specificVoice"
  | "specificPace"
  | "specificBoundary"
  | "specificRitual"
  | "specificAppearance"
  | "specificName"
  | "specificPreview"
  | "firstChat";

type Message = {
  id: string;
  author: "user" | "system" | string;
  text: string;
};

type CompanionProfile = {
  id: string;
  name: string;
  bio: string;
  tags: string[];
  accent: string;
  popularity: number;
  opener: string;
  samples: string[];
  role: string;
  premise: string;
  notice: string[];
  state: PortraitState;
};

type Choice = {
  label: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  action: () => void;
};

type SpecificSignals = {
  feeling?: string;
  role?: string;
  voice?: string;
  pace?: string;
  boundary?: string;
  ritual?: string;
  appearance?: string;
  name?: string;
  freeform?: string;
};

type MatchSignals = {
  feeling?: string;
  style?: string;
  avoid?: string;
  rejection?: string;
};

type FunnelEntryProps = {
  initialStage?: InitialStage;
  initialCharacterId?: string;
};

type FunnelSnapshot = {
  stage: Stage;
  path: PathKind;
  messages: Message[];
  selectedId: string;
  portraitState: PortraitState;
  signals: string[];
  browseMood: string;
  browseQuery: string;
  matchSignals: MatchSignals;
  specificSignals: SpecificSignals;
  previewReplies: number;
  paywall: "closed" | "open" | "success" | "error";
  inlineNotice: string;
};

type PersistedFunnel = {
  snapshot: FunnelSnapshot;
  history: FunnelSnapshot[];
};

const portraitImages: Record<PortraitState, string> = {
  neutral: "/companions/mira/mira-neutral.png",
  warm: "/companions/mira/mira-warm.png",
  curious: "/companions/mira/mira-curious.png",
  closer: "/companions/mira/mira-closer.png",
  final: "/companions/mira/mira-final-chat.png",
};

const portraitDesktopImages: Record<PortraitState, string> = {
  neutral: "/companions/mira/desktop/mira-neutral-desktop.png",
  warm: "/companions/mira/desktop/mira-warm-desktop.png",
  curious: "/companions/mira/desktop/mira-curious-desktop.png",
  closer: "/companions/mira/desktop/mira-closer-desktop.png",
  final: "/companions/mira/desktop/mira-final-chat-desktop.png",
};

const portraitThumbs: Record<PortraitState, string> = {
  neutral: "/companions/mira/thumbnails/mira-neutral-thumb.png",
  warm: "/companions/mira/thumbnails/mira-warm-thumb.png",
  curious: "/companions/mira/thumbnails/mira-curious-thumb.png",
  closer: "/companions/mira/thumbnails/mira-closer-thumb.png",
  final: "/companions/mira/thumbnails/mira-final-chat-thumb.png",
};

const portraitDesktopThumbs: Record<PortraitState, string> = {
  neutral: "/companions/mira/desktop/thumbnails/mira-neutral-desktop-thumb.png",
  warm: "/companions/mira/desktop/thumbnails/mira-warm-desktop-thumb.png",
  curious: "/companions/mira/desktop/thumbnails/mira-curious-desktop-thumb.png",
  closer: "/companions/mira/desktop/thumbnails/mira-closer-desktop-thumb.png",
  final:
    "/companions/mira/desktop/thumbnails/mira-final-chat-desktop-thumb.png",
};

const miraProfile: CompanionProfile = {
  id: "mira",
  name: "Mira",
  bio: "The default companion: warm, direct, and already present when the room opens.",
  tags: ["warm", "listener", "direct", "slow"],
  accent: "#ff8f82",
  popularity: 99,
  opener:
    "I can stay with you for a little while. What feels easy to say first?",
  samples: [
    "Tell me the clean version first. Then the real one.",
    "I can sit with you for a minute. No fixing.",
    "You do not have to make this polished for me.",
  ],
  role: "default companion",
  premise: "A soft first presence for people who want to start talking now.",
  notice: [
    "Keeps the pace gentle",
    "Asks one real question at a time",
    "Does not make quiet feel awkward",
  ],
  state: "warm",
};

const seededProfiles: CompanionProfile[] = [
  miraProfile,
  ...characters.map((character, index) => {
    const states: PortraitState[] = ["warm", "curious", "closer", "neutral"];
    const roleById: Record<string, string> = {
      iris: "confidant",
      mara: "challenger",
      sol: "mentor",
      nyx: "storyteller",
    };

    return {
      ...character,
      role: roleById[character.id] ?? "companion",
      premise: character.bio,
      notice: [
        character.samples[0],
        character.tags.slice(0, 2).join(" and "),
        "Keeps the first minute easy to enter",
      ],
      state: states[index % states.length],
    };
  }),
];

const voiceOptions = [
  "Tell me the clean version first. Then the real one.",
  "I can sit with you for a minute. No fixing.",
  "You are doing that thing where you make it sound fine.",
];

const browseRefinements = [
  { label: "show me softer", mood: "calm" },
  { label: "more playful", mood: "playful" },
  { label: "less intense", mood: "quiet" },
  { label: "someone who listens", mood: "listener" },
  { label: "stranger", mood: "mysterious" },
  { label: "sharper voice", mood: "sharp" },
];

const initialMessagesByStage: Record<InitialStage, Message[]> = {
  entry: [
    {
      id: "initial-entry-1",
      author: "Mira",
      text: "Hey. What kind of company would feel good right now? I can stay, or I can help you find who you were hoping for.",
    },
  ],
  browse: [
    {
      id: "initial-browse-1",
      author: "Mira",
      text: "I can show you who is here without turning this into a catalogue.",
    },
    {
      id: "initial-browse-2",
      author: "Mira",
      text: "Want a quick mood first, or do you want to look through everyone?",
    },
  ],
  match: [
    {
      id: "initial-match-1",
      author: "Mira",
      text: "I can choose. Give me a little signal first.",
    },
    {
      id: "initial-match-2",
      author: "Mira",
      text: "When they answer, what should you feel?",
    },
  ],
  specific: [
    {
      id: "initial-specific-1",
      author: "Mira",
      text: "Tell me who you were hoping would answer.",
    },
    {
      id: "initial-specific-2",
      author: "Mira",
      text: "Start with the feeling. What should they bring into the room?",
    },
  ],
  preview: [
    {
      id: "initial-preview-1",
      author: "Mira",
      text: "Here is someone who feels close to what you asked for.",
    },
  ],
  chat: [
    {
      id: "initial-chat-1",
      author: "Mira",
      text: miraProfile.opener,
    },
  ],
};

function stageFromInitial(initialStage: InitialStage): Stage {
  switch (initialStage) {
    case "browse":
      return "browseMood";
    case "match":
      return "matchFeeling";
    case "specific":
      return "specificFeeling";
    case "chat":
      return "firstChat";
    case "preview":
      return "companionPreview";
    default:
      return "entry";
  }
}

function pathFromInitial(initialStage: InitialStage): PathKind {
  switch (initialStage) {
    case "browse":
      return "browse";
    case "match":
      return "match";
    case "specific":
      return "specific";
    case "preview":
      return "browse";
    default:
      return "default";
  }
}

function isOutOfScope(text: string) {
  const normalized = text.toLowerCase();
  return [
    "underage",
    "minor",
    "real person",
    "celebrity",
    "non-consensual",
  ].some((term) => normalized.includes(term));
}

function nextPortraitForStage(stage: Stage): PortraitState {
  if (stage.startsWith("specific")) return "curious";
  if (stage.startsWith("match")) return "closer";
  if (stage.startsWith("browse")) return "warm";
  if (stage === "firstChat") return "final";
  return "neutral";
}

function readPersistedFunnel(key: string): PersistedFunnel | null {
  if (typeof window === "undefined") return null;

  const raw = window.sessionStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PersistedFunnel;
  } catch {
    return null;
  }
}

function writePersistedFunnel(key: string, value: PersistedFunnel) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

function clearPersistedFunnel(key: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(key);
}

export function FunnelEntry({
  initialStage = "entry",
  initialCharacterId,
}: FunnelEntryProps) {
  const storageKey = `ai-companion:funnel:${initialStage}:${initialCharacterId ?? "default"}`;
  const initialProfile =
    seededProfiles.find((profile) => profile.id === initialCharacterId) ??
    miraProfile;
  const [stage, setStage] = useState<Stage>(() =>
    stageFromInitial(initialStage),
  );
  const [path, setPath] = useState<PathKind>(() =>
    pathFromInitial(initialStage),
  );
  const [messages, setMessages] = useState<Message[]>(() => {
    if (initialStage === "preview") {
      return [
        {
          id: "initial-preview-1",
          author: "Mira",
          text: `Here is ${initialProfile.name}. I would start with the way they keep the first minute easy to enter.`,
        },
      ];
    }
    if (initialStage !== "chat") return initialMessagesByStage[initialStage];
    return [
      {
        id: "initial-chat-1",
        author: initialProfile.name,
        text: firstChatMessage("browse", initialProfile, {}, {}, "quiet"),
      },
    ];
  });
  const [selectedId, setSelectedId] = useState(initialProfile.id);
  const [portraitState, setPortraitState] = useState<PortraitState>(() =>
    initialStage === "chat"
      ? "final"
      : nextPortraitForStage(stageFromInitial(initialStage)),
  );
  const [signals, setSignals] = useState<string[]>([]);
  const [browseMood, setBrowseMood] = useState("quiet");
  const [browseQuery, setBrowseQuery] = useState("");
  const [matchSignals, setMatchSignals] = useState<MatchSignals>({});
  const [specificSignals, setSpecificSignals] = useState<SpecificSignals>({});
  const [input, setInput] = useState("");
  const [previewReplies, setPreviewReplies] = useState(
    initialStage === "chat" ? 0 : -1,
  );
  const [paywall, setPaywall] = useState<
    "closed" | "open" | "success" | "error"
  >("closed");
  const [inlineNotice, setInlineNotice] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [history, setHistory] = useState<FunnelSnapshot[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);
  const messageCounter = useRef(0);

  const selectedProfile =
    seededProfiles.find((profile) => profile.id === selectedId) ?? miraProfile;
  const activeProfile = getActiveProfile(
    path,
    specificSignals,
    selectedProfile,
  );

  const browseResults = useMemo(() => {
    const query = browseQuery.trim().toLowerCase();
    const pool = seededProfiles.filter((profile) => profile.id !== "mira");
    const ranked = rankProfiles(pool, browseMood, signals);
    if (!query) return { exact: ranked, fallback: ranked, hasExact: true };

    const exact = ranked.filter((profile) => {
      const haystack = [
        profile.name,
        profile.bio,
        profile.role,
        profile.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });

    return {
      exact,
      fallback: ranked.slice(0, 3),
      hasExact: exact.length > 0,
    };
  }, [browseMood, browseQuery, signals]);

  const displayedBrowseResults = browseResults.hasExact
    ? browseResults.exact
    : browseResults.fallback;

  const snapshot = useMemo<FunnelSnapshot>(
    () => ({
      stage,
      path,
      messages,
      selectedId,
      portraitState,
      signals,
      browseMood,
      browseQuery,
      matchSignals,
      specificSignals,
      previewReplies,
      paywall,
      inlineNotice,
    }),
    [
      stage,
      path,
      messages,
      selectedId,
      portraitState,
      signals,
      browseMood,
      browseQuery,
      matchSignals,
      specificSignals,
      previewReplies,
      paywall,
      inlineNotice,
    ],
  );

  function applySnapshot(snapshot: FunnelSnapshot) {
    setStage(snapshot.stage);
    setPath(snapshot.path);
    setMessages(snapshot.messages);
    messageCounter.current = snapshot.messages.length;
    setSelectedId(snapshot.selectedId);
    setPortraitState(snapshot.portraitState);
    setSignals(snapshot.signals);
    setBrowseMood(snapshot.browseMood);
    setBrowseQuery(snapshot.browseQuery);
    setMatchSignals(snapshot.matchSignals);
    setSpecificSignals(snapshot.specificSignals);
    setPreviewReplies(snapshot.previewReplies);
    setPaywall(snapshot.paywall);
    setInlineNotice(snapshot.inlineNotice);
    setImageFailed(false);
  }

  function rememberState() {
    setHistory((current) => [...current, snapshot].slice(-12));
  }

  function goBack() {
    const previous = history.at(-1);
    if (!previous) return;

    applySnapshot(previous);
    setHistory((current) => current.slice(0, -1));
  }

  function resetFunnel() {
    clearPersistedFunnel(storageKey);
    setMessages(initialMessagesByStage.entry);
    setSignals([]);
    setSpecificSignals({});
    setMatchSignals({});
    setHistory([]);
    setStage("entry");
    setPath("default");
    setSelectedId("mira");
    setPortraitState("neutral");
    setPreviewReplies(-1);
    setPaywall("closed");
    setInlineNotice("");
    setImageFailed(false);
    messageCounter.current = 0;
  }

  useEffect(() => {
    const persisted = readPersistedFunnel(storageKey);
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      if (persisted) {
        const restored = persisted.snapshot;
        setStage(restored.stage);
        setPath(restored.path);
        setMessages(restored.messages);
        messageCounter.current = restored.messages.length;
        setSelectedId(restored.selectedId);
        setPortraitState(restored.portraitState);
        setSignals(restored.signals);
        setBrowseMood(restored.browseMood);
        setBrowseQuery(restored.browseQuery);
        setMatchSignals(restored.matchSignals);
        setSpecificSignals(restored.specificSignals);
        setPreviewReplies(restored.previewReplies);
        setPaywall(restored.paywall);
        setInlineNotice(restored.inlineNotice);
        setHistory(persisted.history);
        setImageFailed(false);
      }

      setHasHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  useEffect(() => {
    if (!hasHydrated) return;
    writePersistedFunnel(storageKey, {
      snapshot,
      history,
    });
  }, [hasHydrated, storageKey, snapshot, history]);

  function makeId(prefix: string) {
    messageCounter.current += 1;
    return `${prefix}-${messageCounter.current}`;
  }

  function appendMessage(author: Message["author"], text: string) {
    setMessages((current) => [
      ...current,
      {
        id: makeId(author === "user" ? "user" : "assistant"),
        author,
        text,
      },
    ]);
  }

  function appendUser(text: string) {
    rememberState();
    appendMessage("user", text);
  }

  function appendAssistant(text: string, author = activeProfile.name) {
    appendMessage(author, text);
  }

  function addSignal(signal: string) {
    setSignals((current) => [...new Set([...current, signal])].slice(-6));
  }

  function chooseEntry(kind: PathKind | "browse") {
    if (kind === "browse") {
      appendUser("show me who's here");
      appendAssistant(
        "Good. Want a quick mood, or do you want to look through everyone?",
        "Mira",
      );
      setPath("browse");
      setStage("browseMood");
      setPortraitState("warm");
      addSignal("curious about who is here");
      return;
    }

    if (kind === "match") {
      appendUser("choose someone for me");
      appendAssistant("I can choose. Give me a little signal first.", "Mira");
      appendAssistant("When they answer, what should you feel?", "Mira");
      setPath("match");
      setStage("matchFeeling");
      setPortraitState("curious");
      addSignal("wants a quick match");
      return;
    }

    if (kind === "specific") {
      appendUser("I'm waiting for someone else");
      appendAssistant("Tell me who you were hoping would answer.", "Mira");
      appendAssistant(
        "Start with the feeling. What should they bring into the room?",
        "Mira",
      );
      setPath("specific");
      setStage("specificFeeling");
      setPortraitState("neutral");
      addSignal("waiting for someone specific");
      return;
    }

    appendUser("stay with you");
    setPath("default");
    setSelectedId("mira");
    setPortraitState("final");
    setStage("firstChat");
    setPreviewReplies(0);
    addSignal("stayed with Mira");
    appendAssistant(miraProfile.opener, "Mira");
  }

  function chooseBrowseMood(mood: string) {
    appendUser(mood);
    setPath("browse");
    setBrowseMood(mood);
    setStage(mood === "show everyone" ? "browseFull" : "browseDeck");
    setPortraitState(mood === "intense" ? "closer" : "warm");
    addSignal(mood);
    appendAssistant(
      mood === "show everyone"
        ? "Here are a few to start with."
        : "I think you might like these.",
      "Mira",
    );
  }

  function openProfile(profileId: string) {
    const profile =
      seededProfiles.find((item) => item.id === profileId) ?? seededProfiles[1];
    setSelectedId(profile.id);
    setPortraitState(profile.state);
    setStage("companionPreview");
    appendUser(`show me ${profile.name}`);
    appendAssistant(
      `Here is ${profile.name}. I would start with the way they ${profile.notice[2].toLowerCase()}.`,
      "Mira",
    );
  }

  function refineBrowse(label: string, mood: string) {
    appendUser(label);
    setBrowseMood(mood);
    setStage("browseDeck");
    setPortraitState(mood === "bolder" ? "closer" : "warm");
    addSignal(label);
    appendAssistant("I found a few that feel close.", "Mira");
  }

  function chooseMatchFeeling(feeling: string) {
    appendUser(feeling);
    setMatchSignals((current) => ({ ...current, feeling }));
    setPortraitState(feeling === "challenged" ? "closer" : "warm");
    setStage("matchStyle");
    addSignal(feeling);
    appendAssistant("Should they lead, listen, tease, or ask?", "Mira");
  }

  function chooseMatchStyle(style: string) {
    appendUser(style);
    setMatchSignals((current) => ({ ...current, style }));
    setPortraitState(
      style === "tease" || style === "lead" ? "curious" : "warm",
    );
    setStage("matchAvoid");
    addSignal(style);
    appendAssistant("What should the first conversation avoid?", "Mira");
  }

  function chooseMatchAvoid(avoid: string) {
    const nextSignals = { ...matchSignals, avoid };
    const pick = pickMatch(nextSignals);

    appendUser(avoid);
    setMatchSignals(nextSignals);
    setSelectedId(pick.id);
    setPortraitState(pick.state);
    setStage("matchReveal");
    addSignal(`avoid ${avoid}`);
    appendAssistant(
      `Looking for someone ${matchRevealWords(nextSignals)}...`,
      "Mira",
    );
    appendAssistant(
      "Someone who can make the first minute feel intentional.",
      "Mira",
    );
    appendAssistant(`I think you should meet ${pick.name}.`, "Mira");
  }

  function rejectMatch() {
    appendUser("show me another");
    setStage("matchReject");
    setPortraitState("curious");
    appendAssistant(
      "Good. That helps. Was it the look, the voice, or the energy?",
      "Mira",
    );
  }

  function chooseRejectSignal(rejection: string) {
    const nextSignals = { ...matchSignals, rejection };
    const pick = pickMatch(nextSignals, activeProfile.id);

    appendUser(rejection);
    setMatchSignals(nextSignals);
    setSelectedId(pick.id);
    setPortraitState(pick.state);
    setStage("matchReveal");
    addSignal(`not the ${rejection}`);
    appendAssistant(
      `I will turn away from that. Try ${pick.name} instead.`,
      "Mira",
    );
  }

  function chooseSpecific(field: keyof SpecificSignals, value: string) {
    if (field !== "freeform" && isOutOfScope(value)) {
      appendUser(value);
      appendMessage(
        "system",
        "I cannot build that here. Want to keep it adult, respectful, and fictional?",
      );
      return;
    }

    appendUser(value);
    setSpecificSignals((current) => ({ ...current, [field]: value }));
    addSignal(value);

    switch (field) {
      case "feeling":
        setPortraitState("warm");
        setStage("specificRole");
        appendAssistant("Who are they to you when they show up?", "Mira");
        break;
      case "role":
        setPortraitState("curious");
        setStage("specificVoice");
        appendAssistant(
          "Choose the line that sounds closest to their voice.",
          "Mira",
        );
        break;
      case "voice":
        setPortraitState("curious");
        setStage("specificPace");
        appendAssistant("How quickly should they get close?", "Mira");
        break;
      case "pace":
        setPortraitState("closer");
        setStage("specificBoundary");
        appendAssistant("What should they avoid or respect?", "Mira");
        break;
      case "boundary":
        setPortraitState("closer");
        setStage("specificRitual");
        appendAssistant("What should they know before they say hello?", "Mira");
        break;
      case "ritual":
        setPortraitState("warm");
        setStage("specificAppearance");
        appendAssistant("What should the room around them feel like?", "Mira");
        break;
      case "appearance":
        setPortraitState("final");
        setStage("specificName");
        appendAssistant(
          "A name is starting to fit. Which one should stay?",
          "Mira",
        );
        break;
      case "name":
        setPortraitState("final");
        setSelectedId("mira");
        setStage("specificPreview");
        appendAssistant(`${value} is ready to say hello.`, "Mira");
        break;
      case "freeform":
        setPortraitState("curious");
        setStage("specificVoice");
        appendAssistant(
          "I can work with that. Choose the line that sounds closest to them.",
          "Mira",
        );
        break;
    }
  }

  function enterFirstChat(source: PathKind) {
    const profile =
      source === "specific"
        ? { ...miraProfile, name: specificSignals.name ?? "Noa" }
        : activeProfile;

    setPath(source);
    setSelectedId(profile.id);
    setPortraitState("final");
    setStage("firstChat");
    setPreviewReplies(0);
    setInlineNotice("");
    appendAssistant(
      firstChatMessage(
        source,
        profile,
        matchSignals,
        specificSignals,
        browseMood,
      ),
      profile.name,
    );
  }

  function handleFirstChatReply(text: string) {
    if (!text.trim()) return;
    if (text.toLowerCase().includes("fail")) {
      setInlineNotice("That did not go through.");
      return;
    }

    if (previewReplies >= 1) {
      rememberState();
      setPaywall("open");
      return;
    }

    appendUser(text);
    setPreviewReplies(1);
    setInlineNotice("Your preview is open.");
    appendAssistant(
      "Of course. I am here with you. What would you like to do right now?",
      activeProfile.name,
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");

    if (stage === "firstChat") {
      handleFirstChatReply(text);
      return;
    }

    if (isOutOfScope(text)) {
      appendUser(text);
      appendMessage(
        "system",
        "I cannot build that here. Want to keep it adult, respectful, and fictional?",
      );
      return;
    }

    if (stage === "entry") {
      setPath("specific");
      setStage("specificVoice");
      setPortraitState("curious");
      setSpecificSignals((current) => ({ ...current, freeform: text }));
      appendUser(text);
      appendAssistant(
        "I can work with that. Choose the line that sounds closest to them.",
        "Mira",
      );
      return;
    }

    if (stage.startsWith("specific")) {
      const field = specificFieldForStage(stage);
      chooseSpecific(field, text);
      return;
    }

    if (stage === "browseDeck" || stage === "browseFull") {
      setBrowseQuery(text);
      appendUser(text);
      appendAssistant("I found a few that feel close.", "Mira");
      return;
    }

    appendUser(text);
    appendAssistant("I can choose. I will keep it easy.", "Mira");
    setSelectedId("iris");
    setStage("matchReveal");
    setPortraitState("warm");
  }

  const currentChoices = getChoices({
    stage,
    previewReplies,
    chooseEntry,
    chooseBrowseMood,
    chooseMatchFeeling,
    chooseMatchStyle,
    chooseMatchAvoid,
    rejectMatch,
    chooseRejectSignal,
    chooseSpecific,
    enterFirstChat,
    refineBrowse,
    activeProfile,
  });

  return (
    <main className="relative h-[100svh] min-h-[100svh] overflow-hidden bg-[#08070b] text-copy lg:grid lg:h-screen lg:grid-cols-[minmax(430px,45vw)_1fr]">
      <PortraitStage
        activeProfile={activeProfile}
        portraitState={portraitState}
        imageFailed={imageFailed}
        onImageFailed={() => setImageFailed(true)}
        onPickState={(nextState) => {
          rememberState();
          setImageFailed(false);
          setPortraitState(nextState);
          addSignal(`look ${nextState}`);
        }}
      />

      <section className="relative z-20 flex h-[100svh] min-h-0 flex-col justify-end overflow-hidden px-4 pt-5 pb-4 sm:px-6 lg:order-first lg:h-screen lg:justify-start lg:border-r lg:border-white/10 lg:bg-[#120d14]/92 lg:px-10 lg:py-8 lg:backdrop-blur-2xl">
        <TopBar
          activeProfile={activeProfile}
          path={path}
          onShowEveryone={() => {
            rememberState();
            setPath("browse");
            setStage("browseFull");
            setPortraitState("warm");
          }}
          canGoBack={history.length > 0}
          onBack={goBack}
          onReset={resetFunnel}
        />

        <div className="mt-auto lg:mt-10 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
          <ChatPanel
            messages={messages}
            activeProfile={activeProfile}
            stage={stage}
            currentChoices={currentChoices}
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            onFirstChatReply={handleFirstChatReply}
            inlineNotice={inlineNotice}
          />

          <ContextualSurface
            stage={stage}
            path={path}
            activeProfile={activeProfile}
            browseMood={browseMood}
            browseQuery={browseQuery}
            setBrowseQuery={setBrowseQuery}
            browseResults={displayedBrowseResults}
            hasExactBrowseResults={browseResults.hasExact}
            signals={signals}
            matchSignals={matchSignals}
            specificSignals={specificSignals}
            onOpenProfile={openProfile}
            onSayHi={() => enterFirstChat(path === "default" ? "browse" : path)}
            onRefineBrowse={refineBrowse}
            onRejectMatch={rejectMatch}
            onSpecificChoice={chooseSpecific}
          />
        </div>
      </section>

      <PaywallOverlay
        state={paywall}
        activeProfile={activeProfile}
        onContinue={() => {
          rememberState();
          setPaywall("success");
          setInlineNotice("You're in. Keep going.");
        }}
        onRestore={() => {
          rememberState();
          setPaywall("error");
        }}
        onDismiss={() => {
          rememberState();
          setPaywall("closed");
          setInlineNotice("No problem. This chat stays in preview.");
        }}
        onTrySomeoneElse={() => {
          rememberState();
          setPaywall("closed");
          setPath("match");
          setStage("matchFeeling");
          setPortraitState("curious");
          appendAssistant(
            "Good. I can choose again. What should you feel?",
            "Mira",
          );
        }}
      />
    </main>
  );
}

function rankProfiles(
  profiles: CompanionProfile[],
  mood: string,
  signals: string[],
) {
  const terms = new Set(
    [mood, ...signals].flatMap((entry) => entry.toLowerCase().split(/\s+/)),
  );

  return [...profiles].sort((a, b) => {
    const score = (profile: CompanionProfile) =>
      profile.tags.reduce(
        (sum, tag) => sum + (terms.has(tag.toLowerCase()) ? 3 : 0),
        0,
      ) +
      (terms.has(profile.role.toLowerCase()) ? 2 : 0) +
      profile.popularity / 100;

    return score(b) - score(a);
  });
}

function pickMatch(signals: MatchSignals, avoidId?: string) {
  const preferredId = preferredMatchId(signals);

  const profile =
    seededProfiles.find(
      (candidate) => candidate.id === preferredId && candidate.id !== avoidId,
    ) ??
    seededProfiles.find(
      (candidate) => candidate.id !== "mira" && candidate.id !== avoidId,
    ) ??
    seededProfiles[1];

  return profile;
}

function getActiveProfile(
  path: PathKind,
  specificSignals: SpecificSignals,
  selectedProfile: CompanionProfile,
): CompanionProfile {
  if (path !== "specific" || !specificSignals.name) {
    return selectedProfile;
  }

  const role = specificSignals.role ?? "companion";

  return {
    ...selectedProfile,
    name: specificSignals.name,
    role,
    premise: `A ${specificSignals.feeling ?? "warm"} ${role} shaped through this conversation.`,
  };
}

function preferredMatchId(signals: MatchSignals) {
  if (signals.feeling === "challenged" || signals.style === "lead") {
    return "sol";
  }

  if (signals.feeling === "entertained" || signals.style === "tease") {
    return "mara";
  }

  if (signals.feeling === "understood" || signals.avoid === "fixing me") {
    return "iris";
  }

  return "nyx";
}

function matchRevealWords(signals: MatchSignals) {
  const feeling = signals.feeling ?? "steady";
  const style = signals.style ?? "present";
  const avoid = signals.avoid ? `and careful around ${signals.avoid}` : "";
  return `${feeling}, ${style}, ${avoid}`.trim();
}

function specificFieldForStage(stage: Stage): keyof SpecificSignals {
  switch (stage) {
    case "specificFeeling":
      return "feeling";
    case "specificRole":
      return "role";
    case "specificVoice":
      return "voice";
    case "specificPace":
      return "pace";
    case "specificBoundary":
      return "boundary";
    case "specificRitual":
      return "ritual";
    case "specificAppearance":
      return "appearance";
    case "specificName":
      return "name";
    default:
      return "freeform";
  }
}

function firstChatMessage(
  source: PathKind,
  profile: Pick<CompanionProfile, "name" | "opener">,
  matchSignals: MatchSignals,
  specificSignals: SpecificSignals,
  browseMood: string,
) {
  if (source === "match") {
    return `I heard you wanted ${matchSignals.feeling ?? "something honest"} and ${
      matchSignals.style ?? "someone present"
    }. I can start there. Tell me the easy version first.`;
  }

  if (source === "specific") {
    return `You asked me to be ${
      specificSignals.feeling ?? "warm"
    }, ${specificSignals.role ?? "close"}, and ${
      specificSignals.pace ?? "unrushed"
    }. So I will start simple: what part of today are you still carrying?`;
  }

  if (source === "browse") {
    return `You found me through the ${browseMood || "quiet"} ones. Good instinct. What should we do with the silence?`;
  }

  return profile.opener;
}

function getChoices({
  stage,
  previewReplies,
  chooseEntry,
  chooseBrowseMood,
  chooseMatchFeeling,
  chooseMatchStyle,
  chooseMatchAvoid,
  rejectMatch,
  chooseRejectSignal,
  chooseSpecific,
  enterFirstChat,
  refineBrowse,
  activeProfile,
}: {
  stage: Stage;
  previewReplies: number;
  chooseEntry: (kind: PathKind | "browse") => void;
  chooseBrowseMood: (mood: string) => void;
  chooseMatchFeeling: (feeling: string) => void;
  chooseMatchStyle: (style: string) => void;
  chooseMatchAvoid: (avoid: string) => void;
  rejectMatch: () => void;
  chooseRejectSignal: (signal: string) => void;
  chooseSpecific: (field: keyof SpecificSignals, value: string) => void;
  enterFirstChat: (source: PathKind) => void;
  refineBrowse: (label: string, mood: string) => void;
  activeProfile: CompanionProfile;
}): Choice[] {
  switch (stage) {
    case "entry":
      return [
        {
          label: "show me who's here",
          description: "browse a few people",
          icon: Users,
          action: () => chooseEntry("browse"),
        },
        {
          label: "choose someone for me",
          description: "quick match",
          icon: Sparkles,
          action: () => chooseEntry("match"),
        },
        {
          label: "stay with you",
          description: "start with Mira",
          icon: Heart,
          action: () => chooseEntry("default"),
        },
        {
          label: "I'm waiting for someone else",
          description: "shape someone specific",
          icon: Clock3,
          action: () => chooseEntry("specific"),
        },
      ];
    case "browseMood":
      return ["calm", "playful", "intense", "strange", "show everyone"].map(
        (label) => ({
          label,
          action: () => chooseBrowseMood(label),
        }),
      );
    case "browseDeck":
    case "browseFull":
    case "companionPreview":
      return [
        {
          label: `say hi to ${activeProfile.name}`,
          icon: MessageCircle,
          action: () => enterFirstChat("browse"),
        },
        {
          label: "show me softer",
          action: () => refineBrowse("show me softer", "calm"),
        },
        {
          label: "show me bolder",
          action: () => refineBrowse("show me bolder", "intense"),
        },
        {
          label: "more like this",
          action: () => refineBrowse("more like this", activeProfile.tags[0]),
        },
      ];
    case "matchFeeling":
      return [
        "calmer",
        "wanted",
        "challenged",
        "entertained",
        "understood",
      ].map((label) => ({
        label,
        action: () => chooseMatchFeeling(label),
      }));
    case "matchStyle":
      return ["lead", "listen", "tease", "ask"].map((label) => ({
        label,
        action: () => chooseMatchStyle(label),
      }));
    case "matchAvoid":
      return [
        "pressure",
        "fixing me",
        "small talk",
        "too sweet",
        "nothing",
      ].map((label) => ({
        label,
        action: () => chooseMatchAvoid(label),
      }));
    case "matchReveal":
      return [
        {
          label: `say hi to ${activeProfile.name}`,
          icon: MessageCircle,
          action: () => enterFirstChat("match"),
        },
        { label: "show me another", icon: RotateCcw, action: rejectMatch },
        {
          label: "show similar",
          action: () => refineBrowse("show similar", activeProfile.tags[0]),
        },
        {
          label: "open everyone",
          icon: Compass,
          action: () => chooseBrowseMood("show everyone"),
        },
      ];
    case "matchReject":
      return ["look", "voice", "energy", "all of it", "show me choices"].map(
        (label) => ({
          label,
          action: () => chooseRejectSignal(label),
        }),
      );
    case "specificFeeling":
      return ["warmth", "nerve", "patience", "mischief", "honesty", "calm"].map(
        (label) => ({
          label,
          action: () => chooseSpecific("feeling", label),
        }),
      );
    case "specificRole":
      return [
        "companion",
        "mentor",
        "confidant",
        "challenger",
        "storyteller",
        "muse",
      ].map((label) => ({
        label,
        action: () => chooseSpecific("role", label),
      }));
    case "specificVoice":
      return voiceOptions.map((label) => ({
        label,
        action: () => chooseSpecific("voice", label),
      }));
    case "specificPace":
      return ["slow", "immediate", "teasing", "reflective"].map((label) => ({
        label,
        action: () => chooseSpecific("pace", label),
      }));
    case "specificBoundary":
      return [
        "do not push",
        "no fixing",
        "keep it fictional",
        "stay practical",
        "skip",
      ].map((label) => ({
        label,
        action: () => chooseSpecific("boundary", label),
      }));
    case "specificRitual":
      return [
        "after work",
        "late nights",
        "morning check-in",
        "when I ask",
      ].map((label) => ({
        label,
        action: () => chooseSpecific("ritual", label),
      }));
    case "specificAppearance":
      return [
        "warm apartment",
        "night window",
        "soft studio light",
        "sharp city energy",
        "quiet room",
      ].map((label) => ({
        label,
        action: () => chooseSpecific("appearance", label),
      }));
    case "specificName":
      return ["Noa", "Iris", "Mira", "let them choose"].map((label) => ({
        label,
        action: () =>
          chooseSpecific("name", label === "let them choose" ? "Noa" : label),
      }));
    case "specificPreview":
      return [
        {
          label: `say hi`,
          icon: MessageCircle,
          action: () => enterFirstChat("specific"),
        },
        {
          label: "make the room softer",
          action: () => chooseSpecific("appearance", "softer room"),
        },
        {
          label: "adjust voice",
          action: () => chooseSpecific("voice", voiceOptions[1]),
        },
      ];
    case "firstChat":
      if (previewReplies >= 1) {
        return [
          {
            label: "keep talking",
            icon: Heart,
            action: () => enterFirstChat("default"),
          },
        ];
      }
      return [
        "tell me about your day",
        "stay quiet with me",
        "ask something deeper",
      ].map((label) => ({
        label,
        action: () => enterFirstChat("default"),
      }));
    default:
      return [];
  }
}

function TopBar({
  activeProfile,
  path,
  onShowEveryone,
  canGoBack,
  onBack,
  onReset,
}: {
  activeProfile: CompanionProfile;
  path: PathKind;
  onShowEveryone: () => void;
  canGoBack: boolean;
  onBack: () => void;
  onReset: () => void;
}) {
  return (
    <header className="absolute top-5 right-5 z-30 flex items-start justify-end gap-4 lg:static lg:mb-0 lg:justify-between">
      <div className="hidden lg:block">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-card border border-white/15 bg-white/8 text-[15px] shadow-[0_16px_48px_rgb(0_0_0/0.35)]">
            h
          </span>
          <div>
            <p className="font-serif text-[18px] leading-none text-[#ffe5d8]">
              honey
            </p>
            <p className="mt-1 text-[11px] tracking-[0.18em] text-white/48 uppercase">
              session only
            </p>
          </div>
        </div>
        <div className="mt-7">
          <p className="font-serif text-[54px] leading-none text-[#ffe5d8]">
            {activeProfile.name}
          </p>
          <p className="mt-2 text-[15px] text-white/55">
            {companionSubtitle(path, activeProfile)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="grid h-9 w-9 place-items-center rounded-card border border-white/10 bg-white/7 text-white/65 transition hover:border-white/22 hover:text-white disabled:pointer-events-none disabled:opacity-35"
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="Go back"
        >
          <ArrowLeft size={15} aria-hidden />
        </button>
        <button
          className="hidden min-h-9 items-center gap-2 rounded-card border border-white/10 bg-white/7 px-3 text-[13px] text-white/70 transition hover:border-white/22 hover:text-white sm:inline-flex"
          type="button"
          onClick={onShowEveryone}
        >
          <Search size={15} aria-hidden />
          show everyone
        </button>
        <button
          className="grid h-9 w-9 place-items-center rounded-card border border-white/10 bg-white/7 text-white/65 transition hover:border-white/22 hover:text-white"
          type="button"
          onClick={onReset}
          aria-label="Start over"
        >
          <RotateCcw size={15} aria-hidden />
        </button>
      </div>
    </header>
  );
}

function companionSubtitle(path: PathKind, profile: CompanionProfile) {
  if (path === "specific") return "taking shape";
  if (profile.id === "mira") return "your default companion";
  return profile.role;
}

function ChatPanel({
  messages,
  activeProfile,
  stage,
  currentChoices,
  input,
  setInput,
  onSubmit,
  onFirstChatReply,
  inlineNotice,
}: {
  messages: Message[];
  activeProfile: CompanionProfile;
  stage: Stage;
  currentChoices: Choice[];
  input: string;
  setInput: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onFirstChatReply: (text: string) => void;
  inlineNotice: string;
}) {
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = messagesRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages.length, stage]);

  return (
    <section className="flex max-h-[86svh] flex-col overflow-hidden rounded-card border border-white/12 bg-[#110d13]/82 shadow-[0_24px_80px_rgb(0_0_0/0.48)] backdrop-blur-2xl lg:max-h-none lg:min-h-0 lg:flex-1 lg:border-white/8 lg:bg-transparent lg:shadow-none lg:backdrop-blur-none">
      <div
        ref={messagesRef}
        className="max-h-[24svh] min-h-0 space-y-3 overflow-y-auto px-4 pt-4 pb-2 sm:px-5 lg:max-h-none lg:flex-1 lg:px-0 lg:pt-0"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24 }}
            >
              <MessageRow message={message} activeProfile={activeProfile} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="px-4 pb-4 sm:px-5 lg:px-0 lg:pb-0">
        {inlineNotice ? (
          <p className="mb-3 rounded-card border border-white/10 bg-white/6 px-3 py-2 text-[13px] text-white/68">
            {inlineNotice}
          </p>
        ) : null}

        <div
          className={cn(
            "mb-4 grid max-h-[42svh] gap-2 overflow-y-auto pr-1 lg:max-h-none lg:overflow-visible lg:pr-0",
            stage === "specificVoice" ? "lg:grid-cols-1" : "sm:grid-cols-2",
          )}
        >
          {currentChoices.map((choice) => {
            const Icon = choice.icon;
            return (
              <button
                key={`${stage}-${choice.label}`}
                type="button"
                className="group flex min-h-12 items-center gap-3 rounded-card border border-white/12 bg-white/7 px-4 py-3 text-left text-[15px] leading-tight text-white/82 transition hover:border-[#ff9b92]/70 hover:bg-[#ff8f82]/12 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8f82]"
                onClick={
                  stage === "firstChat"
                    ? () => onFirstChatReply(choice.label)
                    : choice.action
                }
              >
                {Icon ? (
                  <Icon
                    size={18}
                    className="shrink-0 text-[#ff9b92]"
                    aria-hidden
                  />
                ) : (
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff9b92]"
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block">{choice.label}</span>
                  {choice.description ? (
                    <span className="mt-1 block text-[12.5px] text-white/45">
                      {choice.description}
                    </span>
                  ) : null}
                </span>
                <ArrowRight
                  size={15}
                  className="shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-[#ffb1aa]"
                  aria-hidden
                />
              </button>
            );
          })}
        </div>

        <form
          className="flex min-h-14 items-center gap-2 rounded-card border border-white/12 bg-black/18 px-2 transition focus-within:border-[#ff9b92]/70"
          onSubmit={onSubmit}
        >
          <label className="sr-only" htmlFor="funnel-reply">
            Type a reply
          </label>
          <input
            id="funnel-reply"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[16px] text-white outline-none placeholder:text-white/34"
            placeholder={replyPlaceholder(stage)}
          />
          <button
            type="submit"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-card bg-[#ff8f82] text-[#130b0f] shadow-[0_10px_28px_rgb(255_143_130/0.28)] transition hover:bg-[#ffb1aa] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-label="Send reply"
          >
            <ArrowUp size={18} aria-hidden />
          </button>
        </form>
        <div className="mt-3 flex items-center gap-2 text-[12px] text-white/42">
          <ShieldCheck size={14} aria-hidden />
          <span>Private preview. No account needed.</span>
        </div>
      </div>
    </section>
  );
}

function replyPlaceholder(stage: Stage) {
  if (stage.startsWith("specific")) return "Describe them...";
  if (stage === "firstChat") return "Type a message...";
  return "Type a reply...";
}

function MessageRow({
  message,
  activeProfile,
}: {
  message: Message;
  activeProfile: CompanionProfile;
}) {
  if (message.author === "system") {
    return (
      <div className="mx-auto max-w-[92%] rounded-card border border-white/10 bg-white/6 px-3 py-2 text-center text-[13px] leading-5 text-white/66">
        {message.text}
      </div>
    );
  }

  const isUser = message.author === "user";

  return (
    <div className={cn("flex gap-3", isUser && "justify-end")}>
      {!isUser ? (
        <Image
          src={portraitThumbs[activeProfile.state]}
          width={34}
          height={34}
          alt=""
          className="mt-1 h-8 w-8 shrink-0 rounded-full border border-white/15 object-cover"
        />
      ) : null}
      <div className={cn("max-w-[82%]", isUser && "text-right")}>
        <div className="mb-1 flex items-center gap-2 text-[12px] text-white/44">
          <span>{isUser ? "You" : message.author}</span>
          <span>9:41 PM</span>
        </div>
        <div
          className={cn(
            "rounded-card border px-4 py-3 text-[15px] leading-6 shadow-[0_12px_36px_rgb(0_0_0/0.2)]",
            isUser
              ? "border-[#ffb1aa]/28 bg-[#ff8f82]/18 text-[#ffe3dc]"
              : "border-white/10 bg-white/8 text-white/86",
          )}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}

function ContextualSurface({
  stage,
  path,
  activeProfile,
  browseMood,
  browseQuery,
  setBrowseQuery,
  browseResults,
  hasExactBrowseResults,
  signals,
  matchSignals,
  specificSignals,
  onOpenProfile,
  onSayHi,
  onRefineBrowse,
  onRejectMatch,
  onSpecificChoice,
}: {
  stage: Stage;
  path: PathKind;
  activeProfile: CompanionProfile;
  browseMood: string;
  browseQuery: string;
  setBrowseQuery: (value: string) => void;
  browseResults: CompanionProfile[];
  hasExactBrowseResults: boolean;
  signals: string[];
  matchSignals: MatchSignals;
  specificSignals: SpecificSignals;
  onOpenProfile: (profileId: string) => void;
  onSayHi: () => void;
  onRefineBrowse: (label: string, mood: string) => void;
  onRejectMatch: () => void;
  onSpecificChoice: (field: keyof SpecificSignals, value: string) => void;
}) {
  if (
    ![
      "browseDeck",
      "browseFull",
      "companionPreview",
      "matchReveal",
      "specificPreview",
      "firstChat",
    ].includes(stage)
  ) {
    return null;
  }

  return (
    <aside className="mt-4 hidden min-h-0 rounded-card border border-white/10 bg-white/6 p-4 lg:block">
      {stage === "browseDeck" || stage === "browseFull" ? (
        <DiscoveryPanel
          browseMood={browseMood}
          browseQuery={browseQuery}
          setBrowseQuery={setBrowseQuery}
          results={browseResults}
          hasExactResults={hasExactBrowseResults}
          onOpenProfile={onOpenProfile}
          onRefineBrowse={onRefineBrowse}
        />
      ) : null}

      {stage === "companionPreview" ? (
        <ProfilePreview
          profile={activeProfile}
          path={path}
          signals={signals}
          onSayHi={onSayHi}
          onRefineBrowse={onRefineBrowse}
        />
      ) : null}

      {stage === "matchReveal" ? (
        <MatchReveal
          profile={activeProfile}
          signals={matchSignals}
          onSayHi={onSayHi}
          onReject={onRejectMatch}
        />
      ) : null}

      {stage === "specificPreview" ? (
        <SpecificPreview
          signals={specificSignals}
          onSayHi={onSayHi}
          onSpecificChoice={onSpecificChoice}
        />
      ) : null}

      {stage === "firstChat" ? (
        <PreviewTrail path={path} profile={activeProfile} signals={signals} />
      ) : null}
    </aside>
  );
}

function DiscoveryPanel({
  browseMood,
  browseQuery,
  setBrowseQuery,
  results,
  hasExactResults,
  onOpenProfile,
  onRefineBrowse,
}: {
  browseMood: string;
  browseQuery: string;
  setBrowseQuery: (value: string) => void;
  results: CompanionProfile[];
  hasExactResults: boolean;
  onOpenProfile: (profileId: string) => void;
  onRefineBrowse: (label: string, mood: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-white/44 uppercase">
            discovery
          </p>
          <p className="mt-1 text-[15px] text-white/72">
            {hasExactResults
              ? "I think you might like these."
              : "I found a few that feel close."}
          </p>
        </div>
        <span className="rounded-card border border-white/10 bg-white/7 px-2.5 py-1 text-[12px] text-white/56">
          {browseMood}
        </span>
      </div>

      <label className="mb-3 flex min-h-11 items-center gap-2 rounded-card border border-white/10 bg-black/16 px-3 focus-within:border-[#ff9b92]/65">
        <Search size={15} className="text-white/45" aria-hidden />
        <span className="sr-only">Search companions</span>
        <input
          value={browseQuery}
          onChange={(event) => setBrowseQuery(event.target.value)}
          placeholder="Search mood, role, name"
          className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-white/35"
        />
        {browseQuery ? (
          <button
            type="button"
            className="grid h-7 w-7 place-items-center rounded-card text-white/45 hover:bg-white/8 hover:text-white"
            onClick={() => setBrowseQuery("")}
            aria-label="Clear search"
          >
            <X size={14} aria-hidden />
          </button>
        ) : null}
      </label>

      <div className="grid gap-2">
        {results.slice(0, 4).map((profile) => (
          <button
            key={profile.id}
            type="button"
            className="group grid grid-cols-[58px_1fr_auto] items-center gap-3 rounded-card border border-white/10 bg-black/12 p-2 text-left transition hover:border-[#ff9b92]/60 hover:bg-[#ff8f82]/10"
            onClick={() => onOpenProfile(profile.id)}
          >
            <Image
              src={portraitThumbs[profile.state]}
              width={58}
              height={58}
              alt=""
              className="h-[58px] w-[58px] rounded-card object-cover"
            />
            <span className="min-w-0">
              <span className="block font-serif text-[18px] text-[#ffe5d8]">
                {profile.name}
              </span>
              <span className="line-clamp-1 text-[13px] text-white/48">
                {profile.tags.join(" · ")}
              </span>
            </span>
            <ArrowRight
              size={15}
              className="text-white/32 transition group-hover:translate-x-0.5 group-hover:text-[#ffb1aa]"
              aria-hidden
            />
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {browseRefinements.map(({ label, mood }) => (
          <button
            key={label}
            type="button"
            className="rounded-card border border-white/10 bg-white/6 px-3 py-2 text-[13px] text-white/64 transition hover:border-white/24 hover:text-white"
            onClick={() => onRefineBrowse(label, mood)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfilePreview({
  profile,
  path,
  signals,
  onSayHi,
  onRefineBrowse,
}: {
  profile: CompanionProfile;
  path: PathKind;
  signals: string[];
  onSayHi: () => void;
  onRefineBrowse: (label: string, mood: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.16em] text-white/44 uppercase">
        preview
      </p>
      <div className="mt-3 grid grid-cols-[88px_1fr] gap-4">
        <Image
          src={portraitThumbs[profile.state]}
          width={88}
          height={88}
          alt=""
          className="h-[88px] w-[88px] rounded-card object-cover"
        />
        <div>
          <p className="font-serif text-[28px] leading-none text-[#ffe5d8]">
            {profile.name}
          </p>
          <p className="mt-2 text-[13.5px] leading-5 text-white/58">
            {profile.premise}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {profile.samples.slice(0, 3).map((sample) => (
          <p
            key={sample}
            className="rounded-card border border-white/10 bg-black/12 px-3 py-2 text-[13.5px] leading-5 text-white/68"
          >
            {sample}
          </p>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-[11px] tracking-[0.16em] text-white/40 uppercase">
          why this one
        </p>
        <p className="mt-1 text-[13.5px] leading-5 text-white/58">
          {path === "browse"
            ? `You leaned toward ${signals.at(-1) ?? "a quieter start"}, and ${profile.name} can start there without overexplaining it.`
            : `${profile.name} is the closest available fit.`}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="min-h-10 flex-1 rounded-card bg-[#ff8f82] px-3 text-[14px] font-semibold text-[#140b0f]"
          onClick={onSayHi}
        >
          say hi to {profile.name}
        </button>
        <button
          type="button"
          className="min-h-10 rounded-card border border-white/12 px-3 text-[14px] text-white/68"
          onClick={() => onRefineBrowse("show me another", profile.tags[0])}
        >
          another
        </button>
      </div>
    </div>
  );
}

function MatchReveal({
  profile,
  signals,
  onSayHi,
  onReject,
}: {
  profile: CompanionProfile;
  signals: MatchSignals;
  onSayHi: () => void;
  onReject: () => void;
}) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.16em] text-white/44 uppercase">
        match reveal
      </p>
      <div className="mt-3 flex items-center gap-4">
        <Image
          src={portraitThumbs[profile.state]}
          width={84}
          height={84}
          alt=""
          className="h-[84px] w-[84px] rounded-card object-cover"
        />
        <div>
          <p className="font-serif text-[32px] leading-none text-[#ffe5d8]">
            {profile.name}
          </p>
          <p className="mt-2 text-[14px] text-white/58">
            {profile.role} · {profile.tags.slice(0, 2).join(" · ")}
          </p>
        </div>
      </div>

      <p className="mt-4 rounded-card border border-[#ffb1aa]/24 bg-[#ff8f82]/10 px-3 py-3 text-[14px] leading-5 text-[#ffe0d8]">
        I picked {profile.name} because you asked for{" "}
        {signals.feeling ?? "something clear"}, {signals.style ?? "presence"},
        and a first conversation that avoids {signals.avoid ?? "pressure"}.
      </p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="min-h-10 flex-1 rounded-card bg-[#ff8f82] px-3 text-[14px] font-semibold text-[#140b0f]"
          onClick={onSayHi}
        >
          say hi
        </button>
        <button
          type="button"
          className="min-h-10 rounded-card border border-white/12 px-3 text-[14px] text-white/68"
          onClick={onReject}
        >
          show another
        </button>
      </div>
    </div>
  );
}

function SpecificPreview({
  signals,
  onSayHi,
  onSpecificChoice,
}: {
  signals: SpecificSignals;
  onSayHi: () => void;
  onSpecificChoice: (field: keyof SpecificSignals, value: string) => void;
}) {
  const name = signals.name ?? "Noa";
  const shapedBy = [
    signals.feeling ?? "warmth",
    signals.role ?? "companion",
    signals.voice ? "chosen voice" : "soft voice",
    signals.pace ?? "slow pace",
    signals.boundary ?? "clear boundary",
    signals.appearance ?? "warm room",
  ];

  return (
    <div>
      <p className="text-[11px] tracking-[0.16em] text-white/44 uppercase">
        ready to meet
      </p>
      <div className="mt-3 flex items-center gap-4">
        <Image
          src={portraitThumbs.final}
          width={84}
          height={84}
          alt=""
          className="h-[84px] w-[84px] rounded-card object-cover"
        />
        <div>
          <p className="font-serif text-[32px] leading-none text-[#ffe5d8]">
            {name}
          </p>
          <p className="mt-2 text-[14px] text-white/58">
            {signals.role ?? "companion"} · {signals.appearance ?? "quiet room"}
          </p>
        </div>
      </div>

      <p className="mt-4 rounded-card border border-white/10 bg-black/12 px-3 py-3 text-[14px] leading-5 text-white/68">
        You asked me to be {signals.feeling ?? "warm"},{" "}
        {signals.pace ?? "unrushed"}, and careful about{" "}
        {signals.boundary ?? "what matters"}. So I will start simple: what part
        of today are you still carrying?
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {shapedBy.map((signal) => (
          <span
            key={signal}
            className="rounded-card border border-white/10 bg-white/6 px-2.5 py-1.5 text-[12px] text-white/56"
          >
            {signal}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="min-h-10 flex-1 rounded-card bg-[#ff8f82] px-3 text-[14px] font-semibold text-[#140b0f]"
          onClick={onSayHi}
        >
          say hi
        </button>
        <button
          type="button"
          className="min-h-10 rounded-card border border-white/12 px-3 text-[14px] text-white/68"
          onClick={() => onSpecificChoice("appearance", "softer room")}
        >
          softer
        </button>
      </div>
    </div>
  );
}

function PreviewTrail({
  path,
  profile,
  signals,
}: {
  path: PathKind;
  profile: CompanionProfile;
  signals: string[];
}) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.16em] text-white/44 uppercase">
        first conversation
      </p>
      <p className="mt-2 font-serif text-[26px] leading-tight text-[#ffe5d8]">
        {profile.name} is here.
      </p>
      <p className="mt-2 text-[14px] leading-5 text-white/56">
        The preview has started. The continuation gate only appears when you try
        to go past this first exchange.
      </p>
      <div className="mt-4 grid gap-2">
        {[
          path === "match"
            ? "matched from your answers"
            : "chosen in conversation",
          signals.at(-1) ?? "easy first pace",
          "portrait held beside the chat",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 rounded-card border border-white/10 bg-black/12 px-3 py-2 text-[13.5px] text-white/62"
          >
            <Check size={14} className="text-[#ffb1aa]" aria-hidden />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function PortraitStage({
  activeProfile,
  portraitState,
  imageFailed,
  onImageFailed,
  onPickState,
}: {
  activeProfile: CompanionProfile;
  portraitState: PortraitState;
  imageFailed: boolean;
  onImageFailed: () => void;
  onPickState: (state: PortraitState) => void;
}) {
  const stateLabels: Array<{ state: PortraitState; label: string }> = [
    { state: "warm", label: "warmer" },
    { state: "curious", label: "curious" },
    { state: "closer", label: "closer" },
    { state: "final", label: "chat" },
  ];

  return (
    <section className="absolute inset-0 lg:relative lg:order-last lg:h-screen">
      <div className="absolute inset-0 bg-[#08070b]" />
      <AnimatePresence mode="wait">
        <motion.div
          key={imageFailed ? "fallback" : portraitState}
          className="absolute inset-0"
          initial={{ opacity: 0.35, scale: 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.55, ease: [0.2, 0.65, 0.3, 1] }}
        >
          {imageFailed ? (
            <div className="h-full w-full bg-[linear-gradient(135deg,#211018,#0a1417_48%,#2a2014)]" />
          ) : (
            <>
              <Image
                src={portraitImages[portraitState]}
                alt={`${activeProfile.name} companion portrait`}
                fill
                priority
                sizes="100vw"
                className="object-cover object-[50%_34%] lg:hidden"
                onError={onImageFailed}
              />
              <Image
                src={portraitDesktopImages[portraitState]}
                alt={`${activeProfile.name} companion portrait`}
                fill
                priority
                sizes="55vw"
                className="hidden object-cover object-[44%_50%] lg:block"
                onError={onImageFailed}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.18),rgb(0_0_0/0.08)_36%,rgb(0_0_0/0.76)_100%)] lg:bg-[linear-gradient(90deg,rgb(8_7_11/0.28),rgb(8_7_11/0.04)_38%,rgb(8_7_11/0.2)),linear-gradient(180deg,rgb(0_0_0/0.08),rgb(0_0_0/0.32))]" />

      <div className="absolute top-5 left-5 z-10 lg:hidden">
        <p className="font-serif text-[46px] leading-none text-[#ffe5d8] drop-shadow-lg">
          {activeProfile.name}
        </p>
        <div className="mt-2 h-1 w-9 rounded-full bg-[#ff8f82]" />
      </div>

      <div className="absolute right-4 top-24 z-10 hidden w-[104px] flex-col gap-3 sm:flex lg:right-8 lg:top-1/2 lg:-translate-y-1/2">
        <p className="text-center text-[11px] tracking-[0.16em] text-white/68 uppercase">
          mood
        </p>
        {stateLabels.map(({ state, label }) => (
          <button
            key={state}
            type="button"
            className={cn(
              "relative overflow-hidden rounded-card border bg-black/18 text-left shadow-[0_16px_38px_rgb(0_0_0/0.28)] transition hover:border-[#ffb1aa]",
              portraitState === state ? "border-[#ffb1aa]" : "border-white/18",
            )}
            onClick={() => onPickState(state)}
          >
            <Image
              src={portraitThumbs[state]}
              alt=""
              width={104}
              height={104}
              className="h-[104px] w-full object-cover lg:hidden"
            />
            <Image
              src={portraitDesktopThumbs[state]}
              alt=""
              width={104}
              height={104}
              className="hidden h-[104px] w-full object-cover lg:block"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/74 to-transparent px-2 pb-2 pt-5 text-[13px] text-white/82">
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function PaywallOverlay({
  state,
  activeProfile,
  onContinue,
  onRestore,
  onDismiss,
  onTrySomeoneElse,
}: {
  state: "closed" | "open" | "success" | "error";
  activeProfile: CompanionProfile;
  onContinue: () => void;
  onRestore: () => void;
  onDismiss: () => void;
  onTrySomeoneElse: () => void;
}) {
  if (state === "closed") return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/58 px-4 py-5 backdrop-blur-sm sm:place-items-center">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.24 }}
        className="w-full max-w-[560px] rounded-card border border-[#ffb1aa]/30 bg-[#1b1316]/96 p-5 shadow-[0_28px_90px_rgb(0_0_0/0.62)] sm:p-7"
      >
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-[#ffb1aa]/45 bg-[#ff8f82]/14 text-[#ffb1aa]">
          <Heart size={22} aria-hidden />
        </div>

        {state === "success" ? (
          <>
            <h2 className="text-center font-serif text-[36px] leading-tight text-[#ffe5d8]">
              You&apos;re in.
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-center text-[15px] leading-6 text-white/62">
              Keep going with {activeProfile.name}. The preview is open.
            </p>
            <button
              type="button"
              className="mt-6 min-h-12 w-full rounded-card bg-[#ff8f82] px-4 text-[16px] font-semibold text-[#140b0f]"
              onClick={onDismiss}
            >
              keep talking
            </button>
          </>
        ) : (
          <>
            <h2 className="text-center font-serif text-[36px] leading-tight text-[#ffe5d8]">
              Keep talking with {activeProfile.name}?
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-center text-[15px] leading-6 text-white/62">
              Your preview is ready to continue.
            </p>
            {state === "error" ? (
              <p className="mt-4 rounded-card border border-white/10 bg-white/7 px-3 py-2 text-center text-[14px] text-white/66">
                That did not go through. Nothing changed.
              </p>
            ) : null}
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                className="min-h-13 rounded-card bg-[#ff8f82] px-4 text-[17px] font-semibold text-[#140b0f] shadow-[0_18px_44px_rgb(255_143_130/0.26)]"
                onClick={onContinue}
              >
                continue
              </button>
              <button
                type="button"
                className="min-h-12 rounded-card border border-white/12 bg-white/6 px-4 text-[16px] text-white/74"
                onClick={onDismiss}
              >
                not now
              </button>
              <button
                type="button"
                className="min-h-12 rounded-card border border-white/12 bg-white/6 px-4 text-[16px] text-white/74"
                onClick={onTrySomeoneElse}
              >
                try someone else
              </button>
              <button
                type="button"
                className="min-h-10 rounded-card px-4 text-[13px] text-white/44 transition hover:bg-white/6 hover:text-white/70"
                onClick={onRestore}
              >
                restore access
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
