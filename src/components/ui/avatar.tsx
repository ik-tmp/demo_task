import { cn } from "@/lib/utils";

type AvatarProps = {
  name: string;
  accent: string;
  className?: string;
};

export function Avatar({ name, accent, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "grid h-16 w-16 shrink-0 place-items-center rounded-card border border-line font-serif text-xl text-ink shadow-xl",
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${accent}, #fff6ee)`,
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
