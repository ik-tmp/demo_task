import { cn } from "@/lib/utils";

type DotlineProps = {
  count: number;
  active: number;
  className?: string;
};

export function Dotline({ count, active, className }: DotlineProps) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      role="presentation"
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => {
        const isActive = i === active;
        return (
          <span
            key={i}
            className={cn(
              "block h-[3px] rounded-full transition-all duration-500 ease-[var(--ease-out)]",
              isActive
                ? "w-7 bg-copy"
                : "w-3 bg-copy/30",
            )}
          />
        );
      })}
    </div>
  );
}
