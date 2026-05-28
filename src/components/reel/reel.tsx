"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { surfaceDialogue } from "@/data/surface-dialogue";
import { cn } from "@/lib/utils";
import { rankCompanions } from "@/lib/reel-ranking";
import type { Companion } from "@/types/companion";
import { FaceSafeFrame } from "@/components/layout/face-safe-frame";
import { PortraitStage } from "@/components/layout/portrait-stage";
import { Dotline } from "./dotline";

const REEL_VIGNETTE_MS = 3000;
const REEL_FADE_MS = 500;
const REJECTED_KEY = "reel:rejected";
const reelCopy = surfaceDialogue.reel;

type ReelProps = {
  companions: Companion[];
};

type ReelPhase = "playing" | "settled" | "interrupted";

function readRejectedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(REJECTED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function Reel({ companions }: ReelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  // Ranked order resolved on the client to avoid hydration mismatch on time-of-day.
  const [order, setOrder] = useState<Companion[]>(companions);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<ReelPhase>("playing");
  const loopsRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const rankedOnce = useRef(false);

  useEffect(() => {
    if (rankedOnce.current) return;
    rankedOnce.current = true;
    const ranked = rankCompanions(companions, {
      fromQuery: from,
      rejectedIds: readRejectedIds(),
    });
    setOrder(ranked);
  }, [companions, from]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (order.length === 0) return;
    timerRef.current = window.setTimeout(() => {
      setIndex((cur) => {
        const next = cur + 1;
        if (next >= order.length) {
          loopsRef.current += 1;
          if (loopsRef.current >= 2) {
            setPhase("settled");
          }
          return 0;
        }
        return next;
      });
    }, REEL_VIGNETTE_MS);
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase, index, order.length]);

  const current = order[index];
  const interrupt = (next: () => void) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPhase("interrupted");
    next();
  };

  if (!current) return null;

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-ink-deep text-copy">
      {/* Ultra-wide gutter: cap the portrait area at 16:9 so faces don't stretch. */}
      <div className="absolute inset-0 mx-auto h-full max-w-[calc(100dvh*16/9)]">
        <FaceSafeFrame region={current.faceSafe} className="h-full w-full">
          <AnimatePresence mode="sync" initial={false}>
            <motion.button
              key={current.id}
              type="button"
              onClick={() => interrupt(() => router.push(`/companion/${current.id}`))}
              aria-label={reelCopy.openAria(current.name)}
              className="absolute inset-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: REEL_FADE_MS / 1000, ease: "easeInOut" }}
            >
              <PortraitStage
                src={current.assets.reel}
                alt={`${current.name} — ${current.scene}`}
                motion
                priority
              />
            </motion.button>
          </AnimatePresence>

          {/* Editorial overlay: lower-left, name + premise. */}
          <div className="pointer-events-none absolute inset-x-0 z-10" style={{ top: `calc(var(--face-safe-bottom) + 6%)` }}>
            <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <h1 className="font-serif text-[42px] leading-[1] tracking-[-0.02em] sm:text-[64px] lg:text-[72px]">
                    {current.name}
                  </h1>
                  <p className="mt-2 max-w-md text-[15px] text-copy/80 sm:text-[17px] md:text-[18px] md:text-copy/90">
                    {current.premise}
                  </p>

                  {/* Desktop: a clear primary CTA + quieter alternates, left-anchored
                      under the name so the choices read as the point, not footer chrome.
                      Mobile keeps the centered bottom cluster below. */}
                  <div className="pointer-events-auto mt-7 hidden flex-col items-start gap-3.5 md:flex">
                    <button
                      type="button"
                      onClick={() => interrupt(() => router.push(`/companion/${current.id}`))}
                      className={cn(
                        "rounded-pill bg-copy px-7 py-3 text-[16px] font-medium text-ink shadow-soft transition",
                        "hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
                      )}
                    >
                      {reelCopy.actions.talkTo(current.name)}
                    </button>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[14px]">
                      <ReelTextAction
                        onClick={() => interrupt(() => router.push("/gallery"))}
                        label={reelCopy.actions.seeEveryone}
                      />
                      <DesktopSep />
                      <ReelTextAction
                        onClick={() => interrupt(() => router.push("/match"))}
                        label={reelCopy.actions.pickForMe}
                      />
                      <DesktopSep />
                      <ReelTextAction
                        onClick={() => interrupt(() => router.push("/create"))}
                        label={reelCopy.actions.describeSomeoneElse}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom: host line + dotline + affordances. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-[max(env(safe-area-inset-bottom),20px)]">
            <div className="pointer-events-auto mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-6 sm:px-10">
              <p className="text-center text-[14px] text-copy/70 sm:text-[15px] md:hidden">
                {reelCopy.prompt}
              </p>
              <Dotline count={order.length} active={index} />
              <div className="md:hidden">
                <Affordances
                  onSeeEveryone={() => interrupt(() => router.push("/gallery"))}
                  onPickForMe={() => interrupt(() => router.push("/match"))}
                  onDescribe={() => interrupt(() => router.push("/create"))}
                />
              </div>
            </div>
          </div>
        </FaceSafeFrame>
      </div>
    </main>
  );
}

type AffordancesProps = {
  onSeeEveryone: () => void;
  onPickForMe: () => void;
  onDescribe: () => void;
};

function Affordances({ onSeeEveryone, onPickForMe, onDescribe }: AffordancesProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5 text-[14px] sm:text-[15px] md:gap-3">
      <AffordanceButton onClick={onSeeEveryone} label={reelCopy.actions.seeEveryone} />
      <Sep />
      <AffordanceButton onClick={onPickForMe} label={reelCopy.actions.pickForMe} />
      <Sep />
      <AffordanceButton
        onClick={onDescribe}
        label={reelCopy.actions.describeSomeoneElse}
      />
    </div>
  );
}

function Sep() {
  return <span className="px-1 text-copy/30 md:hidden" aria-hidden>·</span>;
}

function DesktopSep() {
  return <span className="text-copy/25" aria-hidden>·</span>;
}

function ReelTextAction({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-pill px-1 text-copy/65 transition hover:text-copy",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
      )}
    >
      {label}
    </button>
  );
}

function AffordanceButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-pill px-2 py-1 text-copy/85 transition hover:text-copy",
        // Desktop: read as real buttons, legible over any portrait highlight.
        "md:border md:border-line/70 md:bg-ink/45 md:px-4 md:py-2.5 md:text-copy md:shadow-soft md:backdrop-blur md:hover:border-line md:hover:bg-ink/65",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
      )}
    >
      {label}
    </button>
  );
}
