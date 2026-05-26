import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-copy/7 shadow-2xl shadow-ink/20",
        className,
      )}
      {...props}
    />
  );
}
