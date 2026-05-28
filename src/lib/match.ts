import { matchDialogue } from "@/data/match-dialogue";
import type { Companion } from "@/types/companion";

export type MatchAxis = "feeling" | "role" | "texture" | "avoid" | "familiarity";

export type FeelingId = "calmer" | "wanted" | "challenged" | "entertained" | "understood";
export type RoleId = "lead" | "listen" | "tease" | "ask" | "i-dont-know";
export type TextureId = "quiet-close" | "quick-spark" | "honest-mirror" | "slow-burn";
export type AvoidId =
  | "not-fix"
  | "not-push"
  | "not-flirt"
  | "not-perform"
  | "nothing-specific";
export type FamiliarityId = "familiar" | "surprising" | "dangerous";

export type MatchAnswers = {
  feeling?: FeelingId;
  role?: RoleId;
  texture?: TextureId;
  avoid?: AvoidId[];
  familiarity?: FamiliarityId;
  freeText?: Partial<Record<MatchAxis, string>>;
};

type ScoreTable = Record<string, Record<string, number>>;

const feelingScores: ScoreTable = {
  calmer:      { iris: 3, noa: 1, mira: 2, sasha: 3 },
  wanted:      { iris: 1, noa: 3, mira: 2, sasha: 1 },
  challenged:  { iris: 1, noa: 2, mira: 3, sasha: 2 },
  entertained: { iris: 1, noa: 3, mira: 2, sasha: 1 },
  understood:  { iris: 3, noa: 1, mira: 2, sasha: 3 },
};

const roleScores: ScoreTable = {
  lead:           { iris: 1, noa: 2, mira: 3, sasha: 1 },
  listen:         { iris: 3, noa: 1, mira: 2, sasha: 3 },
  tease:          { iris: 1, noa: 3, mira: 2, sasha: 0 },
  ask:            { iris: 3, noa: 1, mira: 2, sasha: 3 },
  "i-dont-know":  { iris: 2, noa: 2, mira: 2, sasha: 2 },
};

const textureScores: ScoreTable = {
  "quiet-close":   { iris: 3, noa: 1, mira: 2, sasha: 3 },
  "quick-spark":   { iris: 1, noa: 3, mira: 2, sasha: 1 },
  "honest-mirror": { iris: 2, noa: 1, mira: 3, sasha: 3 },
  "slow-burn":     { iris: 3, noa: 1, mira: 2, sasha: 3 },
};

const avoidScores: ScoreTable = {
  "not-fix":          { iris: 3, noa: 1, mira: 2, sasha: 3 },
  "not-push":         { iris: 3, noa: 1, mira: 2, sasha: 3 },
  "not-flirt":        { iris: 3, noa: -1, mira: 2, sasha: 3 },
  "not-perform":      { iris: 2, noa: 1, mira: 3, sasha: 3 },
  "nothing-specific": { iris: 1, noa: 1, mira: 1, sasha: 1 },
};

const familiarityScores: ScoreTable = {
  familiar:   { iris: 3, noa: 1, mira: 2, sasha: 3 },
  surprising: { iris: 1, noa: 3, mira: 2, sasha: 1 },
  dangerous:  { iris: 1, noa: 1, mira: 3, sasha: 1 },
};

export function scoreCompanions(
  companions: Companion[],
  answers: MatchAnswers,
): Array<{ companion: Companion; score: number }> {
  return companions.map((c) => {
    let s = 0;
    if (answers.feeling) s += feelingScores[answers.feeling]?.[c.id] ?? 0;
    if (answers.role) s += (roleScores[answers.role]?.[c.id] ?? 0) * 0.9;
    if (answers.texture) s += (textureScores[answers.texture]?.[c.id] ?? 0) * 0.7;
    if (answers.avoid?.length) {
      for (const a of answers.avoid) s += (avoidScores[a]?.[c.id] ?? 0) * 0.8;
    }
    if (answers.familiarity)
      s += (familiarityScores[answers.familiarity]?.[c.id] ?? 0) * 0.6;
    return { companion: c, score: s };
  });
}

export function pickMatch(
  companions: Companion[],
  answers: MatchAnswers,
  excludeIds: string[] = [],
): Companion {
  const pool = companions.filter((c) => !excludeIds.includes(c.id));
  if (pool.length === 0) return companions[0]; // safety
  const scored = scoreCompanions(pool, answers);
  scored.sort((a, b) => b.score - a.score);
  return scored[0].companion;
}

/**
 * Returns true if the top two candidates are too close to call —
 * triggers the dynamic Q4 familiarity question per DIRECTION-B §7.
 */
export function isAmbiguous(
  companions: Companion[],
  answers: MatchAnswers,
): boolean {
  const scored = scoreCompanions(companions, answers).sort(
    (a, b) => b.score - a.score,
  );
  if (scored.length < 2) return false;
  return Math.abs(scored[0].score - scored[1].score) < 1.0;
}

// ---- Reveal copy composition --------------------------------------------

export function composeRevealLines(
  companion: Companion,
  answers: MatchAnswers,
): [string, string, string] {
  const copy = matchDialogue.reveal;
  const freeText = firstFreeText(answers);
  const feel = freeText
    ? `You said "${truncate(freeText, 54)}." I kept that in the match.`
    : answers.feeling
      ? `Looking for ${copy.feelingPhrase[answers.feeling]}. ${copy.feelingCounterweight[answers.feeling]}`
      : "Looking for someone you can settle into.";
  const role = answers.role
    ? copy.rolePhrase[answers.role]
    : "Reads the room before she answers.";
  const texture = answers.texture
    ? copy.texturePhrase[answers.texture]
    : "Lets the first exchange find its own temperature.";
  const arrival = `I think you should meet ${companion.name}.`;
  return [feel, `${role} ${texture}`, arrival];
}

export function composeWhyHer(
  companion: Companion,
  answers: MatchAnswers,
): string[] {
  const copy = matchDialogue.reveal;
  const bullets: string[] = [];
  const freeText = firstFreeText(answers);
  if (freeText) {
    bullets.push(
      `You wrote "${truncate(freeText, 48)}" - ${decap(companion.rationale.voice)}`,
    );
  }
  if (answers.feeling) {
    bullets.push(
      `You wanted ${copy.feelingPhrase[answers.feeling]} — ${decap(companion.rationale.energy)}`,
    );
  }
  if (answers.role) {
    const rolePhraseShort =
      answers.role === "i-dont-know"
        ? "you weren't sure"
        : choiceLabel("role", answers.role);
    bullets.push(`You said ${rolePhraseShort} — ${decap(companion.rationale.look)}`);
  }
  if (answers.texture) {
    bullets.push(
      `You wanted ${copy.textureShort[answers.texture]} — ${decap(companion.rationale.voice)}`,
    );
  }
  if (answers.avoid && answers.avoid.length > 0) {
    const a = answers.avoid[0];
    const phrase = copy.avoidRationale[a] ?? "keeps it light";
    bullets.push(`You said ${choiceLabel("avoid", a)} — she ${phrase}.`);
  }
  if (bullets.length < 3) {
    bullets.push(companion.rationale.voice);
  }
  return bullets.slice(0, 3);
}

function firstFreeText(answers: MatchAnswers): string | null {
  const freeText = answers.freeText;
  if (!freeText) return null;
  for (const axis of ["feeling", "role", "texture", "avoid", "familiarity"] as MatchAxis[]) {
    const value = freeText[axis]?.trim();
    if (value) return value;
  }
  return null;
}

function choiceLabel(axis: keyof typeof matchDialogue.choices, id: string): string {
  return matchDialogue.choices[axis].find((choice) => choice.id === id)?.label ?? id;
}

function decap(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : `${s.slice(0, n - 3)}...`;
}

export function reactionFor(axis: MatchAxis, id: string): string | null {
  const reactions = matchDialogue.reactions as Record<string, Record<string, string>>;
  return reactions[axis]?.[id] ?? null;
}

export type RejectionAxis = "look" | "voice" | "energy" | "all";

export function nextRevealAfterRejection(
  companions: Companion[],
  answers: MatchAnswers,
  rejectedIds: string[],
  axis: RejectionAxis,
): Companion {
  // Re-score, exclude previously rejected, prefer companions whose rationale
  // for the named axis reads differently than the rejected ones.
  void axis;
  return pickMatch(companions, answers, rejectedIds);
}
