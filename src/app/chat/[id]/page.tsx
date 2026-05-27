import { FunnelEntry } from "@/components/funnel-entry";
import { characters } from "@/lib/characters";

type ChatPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return characters.map((character) => ({
    id: character.id,
  }));
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  return <FunnelEntry initialStage="chat" initialCharacterId={id} />;
}
