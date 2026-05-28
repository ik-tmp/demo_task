export type CompanionEnergy =
  | "listener"
  | "provoker"
  | "guide"
  | "confidant";

export type CompanionVoice = "warm" | "dry" | "curious";

export type TagAxis =
  | "vibe"
  | "role"
  | "energy"
  | "pace"
  | "format"
  | "boundaries";

export type CompanionTags = Record<TagAxis, string[]>;

export type FaceSafeRegion = {
  topPct: number;
  heightPct: number;
};

export type CompanionAssets = {
  reel: string;
  neutral: string;
  warm: string;
  curious: string;
  closer: string;
  finalChat: string;
  desktop?: Partial<{
    neutral: string;
    warm: string;
    curious: string;
    closer: string;
    finalChat: string;
  }>;
  thumbnails?: Partial<{
    neutral: string;
    warm: string;
    curious: string;
    closer: string;
    finalChat: string;
  }>;
};

export type CompanionRanking = {
  morning: number;
  afternoon: number;
  evening: number;
  night: number;
  queryAffinity: string[];
};

export type CompanionRationale = {
  look: string;
  voice: string;
  energy: string;
};

export type CompanionOpeners = {
  browse: string;
  match: string;
  create: string;
};

export type Companion = {
  id: string;
  name: string;
  premise: string;
  energy: CompanionEnergy;
  scene: string;
  assets: CompanionAssets;
  faceSafe: FaceSafeRegion;
  ranking: CompanionRanking;
  tags: CompanionTags;
  traitTags: string[];
  sampleLines: string[];
  voice: CompanionVoice;
  voiceDescribedAs: string;
  openers: CompanionOpeners;
  rationale: CompanionRationale;
  reelSlot: number;
};

export type PortraitState = "neutral" | "warm" | "curious" | "closer" | "finalChat";
