"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Compass, MessageCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Companion } from "@/types/companion";
import {
  type AvoidId,
  type FamiliarityId,
  type FeelingId,
  type MatchAnswers,
  type RejectionAxis,
  type RoleId,
  composeRevealLines,
  composeWhyHer,
  isAmbiguous,
  pickMatch,
} from "@/lib/match";
import { FunnelShell } from "@/components/funnel/funnel-shell";
import { FunnelStep, type StepChoice } from "@/components/funnel/funnel-step";
import { HostLine } from "@/components/funnel/host-line";

type Step =
  | "intro"
  | "feeling"
  | "role"
  | "avoid"
  | "familiarity"
  | "loading"
  | "reveal"
  | "rejection-diagnostic"
  | "create-handoff";

const TOTAL_DOTS = 4; // feeling, role, avoid, [familiarity OR reveal]
const BLUR_BY_STEP: Record<Step, number> = {
  intro: 38,
  feeling: 30,
  role: 22,
  avoid: 14,
  familiarity: 10,
  loading: 8,
  reveal: 0,
  "rejection-diagnostic": 18,
  "create-handoff": 0,
};

const feelingChoices: StepChoice[] = [
  { id: "calmer", label: "calmer" },
  { id: "wanted", label: "wanted" },
  { id: "challenged", label: "challenged" },
  { id: "entertained", label: "entertained" },
  { id: "understood", label: "understood" },
];

const roleChoices: StepChoice[] = [
  { id: "lead", label: "lead" },
  { id: "listen", label: "listen" },
  { id: "tease", label: "tease" },
  { id: "ask", label: "ask" },
  { id: "i-dont-know", label: "I don't know yet" },
];

const avoidChoices: StepChoice[] = [
  { id: "not-fix", label: "not fix" },
  { id: "not-push", label: "not push" },
  { id: "not-flirt", label: "not flirt" },
  { id: "not-perform", label: "not perform" },
  { id: "nothing-specific", label: "nothing specific" },
];

const familiarityChoices: StepChoice[] = [
  { id: "familiar", label: "familiar" },
  { id: "surprising", label: "surprising" },
  { id: "dangerous", label: "a little dangerous" },
];

const rejectionAxisChoices: StepChoice[] = [
  { id: "look", label: "look" },
  { id: "voice", label: "voice" },
  { id: "energy", label: "energy" },
  { id: "all", label: "all of it" },
  { id: "choices", label: "show me choices" },
];

const loadingLines: Record<Step, string | null> = {
  intro: null,
  feeling: null,
  role: "trying a warmer room…",
  avoid: "checking who fits that pace…",
  familiarity: "narrowing it down…",
  loading: "asking around…",
  reveal: null,
  "rejection-diagnostic": null,
  "create-handoff": null,
};

type Pill = { id: string; label: string; axis: string };

type MatchFunnelProps = {
  companions: Companion[];
};

export function MatchFunnel({ companions }: MatchFunnelProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<MatchAnswers>({});
  const [pills, setPills] = useState<Pill[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [rejectionCount, setRejectionCount] = useState(0);
  const [revealLineIndex, setRevealLineIndex] = useState(0);
  const stepIndex = stepToDotIndex(step);

  // Always have a tentative candidate to drive the portrait.
  const candidate = useMemo(() => {
    return pickMatch(companions, answers, rejectedIds);
  }, [companions, answers, rejectedIds]);

  const blurPx = BLUR_BY_STEP[step];

  const revealLines = useMemo(
    () => composeRevealLines(candidate, answers),
    [candidate, answers],
  );

  // Advance through the 3 reveal lines once we enter the reveal step.
  useEffect(() => {
    if (step !== "reveal") return;
    const t1 = window.setTimeout(() => setRevealLineIndex(1), 600);
    const t2 = window.setTimeout(() => setRevealLineIndex(2), 1200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [step]);

  // Move from "loading" → "reveal" after the narrated loading line plays.
  // Reset revealLineIndex here (not in the reveal effect) so we avoid a
  // synchronous setState-in-effect on every re-enter.
  const revealTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (step !== "loading") return;
    revealTimerRef.current = window.setTimeout(() => {
      setRevealLineIndex(0);
      setStep("reveal");
    }, 900);
    return () => {
      if (revealTimerRef.current) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [step]);

  const goBack = () => {
    if (step === "role") return setStep("feeling");
    if (step === "avoid") return setStep("role");
    if (step === "familiarity") return setStep("avoid");
    if (step === "loading" || step === "reveal") {
      // Back from reveal returns to last asked question.
      if (answers.familiarity !== undefined) return setStep("familiarity");
      return setStep("avoid");
    }
    if (step === "rejection-diagnostic") return setStep("reveal");
    if (step === "create-handoff") return setStep("reveal");
    router.push("/");
  };

  const skip = () => {
    // "just meet them" — jump straight to a confident low-risk reveal.
    setStep("reveal");
  };

  // ---- Submit handlers ----------------------------------------------------

  const handleFeeling = (ids: string[]) => {
    const id = ids[0] as FeelingId;
    const label = feelingChoices.find((c) => c.id === id)!.label;
    setAnswers((a) => ({ ...a, feeling: id }));
    setPills((p) => [...p, { id: `feeling-${id}`, label, axis: "feeling" }]);
    setStep("role");
  };
  const handleRole = (ids: string[]) => {
    const id = ids[0] as RoleId;
    const label = roleChoices.find((c) => c.id === id)!.label;
    setAnswers((a) => ({ ...a, role: id }));
    setPills((p) => [...p, { id: `role-${id}`, label, axis: "role" }]);
    setStep("avoid");
  };
  const handleAvoid = (ids: string[]) => {
    const cast = ids as AvoidId[];
    setAnswers((a) => ({ ...a, avoid: cast }));
    setPills((p) => [
      ...p,
      ...cast.map((id) => ({
        id: `avoid-${id}`,
        label: avoidChoices.find((c) => c.id === id)!.label,
        axis: "avoid",
      })),
    ]);
    // Q4 only fires when prior answers can't distinguish 2+ candidates.
    const next: MatchAnswers = { ...answers, avoid: cast };
    if (isAmbiguous(companions, next)) {
      setStep("familiarity");
    } else {
      setStep("loading");
    }
  };
  const handleFamiliarity = (ids: string[]) => {
    const id = ids[0] as FamiliarityId;
    const label = familiarityChoices.find((c) => c.id === id)!.label;
    setAnswers((a) => ({ ...a, familiarity: id }));
    setPills((p) => [...p, { id: `fam-${id}`, label, axis: "familiarity" }]);
    setStep("loading");
  };
  const handleFreeText = (axis: keyof MatchAnswers) => (text: string) => {
    // Demo: free-text fills the axis with a generic "freeform" marker
    // and skips ahead one step.
    setPills((p) => [
      ...p,
      { id: `${axis}-text`, label: `"${truncate(text, 22)}"`, axis: String(axis) },
    ]);
    if (axis === "feeling") setStep("role");
    else if (axis === "role") setStep("avoid");
    else if (axis === "avoid") setStep("loading");
    else setStep("loading");
  };
  const removePill = (id: string) => {
    const removed = pills.find((p) => p.id === id);
    setPills((p) => p.filter((x) => x.id !== id));
    if (!removed) return;
    if (removed.axis === "feeling") setAnswers((a) => ({ ...a, feeling: undefined }));
    if (removed.axis === "role") setAnswers((a) => ({ ...a, role: undefined }));
    if (removed.axis === "avoid")
      setAnswers((a) => ({ ...a, avoid: a.avoid?.filter((x) => `avoid-${x}` !== id) }));
    if (removed.axis === "familiarity")
      setAnswers((a) => ({ ...a, familiarity: undefined }));
  };

  const handleRejection = (ids: string[]) => {
    const axisId = ids[0] as RejectionAxis | "choices";
    if (axisId === "choices") {
      router.push("/gallery");
      return;
    }
    const newRejected = [...rejectedIds, candidate.id];
    setRejectedIds(newRejected);
    setRejectionCount((c) => c + 1);
    if (rejectionCount + 1 >= 2) {
      setStep("create-handoff");
    } else {
      setStep("loading");
    }
  };

  // ---- Render -------------------------------------------------------------

  const portrait = {
    src: step === "reveal" ? candidate.assets.finalChat : candidate.assets.neutral,
    alt: candidate.name,
    faceSafe: candidate.faceSafe,
    blurPx,
  };

  return (
    <FunnelShell
      portrait={portrait}
      pills={pills}
      onRemovePill={removePill}
      progress={
        step === "reveal" || step === "rejection-diagnostic" || step === "create-handoff"
          ? undefined
          : { current: stepIndex, total: TOTAL_DOTS }
      }
      loadingLine={loadingLines[step]}
      onBack={goBack}
      onSkip={
        step === "feeling" || step === "role" || step === "avoid"
          ? skip
          : undefined
      }
      skipLabel="just meet them"
    >
      <AnimatePresence mode="wait">
        {step === "intro" ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            <HostLine>Okay. A few quick things first.</HostLine>
            <button
              type="button"
              onClick={() => setStep("feeling")}
              className="inline-flex items-center gap-1.5 self-start rounded-pill border border-coral/60 bg-coral/12 px-3.5 py-1.5 text-[13px] text-coral hover:border-coral hover:bg-coral/20"
            >
              start <ArrowRight size={14} />
            </button>
          </motion.div>
        ) : null}

        {step === "feeling" ? (
          <motion.div key="feeling" {...fade} className="flex flex-col gap-3">
            <FunnelStep
              question="When they answer, what should you feel?"
              choices={feelingChoices}
              onSubmit={handleFeeling}
              onFreeText={handleFreeText("feeling")}
              freeTextPlaceholder="say it your way"
            />
          </motion.div>
        ) : null}

        {step === "role" ? (
          <motion.div key="role" {...fade} className="flex flex-col gap-3">
            <FunnelStep
              question={
                answers.feeling
                  ? "Should they lead, listen, tease, or ask?"
                  : "Should they ask first, or just be there?"
              }
              choices={roleChoices}
              onSubmit={handleRole}
              onFreeText={handleFreeText("role")}
            />
          </motion.div>
        ) : null}

        {step === "avoid" ? (
          <motion.div key="avoid" {...fade} className="flex flex-col gap-3">
            <FunnelStep
              question="What should the first conversation not do?"
              choices={avoidChoices}
              multiSelect
              maxSelect={3}
              onSubmit={handleAvoid}
              onFreeText={handleFreeText("avoid")}
            />
          </motion.div>
        ) : null}

        {step === "familiarity" ? (
          <motion.div key="fam" {...fade} className="flex flex-col gap-3">
            <FunnelStep
              question="Do you want familiar, surprising, or a little dangerous?"
              choices={familiarityChoices}
              onSubmit={handleFamiliarity}
            />
          </motion.div>
        ) : null}

        {step === "loading" ? (
          <motion.div key="loading" {...fade}>
            <HostLine variant="secondary">putting it together…</HostLine>
          </motion.div>
        ) : null}

        {step === "reveal" ? (
          <motion.div key="reveal" {...fade} className="flex flex-col gap-5">
            <div className="space-y-2.5">
              {revealLines.slice(0, revealLineIndex + 1).map((line, i) => {
                const isLast = i === 2;
                return (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={cn(
                      isLast
                        ? "font-serif text-[22px] leading-tight text-copy sm:text-[26px]"
                        : "text-[15px] italic text-copy-muted",
                    )}
                  >
                    {isLast ? line : line + (line.endsWith("…") ? "" : "…")}
                  </motion.p>
                );
              })}
            </div>

            {revealLineIndex >= 2 ? (
              <RevealActions
                companion={candidate}
                answers={answers}
                onSayHi={() => router.push(`/chat/${candidate.id}?from=match`)}
                onShowAnother={() => setStep("rejection-diagnostic")}
                onOpenEveryone={() => router.push("/gallery")}
              />
            ) : null}
          </motion.div>
        ) : null}

        {step === "rejection-diagnostic" ? (
          <motion.div key="rej" {...fade} className="flex flex-col gap-3">
            <HostLine>Good. That helps. Was it the look, the voice, or the energy?</HostLine>
            <FunnelStep
              question=""
              choices={rejectionAxisChoices}
              onSubmit={handleRejection}
            />
          </motion.div>
        ) : null}

        {step === "create-handoff" ? (
          <motion.div key="handoff" {...fade} className="flex flex-col gap-3">
            <HostLine>{"That's two passes. Want to describe them instead?"}</HostLine>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => router.push("/create")}
                className="inline-flex items-center gap-1.5 rounded-pill border border-coral/60 bg-coral/12 px-3.5 py-1.5 text-[13px] text-coral hover:border-coral hover:bg-coral/20"
              >
                describe someone <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setRejectedIds([]);
                  setRejectionCount(0);
                  setStep("loading");
                }}
                className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-copy/8 px-3.5 py-1.5 text-[13px] text-copy hover:bg-copy/14"
              >
                one more try
              </button>
              <button
                type="button"
                onClick={() => router.push("/gallery")}
                className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-copy/8 px-3.5 py-1.5 text-[13px] text-copy hover:bg-copy/14"
              >
                see everyone
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </FunnelShell>
  );
}

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.32, ease: "easeOut" as const },
};

function stepToDotIndex(step: Step): number {
  switch (step) {
    case "intro":
    case "feeling":
      return 0;
    case "role":
      return 1;
    case "avoid":
      return 2;
    case "familiarity":
    case "loading":
    case "reveal":
    case "rejection-diagnostic":
    case "create-handoff":
      return 3;
  }
}

function truncate(s: string, n: number) {
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`;
}

// ---- Reveal actions -----------------------------------------------------

type RevealActionsProps = {
  companion: Companion;
  answers: MatchAnswers;
  onSayHi: () => void;
  onShowAnother: () => void;
  onOpenEveryone: () => void;
};

function RevealActions({
  companion,
  answers,
  onSayHi,
  onShowAnother,
  onOpenEveryone,
}: RevealActionsProps) {
  const bullets = composeWhyHer(companion, answers);
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-card border border-line/60 bg-copy/[0.05] p-3.5">
        <p className="text-[12px] uppercase tracking-[0.16em] text-copy-faint">Why her</p>
        <ul className="mt-2 space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="text-[14px] leading-[1.5] text-copy/90">
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-card border border-line/60 bg-copy/[0.04] p-3.5">
        <p className="text-[12px] uppercase tracking-[0.16em] text-copy-faint">First message</p>
        <p className="mt-2 text-[15px] italic leading-[1.5] text-copy">
          “{companion.openers.match}”
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onSayHi}
          className="inline-flex items-center gap-1.5 rounded-pill bg-coral px-4 py-2 text-[14px] font-semibold text-ink hover:bg-rose"
        >
          <MessageCircle size={14} /> say hi
        </button>
        <button
          type="button"
          onClick={onShowAnother}
          className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-copy/8 px-3.5 py-1.5 text-[13px] text-copy hover:bg-copy/14"
        >
          <Compass size={14} /> show me another
        </button>
        <button
          type="button"
          onClick={onOpenEveryone}
          className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-copy/8 px-3.5 py-1.5 text-[13px] text-copy hover:bg-copy/14"
        >
          <Users size={14} /> open everyone
        </button>
      </div>
    </div>
  );
}
