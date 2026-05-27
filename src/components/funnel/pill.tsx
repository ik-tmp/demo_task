"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type PillProps = {
  label: string;
  onRemove?: () => void;
  className?: string;
};

/**
 * Summary pill that persists a chosen answer above the chat panel.
 * Removable when onRemove is supplied. Animates in via a brief ghost.
 */
export function Pill({ label, onRemove, className }: PillProps) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.92, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -4 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      data-pill={label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border border-line bg-copy/10 px-3 py-1 text-[12px] tracking-tight text-copy",
        className,
      )}
    >
      <span>{label}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`remove ${label}`}
          className="grid h-4 w-4 place-items-center rounded-full text-copy/60 transition hover:bg-copy/15 hover:text-copy"
        >
          <X size={12} />
        </button>
      ) : null}
    </motion.span>
  );
}

type PillRowProps = {
  pills: { id: string; label: string }[];
  onRemove?: (id: string) => void;
  className?: string;
};

export function PillRow({ pills, onRemove, className }: PillRowProps) {
  if (pills.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {pills.map((p) => (
        <Pill
          key={p.id}
          label={p.label}
          onRemove={onRemove ? () => onRemove(p.id) : undefined}
        />
      ))}
    </div>
  );
}
