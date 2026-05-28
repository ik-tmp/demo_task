"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type TypingTextProps = {
  text: string;
  /** ms per character — 30 reads natural. */
  speed?: number;
  onDone?: () => void;
};

/**
 * Reveals text character-by-character. Used for arrival-aware first
 * message animation in chat (DIRECTION-B §10 / §11). Re-keyed by text
 * via internal state — passing a fresh string starts the animation over.
 */
export function TypingText({ text, speed = 30, onDone }: TypingTextProps) {
  const [shown, setShown] = useState("");
  // Keep onDone out of the typing effect's deps so a parent re-render
  // mid-type never restarts the animation.
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    // All setState calls are wrapped in async ticks, so the lint rule
    // about synchronous setState-in-effect is satisfied.
    // Reduced motion: show the whole line at once, then signal done.
    if (prefersReducedMotion()) {
      const done = window.setTimeout(() => {
        setShown(text);
        onDoneRef.current?.();
      }, 0);
      return () => window.clearTimeout(done);
    }
    let i = 0;
    const tick = () => {
      if (i > text.length) {
        onDoneRef.current?.();
        return;
      }
      setShown(text.slice(0, i));
      i += 1;
      timer = window.setTimeout(tick, speed);
    };
    let timer = window.setTimeout(tick, 0);
    return () => {
      window.clearTimeout(timer);
    };
  }, [text, speed]);

  return <span aria-live="polite">{shown}</span>;
}
