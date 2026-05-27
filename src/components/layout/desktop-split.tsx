"use client";

import { cn } from "@/lib/utils";

type DesktopSplitProps = {
  portrait: React.ReactNode;
  chat: React.ReactNode;
  /** Portrait column width as a percentage. Default 66 (within 60–70 target). */
  portraitPct?: number;
  className?: string;
};

/**
 * Two-column layout for desktop surfaces. Portrait column takes 60–70% of
 * viewport width (default 66%); chat column is fixed-narrower. Column
 * widths are stable across funnel transitions — only inner content
 * changes. Hidden below `md`; mobile uses the stacked layout instead.
 */
export function DesktopSplit({
  portrait,
  chat,
  portraitPct = 66,
  className,
}: DesktopSplitProps) {
  const chatPct = 100 - portraitPct;
  return (
    <div
      className={cn(
        "hidden md:grid h-full w-full",
        className,
      )}
      style={{
        // Chat on the left (narrow), portrait on the right (wide) per §11.
        gridTemplateColumns: `${chatPct}% ${portraitPct}%`,
      }}
      data-desktop-split
    >
      <div
        className="relative flex h-full flex-col border-r border-line bg-ink-deep"
        data-chat-column
      >
        {chat}
      </div>
      <div className="relative h-full overflow-hidden" data-portrait-column>
        {portrait}
      </div>
    </div>
  );
}

/** Mobile sibling: portrait fills the viewport, chat sheet stacks below. */
export function MobileStack({
  portrait,
  className,
}: {
  portrait: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("relative h-[100dvh] w-full md:hidden", className)}
      data-mobile-stack
    >
      {portrait}
    </div>
  );
}
