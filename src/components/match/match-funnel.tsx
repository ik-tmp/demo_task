"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Compass, MessageCircle, Users } from "lucide-react";
import { matchDialogue } from "@/data/match-dialogue";
import { cn } from "@/lib/utils";
import { useFunnelStore } from "@/store/funnel-store";
import type { MatchPersonalization } from "@/types/session";
import type { Companion } from "@/types/companion";
import {
  type AvoidId,
  type FamiliarityId,
  type FeelingId,
  type MatchAxis,
  type MatchAnswers,
  type RejectionAxis,
  type RoleId,
  type TextureId,
  composeRevealLines,
  composeWhyHer,
  isAmbiguous,
  pickMatch,
  reactionFor,
} from "@/lib/match";
import { motionMs, motionSec } from "@/lib/motion";
import { FunnelShell } from "@/components/funnel/funnel-shell";
import { FunnelStep } from "@/components/funnel/funnel-step";
import { HostLine } from "@/components/funnel/host-line";

type Step =
  | "intro"
  | "feeling"
  | "role"
  | "texture"
  | "avoid"
  | "familiarity"
  | "loading"
  | "reveal"
  | "rejection-diagnostic"
  | "create-handoff";

const TOTAL_DOTS = 5; // feeling, role, texture, avoid, [familiarity OR reveal]
const BLUR_BY_STEP: Record<Step, number> = {
  intro: 38,
  feeling: 30,
  role: 24,
  texture: 18,
  avoid: 12,
  familiarity: 10,
  loading: 8,
  reveal: 0,
  "rejection-diagnostic": 18,
  "create-handoff": 0,
};

const matchChoices = matchDialogue.choices;
const matchPrompts = matchDialogue.prompts;
const matchActions = matchDialogue.actions;
const matchRevealLabels = matchDialogue.revealLabels;

type Pill = { id: string; label: string; axis: string };

type MatchFunnelProps = {
  companions: Companion[];
};

export function MatchFunnel({ companions }: MatchFunnelProps) {
  const router = useRouter();
  const setMatchPersonalization = useFunnelStore((state) => state.setMatchPersonalization);
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<MatchAnswers>({});
  const [pills, setPills] = useState<Pill[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [rejectionCount, setRejectionCount] = useState(0);
  const [revealLineIndex, setRevealLineIndex] = useState(0);
  const [reaction, setReaction] = useState<string | null>(null);
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
    const t1 = window.setTimeout(() => setRevealLineIndex(1), motionMs(600));
    const t2 = window.setTimeout(() => setRevealLineIndex(2), motionMs(1200));
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
      setReaction(null);
      setStep("reveal");
    }, motionMs(900));
    return () => {
      if (revealTimerRef.current) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [step]);

  const goBack = () => {
    if (step === "role") return setStep("feeling");
    if (step === "texture") return setStep("role");
    if (step === "avoid") return setStep("texture");
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
    // Jump straight to a confident low-risk reveal.
    setStep("reveal");
  };

  // ---- Submit handlers ----------------------------------------------------

  const handleFeeling = (ids: string[]) => {
    const id = ids[0] as FeelingId;
    const label = matchChoices.feeling.find((c) => c.id === id)!.label;
    const next = { ...answers, feeling: id };
    setAnswers(next);
    setMatchPersonalization(toMatchPersonalization(next));
    setPills((p) => [...p, { id: `feeling-${id}`, label, axis: "feeling" }]);
    setReaction(reactionFor("feeling", id));
    setStep("role");
  };
  const handleRole = (ids: string[]) => {
    const id = ids[0] as RoleId;
    const label = matchChoices.role.find((c) => c.id === id)!.label;
    const next = { ...answers, role: id };
    setAnswers(next);
    setMatchPersonalization(toMatchPersonalization(next));
    setPills((p) => [...p, { id: `role-${id}`, label, axis: "role" }]);
    setReaction(reactionFor("role", id));
    setStep("texture");
  };
  const handleTexture = (ids: string[]) => {
    const id = ids[0] as TextureId;
    const label = matchChoices.texture.find((c) => c.id === id)!.label;
    const next = { ...answers, texture: id };
    setAnswers(next);
    setMatchPersonalization(toMatchPersonalization(next));
    setPills((p) => [...p, { id: `texture-${id}`, label, axis: "texture" }]);
    setReaction(reactionFor("texture", id));
    setStep("avoid");
  };
  const handleAvoid = (ids: string[]) => {
    const cast = ids as AvoidId[];
    const next: MatchAnswers = { ...answers, avoid: cast };
    setAnswers(next);
    setMatchPersonalization(toMatchPersonalization(next));
    setPills((p) => [
      ...p,
      ...cast.map((id) => ({
        id: `avoid-${id}`,
        label: matchChoices.avoid.find((c) => c.id === id)!.label,
        axis: "avoid",
      })),
    ]);
    setReaction(reactionFor("avoid", cast[0]));
    // Q4 only fires when prior answers can't distinguish 2+ candidates.
    if (isAmbiguous(companions, next)) {
      setStep("familiarity");
    } else {
      setStep("loading");
    }
  };
  const handleFamiliarity = (ids: string[]) => {
    const id = ids[0] as FamiliarityId;
    const label = matchChoices.familiarity.find((c) => c.id === id)!.label;
    const next = { ...answers, familiarity: id };
    setAnswers(next);
    setMatchPersonalization(toMatchPersonalization(next));
    setPills((p) => [...p, { id: `fam-${id}`, label, axis: "familiarity" }]);
    setReaction(reactionFor("familiarity", id));
    setStep("loading");
  };
  const handleFreeText = (axis: MatchAxis) => (text: string) => {
    const next: MatchAnswers = {
      ...answers,
      freeText: {
        ...answers.freeText,
        [axis]: text,
      },
    };
    setAnswers(next);
    setMatchPersonalization(toMatchPersonalization(next));
    setPills((p) => [
      ...p,
      { id: `${axis}-text`, label: `"${truncate(text, 22)}"`, axis: String(axis) },
    ]);
    setReaction(matchPrompts.freeTextReaction);
    if (axis === "feeling") setStep("role");
    else if (axis === "role") setStep("texture");
    else if (axis === "texture") setStep("avoid");
    else if (axis === "avoid") setStep("loading");
    else setStep("loading");
  };
  const removePill = (id: string) => {
    const removed = pills.find((p) => p.id === id);
    setPills((p) => p.filter((x) => x.id !== id));
    if (!removed) return;
    const next: MatchAnswers = { ...answers, freeText: { ...answers.freeText } };
    if (removed.axis === "feeling") next.feeling = undefined;
    if (removed.axis === "role") next.role = undefined;
    if (removed.axis === "texture") next.texture = undefined;
    if (removed.axis === "avoid")
      next.avoid = next.avoid?.filter((x) => `avoid-${x}` !== id);
    if (removed.axis === "familiarity") next.familiarity = undefined;
    if (id.endsWith("-text")) {
      delete next.freeText?.[removed.axis as keyof NonNullable<MatchAnswers["freeText"]>];
    }
    setAnswers(next);
    setMatchPersonalization(toMatchPersonalization(next));
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
      loadingLine={step === "loading" ? matchPrompts.loading : reaction}
      onBack={goBack}
      onSkip={
        step === "feeling" || step === "role" || step === "texture" || step === "avoid"
          ? skip
          : undefined
      }
      skipLabel={matchActions.skip}
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
            <HostLine>{matchPrompts.intro}</HostLine>
            <button
              type="button"
              onClick={() => setStep("feeling")}
              className="inline-flex items-center gap-1.5 self-start rounded-pill border border-coral/60 bg-coral/12 px-3.5 py-1.5 text-[13px] text-coral hover:border-coral hover:bg-coral/20"
            >
              {matchActions.start} <ArrowRight size={14} />
            </button>
          </motion.div>
        ) : null}

        {step === "feeling" ? (
          <motion.div key="feeling" {...fade} className="flex flex-col gap-3">
            <FunnelStep
              question={matchPrompts.feeling}
              choices={matchChoices.feeling}
              onSubmit={handleFeeling}
              onFreeText={handleFreeText("feeling")}
              freeTextPlaceholder={matchPrompts.freeTextPlaceholder}
            />
          </motion.div>
        ) : null}

        {step === "role" ? (
          <motion.div key="role" {...fade} className="flex flex-col gap-3">
            <FunnelStep
              question={
                answers.feeling
                  ? matchPrompts.roleWithFeeling
                  : matchPrompts.roleFallback
              }
              choices={matchChoices.role}
              onSubmit={handleRole}
              onFreeText={handleFreeText("role")}
            />
          </motion.div>
        ) : null}

        {step === "texture" ? (
          <motion.div key="texture" {...fade} className="flex flex-col gap-3">
            <FunnelStep
              question={matchPrompts.texture}
              choices={matchChoices.texture}
              onSubmit={handleTexture}
              onFreeText={handleFreeText("texture")}
            />
          </motion.div>
        ) : null}

        {step === "avoid" ? (
          <motion.div key="avoid" {...fade} className="flex flex-col gap-3">
            <FunnelStep
              question={matchPrompts.avoid}
              choices={matchChoices.avoid}
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
              question={matchPrompts.familiarity}
              choices={matchChoices.familiarity}
              onSubmit={handleFamiliarity}
            />
          </motion.div>
        ) : null}

        {step === "loading" ? (
          <motion.div key="loading" {...fade}>
            <HostLine variant="secondary">{matchPrompts.loading}</HostLine>
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
            <HostLine>{matchPrompts.rejectionDiagnostic}</HostLine>
            <FunnelStep
              question=""
              choices={matchChoices.rejectionAxis}
              onSubmit={handleRejection}
            />
          </motion.div>
        ) : null}

        {step === "create-handoff" ? (
          <motion.div key="handoff" {...fade} className="flex flex-col gap-3">
            <HostLine>{matchPrompts.createHandoff}</HostLine>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => router.push("/create")}
                className="inline-flex items-center gap-1.5 rounded-pill border border-coral/60 bg-coral/12 px-3.5 py-1.5 text-[13px] text-coral hover:border-coral hover:bg-coral/20"
              >
                {matchActions.describeSomeone} <ArrowRight size={14} />
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
                {matchActions.oneMoreTry}
              </button>
              <button
                type="button"
                onClick={() => router.push("/gallery")}
                className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-copy/8 px-3.5 py-1.5 text-[13px] text-copy hover:bg-copy/14"
              >
                {matchActions.seeEveryone}
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
  transition: { duration: motionSec(0.32), ease: "easeOut" as const },
};

function stepToDotIndex(step: Step): number {
  switch (step) {
    case "intro":
    case "feeling":
      return 0;
    case "role":
      return 1;
    case "texture":
      return 2;
    case "avoid":
      return 3;
    case "familiarity":
    case "loading":
    case "reveal":
    case "rejection-diagnostic":
    case "create-handoff":
      return 4;
  }
}

function truncate(s: string, n: number) {
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`;
}

function toMatchPersonalization(answers: MatchAnswers): MatchPersonalization {
  const label = (axis: keyof typeof matchChoices, id?: string) =>
    id ? matchChoices[axis].find((c) => c.id === id)?.label : undefined;

  return {
    feeling: label("feeling", answers.feeling),
    role: label("role", answers.role),
    texture: label("texture", answers.texture),
    avoid: answers.avoid
      ?.map((id) => label("avoid", id))
      .filter((value): value is string => Boolean(value)),
    familiarity: label("familiarity", answers.familiarity),
    freeText: answers.freeText,
  };
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
        <p className="text-[12px] uppercase tracking-[0.16em] text-copy-faint">
          {matchRevealLabels.whyHer}
        </p>
        <ul className="mt-2 space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="text-[14px] leading-[1.5] text-copy/90">
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-card border border-line/60 bg-copy/[0.04] p-3.5">
        <p className="text-[12px] uppercase tracking-[0.16em] text-copy-faint">
          {matchRevealLabels.firstMessage}
        </p>
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
          <MessageCircle size={14} /> {matchActions.sayHi}
        </button>
        <button
          type="button"
          onClick={onShowAnother}
          className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-copy/8 px-3.5 py-1.5 text-[13px] text-copy hover:bg-copy/14"
        >
          <Compass size={14} /> {matchActions.showAnother}
        </button>
        <button
          type="button"
          onClick={onOpenEveryone}
          className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-copy/8 px-3.5 py-1.5 text-[13px] text-copy hover:bg-copy/14"
        >
          <Users size={14} /> {matchActions.openEveryone}
        </button>
      </div>
    </div>
  );
}
