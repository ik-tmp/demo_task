import type { Companion, PortraitState } from "@/types/companion";
import type { Dialogue, DialogueBeat, DialogueReply, Source } from "@/types/dialogue";
import { dialogues } from "@/data/dialogues";

/** Hard safety: never let a free-text loop run past this many user turns. */
export const MAX_USER_TURNS = 10;

export function getDialogue(companionId: string): Dialogue | undefined {
  return dialogues[companionId];
}

export function startBeat(dialogue: Dialogue, source: Source): DialogueBeat {
  const id = dialogue.start[source] ?? dialogue.start.direct;
  return dialogue.beats[id];
}

export function getBeat(dialogue: Dialogue, id: string): DialogueBeat | undefined {
  return dialogue.beats[id];
}

/**
 * Route free text to the nearest branch. Matches a reply's `keywords`
 * (or words in its label) against the user's text; falls back to the
 * first reply so the conversation always moves forward.
 */
export function routeFreeText(
  beat: DialogueBeat,
  text: string,
): DialogueReply | undefined {
  if (!beat.replies || beat.replies.length === 0) return undefined;
  const t = text.toLowerCase();
  for (const reply of beat.replies) {
    const tokens = reply.keywords ?? reply.label.toLowerCase().split(/\s+/);
    if (tokens.some((k) => k.length > 2 && t.includes(k))) return reply;
  }
  return beat.replies[0];
}

/** Resolve a portrait state to a concrete asset, preferring the desktop crop when present. */
export function portraitAsset(
  companion: Companion,
  state: PortraitState,
  desktop = false,
): string {
  if (desktop && companion.assets.desktop?.[state]) {
    return companion.assets.desktop[state] as string;
  }
  return companion.assets[state];
}
