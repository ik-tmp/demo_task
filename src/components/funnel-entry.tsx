"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { useFunnelStore, type Branch } from "@/store/funnel-store";

const choices: Array<{
  label: string;
  href: Route;
  branch: Branch;
  accent: string;
}> = [
  {
    label: "Just looking around",
    href: "/browse",
    branch: "browse",
    accent: "#62d2c6",
  },
  {
    label: "Match me with someone",
    href: "/match",
    branch: "match",
    accent: "#ff7f6e",
  },
  {
    label: "I have someone in mind",
    href: "/create",
    branch: "create",
    accent: "#c99cff",
  },
];

export function FunnelEntry() {
  const router = useRouter();
  const setBranch = useFunnelStore((state) => state.setBranch);
  const [activeAccent, setActiveAccent] = useState("#f5be58");

  const background = useMemo(
    () => ({
      background:
        `radial-gradient(circle at 50% 24%, ${activeAccent}40, transparent 26rem), ` +
        "radial-gradient(circle at 82% 68%, rgb(98 210 198 / 0.16), transparent 30rem), " +
        "linear-gradient(135deg, #15131a 0%, #211d2b 55%, #181622 100%)",
    }),
    [activeAccent],
  );

  function choose(choice: (typeof choices)[number]) {
    setBranch(choice.branch);
    router.push(choice.href);
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-5 py-12 transition-[background] duration-500"
      style={background}
    >
      <section className="grid w-full max-w-6xl items-end gap-12 lg:grid-cols-[1fr_24rem]">
        <div className="flex min-h-[70vh] flex-col justify-center">
          <p className="mb-5 text-sm uppercase tracking-[0.16em] text-copy-muted">
            first hello
          </p>
          <h1 className="max-w-3xl font-serif text-6xl leading-none text-copy sm:text-7xl lg:text-8xl">
            Hey. Who do you want to meet?
          </h1>
          <div className="mt-10 grid max-w-2xl gap-3">
            {choices.map((choice) => (
              <Chip
                key={choice.branch}
                size="large"
                onMouseEnter={() => setActiveAccent(choice.accent)}
                onFocus={() => setActiveAccent(choice.accent)}
                onClick={() => choose(choice)}
              >
                <span>{choice.label}</span>
                <ArrowRight size={18} aria-hidden className="ml-auto" />
              </Chip>
            ))}
          </div>
          <button
            className="mt-8 w-fit text-left text-sm text-copy-muted underline decoration-copy-muted/50 underline-offset-4 transition hover:text-copy"
            onClick={() => choose(choices[0])}
          >
            Skip and just show me everyone
          </button>
        </div>

        <aside className="rounded-card border border-line bg-copy/8 p-5 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.16em] text-copy-muted">
            session thread
          </p>
          <div className="mt-8 space-y-3">
            <div className="rounded-card bg-copy px-4 py-3 text-ink">
              Hey. Who do you want to meet?
            </div>
            <div className="ml-auto w-fit rounded-card border border-line px-4 py-3 text-copy-muted">
              pick a path to begin
            </div>
          </div>
          <Button className="mt-8 w-full" onClick={() => choose(choices[1])}>
            Start with match
          </Button>
        </aside>
      </section>
    </main>
  );
}
