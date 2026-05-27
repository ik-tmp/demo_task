import { cn } from "@/lib/utils";

type DotTrailProps = {
  /** Total steps the funnel anticipates. Reflects intent, not commitment. */
  total: number;
  /** Zero-based current step. */
  current: number;
  className?: string;
};

/**
 * Inferred progress trail per DIRECTION-B §5. Not labelled "Step 2 of 5";
 * the user should read "this has shape" without it feeling like a form.
 */
export function DotTrail({ total, current, className }: DotTrailProps) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={cn("flex items-center gap-1.5", className)}
    >
      {Array.from({ length: total }, (_, i) => {
        const filled = i < current;
        const active = i === current;
        return (
          <span
            key={i}
            className={cn(
              "block h-[2px] rounded-full transition-all duration-500 ease-[var(--ease-out)]",
              filled && "w-4 bg-copy/80",
              active && "w-6 bg-coral",
              !filled && !active && "w-3 bg-copy/20",
            )}
          />
        );
      })}
    </div>
  );
}
