import type { Companion } from "@/types/companion";
import type { DialogueBeat } from "@/types/dialogue";
import type { NameMode } from "@/types/session";

type PersonalizeContext = {
  companion: Companion;
  displayName: string | null;
  nameMode: NameMode | null;
  helloContext: string | null;
};

/**
 * Lightly personalizes a scripted opening without prepending a robotic
 * summary. The name is woven into the opening's own greeting, and the
 * hello-context is reflected back in the companion's voice as a genuine
 * beat — never echoed verbatim as a receipt.
 */
export function personalizeStartBeat(
  beat: DialogueBeat,
  { companion, displayName, nameMode, helloContext }: PersonalizeContext,
): DialogueBeat {
  const [first, ...rest] = beat.lines;
  const named = addressByName(first, displayName, nameMode);
  const reflection = reflectContext(helloContext, companion.energy);
  const lines = reflection ? [named, reflection, ...rest] : [named, ...rest];
  return { ...beat, lines };
}

export function cleanName(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 32 ? `${trimmed.slice(0, 29)}...` : trimmed;
}

// Swap the opening's leading greeting ("Hey." / "Hi." / "Hey, you.") for one
// that uses the name, so there's no doubled "Hey." preamble.
function addressByName(
  line: string,
  displayName: string | null,
  nameMode: NameMode | null,
): string {
  if (!displayName || nameMode === "unnamed") return line;
  return line.replace(
    /^(Hey|Hi)(?:,?\s*you)?\.\s+/,
    (_match, greeting: string) => `${greeting}, ${displayName}. `,
  );
}

type Mood = "heavy" | "light" | "curious" | "custom";

function reflectContext(
  helloContext: string | null,
  energy: Companion["energy"],
): string | null {
  if (!helloContext?.trim()) return null;
  return reflections[energy][moodOf(helloContext)];
}

function moodOf(context: string): Mood {
  const c = context.toLowerCase();
  if (/(long day|tired|rough|hard|heavy|exhaust|a lot)/.test(c)) return "heavy";
  if (/(light|easy|breezy|keep it light|fun|simple)/.test(c)) return "light";
  if (/(curious|feeling this out|explore|just looking|see what|checking)/.test(c))
    return "curious";
  return "custom";
}

// In-voice reflections, keyed by companion energy. The opener portrait is
// "warm" for everyone, so each stays in its softer register.
const reflections: Record<Companion["energy"], Record<Mood, string>> = {
  listener: {
    heavy: "A long one, then. Okay — no rush in here. We'll take it slow.",
    light: "Light it is. I'll keep my questions soft.",
    curious: "Just feeling it out — that's a fine reason to be here.",
    custom: "Thanks for telling me that first. I'll hold it gently.",
  },
  provoker: {
    heavy: "Rough one, huh. Don't worry, I won't make you perform cheerful.",
    light: "Light? I can keep it breezy. For a while, anyway.",
    curious: "Just poking around. Respect — I'll behave. Mostly.",
    custom: "Noted. I'll pretend I'm being subtle about it.",
  },
  guide: {
    heavy: "Heavy day. Fine — we don't have to make it tidy.",
    light: "Light, then. We'll keep the pace easy.",
    curious: "Curious. Good — that's the honest way to start anything.",
    custom: "Got it. I'll keep that in view without circling it.",
  },
  confidant: {
    heavy: "A long day. Then let's not rush a single part of it.",
    light: "We can keep it light to start. I'll follow your lead.",
    curious: "Just curious — that's allowed. We can go as slow as you like.",
    custom: "Thank you for saying that first. We'll let it sit while we talk.",
  },
};
