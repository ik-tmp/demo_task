import { cn } from "@/lib/utils";

type AvatarProps = {
  name: string;
  accent: string;
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "tile" | "disc";
  className?: string;
};

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-10 w-10 text-sm",
  md: "h-16 w-16 text-xl",
  lg: "h-24 w-24 text-3xl",
  xl: "h-36 w-36 text-5xl",
};

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({
  name,
  accent,
  size = "md",
  shape = "tile",
  className,
}: AvatarProps) {
  const initials = initialsOf(name);
  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden font-serif text-ink shadow-soft",
        sizeClasses[size],
        shape === "tile" ? "rounded-tile" : "rounded-full",
        className,
      )}
      style={{
        background: `radial-gradient(circle at 28% 22%, #fff6ee, ${accent} 65%, ${accent})`,
      }}
      aria-label={name}
      role="img"
    >
      <span
        className="absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{
          background: `radial-gradient(circle at 80% 90%, rgb(0 0 0 / 0.55), transparent 60%)`,
        }}
        aria-hidden
      />
      <span className="relative z-[1] leading-none">{initials}</span>
    </div>
  );
}
