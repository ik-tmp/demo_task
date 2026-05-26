import { cn } from "@/lib/utils";

type EyebrowProps = React.HTMLAttributes<HTMLParagraphElement> & {
  tone?: "muted" | "accent";
};

export function Eyebrow({
  className,
  tone = "muted",
  ...props
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.22em]",
        tone === "muted" && "text-copy-muted",
        tone === "accent" && "text-coral",
        className,
      )}
      {...props}
    />
  );
}
