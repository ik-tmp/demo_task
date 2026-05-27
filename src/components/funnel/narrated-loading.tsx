"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type NarratedLoadingProps = {
  line: string | null;
  className?: string;
};

/**
 * Italic narrated loading line ("trying a warmer room…", "asking around…").
 * Dissolves in/out as `line` changes. Per DIRECTION-B §5 forward-motion
 * mechanic — bridges step transitions with timing rather than blanks.
 */
export function NarratedLoading({ line, className }: NarratedLoadingProps) {
  return (
    <div className={cn("min-h-[20px]", className)}>
      <AnimatePresence mode="wait">
        {line ? (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="text-[13px] italic text-copy-muted"
          >
            {line}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
