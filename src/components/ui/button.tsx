import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "min-h-9 px-3 text-[13px]",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-14 px-6 text-base",
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-coral text-ink shadow-soft hover:bg-rose active:translate-y-[1px] active:shadow-none",
  secondary:
    "border border-line bg-copy/8 text-copy hover:border-copy/35 hover:bg-copy/14",
  ghost: "text-copy-muted hover:bg-copy/8 hover:text-copy",
  outline:
    "border border-copy/25 bg-transparent text-copy hover:border-copy/55 hover:bg-copy/6",
};

export function Button({
  asChild = false,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "group/btn relative inline-flex items-center justify-center gap-2 rounded-card font-semibold tracking-tight whitespace-nowrap transition duration-200 ease-[var(--ease-out)] select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      type={asChild ? undefined : type}
      {...props}
    />
  );
}
