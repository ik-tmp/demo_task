import type { Companion } from "@/types/companion";
import type { DialogueBeat, Source } from "@/types/dialogue";
import type {
  BrowsePersonalization,
  CreatePersonalization,
  MatchPersonalization,
  NameMode,
} from "@/types/session";

type PersonalizeContext = {
  companion: Companion;
  source: Source;
  displayName: string | null;
  nameMode: NameMode | null;
  helloContext: string | null;
  match: MatchPersonalization | null;
  create: CreatePersonalization | null;
  browse: BrowsePersonalization | null;
};

export function personalizeStartBeat(
  beat: DialogueBeat,
  context: PersonalizeContext,
): DialogueBeat {
  const intro = composePersonalizedIntro(context);
  if (!intro) return beat;
  return {
    ...beat,
    lines: [intro, ...beat.lines],
  };
}

export function cleanName(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 32 ? `${trimmed.slice(0, 29)}...` : trimmed;
}

function composePersonalizedIntro({
  companion,
  source,
  displayName,
  nameMode,
  helloContext,
  match,
  create,
  browse,
}: PersonalizeContext): string | null {
  const greeting = greetingFor(displayName, nameMode);
  const sourceLine = sourceSummary(source, companion, { match, create, browse });
  const contextLine = helloContext ? `I'll keep this in mind: ${trimSentence(helloContext)}` : "";
  return [greeting, sourceLine, contextLine].filter(Boolean).join(" ");
}

function greetingFor(displayName: string | null, nameMode: NameMode | null): string {
  if (nameMode === "unnamed") return "No names yet.";
  if (displayName) return `Hey ${displayName}.`;
  return "Hey.";
}

function sourceSummary(
  source: Source,
  companion: Companion,
  session: {
    match: MatchPersonalization | null;
    create: CreatePersonalization | null;
    browse: BrowsePersonalization | null;
  },
): string {
  if (source === "match") {
    const freeText = firstFreeText(session.match?.freeText);
    const signals = [
      freeText ? `"${truncate(freeText, 36)}"` : session.match?.feeling,
      session.match?.texture,
      session.match?.avoid?.[0],
    ].filter(Boolean);
    if (signals.length > 0) return `You asked for ${joinNatural(signals)}.`;
    return "You asked me to pick carefully.";
  }

  if (source === "create") {
    const createdName = session.create?.companionName ?? companion.name;
    const signals = [
      ...(session.create?.feelings ?? []).slice(0, 2),
      session.create?.role,
      session.create?.boundaries,
    ].filter(Boolean);
    if (signals.length > 0) {
      return `You shaped ${createdName} around ${joinNatural(signals)}.`;
    }
    return `You shaped ${createdName} before this hello.`;
  }

  if (source === "browse") {
    const askedFor = [
      session.browse?.query ? `"${session.browse.query}"` : undefined,
      ...(session.browse?.refinements ?? []),
    ].filter(Boolean);
    if (askedFor.length > 0) {
      return `You stopped on ${companion.name} after asking for ${joinNatural(askedFor)}.`;
    }
    if (session.browse?.previewQuestion) {
      return `You already asked one thing: "${truncate(session.browse.previewQuestion, 44)}."`;
    }
    return `You stopped on ${companion.name}.`;
  }

  return "I will keep the first hello simple.";
}

function firstFreeText(
  freeText?: MatchPersonalization["freeText"],
): string | undefined {
  if (!freeText) return undefined;
  for (const value of Object.values(freeText)) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

function joinNatural(values: Array<string | undefined>): string {
  const clean = values.filter((value): value is string => Boolean(value));
  if (clean.length <= 1) return clean[0] ?? "";
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")}, and ${clean[clean.length - 1]}`;
}

function trimSentence(value: string): string {
  const trimmed = truncate(value.trim(), 74);
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3)}...`;
}
