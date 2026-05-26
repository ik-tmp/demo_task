import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "entry" },
  { href: "/browse", label: "browse" },
  { href: "/match", label: "match" },
  { href: "/create", label: "create" },
] as const;

type AppShellProps = {
  children: React.ReactNode;
  activePath?: string;
};

export function AppShell({ children, activePath }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-ink/72 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="font-serif text-2xl text-copy">
            ai companion
          </Link>
          <div className="flex items-center gap-1 rounded-card border border-line bg-copy/6 p-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-[6px] px-3 py-2 text-sm text-copy-muted transition hover:text-copy",
                  activePath === item.href && "bg-copy text-ink hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
