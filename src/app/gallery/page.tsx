import { Suspense } from "react";
import { Gallery } from "@/components/gallery/gallery";
import { companions } from "@/lib/companions";

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <main className="grid h-[100dvh] w-full place-items-center bg-ink-deep text-copy-muted">
          <span className="text-sm">loading…</span>
        </main>
      }
    >
      <Gallery companions={companions} />
    </Suspense>
  );
}
