import type { PortraitState } from "./companion";

/** Where the user arrived from. Drives the opener beat and first-chat framing. */
export type Source = "browse" | "match" | "create" | "direct";

export type DialogueReply = {
  /** Chip text. Also the user's bubble unless `said` overrides it. */
  label: string;
  /** Override the rendered user bubble (e.g. chip is terse, bubble is fuller). */
  said?: string;
  /** Beat id to advance to. */
  next: string;
  /** Lowercase tokens that route free text to this branch. */
  keywords?: string[];
};

export type DialogueBeat = {
  id: string;
  /** Companion message(s) for this beat. Usually one; two for a beat that lands a follow-up. */
  lines: string[];
  /** Branching suggested replies. Omit on terminal/paywall beats. */
  replies?: DialogueReply[];
  /** Portrait state to settle into when this beat lands. */
  portrait?: PortraitState;
  /** When the user reaches this beat, surface the paywall after the line types. */
  paywall?: boolean;
};

export type Dialogue = {
  /** Opening beat id per arrival source. */
  start: Record<Source, string>;
  beats: Record<string, DialogueBeat>;
};
