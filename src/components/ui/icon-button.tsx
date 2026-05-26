import { cn } from "@/lib/utils";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline" | "filled";
  label: string;
};

const sizeClasses: Record<NonNullable<IconButtonProps["size"]>, string> = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

export function IconButton({
  size = "md",
  variant = "ghost",
  label,
  className,
  type = "button",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      type={type}
      className={cn(
        "inline-grid place-items-center rounded-full border transition duration-200 ease-[var(--ease-out)] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        variant === "ghost" &&
          "border-transparent text-copy-muted hover:bg-copy/10 hover:text-copy",
        variant === "outline" &&
          "border-line text-copy hover:border-copy/35 hover:bg-copy/8",
        variant === "filled" &&
          "border-transparent bg-coral text-ink shadow-soft hover:bg-rose",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
