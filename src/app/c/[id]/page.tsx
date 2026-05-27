import { FunnelEntry } from "@/components/funnel-entry";
import { characters } from "@/lib/characters";

type CharacterPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return characters.map((character) => ({
    id: character.id,
  }));
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params;

  return <FunnelEntry initialStage="preview" initialCharacterId={id} />;
}
