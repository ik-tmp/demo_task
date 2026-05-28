"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { surfaceDialogue } from "@/data/surface-dialogue";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";

const commonCopy = surfaceDialogue.common;

export type StepChoice = {
  id: string;
  label: string;
  /** Optional sublabel for richer chips. */
  hint?: string;
};

type FunnelStepProps = {
  question: string;
  choices: StepChoice[];
  /** When true, the user can pick multiple choices and commit. */
  multiSelect?: boolean;
  /** Initial selection (for back-restored state). */
  initialSelected?: string[];
  /** Multi-select cap — after which extra picks are rejected. */
  maxSelect?: number;
  onSubmit: (selectedIds: string[]) => void;
  /** Optional free-text submission handler. */
  onFreeText?: (text: string) => void;
  freeTextPlaceholder?: string;
  className?: string;
};

/**
 * One funnel step: question + chip row + optional free text. Selection
 * animates as a "ghost" before persisting upward as a pill (the parent
 * is responsible for adding the pill on receipt of onSubmit).
 */
export function FunnelStep({
  question,
  choices,
  multiSelect = false,
  initialSelected = [],
  maxSelect,
  onSubmit,
  onFreeText,
  freeTextPlaceholder = commonCopy.freeTextPlaceholder,
  className,
}: FunnelStepProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [text, setText] = useState("");

  const toggle = (id: string) => {
    if (multiSelect) {
      setSelected((cur) => {
        if (cur.includes(id)) return cur.filter((x) => x !== id);
        if (maxSelect && cur.length >= maxSelect) return cur;
        return [...cur, id];
      });
      return;
    }
    // Single-select submits immediately.
    onSubmit([id]);
  };

  const submitMulti = () => {
    if (selected.length === 0) return;
    onSubmit(selected);
  };

  const handleText = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onFreeText?.(trimmed);
    setText("");
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {question ? (
        <p className="text-[17px] leading-[1.35] text-copy sm:text-[19px]">
          {question}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {choices.map((c) => {
            const isSelected = selected.includes(c.id);
            return (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Chip
                  size="default"
                  selected={isSelected}
                  onClick={() => toggle(c.id)}
                  aria-pressed={multiSelect ? isSelected : undefined}
                >
                  {c.label}
                  {c.hint ? (
                    <span className="ml-1 text-[11px] text-copy-faint">{c.hint}</span>
                  ) : null}
                </Chip>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {multiSelect ? (
        <button
          type="button"
          onClick={submitMulti}
          disabled={selected.length === 0}
          className={cn(
            "inline-flex items-center gap-1.5 self-start rounded-pill border border-coral/60 bg-coral/12 px-3.5 py-1.5 text-[13px] text-coral transition",
            "hover:border-coral hover:bg-coral/20",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          {commonCopy.continue}
          <ArrowRight size={14} />
        </button>
      ) : null}

      <form onSubmit={handleText} className="mt-1 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={freeTextPlaceholder}
          aria-label={commonCopy.freeTextPlaceholder}
          className={cn(
            "flex-1 rounded-pill border border-line bg-copy/5 px-4 py-2 text-[14px] text-copy placeholder:text-copy-faint",
            "focus:border-copy/35 focus:outline-none",
          )}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label={commonCopy.sendAria}
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full border border-line bg-copy/8 text-copy transition",
            "hover:bg-copy/14 disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
