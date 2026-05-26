import type { Character } from "@/types/character";

export type SortKey = "popular" | "new" | "recommended";

export const sortOptions: Array<{ key: SortKey; label: string }> = [
  { key: "popular", label: "Popular" },
  { key: "new", label: "New" },
];

export type BrowseFilters = {
  query: string;
  tags: string[];
  sort: SortKey;
  /**
   * Optional list of tags carried over from Match/Create to bias the
   * "Recommended for you" sort. When present, that sort key becomes
   * selectable from the UI.
   */
  affinityTags?: string[];
};

function matchesQuery(character: Character, q: string) {
  if (!q) return true;
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return (
    character.name.toLowerCase().includes(needle) ||
    character.bio.toLowerCase().includes(needle) ||
    character.tags.some((tag) => tag.toLowerCase().includes(needle))
  );
}

function matchesAllTags(character: Character, selected: string[]) {
  if (selected.length === 0) return true;
  const owned = new Set(character.tags);
  return selected.every((tag) => owned.has(tag));
}

function affinityScore(character: Character, affinity: string[]) {
  if (!affinity?.length) return 0;
  const owned = new Set(character.tags);
  return affinity.reduce((sum, tag) => sum + (owned.has(tag) ? 1 : 0), 0);
}

export function applyBrowseFilters(
  characters: Character[],
  filters: BrowseFilters,
): Character[] {
  const filtered = characters.filter(
    (c) => matchesQuery(c, filters.query) && matchesAllTags(c, filters.tags),
  );

  switch (filters.sort) {
    case "popular":
      return [...filtered].sort((a, b) => b.popularity - a.popularity);
    case "new":
      // Reverse seed order is a stable, deterministic "new" until we have
      // real timestamps in the data.
      return [...filtered].reverse();
    case "recommended": {
      const affinity = filters.affinityTags ?? [];
      return [...filtered].sort(
        (a, b) =>
          affinityScore(b, affinity) - affinityScore(a, affinity) ||
          b.popularity - a.popularity,
      );
    }
    default:
      return filtered;
  }
}

export function collectTagPool(characters: Character[]): string[] {
  const pool = new Set<string>();
  for (const c of characters) for (const t of c.tags) pool.add(t);
  return [...pool].sort();
}
