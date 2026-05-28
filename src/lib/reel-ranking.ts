import type { Companion } from "@/types/companion";

type Daypart = "morning" | "afternoon" | "evening" | "night";

export type RankingInputs = {
  now?: Date;
  fromQuery?: string | null;
  rejectedIds?: string[];
  randomSeed?: number;
};

export function daypartOf(date: Date): Daypart {
  const h = date.getHours();
  if (h < 11) return "morning";
  if (h < 17) return "afternoon";
  if (h < 22) return "evening";
  return "night";
}

function affinityScore(companion: Companion, fromQuery: string | null | undefined): number {
  if (!fromQuery) return 0;
  const needle = fromQuery.toLowerCase().trim();
  if (!needle) return 0;
  const words = needle.split(/[\s,-]+/).filter(Boolean);
  let hits = 0;
  for (const w of words) {
    if (companion.ranking.queryAffinity.some((a) => a === w)) hits += 1;
  }
  return hits;
}

// Deterministic small jitter so a returning user sees variety while
// the demo remains testable when a seed is provided.
function jitter(id: string, seed: number): number {
  let h = seed | 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  // Map to [0, 0.08)
  return Math.abs(h % 80) / 1000;
}

export function rankCompanions(
  companions: Companion[],
  inputs: RankingInputs = {},
): Companion[] {
  const now = inputs.now ?? new Date();
  const dp = daypartOf(now);
  const seed = inputs.randomSeed ?? Math.floor(now.getTime() / 600_000); // changes every 10 min
  const rejected = new Set(inputs.rejectedIds ?? []);

  const scored = companions.map((c) => {
    const base = c.ranking[dp] ?? 0.5;
    const aff = affinityScore(c, inputs.fromQuery) * 0.5;
    const j = jitter(c.id, seed);
    const penalty = rejected.has(c.id) ? -0.4 : 0;
    return { c, score: base + aff + j + penalty };
  });

  scored.sort((a, b) => {
    if (a.c.id === "sasha" && b.c.id !== "sasha") return 1;
    if (b.c.id === "sasha" && a.c.id !== "sasha") return -1;
    return b.score - a.score;
  });
  return scored.map((s) => s.c);
}
