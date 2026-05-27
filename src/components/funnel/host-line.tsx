"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type HostLineProps = {
  children: React.ReactNode;
  className?: string;
  /** Use a quieter, smaller variant for sub-prompts after the main question. */
  variant?: "primary" | "secondary";
};

/**
 * Host voice rendering. Per DIRECTION-B §11, the Host is intentionally
 * less photoreal than the companions — a small typeface block, no avatar.
 * Quiet text, not a character.
 */
export function HostLine({ children, className, variant = "primary" }: HostLineProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        variant === "primary"
          ? "text-[17px] leading-[1.35] text-copy sm:text-[19px]"
          : "text-[14px] leading-[1.4] text-copy-muted",
        className,
      )}
    >
      {children}
    </motion.p>
  );
}
