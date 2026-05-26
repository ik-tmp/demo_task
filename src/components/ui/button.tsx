import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  asChild = false,
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-card px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-coral text-ink hover:bg-gold",
        variant === "secondary" &&
          "border border-line bg-copy/8 text-copy hover:border-copy/35 hover:bg-copy/12",
        variant === "ghost" &&
          "text-copy-muted hover:bg-copy/8 hover:text-copy",
        className,
      )}
      type={asChild ? undefined : type}
      {...props}
    />
  );
}
