import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";

const options = ["Cozy", "Playful", "Sharp", "Mysterious", "Anything goes"];

export default function MatchPage() {
  return (
    <AppShell activePath="/match">
      <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl flex-col justify-center gap-8 px-5 py-10 sm:px-8">
        <p className="text-sm uppercase tracking-[0.16em] text-copy-muted">
          quick match
        </p>
        <h1 className="font-serif text-5xl leading-none text-copy sm:text-7xl">
          What kind of company are you after?
        </h1>
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => (
            <Chip key={option} size="large">
              {option}
            </Chip>
          ))}
        </div>
        <Button asChild variant="secondary" className="w-fit">
          <Link href="/browse">Let me see everyone</Link>
        </Button>
      </main>
    </AppShell>
  );
}
