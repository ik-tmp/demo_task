"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { surfaceDialogue } from "@/data/surface-dialogue";
import { cn } from "@/lib/utils";
import { useFunnelStore } from "@/store/funnel-store";
import type { Companion } from "@/types/companion";
import {
  type GalleryFilters,
  type RefinementId,
  describeActiveFilters,
  rankForGallery,
  refinementLabels,
} from "@/lib/browse";
import { Pill } from "@/components/funnel/pill";

const refinementIds: RefinementId[] = [
  "softer",
  "sharper",
  "older",
  "younger",
  "more-direct",
  "less-polished",
  "stranger",
];
const galleryCopy = surfaceDialogue.gallery;

type GalleryProps = {
  companions: Companion[];
};

export function Gallery({ companions }: GalleryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setBrowsePersonalization = useFunnelStore(
    (state) => state.setBrowsePersonalization,
  );
  const initialRefinements = useMemo(() => {
    const acc: RefinementId[] = [];
    for (const r of refinementIds) if (searchParams.get(r) === "1") acc.push(r);
    return acc;
  }, [searchParams]);

  const [refinements, setRefinements] = useState<RefinementId[]>(initialRefinements);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [textInput, setTextInput] = useState("");

  const filters = useMemo<GalleryFilters>(
    () => ({ refinements, query }),
    [refinements, query],
  );
  const results = useMemo(
    () => rankForGallery(companions, filters),
    [companions, filters],
  );
  const active = results[activeIndex] ?? results[0];

  // Reset active index when filters change. Tracked via a key ref so the
  // setState isn't called on every render.
  const lastFilterKey = useRef<string>("");
  const filterKey = `${refinements.join(",")}|${query}`;
  useEffect(() => {
    if (lastFilterKey.current === filterKey) return;
    lastFilterKey.current = filterKey;
    setActiveIndex(0);
  }, [filterKey]);

  const toggleRefinement = (id: RefinementId) => {
    setRefinements((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  };

  const submitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(textInput.trim());
  };

  const goPrev = () => setActiveIndex((i) => (i - 1 + results.length) % results.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % results.length);

  const why = describeActiveFilters(filters);
  const sayHi = () => {
    setBrowsePersonalization({
      companionId: active.companion.id,
      companionName: active.companion.name,
      query: query || undefined,
      refinements: refinements.map((id) => refinementLabels[id]),
    });
    router.push(`/chat/${active.companion.id}?from=browse`);
  };

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-ink-deep text-copy">
      <div className="absolute inset-0 grid grid-rows-[auto_1fr_auto]">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 border-b border-line/40 bg-ink-deep/85 px-5 py-3 backdrop-blur">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[13px] text-copy-muted transition hover:text-copy"
          >
            <ArrowLeft size={14} />
            {galleryCopy.back}
          </Link>
          <form onSubmit={submitQuery} className="flex flex-1 max-w-md items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={galleryCopy.searchPlaceholder}
              aria-label={galleryCopy.searchAria}
              className="flex-1 rounded-pill border border-line bg-copy/5 px-4 py-1.5 text-[13px] text-copy placeholder:text-copy-faint focus:border-copy/35 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-pill border border-line bg-copy/8 px-3 py-1.5 text-[13px] text-copy transition hover:bg-copy/14"
            >
              {galleryCopy.submit}
            </button>
          </form>
          <span className="hidden text-[12px] text-copy-faint md:inline">
            {activeIndex + 1} / {results.length}
          </span>
        </div>

        {/* Active vignette */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.companion.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0">
                <Image
                  src={active.companion.assets.reel}
                  alt={active.companion.name}
                  fill
                  sizes="100vw"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "50% 28%" }}
                  priority
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(15,13,22,0.25) 0%, rgba(15,13,22,0) 30%, rgba(15,13,22,0) 50%, rgba(15,13,22,0.85) 100%)",
                  }}
                />
              </div>

              {/* Carousel arrows (desktop) */}
              <button
                type="button"
                onClick={goPrev}
                aria-label={galleryCopy.previousAria}
                className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-line bg-ink/55 p-2 text-copy backdrop-blur transition hover:bg-ink/75 md:block"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label={galleryCopy.nextAria}
                className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-line bg-ink/55 p-2 text-copy backdrop-blur transition hover:bg-ink/75 md:block"
              >
                <ChevronRight size={18} />
              </button>

              {/* Editorial overlay */}
              <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-6 sm:px-10">
                <div className="flex flex-col gap-3 md:max-w-md">
                  <div>
                    <p className="font-serif text-[40px] leading-[1] sm:text-[56px]">
                      {active.companion.name}
                    </p>
                    <p className="mt-1.5 text-[15px] text-copy/85 sm:text-[17px]">
                      {active.companion.premise}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-copy-muted">
                    {active.companion.traitTags.map((t) => (
                      <span
                        key={t}
                        className="rounded-pill border border-line/60 bg-copy/[0.06] px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-1.5">
                    {active.companion.sampleLines.slice(0, 3).map((line, i) => (
                      <li
                        key={i}
                        className="rounded-tile border border-line/40 bg-ink/45 px-3 py-2 text-[13px] italic text-copy/85 backdrop-blur sm:text-[14px] md:w-fit md:max-w-full"
                      >
                        “{line}”
                      </li>
                    ))}
                  </ul>

                  {why ? (
                    <p className="text-[12px] text-copy-faint">
                      {galleryCopy.why(why)}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={sayHi}
                    className="inline-flex w-fit items-center gap-1.5 rounded-pill bg-coral px-4 py-2 text-[14px] font-semibold text-ink shadow-soft transition hover:bg-rose"
                  >
                    <MessageCircle size={14} /> {galleryCopy.sayHi(active.companion.name)}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom: refinement chips + pills */}
        <div className="flex flex-col gap-2 border-t border-line/40 bg-ink-deep/85 px-5 py-3 backdrop-blur">
          {refinements.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {refinements.map((r) => (
                <Pill
                  key={r}
                  label={refinementLabels[r]}
                  onRemove={() => toggleRefinement(r)}
                />
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-1.5">
            {refinementIds.map((r) => {
              const selected = refinements.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRefinement(r)}
                  className={cn(
                    "rounded-pill border px-3 py-1 text-[12px] transition",
                    selected
                      ? "border-copy bg-copy text-ink"
                      : "border-line bg-copy/6 text-copy-muted hover:bg-copy/12 hover:text-copy",
                  )}
                >
                  {refinementLabels[r]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
