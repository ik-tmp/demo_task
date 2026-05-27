import type { Companion } from "@/types/companion";

export type MatchAxis = "feeling" | "role" | "avoid" | "familiarity";

export type FeelingId = "calmer" | "wanted" | "challenged" | "entertained" | "understood";
export type RoleId = "lead" | "listen" | "tease" | "ask" | "i-dont-know";
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
  avoid?: AvoidId[];
  familiarity?: FamiliarityId;
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

const feelingPhrase: Record<FeelingId, string> = {
  calmer:      "calm",
  wanted:      "wanted",
  challenged:  "challenged",
  entertained: "lit-up",
  understood:  "understood",
};

const feelingCounterweight: Record<FeelingId, string> = {
  calmer:      "Not fragile.",
  wanted:      "Not desperate.",
  challenged:  "Not combative.",
  entertained: "Not noisy.",
  understood:  "Not patronised.",
};

const rolePhrase: Record<RoleId, string> = {
  lead:           "Steady on her feet, not pushy.",
  listen:         "Attentive, not too much.",
  tease:          "Plays, doesn't perform.",
  ask:            "Asks first, suggests later.",
  "i-dont-know": "Reads the room before she answers.",
};

export function composeRevealLines(
  companion: Companion,
  answers: MatchAnswers,
): [string, string, string] {
  const feel = answers.feeling
    ? `Looking for ${feelingPhrase[answers.feeling]}. ${feelingCounterweight[answers.feeling]}`
    : "Looking for someone you can settle into.";
  const role = answers.role
    ? rolePhrase[answers.role]
    : "Reads the room before she answers.";
  const arrival = `I think you should meet ${companion.name}.`;
  return [feel, role, arrival];
}

const avoidRationale: Partial<Record<AvoidId, string>> = {
  "not-fix":     "asks before she suggests",
  "not-push":    "takes her time on purpose",
  "not-flirt":   "keeps the warmth without the wink",
  "not-perform": "doesn't grandstand",
};

export function composeWhyHer(
  companion: Companion,
  answers: MatchAnswers,
): string[] {
  const bullets: string[] = [];
  if (answers.feeling) {
    bullets.push(
      `You wanted ${feelingPhrase[answers.feeling]} — ${decap(companion.rationale.energy)}`,
    );
  }
  if (answers.role) {
    const rolePhraseShort =
      answers.role === "i-dont-know" ? "you weren't sure" : answers.role;
    bullets.push(`You said ${rolePhraseShort} — ${decap(companion.rationale.look)}`);
  }
  if (answers.avoid && answers.avoid.length > 0) {
    const a = answers.avoid[0];
    const phrase = avoidRationale[a] ?? "keeps it light";
    bullets.push(`You said ${a.replace(/-/g, " ")} — she ${phrase}.`);
  }
  if (bullets.length < 3) {
    bullets.push(companion.rationale.voice);
  }
  return bullets.slice(0, 3);
}

function decap(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
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
