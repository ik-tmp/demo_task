"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import { Search, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CharacterCard } from "@/components/character-card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Display } from "@/components/ui/display";
import { Eyebrow } from "@/components/ui/eyebrow";
import { IconButton } from "@/components/ui/icon-button";
import { Surface } from "@/components/ui/surface";
import { characters } from "@/lib/characters";
import {
  applyBrowseFilters,
  collectTagPool,
  sortOptions,
  type SortKey,
} from "@/lib/browse";

const tagPool = collectTagPool(characters);

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("popular");

  const results = useMemo(
    () => applyBrowseFilters(characters, { query, tags, sort }),
    [query, tags, sort],
  );

  function toggleTag(tag: string) {
    setTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
  }

  function clearFilters() {
    setQuery("");
    setTags([]);
  }

  const hasFilters = query.length > 0 || tags.length > 0;

  return (
    <AppShell activePath="/browse">
      <Surface accent="#62d2c6" intensity="calm">
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 pt-10 pb-16 sm:px-8 sm:pt-12">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow tone="muted">discovery</Eyebrow>
              <Display size="md" className="mt-2">
                Who&apos;s around today.
              </Display>
            </div>
            <p className="text-[13px] tracking-[0.14em] uppercase text-copy-muted">
              {results.length}{" "}
              {results.length === 1 ? "character" : "characters"}
              {hasFilters ? " match" : " in residence"}
            </p>
          </header>

          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="group flex min-h-12 flex-1 items-center gap-3 rounded-tile border border-line bg-ink/45 px-4 transition focus-within:border-copy/55 focus-within:bg-ink/65">
                <Search
                  size={17}
                  aria-hidden
                  className="shrink-0 text-copy-muted"
                />
                <span className="sr-only">Search characters</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent text-[15px] text-copy outline-none placeholder:text-copy-muted/70"
                  placeholder="Search names, moods, things they're good at"
                />
                {query ? (
                  <IconButton
                    label="Clear search"
                    size="sm"
                    onClick={() => setQuery("")}
                  >
                    <X size={14} />
                  </IconButton>
                ) : null}
              </label>

              <div className="flex items-center gap-1 rounded-pill border border-line bg-copy/[0.05] p-1">
                {sortOptions.map((opt) => (
                  <Chip
                    key={opt.key}
                    size="sm"
                    selected={sort === opt.key}
                    onClick={() => setSort(opt.key)}
                    className="border-transparent"
                  >
                    {opt.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Eyebrow className="mr-2 hidden sm:inline">tags</Eyebrow>
              {tagPool.map((tag) => (
                <Chip
                  key={tag}
                  size="sm"
                  tone="quiet"
                  selected={tags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Chip>
              ))}
              {hasFilters ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-auto"
                >
                  <X size={14} aria-hidden />
                  Clear all
                </Button>
              ) : null}
            </div>
          </section>

          {results.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : (
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  href={`/c/${character.id}` as Route}
                />
              ))}
            </section>
          )}
        </main>
      </Surface>
    </AppShell>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-tile border border-dashed border-copy/15 bg-copy/[0.03] px-6 py-14 text-center">
      <Eyebrow tone="muted">empty room</Eyebrow>
      <p className="max-w-md font-serif text-2xl leading-snug text-copy">
        Nothing matches all of that. Try fewer filters?
      </p>
      <Button variant="secondary" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}
