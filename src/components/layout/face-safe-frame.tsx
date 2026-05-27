"use client";

import { createContext, useContext, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { FaceSafeRegion } from "@/types/companion";

type FaceSafeContextValue = {
  /** Vertical position (0–100) where the face region starts. */
  topPct: number;
  /** Height (0–100) of the face region as a percentage of the portrait. */
  heightPct: number;
  /** Bottom edge of the face region as a percentage (topPct + heightPct). */
  bottomPct: number;
};

const FaceSafeContext = createContext<FaceSafeContextValue | null>(null);

export function useFaceSafe(): FaceSafeContextValue {
  const ctx = useContext(FaceSafeContext);
  if (!ctx) {
    throw new Error(
      "useFaceSafe must be used inside a <FaceSafeFrame> — the portrait surface owns face-safe geometry.",
    );
  }
  return ctx;
}

type FaceSafeFrameProps = React.HTMLAttributes<HTMLDivElement> & {
  region: FaceSafeRegion;
  /**
   * When true, renders a faint debug outline over the face-safe region.
   * Drives the §13 layout-failure-mode Playwright fixtures.
   */
  debug?: boolean;
};

/**
 * Wraps a portrait stage and exposes face-safe geometry to descendants
 * via CSS custom properties and React context. Descendants compute their
 * own max-heights and overlay positions from this — face-safe is not a
 * designer convention, it is a layout invariant (DIRECTION-B §4).
 *
 * The frame itself is just a positioning context; it does not render the
 * portrait. Use <PortraitStage> as the immediate child for the standard
 * portrait + Ken Burns treatment.
 */
export function FaceSafeFrame({
  region,
  debug = false,
  className,
  style,
  children,
  ...props
}: FaceSafeFrameProps) {
  const value = useMemo<FaceSafeContextValue>(
    () => ({
      topPct: region.topPct,
      heightPct: region.heightPct,
      bottomPct: region.topPct + region.heightPct,
    }),
    [region.topPct, region.heightPct],
  );

  const cssVars = {
    "--face-safe-top": `${value.topPct}%`,
    "--face-safe-height": `${value.heightPct}%`,
    "--face-safe-bottom": `${value.bottomPct}%`,
  } as React.CSSProperties;

  return (
    <FaceSafeContext.Provider value={value}>
      <div
        className={cn("relative isolate overflow-hidden", className)}
        style={{ ...cssVars, ...style }}
        data-face-safe-frame
        {...props}
      >
        {children}
        {debug ? (
          <div
            aria-hidden
            data-face-safe-debug
            className="pointer-events-none absolute inset-x-0 z-50 border-y border-dashed border-coral/60"
            style={{
              top: `${value.topPct}%`,
              height: `${value.heightPct}%`,
              background: "rgba(255,127,110,0.06)",
            }}
          />
        ) : null}
      </div>
    </FaceSafeContext.Provider>
  );
}
