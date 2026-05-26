import characterData from "@/data/characters.json";
import type { Character } from "@/types/character";

export const characters = characterData as Character[];

export function getCharacter(id: string) {
  return characters.find((character) => character.id === id);
}
