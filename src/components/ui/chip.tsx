import { cn } from "@/lib/utils";

type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "default" | "quiet" | "solid";
  size?: "sm" | "default" | "large";
  selected?: boolean;
};

const sizeClasses: Record<NonNullable<ChipProps["size"]>, string> = {
  sm: "min-h-8 px-2.5 text-[12px]",
  default: "min-h-10 px-3.5 text-sm",
  large: "min-h-14 px-5 text-base sm:text-[17px]",
};

export function Chip({
  className,
  tone = "default",
  size = "default",
  selected = false,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-pill border text-left tracking-tight transition duration-200 ease-[var(--ease-out)] select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
        sizeClasses[size],
        tone === "default" &&
          !selected &&
          "border-line bg-copy/8 text-copy hover:border-copy/35 hover:bg-copy/14",
        tone === "quiet" &&
          !selected &&
          "border-copy/10 bg-copy/5 text-copy-muted hover:border-copy/25 hover:bg-copy/10 hover:text-copy",
        tone === "solid" &&
          !selected &&
          "border-transparent bg-panel text-ink hover:bg-panel-muted",
        selected && "border-copy bg-copy text-ink hover:bg-panel-muted",
        className,
      )}
      type={type}
      aria-pressed={selected ? true : undefined}
      {...props}
    />
  );
}
