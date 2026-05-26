import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import type { Character } from "@/types/character";
import { cn } from "@/lib/utils";

type CharacterCardProps = {
  character: Character;
  href?: Route;
  className?: string;
  variant?: "default" | "compact";
};

export function CharacterCard({
  character,
  href,
  className,
  variant = "default",
}: CharacterCardProps) {
  const content = (
    <Card
      variant="default"
      interactive
      className={cn(
        "relative isolate flex h-full flex-col gap-4 overflow-hidden p-5",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 -z-10 h-56 w-56 rounded-full opacity-40 blur-3xl transition duration-500 group-hover:opacity-70"
        style={{
          background: `radial-gradient(circle, ${character.accent}66, transparent 70%)`,
        }}
      />
      <div className="flex items-start gap-4">
        <Avatar
          name={character.name}
          accent={character.accent}
          size={variant === "compact" ? "sm" : "md"}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-[22px] leading-tight tracking-tight text-copy">
              {character.name}
            </h3>
            <ArrowUpRight
              size={18}
              aria-hidden
              className="mt-1 shrink-0 text-copy-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-copy"
            />
          </div>
          <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-5 text-copy-muted">
            {character.bio}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {character.tags.slice(0, 3).map((tag) => (
          <Tag key={tag} tone="accent" accent={character.accent}>
            {tag}
          </Tag>
        ))}
      </div>

      <p className="mt-auto border-t border-line pt-3.5 text-[13.5px] leading-5 text-copy-muted italic transition duration-300 md:opacity-60 md:group-hover:opacity-100">
        “{character.opener}”
      </p>
    </Card>
  );

  if (!href) {
    return <div className="group">{content}</div>;
  }

  return (
    <Link
      href={href}
      className="group block focus:outline-none focus-visible:[&>div]:ring-2 focus-visible:[&>div]:ring-coral focus-visible:[&>div]:ring-offset-2 focus-visible:[&>div]:ring-offset-ink"
    >
      {content}
    </Link>
  );
}
