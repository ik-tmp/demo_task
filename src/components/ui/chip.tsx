import { cn } from "@/lib/utils";

type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "default" | "quiet";
  size?: "default" | "large";
};

export function Chip({
  className,
  tone = "default",
  size = "default",
  type = "button",
  ...props
}: ChipProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-card border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral",
        size === "default" && "min-h-9 px-3 text-sm",
        size === "large" && "min-h-14 px-5 text-base sm:text-lg",
        tone === "default" &&
          "border-line bg-copy/10 text-copy hover:border-copy/40 hover:bg-copy/15",
        tone === "quiet" &&
          "border-copy/10 bg-copy/7 text-copy-muted hover:border-copy/25 hover:text-copy",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
