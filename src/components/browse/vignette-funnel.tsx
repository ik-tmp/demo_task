"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Users } from "lucide-react";
import type { Companion } from "@/types/companion";
import { FunnelShell } from "@/components/funnel/funnel-shell";
import { HostLine } from "@/components/funnel/host-line";
import { Chip } from "@/components/ui/chip";

type Step = "intro" | "samples" | "more";

type VignetteFunnelProps = {
  companion: Companion;
};

export function VignetteFunnel({ companion }: VignetteFunnelProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");

  const sayHi = () => router.push(`/chat/${companion.id}?from=browse`);
  const tellMore = () => setStep("samples");
  const seeEveryone = () => router.push("/gallery");
  const showSofter = () => router.push("/gallery?softer=1");
  const showSharper = () => router.push("/gallery?sharper=1");

  return (
    <FunnelShell
      portrait={{
        src: companion.assets.reel,
        alt: `${companion.name} — ${companion.scene}`,
        faceSafe: companion.faceSafe,
      }}
    >
      <AnimatePresence mode="wait">
        {step === "intro" ? (
          <motion.div key="intro" {...fade} className="flex flex-col gap-4">
            <div>
              <p className="font-serif text-[32px] leading-[1.05] text-copy sm:text-[40px]">
                {companion.name}
              </p>
              <p className="mt-1.5 text-[15px] text-copy/85">{companion.premise}</p>
            </div>
            <HostLine variant="secondary">
              {hostIntro(companion)}
            </HostLine>
            <div className="flex flex-wrap items-center gap-2">
              <PrimaryChip onClick={sayHi} icon={<MessageCircle size={14} />}>
                say hi to {companion.name}
              </PrimaryChip>
              <Chip onClick={tellMore}>tell me more</Chip>
              <Chip onClick={seeEveryone}>see everyone</Chip>
            </div>
          </motion.div>
        ) : null}

        {step === "samples" ? (
          <motion.div key="samples" {...fade} className="flex flex-col gap-4">
            <HostLine variant="secondary">
              {`Three things she might open with.`}
            </HostLine>
            <ul className="space-y-2">
              {companion.sampleLines.map((line, i) => (
                <li
                  key={i}
                  className="rounded-tile border border-line/60 bg-copy/[0.05] px-3.5 py-2.5 text-[14px] italic text-copy/90"
                >
                  “{line}”
                </li>
              ))}
            </ul>
            <HostLine variant="secondary">
              {`Her voice is ${companion.voiceDescribedAs}. You can interrupt her any time.`}
            </HostLine>
            <div className="flex flex-wrap items-center gap-2">
              <PrimaryChip onClick={sayHi} icon={<MessageCircle size={14} />}>
                say hi to {companion.name}
              </PrimaryChip>
              <Chip onClick={showSofter}>show me softer</Chip>
              <Chip onClick={showSharper}>show me sharper</Chip>
              <Chip onClick={seeEveryone} className="inline-flex items-center gap-1.5">
                <Users size={14} />
                see everyone
              </Chip>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </FunnelShell>
  );
}

function hostIntro(c: Companion): string {
  // Simple per-energy host intro voice.
  switch (c.energy) {
    case "listener":
      return `${c.name}. Reads a lot, talks slow. Asks good questions and actually waits for the answer.`;
    case "provoker":
      return `${c.name}. Quick. She'll find the part of the story you weren't going to tell.`;
    case "guide":
      return `${c.name}. Knows where she's going. Walks beside you, not in front.`;
    case "confidant":
      return `${c.name}. The long version, every time. She wants the whole shape.`;
  }
}

function PrimaryChip({
  onClick,
  icon,
  children,
}: {
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-pill bg-coral px-4 py-2 text-[14px] font-semibold text-ink shadow-soft transition hover:bg-rose"
    >
      {icon}
      {children}
    </button>
  );
}

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.28, ease: "easeOut" as const },
};
