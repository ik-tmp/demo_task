import companionData from "@/data/companions.json";
import type { Companion, PortraitState } from "@/types/companion";

export const companions = companionData as Companion[];

export function getCompanion(id: string): Companion | undefined {
  return companions.find((c) => c.id === id);
}

export function requireCompanion(id: string): Companion {
  const c = getCompanion(id);
  if (!c) throw new Error(`Unknown companion: ${id}`);
  return c;
}

export function portraitSrc(
  companion: Companion,
  state: PortraitState,
  surface: "mobile" | "desktop" = "mobile",
): string {
  if (surface === "desktop" && companion.assets.desktop?.[state]) {
    return companion.assets.desktop[state]!;
  }
  return companion.assets[state];
}

export function thumbnailSrc(
  companion: Companion,
  state: PortraitState,
): string | undefined {
  return companion.assets.thumbnails?.[state];
}

export function hasThumbnails(companion: Companion): boolean {
  return Boolean(companion.assets.thumbnails);
}
