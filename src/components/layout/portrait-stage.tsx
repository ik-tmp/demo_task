"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

const SOFT_FAIL_SRC = "/companions/_shared/soft-fail.png";
const CROSSFADE_SEC = 0.55;

type PortraitStageProps = {
  src: string;
  alt: string;
  /** When true, applies the subtle Ken Burns / parallax motion treatment. */
  motion?: boolean;
  /** Optional CSS blur strength in px (used for Match's "narrowing in" state). */
  blurPx?: number;
  /** Vertical focal point (0–100) — where the face sits in the source. */
  focalY?: number;
  priority?: boolean;
  className?: string;
};

type Layer = { src: string; key: number };

/**
 * Renders the companion portrait. When `src` changes on a live instance (e.g.
 * the chat/funnel portrait shifting as the user answers), the previous image
 * stays put until the new one has loaded, then the two crossfade — no hard cut
 * or flash. The Ken Burns transform wraps the whole stack so parallax stays
 * continuous across the swap. Reduced motion collapses the crossfade to an
 * instant swap.
 */
export function PortraitStage({
  src,
  alt,
  motion: animate = true,
  blurPx,
  focalY = 28,
  priority = false,
  className,
}: PortraitStageProps) {
  const keyRef = useRef(0);
  const [layers, setLayers] = useState<Layer[]>(() => [{ src, key: 0 }]);

  // A new src stacks a fresh layer on top; identical src is a no-op.
  useEffect(() => {
    setLayers((prev) => {
      const top = prev[prev.length - 1];
      if (top && top.src === src) return prev;
      keyRef.current += 1;
      return [...prev, { src, key: keyRef.current }];
    });
  }, [src]);

  // Once a layer is fully shown, drop everything beneath it.
  const settleLayer = useCallback((key: number) => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.key === key);
      return idx <= 0 ? prev : prev.slice(idx);
    });
  }, []);

  const blurStyle = blurPx ? { filter: `blur(${blurPx}px)` } : undefined;

  const stack = layers.map((layer, i) => (
    <PortraitLayer
      key={layer.key}
      layerKey={layer.key}
      src={layer.src}
      alt={alt}
      focalY={focalY}
      blurStyle={blurStyle}
      priority={priority && i === 0}
      isFirst={i === 0}
      onSettled={settleLayer}
    />
  ));

  return (
    <div className={cn("absolute inset-0 h-full w-full", className)}>
      {animate ? (
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.02, x: 0, y: 0 }}
          animate={{
            scale: [1.02, 1.05, 1.02],
            x: ["0%", "-0.6%", "0%"],
            y: ["0%", "0.8%", "0%"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {stack}
        </motion.div>
      ) : (
        stack
      )}
      {/* Edge vignetting — keeps text legible against bright portrait highlights. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,13,22,0.30) 0%, rgba(15,13,22,0) 24%, rgba(15,13,22,0) 56%, rgba(15,13,22,0.75) 100%)",
        }}
      />
    </div>
  );
}

type PortraitLayerProps = {
  layerKey: number;
  src: string;
  alt: string;
  focalY: number;
  blurStyle?: React.CSSProperties;
  priority: boolean;
  isFirst: boolean;
  onSettled: (key: number) => void;
};

function PortraitLayer({
  layerKey,
  src,
  alt,
  focalY,
  blurStyle,
  priority,
  isFirst,
  onSettled,
}: PortraitLayerProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const instant = prefersReducedMotion();
  const effectiveSrc = failed ? SOFT_FAIL_SRC : src;

  // The base layer and reduced-motion swaps appear immediately; stacked
  // layers wait until their image has loaded so the crossfade never reveals
  // a blank frame.
  const shown = isFirst || instant || loaded;

  // After the crossfade settles, ask the parent to prune the layers beneath.
  useEffect(() => {
    if (!shown || isFirst) return;
    const ms = instant ? 0 : CROSSFADE_SEC * 1000;
    const t = window.setTimeout(() => onSettled(layerKey), ms);
    return () => window.clearTimeout(t);
  }, [shown, isFirst, instant, layerKey, onSettled]);

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: isFirst || instant ? 1 : 0 }}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={{ duration: instant ? 0 : CROSSFADE_SEC, ease: "easeInOut" }}
    >
      <Image
        src={effectiveSrc}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="h-full w-full object-cover"
        style={{ objectPosition: `50% ${focalY}%`, ...blurStyle }}
        priority={priority}
        loading={priority ? undefined : "eager"}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </motion.div>
  );
}
