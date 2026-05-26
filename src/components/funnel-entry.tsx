"use client";

import { useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Compass, Sparkles, Wand2 } from "lucide-react";
import { ChoiceCard } from "@/components/ui/choice-card";
import { Surface } from "@/components/ui/surface";
import { Display } from "@/components/ui/display";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Avatar } from "@/components/ui/avatar";
import { Tag } from "@/components/ui/tag";
import { MessageBubble } from "@/components/ui/message-bubble";
import { characters } from "@/lib/characters";
import { useFunnelStore, type Branch } from "@/store/funnel-store";

type Choice = {
  branch: Branch;
  label: string;
  hint: string;
  href: Route;
  accent: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const DEFAULT_ACCENT = "#f5be58";

const choices: Choice[] = [
  {
    branch: "browse",
    label: "Just looking around",
    hint: "Show me who's here. I'll pick someone myself.",
    href: "/browse",
    accent: "#62d2c6",
    icon: Compass,
  },
  {
    branch: "match",
    label: "Match me with someone",
    hint: "Ask me a few things. Pick for me.",
    href: "/match",
    accent: "#ffb29f",
    icon: Sparkles,
  },
  {
    branch: "create",
    label: "I have someone in mind",
    hint: "Help me build them from scratch.",
    href: "/create",
    accent: "#c99cff",
    icon: Wand2,
  },
];

export function FunnelEntry() {
  const router = useRouter();
  const setBranch = useFunnelStore((state) => state.setBranch);
  const [hovered, setHovered] = useState<number | null>(null);

  const activeAccent = hovered !== null ? choices[hovered].accent : DEFAULT_ACCENT;
  const activeChoice = hovered !== null ? choices[hovered] : null;

  function choose(choice: Choice) {
    setBranch(choice.branch);
    router.push(choice.href);
  }

  return (
    <Surface accent={activeAccent}>
      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pt-8 pb-10 sm:px-8 sm:pt-10 lg:px-12">
        <TopBar accent={activeAccent} />

        <section className="grid flex-1 items-center gap-12 py-10 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <HeroColumn
            choices={choices}
            hovered={hovered}
            setHovered={setHovered}
            onChoose={choose}
          />

          <aside className="hidden lg:block">
            <PreviewPanel activeChoice={activeChoice} accent={activeAccent} />
          </aside>
        </section>

        <FooterBar />
      </main>
    </Surface>
  );
}

function TopBar({ accent }: { accent: string }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-9 w-9 place-items-center rounded-tile transition duration-500"
          style={{
            background: `linear-gradient(135deg, ${accent}, #fff6ee)`,
            boxShadow: `0 12px 30px ${accent}40`,
          }}
        >
          <span className="font-serif text-[15px] text-ink">h</span>
        </span>
        <div className="leading-tight">
          <p className="font-serif text-[18px] text-copy">honey</p>
          <p className="text-[11px] tracking-[0.18em] uppercase text-copy-muted">
            companion
          </p>
        </div>
      </div>
      <Eyebrow tone="muted" className="hidden sm:block">
        first hello
      </Eyebrow>
    </header>
  );
}

type HeroColumnProps = {
  choices: Choice[];
  hovered: number | null;
  setHovered: (n: number | null) => void;
  onChoose: (c: Choice) => void;
};

function HeroColumn({ choices, hovered, setHovered, onChoose }: HeroColumnProps) {
  return (
    <div className="flex flex-col">
      <p className="mb-5 inline-flex items-center gap-2 text-[13px] text-copy-muted">
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-coral/60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-coral" />
        </span>
        we&apos;re live. say hi when you&apos;re ready.
      </p>

      <Display size="xl" className="max-w-[18ch]">
        Hey. Who do you want to meet?
      </Display>

      <p className="mt-6 max-w-md text-[15.5px] leading-7 text-copy-muted">
        Three ways in. Hover one and the room shifts to match. Pick the door
        that fits the mood.
      </p>

      <div className="mt-9 grid max-w-xl gap-3">
        {choices.map((choice, index) => (
          <ChoiceCard
            key={choice.branch}
            label={choice.label}
            hint={choice.hint}
            accent={choice.accent}
            active={hovered === index}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(index)}
            onBlur={() => setHovered(null)}
            onClick={() => onChoose(choice)}
            trailing={<ArrowUpRight size={18} aria-hidden />}
          />
        ))}
      </div>

      <button
        onClick={() => onChoose(choices[0])}
        className="mt-8 w-fit text-[13.5px] text-copy-muted underline decoration-copy-muted/40 underline-offset-[5px] transition hover:text-copy hover:decoration-copy"
      >
        Skip and just show me everyone
      </button>
    </div>
  );
}

function FooterBar() {
  return (
    <footer className="mt-10 flex items-center justify-between text-[12px] text-copy-faint">
      <span className="tracking-[0.12em] uppercase">
        no signup · session only
      </span>
      <span className="hidden tracking-[0.12em] uppercase sm:inline">
        v0 · entry experience
      </span>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Preview Panel — morphs in response to which choice is hovered.
// ---------------------------------------------------------------------------

type PreviewPanelProps = {
  activeChoice: Choice | null;
  accent: string;
};

const previewVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.65, 0.3, 1] as const } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] as const } },
};

function PreviewPanel({ activeChoice, accent }: PreviewPanelProps) {
  const key = activeChoice?.branch ?? "idle";

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -inset-y-10 -z-10 rounded-[28px] opacity-90 blur-2xl transition duration-700"
        style={{
          background: `radial-gradient(60% 50% at 60% 30%, ${accent}26, transparent 70%)`,
        }}
      />
      <div className="relative overflow-hidden rounded-tile border border-line bg-ink-glass p-5 shadow-glow backdrop-blur-xl sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <Eyebrow tone="muted">a peek inside</Eyebrow>
          <span
            aria-hidden
            className="h-2 w-2 rounded-full transition duration-500"
            style={{ background: accent, boxShadow: `0 0 16px ${accent}` }}
          />
        </div>
        <div className="relative min-h-[22rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              variants={previewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-4"
            >
              {key === "browse" && <BrowsePreview />}
              {key === "match" && <MatchPreview />}
              {key === "create" && <CreatePreview />}
              {key === "idle" && <IdlePreview />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function IdlePreview() {
  const featured = characters[0];
  return (
    <>
      <p className="font-serif text-[22px] leading-[1.25] text-copy">
        Make a choice. The room shifts.
      </p>
      <p className="text-[14px] leading-6 text-copy-muted">
        Whatever you pick, you&apos;re one chip away from the others. Nothing
        commits you here.
      </p>

      <div className="mt-2 flex items-start gap-3 rounded-tile border border-line bg-copy/[0.04] p-3">
        <Avatar
          name={featured.name}
          accent={featured.accent}
          size="sm"
          shape="disc"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-serif text-[17px] text-copy">{featured.name}</p>
            <Tag tone="accent" accent={featured.accent}>
              popular
            </Tag>
          </div>
          <p className="mt-0.5 line-clamp-2 text-[13.5px] leading-5 text-copy-muted">
            {featured.bio}
          </p>
        </div>
      </div>

      <MessageBubble variant="system" className="mt-1 text-[13px]">
        psst — there are {characters.length} characters waiting on the other
        side.
      </MessageBubble>
    </>
  );
}

function BrowsePreview() {
  const sample = characters.slice(0, 3);
  return (
    <>
      <p className="font-serif text-[22px] leading-[1.25] text-copy">
        A room full of someones.
      </p>
      <p className="text-[14px] leading-6 text-copy-muted">
        Search, filter, scroll. Each card opens a small sample of how they
        talk before you commit.
      </p>

      <div className="mt-2 flex flex-col gap-2.5">
        {sample.map((character, i) => (
          <motion.div
            key={character.id}
            initial={{ opacity: 0, x: 14 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { delay: 0.06 + i * 0.05, duration: 0.35 },
            }}
            className="flex items-center gap-3 rounded-tile border border-line bg-copy/[0.05] p-2.5"
          >
            <Avatar
              name={character.name}
              accent={character.accent}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-[15.5px] text-copy">
                {character.name}
              </p>
              <p className="truncate text-[12.5px] text-copy-muted">
                {character.tags.slice(0, 3).join(" · ")}
              </p>
            </div>
            <ArrowUpRight
              size={16}
              className="text-copy-muted"
              aria-hidden
            />
          </motion.div>
        ))}
      </div>
    </>
  );
}

function MatchPreview() {
  const pick = characters[0];
  return (
    <>
      <p className="font-serif text-[22px] leading-[1.25] text-copy">
        I&apos;ll find someone for you.
      </p>
      <p className="text-[14px] leading-6 text-copy-muted">
        A few quick questions. One reveal. If it&apos;s wrong, the next pick
        is one tap away.
      </p>

      <div className="mt-2 flex flex-col gap-3 rounded-tile border border-line bg-copy/[0.05] p-4">
        <div className="flex items-center gap-3">
          <Avatar
            name={pick.name}
            accent={pick.accent}
            size="md"
            shape="disc"
          />
          <div className="min-w-0">
            <p className="font-serif text-[20px] leading-tight text-copy">
              {pick.name}
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {pick.tags.slice(0, 3).map((tag) => (
                <Tag key={tag} tone="accent" accent={pick.accent}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </div>
        <MessageBubble accent={pick.accent} className="text-[14px]">
          {pick.opener}
        </MessageBubble>
      </div>

      <p className="text-[12.5px] tracking-[0.12em] uppercase text-copy-faint">
        — here&apos;s why · cozy · listener · warm
      </p>
    </>
  );
}

function CreatePreview() {
  const steps = [
    { label: "Archetype", value: "Companion" },
    { label: "Traits", value: "Warm · Witty" },
    { label: "Voice", value: "—" },
    { label: "Name", value: "—" },
  ];
  return (
    <>
      <p className="font-serif text-[22px] leading-[1.25] text-copy">
        Bring them to life.
      </p>
      <p className="text-[14px] leading-6 text-copy-muted">
        Four light steps. A live preview on the side. You&apos;ll watch your
        character become real as you choose.
      </p>

      <div className="mt-2 flex items-start gap-3 rounded-tile border border-line bg-copy/[0.05] p-3.5">
        <div
          aria-hidden
          className="grid h-14 w-14 shrink-0 place-items-center rounded-tile border border-dashed border-copy/25 bg-copy/[0.04]"
        >
          <Wand2 size={20} className="text-copy-muted" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.05 + i * 0.05, duration: 0.3 },
              }}
              className="flex items-baseline justify-between gap-3"
            >
              <span className="text-[11px] tracking-[0.14em] uppercase text-copy-faint">
                {step.label}
              </span>
              <span
                className={
                  step.value === "—"
                    ? "text-[13px] text-copy-faint"
                    : "text-[13.5px] text-copy"
                }
              >
                {step.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <MessageBubble variant="system" className="text-[13px]">
        templates fill in as you pick. nothing is locked.
      </MessageBubble>
    </>
  );
}
