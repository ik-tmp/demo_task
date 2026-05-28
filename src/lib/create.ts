import type { Companion } from "@/types/companion";
import { createDialogue } from "@/data/create-dialogue";

/**
 * Create-funnel logic. The visual generation moment (in-progress vignette
 * evolution + 6 pre-rendered template outputs) is asset-gated, so the
 * reveal currently routes to a best-fit launch companion. When Create
 * assets ship, replace `CREATE_REVEAL_FALLBACK` paths only.
 */
export const CREATE_REVEAL_FALLBACK = false;

/** Four-stage progression assets driving the in-progress vignette. */
export const IN_PROGRESS_STAGES = [
  "/companions/create/in-progress-1.png",
  "/companions/create/in-progress-2.png",
  "/companions/create/in-progress-3.png",
  "/companions/create/in-progress-4.png",
] as const;

/** Net-new template reveals — used when the user's combo lands outside the
 *  launch cast's natural fit. The remaining three templates reuse Noa
 *  (warmth+warm-apartment), Iris (patience+mentor), and Sasha (calm+older-soul).
 */
type Template = {
  id: string;
  name: string;
  asset: string;
  premise: string;
};

const dedicatedTemplates: Template[] = [
  {
    id: "vera",
    name: "Vera",
    asset: "/companions/create/template-2-vera.png",
    premise: "Warm with an edge. Vera asks the question you were avoiding.",
  },
  {
    id: "playful",
    name: "Juno",
    asset: "/companions/create/template-4-playful.png",
    premise: "Playful and direct. Juno tells the joke, then asks what's really going on.",
  },
  {
    id: "gentle",
    name: "Hana",
    asset: "/companions/create/template-5-gentle.png",
    premise: "Calm and patient. Hana gives you time to explain.",
  },
];

export type RevealAsset = {
  src: string;
  /** When set, the reveal shows a fully-rendered new companion (not a launch one). */
  syntheticName?: string;
  syntheticPremise?: string;
};

/**
 * Picks a reveal asset given the answers and a chosen name.
 * If the user named the companion something the templates anticipate, we
 * use the dedicated template. Otherwise we route to the closest launch
 * companion's final-chat (reuse — template-1/3/6 cover this case).
 */
export function pickRevealAsset(
  fallbackCompanion: Companion,
  answers: CreateAnswers,
  chosenName: string,
): RevealAsset {
  const lowerName = chosenName.trim().toLowerCase();

  // 1) Explicit named template match.
  const named = dedicatedTemplates.find((t) => t.name.toLowerCase() === lowerName);
  if (named) {
    return {
      src: named.asset,
      syntheticName: named.name,
      syntheticPremise: named.premise,
    };
  }

  // 2) Pattern match by answer combination.
  const f = answers.feelings ?? [];
  const looks = answers.looks ?? [];
  if (f.includes("warmth") && f.includes("nerve")) {
    const t = dedicatedTemplates[0];
    return { src: t.asset, syntheticName: chosenName || t.name, syntheticPremise: t.premise };
  }
  if (f.includes("mischief") && looks.includes("warm-apartment")) {
    const t = dedicatedTemplates[1];
    return { src: t.asset, syntheticName: chosenName || t.name, syntheticPremise: t.premise };
  }
  if (f.includes("calm") && f.includes("patience")) {
    const t = dedicatedTemplates[2];
    return { src: t.asset, syntheticName: chosenName || t.name, syntheticPremise: t.premise };
  }

  // 3) Fallback: reuse the closest launch companion's finalChat (templates #1/#3/#6).
  return { src: fallbackCompanion.assets.finalChat };
}

export type FeelingId =
  | "warmth"
  | "nerve"
  | "patience"
  | "mischief"
  | "honesty"
  | "calm";
export type RoleId =
  | "companion"
  | "muse"
  | "mentor"
  | "confidant"
  | "challenger"
  | "storyteller";
export type VoiceId = "warm" | "dry" | "curious";
export type LookId =
  | "soft-studio-light"
  | "night-window"
  | "sharp-city-energy"
  | "warm-apartment"
  | "older-soul"
  | "classic-beauty"
  | "unusual-but-grounded";
export type BoundaryId =
  | "slow-trust"
  | "not-flirty"
  | "gentle-push"
  | "no-roleplay"
  | "no-fake-history";

export type CreateAnswers = {
  feelings?: FeelingId[]; // multi-select up to 2
  role?: RoleId;
  voice?: VoiceId;
  looks?: LookId[]; // multi-select up to 2
  name?: string;
  pace?: "quick" | "unhurried";
  boundaries?: BoundaryId | string;
  context?: string;
};

const feelingScores: Record<FeelingId, Record<string, number>> = {
  warmth:   { iris: 2, noa: 3, mira: 1, sasha: 2 },
  nerve:    { iris: 1, noa: 1, mira: 3, sasha: 1 },
  patience: { iris: 3, noa: 1, mira: 2, sasha: 3 },
  mischief: { iris: 1, noa: 3, mira: 1, sasha: 0 },
  honesty:  { iris: 2, noa: 1, mira: 3, sasha: 3 },
  calm:     { iris: 3, noa: 1, mira: 2, sasha: 3 },
};
const roleScores: Record<RoleId, Record<string, number>> = {
  companion:  { iris: 2, noa: 2, mira: 1, sasha: 2 },
  muse:       { iris: 1, noa: 2, mira: 2, sasha: 1 },
  mentor:     { iris: 3, noa: 0, mira: 1, sasha: 3 },
  confidant:  { iris: 1, noa: 3, mira: 1, sasha: 3 },
  challenger: { iris: 0, noa: 1, mira: 3, sasha: 0 },
  storyteller: { iris: 1, noa: 2, mira: 2, sasha: 2 },
};
const voiceScores: Record<VoiceId, Record<string, number>> = {
  warm:    { iris: 3, noa: 1, mira: 1, sasha: 2 },
  dry:     { iris: 0, noa: 3, mira: 1, sasha: 1 },
  curious: { iris: 1, noa: 0, mira: 2, sasha: 3 },
};
const lookScores: Record<LookId, Record<string, number>> = {
  "soft-studio-light": { iris: 2, noa: 1, mira: 0, sasha: 3 },
  "night-window":      { iris: 1, noa: 1, mira: 3, sasha: 2 },
  "sharp-city-energy": { iris: 0, noa: 1, mira: 3, sasha: 0 },
  "warm-apartment":    { iris: 1, noa: 3, mira: 0, sasha: 1 },
  "older-soul":        { iris: 2, noa: 0, mira: 2, sasha: 3 },
  "classic-beauty":    { iris: 2, noa: 2, mira: 1, sasha: 2 },
  "unusual-but-grounded": { iris: 0, noa: 1, mira: 2, sasha: 2 },
};

export function pickFallbackCompanion(
  companions: Companion[],
  answers: CreateAnswers,
): Companion {
  const totals = new Map<string, number>();
  const add = (c: string, n: number) => totals.set(c, (totals.get(c) ?? 0) + n);
  if (answers.feelings) for (const f of answers.feelings) {
    for (const [k, v] of Object.entries(feelingScores[f])) add(k, v);
  }
  if (answers.role) {
    for (const [k, v] of Object.entries(roleScores[answers.role])) add(k, v);
  }
  if (answers.voice) {
    for (const [k, v] of Object.entries(voiceScores[answers.voice])) add(k, v);
  }
  if (answers.looks) for (const l of answers.looks) {
    for (const [k, v] of Object.entries(lookScores[l])) add(k, v);
  }
  let best: { c: Companion; score: number } | null = null;
  for (const c of companions) {
    const s = totals.get(c.id) ?? 0;
    if (!best || s > best.score) best = { c, score: s };
  }
  return best!.c;
}

const feelingNamesPool: Record<FeelingId, string[]> = {
  warmth:   ["Noa", "Sasha", "Mira"],
  nerve:    ["Iris", "Vera", "Quinn"],
  patience: ["Iris", "Hana", "Anna"],
  mischief: ["Noa", "Juno", "Lex"],
  honesty:  ["Sol", "Iris", "June"],
  calm:     ["Iris", "Hana", "Rae"],
};

export function suggestNames(answers: CreateAnswers): string[] {
  const seed = answers.feelings?.[0] ?? "calm";
  return feelingNamesPool[seed];
}

const feelingPhrase: Record<FeelingId, string> = {
  warmth:   "warm",
  nerve:    "sharp",
  patience: "patient",
  mischief: "playful",
  honesty:  "honest",
  calm:     "calm",
};

export function composePremise(answers: CreateAnswers, name: string): string {
  const f = answers.feelings?.[0];
  const role = answers.role;
  if (f && role) {
    return `${capitalize(feelingPhrase[f])} ${role}. ${name} listens before she gives advice.`;
  }
  if (f) return `${capitalize(feelingPhrase[f])}. ${name} keeps things grounded.`;
  return `${name} is here when you need her.`;
}

export function composeFeelingClause(answers: CreateAnswers): string {
  const f = answers.feelings ?? [];
  if (f.length === 0) return "warm";
  if (f.length === 1) return feelingPhrase[f[0]];
  return `${feelingPhrase[f[0]]} and ${feelingPhrase[f[1]]}`;
}

export function composeShapedItems(answers: CreateAnswers): string[] {
  const items: string[] = [];
  const copy = createDialogue.shapedLine;
  if (answers.feelings) items.push(copy.feelings(composeFeelingClause(answers)));
  if (answers.role) items.push(copy.role(answers.role));
  if (answers.voice) items.push(copy.voice(answers.voice));
  if (answers.looks) {
    items.push(copy.looks(answers.looks.map((l) => l.replace(/-/g, " ")).join(" + ")));
  }
  if (answers.pace) items.push(copy.pace(answers.pace));
  if (answers.boundaries) {
    const boundary = String(answers.boundaries);
    const boundaryLabel =
      createDialogue.choices.boundaries.find((c) => c.id === boundary)?.label ??
      boundary.replace(/-/g, " ");
    items.push(copy.boundaries(boundaryLabel));
  }
  if (answers.context) items.push(copy.context(truncate(answers.context, 60)));
  return items;
}

export function reactionForCreate(axis: string, id: string): string | null {
  const reactions = createDialogue.reactions as Record<string, Record<string, string>>;
  return reactions[axis]?.[id] ?? null;
}

export function isConflicting(answers: CreateAnswers): boolean {
  // mischief + patience → pace question
  const f = answers.feelings ?? [];
  return f.includes("mischief") && f.includes("patience");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : `${s.slice(0, n - 1)}...`;
}

// Free-text skip parser — looks for role/voice/boundary cues so the
// funnel can jump forward and back-fill pills retroactively (§8).
export function parseFreeText(text: string): Partial<CreateAnswers> {
  const t = text.toLowerCase();
  const out: Partial<CreateAnswers> = {};
  if (/\bmentor\b/.test(t)) out.role = "mentor";
  else if (/\bmuse\b/.test(t)) out.role = "muse";
  else if (/\bconfidant\b/.test(t)) out.role = "confidant";
  else if (/\bchallenger\b/.test(t)) out.role = "challenger";
  else if (/\bcompanion\b/.test(t)) out.role = "companion";
  else if (/\bstoryteller\b/.test(t)) out.role = "storyteller";

  if (/\bdry\b/.test(t)) out.voice = "dry";
  else if (/\bwarm\b/.test(t)) out.voice = "warm";
  else if (/\bcurious\b/.test(t)) out.voice = "curious";

  if (/slow trust|earn trust|take it slow/.test(t)) out.boundaries = "slow-trust";
  if (/doesn'?t flirt|no flirt|not flirty|not flirt/.test(t)) out.boundaries = "not-flirty";
  if (/gentle push|push me gently|challenge gently/.test(t)) out.boundaries = "gentle-push";
  if (/no roleplay|doesn'?t roleplay|not roleplay/.test(t)) out.boundaries = "no-roleplay";
  if (/no fake history|no shared history|don'?t pretend we know/.test(t)) out.boundaries = "no-fake-history";

  if (/\bwarmth\b|warmer/.test(t)) out.feelings = ["warmth"];
  else if (/\bcalm\b|calmer/.test(t)) out.feelings = ["calm"];
  else if (/\bnerve\b|sharper/.test(t)) out.feelings = ["nerve"];
  else if (/\bpatience\b|patient/.test(t)) out.feelings = ["patience"];

  return out;
}
