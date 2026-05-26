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
      <header className="sticky top-0 z-30 border-b border-line bg-ink/65 backdrop-blur-xl">
        <nav className="mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 outline-none"
          >
            <span
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-tile shadow-soft transition group-hover:scale-[1.04]"
              style={{
                background:
                  "radial-gradient(circle at 30% 25%, #fff6ee, #f5be58 70%)",
              }}
            >
              <span className="font-serif text-[13px] text-ink">h</span>
            </span>
            <span className="font-serif text-[17px] tracking-tight text-copy">
              honey
            </span>
          </Link>

          <div className="flex items-center gap-0.5 rounded-pill border border-line bg-copy/[0.05] p-1">
            {navItems.map((item) => {
              const active = activePath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-pill px-3 py-1.5 text-[13px] tracking-tight transition",
                    active
                      ? "bg-copy text-ink shadow-soft"
                      : "text-copy-muted hover:text-copy",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
