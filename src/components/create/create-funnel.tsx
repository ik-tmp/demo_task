"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { createDialogue } from "@/data/create-dialogue";
import { surfaceDialogue } from "@/data/surface-dialogue";
import { cn } from "@/lib/utils";
import type { Companion } from "@/types/companion";
import {
  type CreateAnswers,
  type BoundaryId,
  type FeelingId,
  type LookId,
  type RoleId,
  type VoiceId,
  IN_PROGRESS_STAGES,
  composePremise,
  composeShapedItems,
  isConflicting,
  parseFreeText,
  pickFallbackCompanion,
  pickRevealAsset,
  reactionForCreate,
  suggestNames,
} from "@/lib/create";
import { motionMs, motionSec } from "@/lib/motion";
import { FunnelShell } from "@/components/funnel/funnel-shell";
import { FunnelStep } from "@/components/funnel/funnel-step";
import { HostLine } from "@/components/funnel/host-line";

type Step =
  | "feeling"
  | "role"
  | "voice"
  | "pace"
  | "look"
  | "boundaries"
  | "context"
  | "name"
  | "loading"
  | "reveal";

const BLUR_BY_STEP: Record<Step, number> = {
  feeling: 36,
  role: 28,
  voice: 22,
  pace: 18,
  look: 14,
  boundaries: 10,
  context: 8,
  name: 6,
  loading: 4,
  reveal: 0,
};

const createChoices = createDialogue.choices;
const createPrompts = createDialogue.prompts;
const createRevealLabels = createDialogue.revealLabels;
const commonCopy = surfaceDialogue.common;

type Pill = { id: string; label: string; axis: string };
const TOTAL_DOTS = 7;

type CreateFunnelProps = {
  companions: Companion[];
};

export function CreateFunnel({ companions }: CreateFunnelProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("feeling");
  const [answers, setAnswers] = useState<CreateAnswers>({});
  const [pills, setPills] = useState<Pill[]>([]);
  const [chosenName, setChosenName] = useState<string>("");
  const [reaction, setReaction] = useState<string | null>(null);
  const loadingTimerRef = useRef<number | null>(null);

  const candidate = useMemo(
    () => pickFallbackCompanion(companions, answers),
    [companions, answers],
  );

  // In-progress vignettes drive the "you can see her assembling" moment.
  // Stage advances as user answers more steps.
  const stage = stageFromStep(step);
  const reveal = useMemo(
    () => pickRevealAsset(candidate, answers, chosenName),
    [candidate, answers, chosenName],
  );

  const portraitSrc =
    step === "reveal" ? reveal.src : IN_PROGRESS_STAGES[stage];

  // ---- Submit handlers ---------------------------------------------------

  const addPill = (axis: string, ids: string[], lookup: Array<{ id: string; label: string }>) => {
    setPills((p) => [
      ...p.filter((x) => !ids.some((id) => x.id === `${axis}-${id}`)),
      ...ids.map((id) => ({
        id: `${axis}-${id}`,
        label: lookup.find((c) => c.id === id)?.label ?? id,
        axis,
      })),
    ]);
  };

  const handleFeeling = (ids: string[]) => {
    const f = ids as FeelingId[];
    setAnswers((a) => ({ ...a, feelings: f }));
    addPill("feeling", ids, createChoices.feeling);
    setReaction(reactionForCreate("feeling", ids[0]));
    setStep("role");
  };
  const handleRole = (ids: string[]) => {
    const id = ids[0] as RoleId;
    setAnswers((a) => ({ ...a, role: id }));
    addPill("role", [id], createChoices.role);
    setReaction(reactionForCreate("role", id));
    setStep("voice");
  };
  const handleVoice = (id: VoiceId, label: string) => {
    setAnswers((a) => ({ ...a, voice: id }));
    setPills((p) => [
      ...p.filter((x) => x.axis !== "voice"),
      { id: `voice-${id}`, label: `voice: ${label}`, axis: "voice" },
    ]);
    setReaction(reactionForCreate("voice", id));
    // If conflicting feelings, pace fires here. Else go to look.
    if (isConflicting(answers)) setStep("pace");
    else setStep("look");
  };
  const handlePace = (ids: string[]) => {
    const id = ids[0] as "quick" | "unhurried";
    setAnswers((a) => ({ ...a, pace: id }));
    addPill("pace", [id], createChoices.pace);
    setReaction(reactionForCreate("pace", id));
    setStep("look");
  };
  const handleLook = (ids: string[]) => {
    const l = ids as LookId[];
    setAnswers((a) => ({ ...a, looks: l }));
    addPill("look", ids, createChoices.look);
    setReaction(reactionForCreate("look", ids[0]));
    setStep("boundaries");
  };
  const handleBoundary = (ids: string[]) => {
    const id = ids[0] as BoundaryId;
    const label = createChoices.boundaries.find((c) => c.id === id)?.label ?? id;
    setAnswers((a) => ({ ...a, boundaries: id }));
    setPills((p) => [
      ...p.filter((x) => x.axis !== "boundaries"),
      { id: `boundaries-${id}`, label, axis: "boundaries" },
    ]);
    setReaction(reactionForCreate("boundaries", id));
    setStep("context");
  };
  const handleBoundaryText = (text: string) => {
    const parsed = parseFreeText(text);
    const boundary = parsed.boundaries ?? text;
    setAnswers((a) => ({ ...a, boundaries: boundary }));
    setPills((p) => [
      ...p.filter((x) => x.axis !== "boundaries"),
      {
        id: "boundaries-text",
        label: `boundary: ${truncate(text, 22)}`,
        axis: "boundaries",
      },
    ]);
    setReaction(createPrompts.boundaryTextReaction);
    setStep("context");
  };
  const handleContextSkip = () => setStep("name");
  const handleContextSubmit = (text: string) => {
    setAnswers((a) => ({ ...a, context: text }));
    setPills((p) => [
      ...p,
      { id: "context", label: `“${truncate(text, 20)}”`, axis: "context" },
    ]);
    setStep("name");
  };
  const handleName = (name: string) => {
    setChosenName(name);
    setAnswers((a) => ({ ...a, name }));
    setPills((p) => [
      ...p.filter((x) => x.axis !== "name"),
      { id: "name", label: name, axis: "name" },
    ]);
    setReaction(null);
    setStep("loading");
    // Brief narrated loading, then reveal.
    loadingTimerRef.current = window.setTimeout(() => setStep("reveal"), motionMs(1100));
  };

  const handleFreeTextAt = (currentStep: Step) => (text: string) => {
    // Free-text skip: parse and back-fill pills retroactively.
    const parsed = parseFreeText(text);
    const next: CreateAnswers = { ...answers };
    const newPills: Pill[] = [...pills];
    if (parsed.feelings) {
      next.feelings = parsed.feelings;
      newPills.push({
        id: `feeling-${parsed.feelings[0]}`,
        label: parsed.feelings[0],
        axis: "feeling",
      });
    }
    if (parsed.role) {
      next.role = parsed.role;
      newPills.push({ id: `role-${parsed.role}`, label: parsed.role, axis: "role" });
    }
    if (parsed.voice) {
      next.voice = parsed.voice;
      newPills.push({
        id: `voice-${parsed.voice}`,
        label: `voice: ${parsed.voice}`,
        axis: "voice",
      });
    }
    if (parsed.boundaries) {
      next.boundaries = parsed.boundaries;
      newPills.push({
        id: "boundaries",
        label: `boundary: ${parsed.boundaries}`,
        axis: "boundaries",
      });
    }
    // Also keep the raw text as the context seed.
    next.context = text;
    setAnswers(next);
    setPills(newPills);
    // Jump forward while still preserving the concrete shaping turns.
    if (currentStep === "feeling" || currentStep === "role" || currentStep === "voice") {
      setStep(next.looks ? "boundaries" : "look");
    } else if (currentStep === "look") {
      setStep("boundaries");
    } else if (currentStep === "boundaries") {
      setStep("context");
    } else if (currentStep === "context") {
      setStep("name");
    }
  };

  const removePill = (id: string) => {
    const removed = pills.find((p) => p.id === id);
    setPills((cur) => cur.filter((x) => x.id !== id));
    if (!removed) return;
    if (removed.axis === "feeling") setAnswers((a) => ({ ...a, feelings: undefined }));
    if (removed.axis === "role") setAnswers((a) => ({ ...a, role: undefined }));
    if (removed.axis === "voice") setAnswers((a) => ({ ...a, voice: undefined }));
    if (removed.axis === "look") setAnswers((a) => ({ ...a, looks: undefined }));
    if (removed.axis === "pace") setAnswers((a) => ({ ...a, pace: undefined }));
    if (removed.axis === "boundaries")
      setAnswers((a) => ({ ...a, boundaries: undefined }));
    if (removed.axis === "context") setAnswers((a) => ({ ...a, context: undefined }));
  };

  const goBack = () => {
    const order: Step[] = [
      "feeling",
      "role",
      "voice",
      "pace",
      "look",
      "boundaries",
      "context",
      "name",
      "loading",
      "reveal",
    ];
    const idx = order.indexOf(step);
    if (idx > 0) {
      // Skip past steps we silently skipped.
      let target = idx - 1;
      while (target > 0) {
        const t = order[target];
        if (t === "pace" && !isConflicting(answers)) target -= 1;
        else if (t === "boundaries" && !answers.boundaries) target -= 1;
        else if (t === "loading" || t === "context") target -= 1;
        else break;
      }
      setStep(order[target]);
      return;
    }
    router.push("/");
  };

  // ---- Render -------------------------------------------------------------

  return (
    <FunnelShell
      portrait={{
        src: portraitSrc,
        alt: candidate.name,
        faceSafe: candidate.faceSafe,
        blurPx: BLUR_BY_STEP[step],
      }}
      pills={pills}
      onRemovePill={removePill}
      progress={
        step === "reveal" || step === "loading"
          ? undefined
          : { current: stepToDotIndex(step), total: TOTAL_DOTS }
      }
      loadingLine={step === "loading" ? createPrompts.loading : reaction}
      onBack={goBack}
    >
      <AnimatePresence mode="wait">
        {step === "feeling" ? (
          <motion.div key="feeling" {...fade} className="flex flex-col gap-3">
            <HostLine>{createPrompts.feelingHost}</HostLine>
            <FunnelStep
              question={createPrompts.feelingQuestion}
              choices={createChoices.feeling}
              multiSelect
              maxSelect={2}
              onSubmit={handleFeeling}
              onFreeText={handleFreeTextAt("feeling")}
            />
          </motion.div>
        ) : null}

        {step === "role" ? (
          <motion.div key="role" {...fade} className="flex flex-col gap-3">
            <FunnelStep
              question={createPrompts.roleQuestion}
              choices={createChoices.role}
              onSubmit={handleRole}
              onFreeText={handleFreeTextAt("role")}
            />
          </motion.div>
        ) : null}

        {step === "voice" ? (
          <VoiceStep
            key="voice"
            companion={candidate}
            onPick={handleVoice}
            onFreeText={handleFreeTextAt("voice")}
          />
        ) : null}

        {step === "pace" ? (
          <motion.div key="pace" {...fade} className="flex flex-col gap-3">
            <HostLine variant="secondary">{createPrompts.paceHost}</HostLine>
            <FunnelStep
              question={createPrompts.paceQuestion}
              choices={createChoices.pace}
              onSubmit={handlePace}
            />
          </motion.div>
        ) : null}

        {step === "look" ? (
          <motion.div key="look" {...fade} className="flex flex-col gap-3">
            <FunnelStep
              question={createPrompts.lookQuestion}
              choices={createChoices.look}
              multiSelect
              maxSelect={2}
              onSubmit={handleLook}
              onFreeText={handleFreeTextAt("look")}
            />
          </motion.div>
        ) : null}

        {step === "boundaries" ? (
          <motion.div key="boundaries" {...fade} className="flex flex-col gap-3">
            <FunnelStep
              question={createPrompts.boundariesQuestion}
              choices={createChoices.boundaries}
              onSubmit={handleBoundary}
              onFreeText={handleBoundaryText}
              freeTextPlaceholder={createPrompts.boundariesPlaceholder}
            />
          </motion.div>
        ) : null}

        {step === "context" ? (
          <motion.div key="context" {...fade} className="flex flex-col gap-3">
            <HostLine>{createPrompts.contextHost}</HostLine>
            <FunnelStep
              question={createPrompts.contextQuestion}
              choices={[]}
              onSubmit={() => {}}
              onFreeText={handleContextSubmit}
              freeTextPlaceholder={createPrompts.contextPlaceholder}
            />
            <button
              type="button"
              onClick={handleContextSkip}
              className="self-start text-[12px] text-copy-faint hover:text-copy-muted"
            >
              {createPrompts.contextSkip}
            </button>
          </motion.div>
        ) : null}

        {step === "name" ? (
          <NameStep
            key="name"
            suggestions={suggestNames(answers)}
            onPick={handleName}
          />
        ) : null}

        {step === "loading" ? (
          <motion.div key="loading" {...fade}>
            <HostLine variant="secondary">{createPrompts.loading}</HostLine>
          </motion.div>
        ) : null}

        {step === "reveal" ? (
          <RevealCard
            key="reveal"
            companion={candidate}
            answers={answers}
            name={reveal.syntheticName ?? chosenName}
            synthetic={Boolean(reveal.syntheticName)}
            syntheticPremise={reveal.syntheticPremise}
            onMeet={() => router.push(`/chat/${candidate.id}?from=create`)}
          />
        ) : null}
      </AnimatePresence>
    </FunnelShell>
  );
}

function stageFromStep(step: Step): 0 | 1 | 2 | 3 {
  // Map funnel step to in-progress vignette stage (silhouette → face).
  switch (step) {
    case "feeling":
      return 0;
    case "role":
    case "voice":
    case "pace":
      return 1;
    case "look":
    case "boundaries":
      return 2;
    case "context":
    case "name":
    case "loading":
    case "reveal":
      return 3;
  }
}

function stepToDotIndex(step: Step): number {
  switch (step) {
    case "feeling": return 0;
    case "role": return 1;
    case "voice":
    case "pace":
      return 2;
    case "look": return 3;
    case "boundaries": return 4;
    case "context": return 5;
    case "name":
    case "loading":
    case "reveal":
      return 6;
  }
}

function truncate(s: string, n: number) {
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`;
}

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: motionSec(0.32), ease: "easeOut" as const },
};

// ---- Voice step -----------------------------------------------------------

function VoiceStep({
  companion,
  onPick,
  onFreeText,
}: {
  companion: Companion;
  onPick: (id: VoiceId, label: string) => void;
  onFreeText: (text: string) => void;
}) {
  const samples = createDialogue.voiceSamples;
  const [text, setText] = useState("");
  void companion;
  return (
    <motion.div {...fade} className="flex flex-col gap-3">
      <HostLine>{createPrompts.voiceHost}</HostLine>
      <div className="flex flex-col gap-2">
        {samples.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s.id as VoiceId, s.label)}
            className={cn(
              "rounded-tile border border-line bg-copy/[0.05] px-3.5 py-2.5 text-left text-[14px] italic text-copy/90",
              "transition hover:border-copy/35 hover:bg-copy/10",
            )}
          >
            “{s.text}”
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const t = text.trim();
          if (t) onFreeText(t);
          setText("");
        }}
        className="mt-1 flex items-center gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={createPrompts.voicePlaceholder}
          className="flex-1 rounded-pill border border-line bg-copy/5 px-4 py-2 text-[13px] text-copy placeholder:text-copy-faint focus:border-copy/35 focus:outline-none"
        />
        <button
          type="submit"
          aria-label={commonCopy.sendAria}
          className="grid h-9 w-9 place-items-center rounded-full border border-line bg-copy/8 text-copy transition hover:bg-copy/14"
        >
          <ArrowRight size={16} />
        </button>
      </form>
    </motion.div>
  );
}

// ---- Name step ------------------------------------------------------------

function NameStep({
  suggestions,
  onPick,
}: {
  suggestions: string[];
  onPick: (name: string) => void;
}) {
  const [custom, setCustom] = useState("");
  return (
    <motion.div {...fade} className="flex flex-col gap-3">
      <HostLine>{createPrompts.nameHost}</HostLine>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPick(n)}
            className="rounded-pill border border-line bg-copy/8 px-3.5 py-1.5 text-[14px] text-copy transition hover:bg-copy/14"
          >
            {n}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const t = custom.trim();
          if (t) onPick(t);
        }}
        className="mt-1 flex items-center gap-2"
      >
        <input
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder={createPrompts.customNamePlaceholder}
          className="flex-1 rounded-pill border border-line bg-copy/5 px-4 py-2 text-[13px] text-copy placeholder:text-copy-faint focus:border-copy/35 focus:outline-none"
        />
        <button
          type="submit"
          aria-label={commonCopy.sendAria}
          disabled={!custom.trim()}
          className="grid h-9 w-9 place-items-center rounded-full border border-line bg-copy/8 text-copy transition hover:bg-copy/14 disabled:opacity-40"
        >
          <ArrowRight size={16} />
        </button>
      </form>
    </motion.div>
  );
}

// ---- Reveal card ----------------------------------------------------------

function RevealCard({
  companion,
  answers,
  name,
  synthetic,
  syntheticPremise,
  onMeet,
}: {
  companion: Companion;
  answers: CreateAnswers;
  name: string;
  synthetic: boolean;
  syntheticPremise?: string;
  onMeet: () => void;
}) {
  const composedPremise = syntheticPremise ?? composePremise(answers, name);
  const shapedItems = useMemo(() => composeShapedItems(answers), [answers]);

  return (
    <motion.div {...fade} className="flex flex-col gap-4">
      <div>
        <p className="font-serif text-[28px] leading-tight text-copy sm:text-[32px]">
          {name}
        </p>
        <p className="mt-1 text-[14px] text-copy/85">{composedPremise}</p>
      </div>

      <div className="rounded-card border border-line/60 bg-copy/[0.05] p-3.5">
        <p className="text-[12px] uppercase tracking-[0.16em] text-copy-faint">
          {createRevealLabels.whatShapedThem}
        </p>
        <ul className="mt-2 space-y-1 text-[13px] text-copy/85">
          {shapedItems.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-card border border-line/60 bg-copy/[0.04] p-3.5">
        <p className="text-[12px] uppercase tracking-[0.16em] text-copy-faint">
          {createRevealLabels.firstMessage}
        </p>
        <p className="mt-2 text-[15px] italic leading-[1.5] text-copy">
          “{companion.openers.create}”
        </p>
      </div>

      {synthetic ? null : (
        <p className="text-[11.5px] text-copy-faint">
          {createRevealLabels.fallbackNote}
        </p>
      )}

      <button
        type="button"
        onClick={onMeet}
        className="inline-flex items-center gap-1.5 self-start rounded-pill bg-coral px-4 py-2 text-[14px] font-semibold text-ink shadow-soft transition hover:bg-rose"
      >
        <MessageCircle size={14} /> {createRevealLabels.meet} {name}
      </button>
    </motion.div>
  );
}
