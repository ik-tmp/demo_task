import { cn } from "@/lib/utils";

type DisplayProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3";
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses: Record<NonNullable<DisplayProps["size"]>, string> = {
  sm: "text-3xl sm:text-4xl",
  md: "text-4xl sm:text-5xl lg:text-6xl",
  lg: "text-5xl sm:text-6xl lg:text-7xl",
  xl: "text-[3.25rem] leading-[1.02] sm:text-[4.5rem] lg:text-[5.75rem]",
};

export function Display({
  as = "h1",
  size = "lg",
  className,
  ...props
}: DisplayProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "font-serif font-normal leading-[1.04] tracking-[-0.02em] text-copy [text-wrap:balance]",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
