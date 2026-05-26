import Link from "next/link";
import type { Route } from "next";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { characters } from "@/lib/characters";

export default function BrowsePage() {
  return (
    <AppShell activePath="/browse">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-5 rounded-card border border-line bg-copy/6 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-card border border-line bg-ink/35 px-4 text-copy-muted">
            <Search size={18} aria-hidden />
            <span className="sr-only">Search characters</span>
            <input
              className="w-full bg-transparent text-copy outline-none placeholder:text-copy-muted/70"
              placeholder="Search names, tags, moods"
            />
          </label>
          <div className="flex items-center gap-3">
            <Button variant="secondary">
              <SlidersHorizontal size={18} aria-hidden />
              Filters
            </Button>
            <select className="min-h-12 rounded-card border border-line bg-ink/55 px-4 text-copy outline-none">
              <option>Popular today</option>
              <option>New</option>
              <option>Recommended for you</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/c/${character.id}` as Route}
              className="group focus:outline-none"
            >
              <Card className="flex h-full flex-col gap-5 p-5 transition duration-200 group-hover:-translate-y-1 group-hover:border-copy/30 group-focus-visible:ring-2 group-focus-visible:ring-coral">
                <div className="flex items-start gap-4">
                  <Avatar name={character.name} accent={character.accent} />
                  <div className="min-w-0">
                    <h2 className="font-serif text-2xl leading-tight text-copy">
                      {character.name}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-copy-muted">
                      {character.bio}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {character.tags.slice(0, 2).map((tag) => (
                    <Chip key={tag} tone="quiet">
                      {tag}
                    </Chip>
                  ))}
                </div>
                <p className="mt-auto border-t border-line pt-4 text-sm italic leading-6 text-copy-muted md:opacity-0 md:transition md:group-hover:opacity-100">
                  {character.opener}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
