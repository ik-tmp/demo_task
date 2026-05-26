import { Send, MoreHorizontal } from "lucide-react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { getCharacter, characters } from "@/lib/characters";

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
  const character = getCharacter(id);

  if (!character) {
    notFound();
  }

  return (
    <AppShell>
      <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <Avatar
              name={character.name}
              accent={character.accent}
              className="h-11 w-11 text-sm"
            />
            <div>
              <h1 className="font-serif text-2xl text-copy">
                {character.name}
              </h1>
              <p className="text-sm text-copy-muted">here now</p>
            </div>
          </div>
          <Button variant="ghost" aria-label="Open chat menu">
            <MoreHorizontal size={20} aria-hidden />
          </Button>
        </header>

        <section className="flex flex-1 flex-col justify-end gap-4 py-6">
          <div className="max-w-[82%] rounded-card rounded-bl-sm bg-copy px-4 py-3 text-ink shadow-xl">
            {character.opener}
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip tone="quiet">Tell me more</Chip>
            <Chip tone="quiet">What are you like?</Chip>
            <Chip tone="quiet">Surprise me</Chip>
          </div>
        </section>

        <form className="flex items-end gap-3 border-t border-line pt-4">
          <label className="sr-only" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            className="max-h-36 min-h-12 flex-1 resize-none rounded-card border border-line bg-copy/8 px-4 py-3 text-copy outline-none placeholder:text-copy-muted/70 focus:border-coral"
            placeholder="Say hi"
            rows={1}
          />
          <Button type="submit" aria-label="Send message">
            <Send size={18} aria-hidden />
          </Button>
        </form>
      </main>
    </AppShell>
  );
}
