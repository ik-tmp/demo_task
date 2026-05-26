import { cn } from "@/lib/utils";

type MessageBubbleProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "character" | "user" | "system";
  accent?: string;
  tail?: boolean;
};

export function MessageBubble({
  variant = "character",
  accent,
  tail = false,
  className,
  style,
  ...props
}: MessageBubbleProps) {
  const accentStyle =
    variant === "character" && accent
      ? {
          borderColor: `${accent}55`,
          background: `linear-gradient(135deg, ${accent}1a, ${accent}10)`,
        }
      : undefined;

  return (
    <div
      className={cn(
        "relative max-w-[88%] rounded-tile border px-4 py-3 text-[15px] leading-[1.5]",
        variant === "character" &&
          !accent &&
          "border-line bg-copy/[0.07] text-copy",
        variant === "character" && accent && "text-copy",
        variant === "user" &&
          "ml-auto border-transparent bg-copy text-ink shadow-soft",
        variant === "system" &&
          "border-dashed border-copy/15 bg-transparent text-copy-muted italic",
        tail && variant === "character" && "rounded-bl-sm",
        tail && variant === "user" && "rounded-br-sm",
        className,
      )}
      style={{ ...accentStyle, ...style }}
      {...props}
    />
  );
}
