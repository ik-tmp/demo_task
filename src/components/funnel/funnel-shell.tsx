"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { FaceSafeFrame } from "@/components/layout/face-safe-frame";
import { PortraitStage } from "@/components/layout/portrait-stage";
import { PillRow } from "./pill";
import { DotTrail } from "./dot-trail";
import { NarratedLoading } from "./narrated-loading";
import type { FaceSafeRegion } from "@/types/companion";

export type FunnelPortrait = {
  src: string;
  alt: string;
  faceSafe: FaceSafeRegion;
  focalY?: number;
  blurPx?: number;
};

type FunnelShellProps = {
  portrait: FunnelPortrait;
  pills?: { id: string; label: string }[];
  onRemovePill?: (id: string) => void;
  progress?: { current: number; total: number };
  loadingLine?: string | null;
  onBack?: () => void;
  onSkip?: () => void;
  skipLabel?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Single-tree funnel shell.
 *
 * Mobile (<md):  portrait fills the viewport. Chat sheet overlays the
 *                bottom, capped at `100% − face-safe-bottom − 8px` so it
 *                cannot encroach on the face. Soft gradient on top edge.
 * Desktop (≥md): grid with chat (~34%) on the left and portrait (~66%)
 *                on the right. Chat column has its own background; no
 *                gradient needed.
 *
 * The chat body is rendered exactly once. Layout differences are CSS-only.
 */
export function FunnelShell({
  portrait,
  pills = [],
  onRemovePill,
  progress,
  loadingLine = null,
  onBack,
  onSkip,
  skipLabel = "just meet them",
  children,
  className,
}: FunnelShellProps) {
  const faceSafeBottomPct = portrait.faceSafe.topPct + portrait.faceSafe.heightPct;
  const cssVars = {
    "--face-safe-bottom": `${faceSafeBottomPct}%`,
  } as React.CSSProperties;

  return (
    <main
      className={cn(
        "relative h-[100dvh] w-full bg-ink-deep text-copy",
        "grid grid-cols-1 grid-rows-1",
        "md:grid-cols-[34%_66%] md:[grid-template-areas:'chat_portrait']",
        "[grid-template-areas:'stack']",
        className,
      )}
      style={cssVars}
    >
      {/* Portrait region. */}
      <div
        className={cn(
          "relative h-full w-full overflow-hidden",
          "[grid-area:stack] md:[grid-area:portrait]",
        )}
      >
        <div className="absolute inset-0 mx-auto h-full max-w-[calc(100dvh*16/9)]">
          <FaceSafeFrame region={portrait.faceSafe} className="h-full w-full">
            <PortraitStage
              src={portrait.src}
              alt={portrait.alt}
              focalY={portrait.focalY}
              blurPx={portrait.blurPx}
              motion
              priority
            />
          </FaceSafeFrame>
        </div>
      </div>

      {/* Chat region — overlays portrait on mobile, own column on desktop. */}
      <div
        data-chat-sheet
        data-face-safe-respects
        className={cn(
          "z-30 self-end flex flex-col",
          "[grid-area:stack] md:[grid-area:chat]",
          // Mobile: bottom overlay, height capped by face-safe.
          "max-h-[calc(100%_-_var(--face-safe-bottom)_-_8px)]",
          // Desktop: full column, own background, no cap.
          "md:self-stretch md:max-h-none md:border-r md:border-line md:bg-ink-deep",
        )}
      >
        {/* Top-blend gradient (mobile only — desktop column has its own bg). */}
        <div
          aria-hidden
          className="pointer-events-none relative h-8 w-full shrink-0 md:hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(15,13,22,0) 0%, rgba(15,13,22,0.62) 60%, rgba(15,13,22,0.88) 100%)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          />
        </div>

        <div className="relative flex flex-1 flex-col overflow-y-auto overscroll-contain bg-ink-deep/92 pb-[max(env(safe-area-inset-bottom),12px)] backdrop-blur-xl md:bg-transparent md:backdrop-blur-none md:pb-0">
          <ChatBody
            pills={pills}
            onRemovePill={onRemovePill}
            progress={progress}
            loadingLine={loadingLine}
            onBack={onBack}
            onSkip={onSkip}
            skipLabel={skipLabel}
          >
            {children}
          </ChatBody>
        </div>
      </div>
    </main>
  );
}

type ChatBodyProps = {
  pills: { id: string; label: string }[];
  onRemovePill?: (id: string) => void;
  progress?: { current: number; total: number };
  loadingLine: string | null;
  onBack?: () => void;
  onSkip?: () => void;
  skipLabel: string;
  children: React.ReactNode;
};

function ChatBody({
  pills,
  onRemovePill,
  progress,
  loadingLine,
  onBack,
  onSkip,
  skipLabel,
  children,
}: ChatBodyProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line/60 px-5 py-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="back"
            className="inline-flex items-center gap-1 rounded-pill px-2 py-1 text-[13px] text-copy-muted transition hover:text-copy"
          >
            <ArrowLeft size={14} />
            back
          </button>
        ) : (
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-pill px-2 py-1 text-[13px] text-copy-muted transition hover:text-copy"
          >
            <ArrowLeft size={14} />
            reel
          </Link>
        )}
        {progress ? (
          <DotTrail current={progress.current} total={progress.total} />
        ) : (
          <span />
        )}
      </div>

      {pills.length > 0 ? (
        <div className="shrink-0 border-b border-line/40 px-5 py-2.5">
          <PillRow pills={pills} onRemove={onRemovePill} />
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4">
        <div className="flex flex-col gap-5">
          {children}
          <NarratedLoading line={loadingLine} />
        </div>
      </div>

      {onSkip ? (
        <div className="shrink-0 border-t border-line/40 px-5 py-2.5">
          <button
            type="button"
            onClick={onSkip}
            className="text-[12px] text-copy-faint transition hover:text-copy-muted"
          >
            {skipLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
