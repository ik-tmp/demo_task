"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type PaywallStatus = "hidden" | "open" | "dismissed" | "success" | "error";

type PaywallProps = {
  status: PaywallStatus;
  companionName: string;
  onContinue: () => void;
  onDismiss: () => void;
  onTryAnother: () => void;
  onRestoreError: () => void;
};

/**
 * Quiet overlay paywall per DIRECTION-B §12. Does NOT dim the portrait;
 * companion and chat stay visible. Three actions: continue (mock success),
 * not now (dismiss), try someone else (back to reel). A separate "restore
 * access" trigger surfaces the error state inline.
 *
 * Hard rules:
 *  - Must not cover the face. Sits at the bottom of the chat column on
 *    desktop and as a content card inside the chat sheet on mobile, both
 *    of which already respect the face-safe region via FunnelShell.
 *  - Never appears during the funnel — only in first chat.
 */
export function Paywall({
  status,
  companionName,
  onContinue,
  onDismiss,
  onTryAnother,
  onRestoreError,
}: PaywallProps) {
  if (status === "hidden") return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        data-paywall
        data-face-safe-respects
        className="rounded-tile border border-line bg-ink-deep/95 p-4 backdrop-blur"
      >
        {status === "open" ? (
          <OpenBody
            companionName={companionName}
            onContinue={onContinue}
            onDismiss={onDismiss}
            onTryAnother={onTryAnother}
            onRestoreError={onRestoreError}
          />
        ) : null}
        {status === "dismissed" ? (
          <Quiet body="No problem. This chat stays in preview." />
        ) : null}
        {status === "success" ? (
          <Quiet body={"You're in. Keep going."} />
        ) : null}
        {status === "error" ? (
          <Quiet body={"That didn't go through. Nothing changed."} onRetry={onContinue} />
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}

function OpenBody({
  companionName,
  onContinue,
  onDismiss,
  onTryAnother,
  onRestoreError,
}: {
  companionName: string;
  onContinue: () => void;
  onDismiss: () => void;
  onTryAnother: () => void;
  onRestoreError: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="font-serif text-[19px] text-copy">
          Keep talking with {companionName}?
        </p>
        <p className="mt-1 text-[13px] text-copy-muted">
          Your preview is ready to continue.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-1.5 rounded-pill bg-coral px-3.5 py-1.5 text-[13px] font-semibold text-ink hover:bg-rose"
        >
          continue
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            "rounded-pill border border-line bg-copy/8 px-3 py-1.5 text-[13px] text-copy transition hover:bg-copy/14",
          )}
        >
          not now
        </button>
        <button
          type="button"
          onClick={onTryAnother}
          className="rounded-pill border border-line bg-copy/8 px-3 py-1.5 text-[13px] text-copy transition hover:bg-copy/14"
        >
          try someone else
        </button>
        <button
          type="button"
          onClick={onRestoreError}
          className="text-[12px] text-copy-faint underline-offset-2 transition hover:text-copy-muted hover:underline"
        >
          restore access
        </button>
      </div>
    </div>
  );
}

function Quiet({ body, onRetry }: { body: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[14px] text-copy/90">{body}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="self-start rounded-pill border border-line bg-copy/8 px-3 py-1 text-[12px] text-copy hover:bg-copy/14"
        >
          try again
        </button>
      ) : null}
    </div>
  );
}
