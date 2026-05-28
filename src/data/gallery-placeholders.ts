/**
 * Locked teaser tiles shown in the gallery grid. They sit behind the mock
 * paywall as the "rest of the cast" and stay out of companions.json on purpose
 * so they never leak into reel/match/create ranking.
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
    asset: "/companions/gallery/elias.png",
  },
  {
    id: "juno",
    name: "Juno",
    vibe: "bright and mischievous",
    accent: "#f5be58",
    locked: true,
    asset: "/companions/gallery/juno.png",
  },
  {
    id: "rafa",
    name: "Rafa",
    vibe: "calm, grounded nights",
    accent: "#c99cff",
    locked: true,
    asset: "/companions/gallery/rafa.png",
  },
  {
    id: "leila",
    name: "Leila",
    vibe: "precise and generous",
    accent: "#ff7f6e",
    locked: true,
    asset: "/companions/gallery/leila.png",
  },
  {
    id: "theo",
    name: "Theo",
    vibe: "practical kindness",
    accent: "#8ed4ff",
    locked: true,
    asset: "/companions/gallery/theo.png",
  },
  {
    id: "amara",
    name: "Amara",
    vibe: "soft intensity",
    accent: "#b5d66f",
    locked: true,
    asset: "/companions/gallery/amara.png",
  },
  {
    id: "soren",
    name: "Soren",
    vibe: "dry, lucid calm",
    accent: "#d7b7ff",
    locked: true,
    asset: "/companions/gallery/soren.png",
  },
  {
    id: "valen",
    name: "Valen",
    vibe: "late-night levity",
    accent: "#ffb29f",
    locked: true,
    asset: "/companions/gallery/valen.png",
  },
];
