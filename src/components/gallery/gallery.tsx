"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { surfaceDialogue } from "@/data/surface-dialogue";
import { galleryPlaceholders } from "@/data/gallery-placeholders";
import { motionSec } from "@/lib/motion";
import { useFunnelStore } from "@/store/funnel-store";
import type { Companion } from "@/types/companion";
import {
  type GalleryFilters,
  type RefinementId,
  describeActiveFilters,
  rankForGallery,
  refinementLabels,
} from "@/lib/browse";
import { Paywall, type PaywallStatus } from "@/components/chat/paywall";

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
  // Refinements are still accepted as deep-link params (e.g. /gallery?softer=1)
  // and silently affect ranking, but there are no on-screen refinement chips.
  const refinements = useMemo(() => {
    const acc: RefinementId[] = [];
    for (const r of refinementIds) if (searchParams.get(r) === "1") acc.push(r);
    return acc;
  }, [searchParams]);

  const [query, setQuery] = useState("");
  const [textInput, setTextInput] = useState("");
  const [paywall, setPaywall] = useState<PaywallStatus>("hidden");
  const [lockedName, setLockedName] = useState<string>("");

  const filters = useMemo<GalleryFilters>(
    () => ({ refinements, query }),
    [refinements, query],
  );
  const results = useMemo(
    () => rankForGallery(companions, filters),
    [companions, filters],
  );

  // The gallery never empties (DIRECTION-B §6): the top-ranked companion is
  // always the hero, the rest fill the grid.
  const hero = results[0].companion;
  const rest = results.slice(1).map((r) => r.companion);

  const submitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(textInput.trim());
  };

  const why = describeActiveFilters(filters);

  const meet = (companion: Companion) => {
    setBrowsePersonalization({
      companionId: companion.id,
      companionName: companion.name,
      query: query || undefined,
      refinements: refinements.map((id) => refinementLabels[id]),
    });
    router.push(`/chat/${companion.id}?from=browse`);
  };

  const openPaywall = (name: string) => {
    setLockedName(name);
    setPaywall("open");
  };
  const closePaywall = () => setPaywall("hidden");
  const unlockPaywall = () => {
    setPaywall("success");
    window.setTimeout(closePaywall, 1500);
  };

  return (
    <main className="relative h-[100dvh] w-full overflow-y-auto bg-ink-deep text-copy">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-line/40 bg-ink-deep/85 px-5 py-3 backdrop-blur">
        <Link
          href="/"
          aria-label={galleryCopy.back}
          className="-ml-1 inline-flex shrink-0 items-center rounded-pill p-1.5 text-copy-muted transition hover:text-copy"
        >
          <ArrowLeft size={16} />
        </Link>
        <form onSubmit={submitQuery} className="flex flex-1 items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={galleryCopy.searchPlaceholder}
            aria-label={galleryCopy.searchAria}
            className="min-w-0 flex-1 rounded-pill border border-line bg-copy/5 px-4 py-1.5 text-[13px] text-copy placeholder:text-copy-faint focus:border-copy/35 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-pill border border-line bg-copy/8 px-3 py-1.5 text-[13px] text-copy transition hover:bg-copy/14"
          >
            {galleryCopy.submit}
          </button>
        </form>
      </div>

      {/* Hero — best-fit vignette */}
      <section className="px-5 pt-4">
        <div className="relative h-[52vh] min-h-[340px] max-h-[560px] overflow-hidden rounded-tile border border-line/40">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={hero.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionSec(0.35), ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={hero.assets.reel}
                alt={hero.name}
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
                    "linear-gradient(180deg, rgba(15,13,22,0.25) 0%, rgba(15,13,22,0) 30%, rgba(15,13,22,0) 48%, rgba(15,13,22,0.9) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-6 sm:px-8">
                <div className="flex flex-col gap-2.5 md:max-w-md">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copy-faint">
                    {galleryCopy.bestFit}
                  </span>
                  <div>
                    <p className="font-serif text-[40px] leading-[1] sm:text-[52px] lg:text-[64px]">
                      {hero.name}
                    </p>
                    <p className="mt-1.5 text-[15px] text-copy/85 sm:text-[17px]">
                      {hero.premise}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-copy-muted">
                    {hero.traitTags.map((t) => (
                      <span
                        key={t}
                        className="rounded-pill border border-line/60 bg-copy/[0.06] px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {why ? (
                    <p className="text-[12px] text-copy-faint">
                      {galleryCopy.why(why)}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => meet(hero)}
                    className="mt-0.5 inline-flex w-fit items-center gap-1.5 rounded-pill bg-coral px-4 py-2 text-[14px] font-semibold text-ink shadow-soft transition hover:bg-rose"
                  >
                    <MessageCircle size={14} /> {galleryCopy.sayHi(hero.name)}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Grid — everyone else, create, locked */}
      <section className="px-5 pb-10 pt-6">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-copy-faint">
          {galleryCopy.restLabel}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((c) => (
            <CompanionTile key={c.id} companion={c} onSelect={() => meet(c)} />
          ))}
          <CreateTile />
          {galleryPlaceholders.map((p) => (
            <LockedTile
              key={p.id}
              name={p.name}
              vibe={p.vibe}
              accent={p.accent}
              asset={p.asset}
              onSelect={() => openPaywall(p.name)}
            />
          ))}
        </div>
      </section>

      {/* Locked-cast paywall overlay (mock) */}
      {paywall !== "hidden" ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink-deep/70 p-4 backdrop-blur-sm"
          onClick={closePaywall}
        >
          <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <Paywall
              status={paywall}
              variant="lockedCast"
              companionName={lockedName}
              onContinue={unlockPaywall}
              onDismiss={closePaywall}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}

function CompanionTile({
  companion,
  onSelect,
}: {
  companion: Companion;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={galleryCopy.sayHi(companion.name)}
      className="group relative aspect-video overflow-hidden rounded-tile border border-line/40 text-left transition hover:border-copy/30"
    >
      <Image
        src={companion.assets.reel}
        alt={companion.name}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,13,22,0) 40%, rgba(15,13,22,0.9) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 z-10 p-3.5">
        <p className="font-serif text-[24px] leading-none">{companion.name}</p>
        <p className="mt-1 line-clamp-1 text-[12px] text-copy/75">
          {companion.premise}
        </p>
      </div>
    </button>
  );
}

function CreateTile() {
  const { title, hint } = galleryCopy.createTile;
  return (
    <Link
      href="/create"
      className="group relative flex aspect-video items-center gap-3.5 overflow-hidden rounded-tile border border-dashed border-coral/45 p-4 transition hover:border-coral/80"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 transition duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120% 90% at 20% 0%, rgba(255,127,110,0.22), transparent 55%), radial-gradient(120% 90% at 100% 100%, rgba(201,156,255,0.22), transparent 55%)",
        }}
      />
      <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-coral/15 text-coral">
        <Sparkles size={19} />
      </span>
      <span className="relative z-10 min-w-0">
        <span className="block font-serif text-[22px] leading-tight text-copy">
          {title}
        </span>
        <span className="mt-1 flex items-center gap-1 text-[12.5px] text-copy-muted">
          {hint}
          <ArrowRight
            size={13}
            className="shrink-0 transition group-hover:translate-x-0.5"
          />
        </span>
      </span>
    </Link>
  );
}

function LockedTile({
  name,
  vibe,
  accent,
  asset,
  onSelect,
}: {
  name: string;
  vibe: string;
  accent: string;
  asset?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={galleryCopy.lockedTile.lockedAria(name)}
      className="group relative flex aspect-video flex-col justify-between overflow-hidden rounded-tile border border-line/40 p-3.5 text-left transition hover:border-copy/25"
    >
      {asset ? (
        <Image
          src={asset}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      ) : null}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: asset
            ? `radial-gradient(95% 90% at 76% 20%, ${accent}20, transparent 58%), linear-gradient(180deg, rgba(15,13,22,0.08) 0%, rgba(15,13,22,0.14) 42%, rgba(15,13,22,0.82) 100%)`
            : `radial-gradient(110% 120% at 75% 15%, ${accent}33, transparent 60%), linear-gradient(180deg, #211d2b 0%, #0e0c14 100%)`,
        }}
      />
      <div className="relative z-10 flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-ink/55 text-copy backdrop-blur">
          <Lock size={15} />
        </span>
        <span className="rounded-pill border border-line/70 bg-ink/55 px-2 py-0.5 text-[10px] uppercase tracking-wide text-copy backdrop-blur">
          {galleryCopy.lockedTile.badge}
        </span>
      </div>
      <span className="relative z-10">
        <span className="block font-serif text-[22px] leading-tight text-copy">
          {name}
        </span>
        <span className="mt-1 block text-[12px] text-copy/80">{vibe}</span>
      </span>
    </button>
  );
}
