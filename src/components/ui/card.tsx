import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "raised" | "muted" | "glass";
  interactive?: boolean;
};

const variantClasses: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "border-line bg-copy/[0.06]",
  raised: "border-line bg-ink-soft shadow-deep",
  muted: "border-copy/8 bg-copy/[0.03]",
  glass: "border-line bg-ink-glass backdrop-blur-xl",
};

export function Card({
  className,
  variant = "default",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-card border",
        variantClasses[variant],
        interactive &&
          "cursor-pointer transition duration-200 ease-[var(--ease-out)] hover:-translate-y-[2px] hover:border-copy/30 hover:bg-copy/[0.09]",
        className,
      )}
      {...props}
    />
  );
}
