"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    // All setState calls are wrapped in async ticks, so the lint rule
    // about synchronous setState-in-effect is satisfied.
    let i = 0;
    const tick = () => {
      if (i > text.length) {
        onDone?.();
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
  }, [text, speed, onDone]);

  return <span aria-live="polite">{shown}</span>;
}
