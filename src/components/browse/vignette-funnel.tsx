"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle, Users } from "lucide-react";
import { surfaceDialogue } from "@/data/surface-dialogue";
import type { Companion } from "@/types/companion";
import { PREVIEW_QA_MAX_TURNS, previewAnswer } from "@/lib/browse";
import { motionSec } from "@/lib/motion";
import { FunnelShell } from "@/components/funnel/funnel-shell";
import { HostLine } from "@/components/funnel/host-line";
import { Chip } from "@/components/ui/chip";

type Step = "intro" | "samples";
type QA = { id: number; q: string; a: string };
const browseCopy = surfaceDialogue.browse;
const commonCopy = surfaceDialogue.common;

type VignetteFunnelProps = {
  companion: Companion;
};

export function VignetteFunnel({ companion }: VignetteFunnelProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [qa, setQa] = useState<QA[]>([]);
  const [ask, setAsk] = useState("");
  const turnRef = useRef(0);

  const sayHi = () => router.push(`/chat/${companion.id}?from=browse`);
  const tellMore = () => setStep("samples");
  const seeEveryone = () => router.push("/gallery");
  const showSofter = () => router.push("/gallery?softer=1");
  const showSharper = () => router.push("/gallery?sharper=1");

  const atQaLimit = qa.length >= PREVIEW_QA_MAX_TURNS;
  const submitAsk = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || atQaLimit) return;
    const answer = previewAnswer(companion, turnRef.current);
    turnRef.current += 1;
    setQa((cur) => [...cur, { id: turnRef.current, q: trimmed, a: answer }]);
    setAsk("");
  };

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
            <HostLine variant="secondary">{browseCopy.hostIntro(companion)}</HostLine>
            <div className="flex flex-wrap items-center gap-2">
              <PrimaryChip onClick={sayHi} icon={<MessageCircle size={14} />}>
                {browseCopy.actions.sayHi(companion.name)}
              </PrimaryChip>
              <Chip onClick={tellMore}>{browseCopy.actions.tellMore}</Chip>
              <Chip onClick={seeEveryone}>{browseCopy.actions.seeEveryone}</Chip>
            </div>
          </motion.div>
        ) : null}

        {step === "samples" ? (
          <motion.div key="samples" {...fade} className="flex flex-col gap-4">
            <HostLine variant="secondary">{browseCopy.samplesIntro}</HostLine>
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
              {browseCopy.voicePrompt(companion.voiceDescribedAs)}
            </HostLine>

            {qa.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {qa.map((item) => (
                  <div key={item.id} className="flex flex-col gap-2.5">
                    <div className="max-w-[88%] self-end rounded-tile border border-transparent bg-copy px-3.5 py-2.5 text-[14px] leading-[1.5] text-ink">
                      {item.q}
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.26, ease: "easeOut" }}
                      className="max-w-[88%] self-start rounded-tile border border-line bg-copy/[0.07] px-3.5 py-2.5 text-[14px] italic leading-[1.5] text-copy"
                    >
                      {item.a}
                    </motion.div>
                  </div>
                ))}
              </div>
            ) : null}

            {!atQaLimit ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitAsk(ask);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={ask}
                  onChange={(e) => setAsk(e.target.value)}
                  placeholder={browseCopy.askPlaceholder(companion.name)}
                  aria-label={browseCopy.askPlaceholder(companion.name)}
                  className="flex-1 rounded-pill border border-line bg-copy/5 px-4 py-2 text-[13px] text-copy placeholder:text-copy-faint focus:border-copy/35 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!ask.trim()}
                  aria-label={commonCopy.sendAria}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line bg-copy/8 text-copy transition hover:bg-copy/14 disabled:opacity-40"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <HostLine variant="secondary">{browseCopy.qaLimitPrompt}</HostLine>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <PrimaryChip onClick={sayHi} icon={<MessageCircle size={14} />}>
                {browseCopy.actions.sayHi(companion.name)}
              </PrimaryChip>
              <Chip onClick={showSofter}>{browseCopy.actions.showSofter}</Chip>
              <Chip onClick={showSharper}>{browseCopy.actions.showSharper}</Chip>
              <Chip onClick={seeEveryone} className="inline-flex items-center gap-1.5">
                <Users size={14} />
                {browseCopy.actions.seeEveryone}
              </Chip>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </FunnelShell>
  );
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
  transition: { duration: motionSec(0.28), ease: "easeOut" as const },
};
