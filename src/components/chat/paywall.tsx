"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, X } from "lucide-react";
import { surfaceDialogue } from "@/data/surface-dialogue";
import { cn } from "@/lib/utils";

export type PaywallStatus = "hidden" | "open" | "dismissed" | "success";
export type PaywallVariant = "preview" | "lockedCast" | "create";

const paywallCopy = surfaceDialogue.paywall;
type PlanId = (typeof paywallCopy.plans)[number]["id"];

type PaywallProps = {
  status: PaywallStatus;
  companionName: string;
  onContinue: () => void;
  onDismiss: () => void;
  variant?: PaywallVariant;
};

/**
 * Mock premium paywall. Deliberately obvious for the demo: a lock badge,
 * a "Preview ended" eyebrow, a selected plan + price, and a bold unlock
 * CTA. This is a web subscription wall — the only actions are unlock and
 * dismiss (close). No product-navigation; the reel stays reachable from
 * the chat header.
 *
 * It sits at the bottom of the chat column (desktop) or inside the chat
 * sheet (mobile) — both already clear the face-safe region — and the
 * transcript behind it is blurred by the caller. It never appears during
 * the funnel, only in first chat after the preview is spent.
 */
export function Paywall({
  status,
  companionName,
  onContinue,
  onDismiss,
  variant = "preview",
}: PaywallProps) {
  if (status === "hidden") return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        data-paywall
        data-face-safe-respects
        className="overflow-hidden rounded-tile border border-coral/40 bg-ink-deep/97 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl"
      >
        <div aria-hidden className="h-0.5 w-full bg-gradient-to-r from-coral/40 via-coral to-coral/40" />
        <div className="p-4">
          {status === "open" ? (
            <OpenBody
              companionName={companionName}
              variant={variant}
              onContinue={onContinue}
              onDismiss={onDismiss}
            />
          ) : null}
          {status === "dismissed" ? <DismissedBody onUnlock={onContinue} /> : null}
          {status === "success" ? <Quiet body={paywallCopy.success} /> : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function OpenBody({
  companionName,
  variant,
  onContinue,
  onDismiss,
}: {
  companionName: string;
  variant: PaywallVariant;
  onContinue: () => void;
  onDismiss: () => void;
}) {
  const [selected, setSelected] = useState<PlanId>(paywallCopy.defaultPlan);
  const header =
    variant === "lockedCast"
      ? paywallCopy.lockedCast
      : variant === "create"
        ? {
            eyebrow: paywallCopy.create.eyebrow,
            title: paywallCopy.create.title(companionName),
            body: paywallCopy.create.body,
          }
        : {
            eyebrow: paywallCopy.eyebrow,
            title: paywallCopy.title(companionName),
            body: paywallCopy.body,
          };

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-coral/15 text-coral">
            <Lock size={15} />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-coral">
            {header.eyebrow}
          </span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label={paywallCopy.closeAria}
          className="-mr-1 -mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-copy-faint transition hover:bg-copy/10 hover:text-copy"
        >
          <X size={16} />
        </button>
      </div>

      <div>
        <p className="font-serif text-[21px] leading-tight text-copy">
          {header.title}
        </p>
        <p className="mt-1.5 text-[13.5px] text-copy-muted">{header.body}</p>
      </div>

      <div className="flex flex-col gap-2">
        {paywallCopy.plans.map((plan) => {
          const active = plan.id === selected;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelected(plan.id)}
              aria-pressed={active}
              className={cn(
                "flex items-center justify-between gap-3 rounded-tile border px-3.5 py-2.5 text-left transition",
                active
                  ? "border-coral bg-coral/[0.07]"
                  : "border-line bg-copy/[0.02] hover:border-line/80 hover:bg-copy/5",
              )}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 transition",
                    active ? "border-coral" : "border-copy/30",
                  )}
                >
                  {active ? <span className="h-1.5 w-1.5 rounded-full bg-coral" /> : null}
                </span>
                <span className="flex flex-col">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[13.5px] font-medium text-copy">{plan.name}</span>
                    {plan.best ? (
                      <span className="rounded-pill bg-coral/15 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-coral">
                        {plan.best}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-[11.5px] text-copy-faint">{plan.billed}</span>
                </span>
              </span>
              <span className="flex flex-col items-end">
                <span className="text-[13.5px] font-semibold text-copy">{plan.perMonth}</span>
                {plan.save ? (
                  <span className="text-[11.5px] font-medium text-coral">{plan.save}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-tile bg-coral px-4 py-3 text-[14.5px] font-semibold text-ink transition hover:bg-rose"
      >
        {paywallCopy.actions.continue}
        <ArrowRight size={16} />
      </button>

      <p className="-mt-1 text-center text-[11.5px] text-copy-faint">{paywallCopy.footnote}</p>
    </div>
  );
}

function DismissedBody({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-copy/10 text-copy-muted">
          <Lock size={13} />
        </span>
        <div>
          <p className="text-[13px] font-medium text-copy">{paywallCopy.dismissedTitle}</p>
          <p className="text-[12px] text-copy-muted">{paywallCopy.dismissed}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onUnlock}
        className="shrink-0 rounded-pill bg-coral px-3.5 py-1.5 text-[12.5px] font-semibold text-ink transition hover:bg-rose"
      >
        {paywallCopy.actions.unlock}
      </button>
    </div>
  );
}

function Quiet({ body }: { body: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-coral/15 text-coral">
        <Lock size={13} />
      </span>
      <p className="flex-1 text-[14px] text-copy/90">{body}</p>
    </div>
  );
}
