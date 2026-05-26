import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ChoiceCardProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  hint?: string;
  accent: string;
  trailing?: React.ReactNode;
  active?: boolean;
};

export const ChoiceCard = forwardRef<HTMLButtonElement, ChoiceCardProps>(
  function ChoiceCard(
    { label, hint, accent, trailing, active, className, type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "group/choice relative flex w-full items-center gap-4 overflow-hidden rounded-tile border bg-copy/[0.05] px-4 py-4 text-left transition duration-300 ease-[var(--ease-out)] select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:px-5 sm:py-5",
          active
            ? "border-copy/40 bg-copy/[0.12]"
            : "border-line hover:border-copy/30 hover:bg-copy/[0.09]",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 opacity-0 transition duration-500 group-hover/choice:opacity-100 group-focus-visible/choice:opacity-100",
            active && "opacity-100",
          )}
          style={{
            background: `radial-gradient(120% 80% at 0% 50%, ${accent}28, transparent 65%)`,
          }}
        />
        <span
          aria-hidden
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full transition duration-300"
          style={{
            background: `radial-gradient(circle at 35% 30%, #fff6ee, ${accent})`,
            boxShadow: `0 8px 24px ${accent}3a`,
          }}
        >
          <span
            className="h-2.5 w-2.5 rounded-full bg-ink/70"
            style={{
              animation: active ? "pulse-dot 1.6s ease-in-out infinite" : undefined,
            }}
          />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[17px] font-medium tracking-tight text-copy sm:text-[18px]">
            {label}
          </span>
          {hint ? (
            <span className="mt-0.5 text-[13.5px] text-copy-muted">{hint}</span>
          ) : null}
        </span>
        {trailing ? (
          <span
            className={cn(
              "ml-auto inline-flex shrink-0 items-center text-copy-muted transition duration-300 group-hover/choice:text-copy group-hover/choice:translate-x-0.5",
              active && "text-copy translate-x-0.5",
            )}
          >
            {trailing}
          </span>
        ) : null}
      </button>
    );
  },
);
