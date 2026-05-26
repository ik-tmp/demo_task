import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";

const archetypes = [
  "Companion",
  "Mentor",
  "Sidekick",
  "Antagonist",
  "Muse",
  "Stranger",
];

export default function CreatePage() {
  return (
    <AppShell activePath="/create">
      <main className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_22rem]">
        <section className="flex flex-col justify-center gap-8">
          <p className="text-sm uppercase tracking-[0.16em] text-copy-muted">
            create
          </p>
          <h1 className="font-serif text-5xl leading-none text-copy sm:text-7xl">
            Who are they to you?
          </h1>
          <div className="grid gap-3 sm:grid-cols-2">
            {archetypes.map((archetype) => (
              <Chip key={archetype} size="large">
                {archetype}
              </Chip>
            ))}
          </div>
          <Button asChild variant="secondary" className="w-fit">
            <Link href="/browse">I just want to browse</Link>
          </Button>
        </section>
        <Card className="self-center p-5">
          <p className="text-sm uppercase tracking-[0.16em] text-copy-muted">
            live preview
          </p>
          <div className="mt-8 rounded-card border border-dashed border-line p-5 text-copy-muted">
            your character starts taking shape here.
          </div>
        </Card>
      </main>
    </AppShell>
  );
}
