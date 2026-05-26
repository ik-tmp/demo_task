import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center">
      <h1 className="font-serif text-5xl text-copy">Nothing here.</h1>
      <p className="max-w-md text-copy-muted">
        That companion is not in this session. The browse grid has everyone
        available right now.
      </p>
      <Button asChild>
        <Link href="/browse">Back to browse</Link>
      </Button>
    </main>
  );
}
