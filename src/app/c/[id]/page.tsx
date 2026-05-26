import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { characters, getCharacter } from "@/lib/characters";

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
  const character = getCharacter(id);

  if (!character) {
    notFound();
  }

  return (
    <AppShell activePath="/browse">
      <main className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col gap-5">
          <Avatar
            name={character.name}
            accent={character.accent}
            className="h-40 w-40 text-5xl"
          />
          <div>
            <h1 className="max-w-lg font-serif text-5xl leading-none text-copy sm:text-6xl">
              {character.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-copy-muted">
              {character.bio}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {character.tags.map((tag) => (
              <Chip key={tag} tone="quiet">
                {tag}
              </Chip>
            ))}
          </div>
          <Button asChild className="mt-2 w-full sm:w-fit">
            <Link href={`/chat/${character.id}` as Route}>Start chatting</Link>
          </Button>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm uppercase tracking-[0.16em] text-copy-muted">
            sample messages
          </h2>
          {character.samples.map((sample) => (
            <Card key={sample} className="p-5">
              <p className="text-base leading-7 text-copy">{sample}</p>
            </Card>
          ))}
        </section>
      </main>
    </AppShell>
  );
}
