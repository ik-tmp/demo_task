"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SOFT_FAIL_SRC = "/companions/_shared/soft-fail.png";

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

export function PortraitStage({
  src,
  alt,
  motion: animate = true,
  blurPx,
  focalY = 28,
  priority = false,
  className,
}: PortraitStageProps) {
  const [failed, setFailed] = useState(false);
  const effectiveSrc = failed ? SOFT_FAIL_SRC : src;
  const blurStyle = blurPx ? { filter: `blur(${blurPx}px)` } : undefined;

  const imgEl = (
    <Image
      key={effectiveSrc}
      src={effectiveSrc}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 70vw, 100vw"
      className={cn("h-full w-full object-cover")}
      style={{
        objectPosition: `50% ${focalY}%`,
        ...blurStyle,
      }}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );

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
          {imgEl}
        </motion.div>
      ) : (
        imgEl
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
