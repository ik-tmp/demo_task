"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

type SurfaceProps = React.HTMLAttributes<HTMLDivElement> & {
  accent?: string;
  /**
   * Visual intensity of the morphing layers.
   * `"hero"` ramps up brightness for entry screens; `"calm"` is for
   * deeper interior surfaces.
   */
  intensity?: "hero" | "calm";
};

export function Surface({
  accent = "#f5be58",
  intensity = "hero",
  className,
  style,
  children,
  ...props
}: SurfaceProps) {
  const layers = useMemo(() => {
    const primaryAlpha = intensity === "hero" ? "55" : "30";
    const secondaryAlpha = intensity === "hero" ? "22" : "14";
    return {
      primary: `radial-gradient(900px circle at 18% -8%, ${accent}${primaryAlpha}, transparent 62%)`,
      secondary: `radial-gradient(680px circle at 92% 110%, ${accent}${secondaryAlpha}, transparent 55%)`,
      base: `linear-gradient(180deg, #1a1824 0%, #15131a 55%, #100e16 100%)`,
    };
  }, [accent, intensity]);

  return (
    <div
      className={cn("relative isolate min-h-screen overflow-hidden", className)}
      style={style}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30 transition-[background] duration-[900ms] ease-[var(--ease-soft)]"
        style={{
          background: `${layers.primary}, ${layers.secondary}, ${layers.base}`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-60 transition duration-700"
        style={{
          background: `radial-gradient(circle at 50% 38%, transparent 0%, transparent 45%, rgb(7 5 12 / 0.45) 100%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 -z-10 h-[36rem] w-[36rem] rounded-full opacity-40 blur-3xl transition duration-1000"
        style={{
          background: `radial-gradient(circle, ${accent}66 0%, transparent 70%)`,
          animation: "drift 14s ease-in-out infinite",
        }}
      />
      <div className="grain -z-10" aria-hidden />
      {children}
    </div>
  );
}
