import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CharacterCard } from "@/components/character-card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Display } from "@/components/ui/display";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MessageBubble } from "@/components/ui/message-bubble";
import { Surface } from "@/components/ui/surface";
import { Tag } from "@/components/ui/tag";
import { characters, getCharacter } from "@/lib/characters";
import type { Character } from "@/types/character";

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

function findRelated(target: Character, limit = 3): Character[] {
  const owned = new Set(target.tags);
  return characters
    .filter((c) => c.id !== target.id)
    .map((c) => ({
      character: c,
      overlap: c.tags.filter((tag) => owned.has(tag)).length,
    }))
    .sort(
      (a, b) =>
        b.overlap - a.overlap || b.character.popularity - a.character.popularity,
    )
    .slice(0, limit)
    .map((entry) => entry.character);
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = getCharacter(id);

  if (!character) {
    notFound();
  }

  const related = findRelated(character);

  return (
    <AppShell activePath="/browse">
      <Surface accent={character.accent} intensity="hero">
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 pt-10 pb-16 sm:px-8 sm:pt-12">
          <Link
            href="/browse"
            className="inline-flex w-fit items-center gap-2 text-[13px] text-copy-muted transition hover:text-copy"
          >
            <ArrowLeft size={14} aria-hidden /> back to everyone
          </Link>

          <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
            <div className="flex flex-col gap-6">
              <div className="flex items-end gap-6">
                <Avatar
                  name={character.name}
                  accent={character.accent}
                  size="xl"
                />
                <div className="pb-2">
                  <Eyebrow tone="muted">character</Eyebrow>
                  <div className="mt-1 flex items-center gap-2 text-[13px] text-copy-muted">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: character.accent,
                        boxShadow: `0 0 12px ${character.accent}`,
                      }}
                    />
                    here now
                  </div>
                </div>
              </div>

              <Display size="lg">{character.name}</Display>
              <p className="max-w-xl text-[16px] leading-7 text-copy-muted">
                {character.bio}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {character.tags.map((tag) => (
                  <Tag key={tag} tone="accent" accent={character.accent}>
                    {tag}
                  </Tag>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg">
                  <Link href={`/chat/${character.id}` as Route}>
                    Start chatting
                    <ArrowUpRight size={18} aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/browse">Keep looking</Link>
                </Button>
              </div>
            </div>

            <aside className="flex flex-col gap-4">
              <Eyebrow tone="muted">a sample of how they talk</Eyebrow>
              <div className="flex flex-col gap-3">
                {character.samples.map((sample, i) => (
                  <MessageBubble
                    key={sample}
                    accent={character.accent}
                    tail={i === character.samples.length - 1}
                    className="max-w-full"
                  >
                    {sample}
                  </MessageBubble>
                ))}
              </div>

              <MessageBubble variant="system" className="mt-2 text-[13px]">
                first message in chat: “{character.opener}”
              </MessageBubble>
            </aside>
          </section>

          {related.length ? (
            <section className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between">
                <Eyebrow tone="muted">similar in mood</Eyebrow>
                <Link
                  href="/browse"
                  className="text-[13px] text-copy-muted underline decoration-copy-muted/40 underline-offset-[5px] transition hover:text-copy"
                >
                  see all
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rel) => (
                  <CharacterCard
                    key={rel.id}
                    character={rel}
                    href={`/c/${rel.id}` as Route}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </main>
      </Surface>
    </AppShell>
  );
}
