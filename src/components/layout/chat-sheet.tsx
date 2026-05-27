"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFaceSafe } from "./face-safe-frame";

type ChatSheetProps = {
  /**
   * Minimum visible height of the sheet at rest (px). The sheet is allowed
   * to be shorter than this if its content is shorter — the rule is that
   * the sheet never reserves empty vertical space.
   */
  minRestPx?: number;
  /**
   * When true, the sheet does not render the top-blend gradient. Use when
   * the sheet sits inside a desktop column that has its own background and
   * does not overlay portrait pixels.
   */
  noBlend?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/**
 * Mobile / overlay chat sheet. Sits at the bottom of its FaceSafeFrame
 * parent, sizes fluidly to content, scrolls internally before encroaching
 * on the face-safe region, and softens its top edge with a gradient +
 * backdrop-blur so it blends into the portrait rather than cutting it.
 *
 * Hard rules (DIRECTION-B §4 / §13):
 *  - The sheet's top edge (including the gradient zone) must never enter
 *    the face-safe region. Enforced via max-height.
 *  - The gradient zone (~32px) is decorative — no text, chips, or taps
 *    inside it. Content sits below the fully-opaque portion.
 *  - Height changes are continuous animations, not snaps between fixed
 *    heights.
 */
export function ChatSheet({
  className,
  style,
  children,
  minRestPx = 96,
  noBlend = false,
}: ChatSheetProps) {
  const { bottomPct } = useFaceSafe();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentH, setContentH] = useState<number>(minRestPx);
  const GRADIENT_H = 32;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect.height ?? minRestPx;
      setContentH(Math.max(minRestPx, Math.ceil(h)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [minRestPx]);

  // Max height: distance from sheet bottom to face-safe bottom edge,
  // capped to viewport. (We sit inside a FaceSafeFrame whose height is
  // the portrait height; bottomPct is the face-safe bottom as a % of it.)
  const maxHeight = `calc(100% - ${bottomPct}% - 8px)`;
  const targetHeight = `min(${contentH + GRADIENT_H}px, ${maxHeight})`;

  return (
    <motion.div
      data-chat-sheet
      data-face-safe-respects
      className={cn(
        "pointer-events-auto absolute inset-x-0 bottom-0 z-30 flex flex-col",
        className,
      )}
      initial={false}
      animate={{ height: targetHeight }}
      transition={{ type: "spring", stiffness: 260, damping: 36, mass: 0.7 }}
      style={{
        maxHeight,
        ...style,
      }}
    >
      {/* Gradient blend zone — decorative; no content allowed inside. */}
      {noBlend ? null : (
        <div
          aria-hidden
          className="pointer-events-none relative w-full shrink-0"
          style={{ height: GRADIENT_H }}
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
      )}
      <div
        className={cn(
          "relative flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(env(safe-area-inset-bottom),16px)] pt-2",
          noBlend ? "bg-transparent" : "bg-ink-deep/92 backdrop-blur-xl",
        )}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </motion.div>
  );
}
