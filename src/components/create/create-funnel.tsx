"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Companion } from "@/types/companion";
import {
  type CreateAnswers,
  type FeelingId,
  type LookId,
  type RoleId,
  type VoiceId,
  IN_PROGRESS_STAGES,
  composeFeelingClause,
  composePremise,
  isConflicting,
  parseFreeText,
  pickFallbackCompanion,
  pickRevealAsset,
  suggestNames,
} from "@/lib/create";
import { FunnelShell } from "@/components/funnel/funnel-shell";
import { FunnelStep, type StepChoice } from "@/components/funnel/funnel-step";
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

const feelingChoices: StepChoice[] = [
  { id: "warmth", label: "warmth" },
  { id: "nerve", label: "nerve" },
  { id: "patience", label: "patience" },
  { id: "mischief", label: "mischief" },
  { id: "honesty", label: "honesty" },
  { id: "calm", label: "calm" },
];
const roleChoices: StepChoice[] = [
  { id: "companion", label: "companion" },
  { id: "muse", label: "muse" },
  { id: "mentor", label: "mentor" },
  { id: "confidant", label: "confidant" },
  { id: "challenger", label: "challenger" },
  { id: "storyteller", label: "storyteller" },
];
const lookChoices: StepChoice[] = [
  { id: "soft-studio-light", label: "soft studio light" },
  { id: "night-window", label: "night window" },
  { id: "sharp-city-energy", label: "sharp city energy" },
  { id: "warm-apartment", label: "warm apartment" },
  { id: "older-soul", label: "older soul" },
  { id: "classic-beauty", label: "classic beauty" },
  { id: "unusual-but-grounded", label: "unusual but grounded" },
];
const paceChoices: StepChoice[] = [
  { id: "quick", label: "quick" },
  { id: "unhurried", label: "unhurried" },
];

type Pill = { id: string; label: string; axis: string };
const TOTAL_DOTS = 5;

type CreateFunnelProps = {
  companions: Companion[];
};

export function CreateFunnel({ companions }: CreateFunnelProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("feeling");
  const [answers, setAnswers] = useState<CreateAnswers>({});
  const [pills, setPills] = useState<Pill[]>([]);
  const [chosenName, setChosenName] = useState<string>("");
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

  const addPill = (axis: string, ids: string[], lookup: StepChoice[]) => {
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
    addPill("feeling", ids, feelingChoices);
    setStep("role");
  };
  const handleRole = (ids: string[]) => {
    const id = ids[0] as RoleId;
    setAnswers((a) => ({ ...a, role: id }));
    addPill("role", [id], roleChoices);
    setStep("voice");
  };
  const handleVoice = (id: VoiceId, label: string) => {
    setAnswers((a) => ({ ...a, voice: id }));
    setPills((p) => [
      ...p.filter((x) => x.axis !== "voice"),
      { id: `voice-${id}`, label: `voice: ${label}`, axis: "voice" },
    ]);
    // If conflicting feelings, pace fires here. Else go to look.
    if (isConflicting(answers)) setStep("pace");
    else setStep("look");
  };
  const handlePace = (ids: string[]) => {
    const id = ids[0] as "quick" | "unhurried";
    setAnswers((a) => ({ ...a, pace: id }));
    addPill("pace", [id], paceChoices);
    setStep("look");
  };
  const handleLook = (ids: string[]) => {
    const l = ids as LookId[];
    setAnswers((a) => ({ ...a, looks: l }));
    addPill("look", ids, lookChoices);
    // Boundaries only if implied earlier (we'd have answers.boundaries already).
    if (answers.boundaries) setStep("context");
    else setStep("name");
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
    setStep("loading");
    // Brief narrated loading, then reveal.
    loadingTimerRef.current = window.setTimeout(() => setStep("reveal"), 1100);
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
    // Jump forward — to look if we don't have it, otherwise to name.
    if (currentStep === "feeling" || currentStep === "role" || currentStep === "voice") {
      setStep(next.looks ? "name" : "look");
    } else if (currentStep === "look") {
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
      loadingLine={
        step === "loading" ? "putting her together…" : null
      }
      onBack={goBack}
    >
      <AnimatePresence mode="wait">
        {step === "feeling" ? (
          <motion.div key="feeling" {...fade} className="flex flex-col gap-3">
            <HostLine>Tell me who you were hoping would answer. Start with the feeling.</HostLine>
            <FunnelStep
              question="What should they bring into the room?"
              choices={feelingChoices}
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
              question="Who are they to you?"
              choices={roleChoices}
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
            <HostLine variant="secondary">Mischief and patience together — how do those land?</HostLine>
            <FunnelStep
              question="Quick or unhurried?"
              choices={paceChoices}
              onSubmit={handlePace}
            />
          </motion.div>
        ) : null}

        {step === "look" ? (
          <motion.div key="look" {...fade} className="flex flex-col gap-3">
            <FunnelStep
              question="Pick a room and a light."
              choices={lookChoices}
              multiSelect
              maxSelect={2}
              onSubmit={handleLook}
              onFreeText={handleFreeTextAt("look")}
            />
          </motion.div>
        ) : null}

        {step === "context" ? (
          <motion.div key="context" {...fade} className="flex flex-col gap-3">
            <HostLine>What should they know before they say hello?</HostLine>
            <FunnelStep
              question=""
              choices={[]}
              onSubmit={() => {}}
              onFreeText={handleContextSubmit}
              freeTextPlaceholder="anything — or skip"
            />
            <button
              type="button"
              onClick={handleContextSkip}
              className="self-start text-[12px] text-copy-faint hover:text-copy-muted"
            >
              skip ahead
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
            <HostLine variant="secondary">putting her together…</HostLine>
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
    case "look":
    case "boundaries":
      return 3;
    case "context":
    case "name":
    case "loading":
    case "reveal":
      return 4;
  }
}

function truncate(s: string, n: number) {
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`;
}

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.32, ease: "easeOut" as const },
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
  const samples: Array<{ id: VoiceId; label: string; text: string }> = [
    { id: "dry", label: "dry", text: "Hi. So how's your week going?" },
    { id: "warm", label: "warm", text: "Hey, you. I just got in — how was your day?" },
    { id: "curious", label: "curious", text: "Hi. What were you doing right before you opened this?" },
  ];
  const [text, setText] = useState("");
  void companion;
  return (
    <motion.div {...fade} className="flex flex-col gap-3">
      <HostLine>How do they sound? Pick the one that sounds right.</HostLine>
      <div className="flex flex-col gap-2">
        {samples.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s.id, s.label)}
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
          placeholder="or describe their voice"
          className="flex-1 rounded-pill border border-line bg-copy/5 px-4 py-2 text-[13px] text-copy placeholder:text-copy-faint focus:border-copy/35 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="send"
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
      <HostLine>Who is this?</HostLine>
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
          placeholder="or name her yourself"
          className="flex-1 rounded-pill border border-line bg-copy/5 px-4 py-2 text-[13px] text-copy placeholder:text-copy-faint focus:border-copy/35 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="send"
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
  const feelingClause = composeFeelingClause(answers);
  const shapedItems = useMemo(() => {
    const items: string[] = [];
    if (answers.feelings) items.push(feelingClause + ".");
    if (answers.role) items.push(`a ${answers.role} who'll mostly listen.`);
    if (answers.voice) items.push(`a ${answers.voice} voice.`);
    if (answers.looks)
      items.push(answers.looks.map((l) => l.replace(/-/g, " ")).join(" + ") + ".");
    if (answers.pace) items.push(`pace: ${answers.pace}.`);
    if (answers.boundaries) items.push(`boundary: ${answers.boundaries}.`);
    if (answers.context) items.push(`note: ${truncate(answers.context, 60)}`);
    return items;
  }, [answers, feelingClause]);

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
          What shaped them
        </p>
        <ul className="mt-2 space-y-1 text-[13px] text-copy/85">
          {shapedItems.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-card border border-line/60 bg-copy/[0.04] p-3.5">
        <p className="text-[12px] uppercase tracking-[0.16em] text-copy-faint">
          First message
        </p>
        <p className="mt-2 text-[15px] italic leading-[1.5] text-copy">
          “{companion.openers.create}”
        </p>
      </div>

      {synthetic ? null : (
        <p className="text-[11.5px] text-copy-faint">
          {`Closest cast match — she'll arrive as herself when the rest of her vignettes ship.`}
        </p>
      )}

      <button
        type="button"
        onClick={onMeet}
        className="inline-flex items-center gap-1.5 self-start rounded-pill bg-coral px-4 py-2 text-[14px] font-semibold text-ink shadow-soft transition hover:bg-rose"
      >
        <MessageCircle size={14} /> meet {name}
      </button>
    </motion.div>
  );
}
