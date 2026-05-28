/**
 * Locked teaser tiles shown in the gallery grid. These are companions whose
 * portraits aren't generated yet — they sit behind the mock paywall as the
 * "rest of the cast". Kept out of companions.json on purpose so they never
 * leak into reel/match/create ranking.
 *
 * When a real portrait is generated later, set `asset` and flip `locked` to
 * false; no layout change is required.
 */
export type GalleryPlaceholder = {
  id: string;
  name: string;
  vibe: string;
  accent: string;
  locked: boolean;
  asset?: string;
};

export const galleryPlaceholders: GalleryPlaceholder[] = [
  {
    id: "elias",
    name: "Elias",
    vibe: "slow-burning warmth",
    accent: "#62d2c6",
    locked: true,
  },
  {
    id: "juno",
    name: "Juno",
    vibe: "bright and mischievous",
    accent: "#f5be58",
    locked: true,
  },
  {
    id: "rafa",
    name: "Rafa",
    vibe: "calm, grounded nights",
    accent: "#c99cff",
    locked: true,
  },
];
