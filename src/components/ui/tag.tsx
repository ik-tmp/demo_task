import { cn } from "@/lib/utils";

type TagProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "muted" | "accent" | "filled";
  accent?: string;
};

export function Tag({
  className,
  tone = "muted",
  accent,
  style,
  ...props
}: TagProps) {
  const accentStyle =
    tone === "accent" && accent
      ? {
          background: `${accent}1f`,
          borderColor: `${accent}55`,
          color: "#fff6ee",
        }
      : undefined;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-[11px] font-medium tracking-[0.04em] uppercase whitespace-nowrap",
        tone === "muted" && "border-copy/12 bg-copy/5 text-copy-muted",
        tone === "filled" && "border-transparent bg-copy text-ink",
        tone === "accent" && !accent && "border-coral/40 bg-coral/15 text-copy",
        className,
      )}
      style={{ ...accentStyle, ...style }}
      {...props}
    />
  );
}
