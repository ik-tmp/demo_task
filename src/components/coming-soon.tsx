import Link from "next/link";

type ComingSoonProps = {
  surface: string;
  milestone: string;
  note?: string;
};

/**
 * Temporary stub for Direction B surfaces that aren't built yet. Replaced
 * milestone-by-milestone as the implementation lands.
 */
export function ComingSoon({ surface, milestone, note }: ComingSoonProps) {
  return (
    <main className="grid min-h-[100dvh] w-full place-items-center bg-ink-deep px-6 text-center text-copy">
      <div className="max-w-md space-y-4">
        <p className="font-serif text-3xl tracking-tight">{surface}</p>
        <p className="text-sm text-copy-muted">
          {milestone} will replace this surface.
        </p>
        {note ? <p className="text-xs text-copy-faint">{note}</p> : null}
        <Link
          href="/"
          className="inline-block rounded-pill border border-line px-4 py-2 text-sm text-copy hover:border-copy/35"
        >
          back to the reel
        </Link>
      </div>
    </main>
  );
}
