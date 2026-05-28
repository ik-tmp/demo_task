import type { Companion, CompanionEnergy, TagAxis } from "@/types/companion";

export type RefinementId =
  | "softer"
  | "sharper"
  | "older"
  | "younger"
  | "more-direct"
  | "less-polished"
  | "stranger";

export const refinementLabels: Record<RefinementId, string> = {
  softer: "softer",
  sharper: "sharper",
  older: "older",
  younger: "younger",
  "more-direct": "more direct",
  "less-polished": "less polished",
  stranger: "stranger",
};

/**
 * Conversational refinements map to tag affinities, not hard filters.
 * Each refinement boosts a companion's score by how many of its target
 * tags the companion owns — companions are reordered, not eliminated.
 */
const refinementWeights: Record<RefinementId, Partial<Record<TagAxis, string[]>>> = {
  softer:        { vibe: ["calm", "grounded"], energy: ["gentle", "quiet"] },
  sharper:       { vibe: ["sharp", "playful"], energy: ["witty", "intense"] },
  older:         { role: ["mentor", "confidant"] },
  younger:       { energy: ["playful", "flirty"], pace: ["immediate"] },
  "more-direct": { vibe: ["sharp", "grounded"], pace: ["immediate"] },
  "less-polished": { vibe: ["grounded", "sharp"], energy: ["intense"] },
  stranger:      { vibe: ["mysterious", "dreamy"] },
};

function tagsOf(c: Companion): Set<string> {
  const set = new Set<string>();
  for (const axis of Object.keys(c.tags) as TagAxis[]) {
    for (const t of c.tags[axis]) set.add(`${axis}:${t}`);
  }
  return set;
}

function refinementScore(c: Companion, refinements: RefinementId[]): number {
  if (refinements.length === 0) return 0;
  const owned = tagsOf(c);
  let score = 0;
  for (const r of refinements) {
    const weights = refinementWeights[r];
    for (const axis of Object.keys(weights) as TagAxis[]) {
      for (const t of weights[axis]!) {
        if (owned.has(`${axis}:${t}`)) score += 1;
      }
    }
  }
  return score;
}

function queryScore(c: Companion, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  let score = 0;
  if (c.name.toLowerCase().includes(q)) score += 4;
  if (c.premise.toLowerCase().includes(q)) score += 2;
  for (const trait of c.traitTags) {
    if (trait.toLowerCase().includes(q)) score += 1;
  }
  for (const aff of c.ranking.queryAffinity) {
    if (q.includes(aff) || aff.includes(q)) score += 1;
  }
  return score;
}

export type GalleryFilters = {
  refinements: RefinementId[];
  query: string;
};

export type GalleryResult = {
  companion: Companion;
  score: number;
};

/**
 * Sorts companions by a soft score that combines refinements and query.
 * Nothing is filtered out — the gallery never empties (DIRECTION-B §6).
 * The top result earns a "Why you're seeing this" hint if any signal
 * was applied.
 */
export function rankForGallery(
  companions: Companion[],
  filters: GalleryFilters,
): GalleryResult[] {
  return companions
    .map((c) => ({
      companion: c,
      score: refinementScore(c, filters.refinements) + queryScore(c, filters.query),
    }))
    .sort((a, b) => b.score - a.score);
}

// ---- Browse preview Q&A -------------------------------------------------
// Deterministic in-voice "host" answers for the teaser exchange before the
// real chat (DIRECTION-B §6 / M4: free text → one-line in-voice answer,
// max ~3 turns). Cycles by turn so each question gets a fresh line.

const previewAnswersByEnergy: Record<CompanionEnergy, string[]> = {
  listener: [
    "I'd probably ask what you're reading, then actually listen to the answer.",
    "I'm better in the quiet than the noise. You'll see.",
    "Ask me anything — I'll take my time with it.",
  ],
  provoker: [
    "I'd make you laugh, then ask the question you're avoiding. It's a whole bit.",
    "Careful — I answer honestly. It's a bit of a problem.",
    "Try me. I'm quick, but I land where it counts.",
  ],
  guide: [
    "I'd ask where your head's at, then walk you there. No lectures.",
    "I don't do small talk for long. Fair warning.",
    "Ask. I've probably walked that street before.",
  ],
  confidant: [
    "I'd give you time to explain, so don't worry about rambling.",
    "Tell me where it starts. I'll help you sort it out.",
    "I'm slow on purpose. The good stuff doesn't rush.",
  ],
};

export const PREVIEW_QA_MAX_TURNS = 3;

export function previewAnswer(c: Companion, turn: number): string {
  const pool = previewAnswersByEnergy[c.energy];
  return pool[turn % pool.length];
}

export function describeActiveFilters(filters: GalleryFilters): string | null {
  const parts: string[] = [];
  if (filters.refinements.length > 0) {
    parts.push(filters.refinements.map((r) => refinementLabels[r]).join(", "));
  }
  if (filters.query.trim()) parts.push(`"${filters.query.trim()}"`);
  if (parts.length === 0) return null;
  return parts.join(" · ");
}
