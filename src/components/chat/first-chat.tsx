"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { surfaceDialogue } from "@/data/surface-dialogue";
import { cn } from "@/lib/utils";
import type { Companion, PortraitState } from "@/types/companion";
import type { DialogueBeat, Source } from "@/types/dialogue";
import {
  MAX_USER_TURNS,
  getBeat,
  getDialogue,
  portraitAsset,
  routeFreeText,
  startBeat,
} from "@/lib/dialogue";
import { motionMs } from "@/lib/motion";
import { FunnelShell } from "@/components/funnel/funnel-shell";
import { TypingText } from "./typing-text";
import { Paywall, type PaywallStatus } from "./paywall";

type Message = {
  id: string;
  author: "companion" | "user";
  text: string;
  typing?: boolean;
};

type FirstChatProps = {
  companion: Companion;
};
const chatCopy = surfaceDialogue.chat;

export function FirstChat({ companion }: FirstChatProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sourceParam = searchParams.get("from");
  const source: Source = useMemo(() => {
    if (sourceParam === "browse" || sourceParam === "match" || sourceParam === "create")
      return sourceParam;
    return "direct";
  }, [sourceParam]);

  const dialogue = useMemo(() => getDialogue(companion.id), [companion.id]);
  const start = useMemo(
    () => (dialogue ? startBeat(dialogue, source) : null),
    [dialogue, source],
  );

  const [beat, setBeat] = useState<DialogueBeat | null>(start);
  const [messages, setMessages] = useState<Message[]>(() =>
    start
      ? [{ id: "c-1", author: "companion", text: start.lines[0], typing: true }]
      : [],
  );
  const [repliesReady, setRepliesReady] = useState(false);
  const [companionTyping, setCompanionTyping] = useState(false);
  const [portrait, setPortrait] = useState<PortraitState>(start?.portrait ?? "warm");
  const [paywall, setPaywall] = useState<PaywallStatus>("hidden");
  const [userInput, setUserInput] = useState("");

  const lineQueueRef = useRef<string[]>(start ? start.lines.slice(1) : []);
  const userTurnsRef = useRef(0);
  const idCounter = useRef(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const nextId = (prefix: string) => `${prefix}-${(idCounter.current += 1)}`;

  // Enter a beat: settle portrait, queue its lines, type the first one.
  const enterBeat = (b: DialogueBeat) => {
    setBeat(b);
    setRepliesReady(false);
    if (b.portrait) setPortrait(b.portrait);
    const [first, ...rest] = b.lines;
    lineQueueRef.current = rest;
    setMessages((m) => [
      ...m,
      { id: nextId("c"), author: "companion", text: first, typing: true },
    ]);
  };

  // Auto-scroll on new content.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, repliesReady, paywall]);

  // A companion line finished typing.
  const handleLineDone = (id: string) => {
    setMessages((cur) => cur.map((x) => (x.id === id ? { ...x, typing: false } : x)));
    if (lineQueueRef.current.length > 0) {
      const [next, ...rest] = lineQueueRef.current;
      lineQueueRef.current = rest;
      window.setTimeout(() => {
        setMessages((m) => [
          ...m,
          { id: nextId("c"), author: "companion", text: next, typing: true },
        ]);
      }, motionMs(160));
      return;
    }
    // Beat fully delivered.
    if (beat?.paywall || userTurnsRef.current >= MAX_USER_TURNS) {
      window.setTimeout(() => setPaywall("open"), motionMs(400));
    } else {
      setRepliesReady(true);
    }
  };

  // Advance to the next beat, recording what the user said.
  const advance = (nextBeatId: string, userText: string) => {
    if (!dialogue) return;
    setRepliesReady(false);
    setUserInput("");
    setMessages((m) => [...m, { id: nextId("u"), author: "user", text: userText }]);
    userTurnsRef.current += 1;
    setCompanionTyping(true);
    window.setTimeout(() => {
      setCompanionTyping(false);
      const next = getBeat(dialogue, nextBeatId);
      if (next) enterBeat(next);
    }, motionMs(380));
  };

  const chooseReply = (next: string, said: string) => advance(next, said);

  const sendFreeText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !beat || !repliesReady) return;
    const reply = routeFreeText(beat, trimmed);
    if (!reply) return;
    advance(reply.next, trimmed);
  };

  // Paywall handlers (mock).
  const onContinue = () => {
    setPaywall("success");
    window.setTimeout(() => setPaywall("hidden"), 1600);
  };
  const onDismiss = () => setPaywall("dismissed");
  const onTryAnother = () => router.push("/");
  const onRestoreError = () => setPaywall("error");

  const showReplies =
    repliesReady &&
    !companionTyping &&
    paywall !== "open" &&
    paywall !== "success" &&
    Boolean(beat?.replies?.length);
  const inputLocked = paywall === "open" || !repliesReady || companionTyping;

  return (
    <FunnelShell
      portrait={{
        src: portraitAsset(companion, portrait),
        alt: companion.name,
        faceSafe: companion.faceSafe,
      }}
    >
      <div className="flex flex-col gap-3">
        <header className="flex items-center justify-between gap-3 pb-1">
          <div>
            <p className="font-serif text-[20px] leading-tight text-copy">
              {companion.name}
            </p>
            <p className="text-[12px] text-copy-faint">{companion.voiceDescribedAs}</p>
          </div>
        </header>

        <div
          ref={scrollRef}
          className="flex flex-col gap-2.5 overflow-y-auto"
          aria-label={chatCopy.conversationAria}
        >
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className={cn(
                  "max-w-[88%] rounded-tile border px-3.5 py-2.5 text-[14.5px] leading-[1.5]",
                  m.author === "companion"
                    ? "self-start border-line bg-copy/[0.07] text-copy"
                    : "self-end border-transparent bg-copy text-ink",
                )}
              >
                {m.typing ? (
                  <TypingText
                    text={m.text}
                    speed={12}
                    onDone={() => handleLineDone(m.id)}
                  />
                ) : (
                  m.text
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {companionTyping ? (
            <div className="self-start text-[12px] italic text-copy-faint">
              {chatCopy.typing(companion.name)}
            </div>
          ) : null}
        </div>

        {showReplies ? (
          <div className="flex flex-wrap gap-1.5">
            {beat!.replies!.map((r) => (
              <button
                key={r.next + r.label}
                type="button"
                data-suggested-reply
                onClick={() => chooseReply(r.next, r.said ?? r.label)}
                className="rounded-pill border border-line bg-copy/6 px-3 py-1 text-[12.5px] text-copy-muted transition hover:bg-copy/12 hover:text-copy"
              >
                {r.label}
              </button>
            ))}
          </div>
        ) : null}

        <Paywall
          status={paywall}
          companionName={companion.name}
          onContinue={onContinue}
          onDismiss={onDismiss}
          onTryAnother={onTryAnother}
          onRestoreError={onRestoreError}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendFreeText(userInput);
          }}
          className="mt-1 flex items-center gap-2"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              paywall === "open"
                ? chatCopy.inputPreviewFull
                : chatCopy.inputPlaceholder(companion.name)
            }
            disabled={inputLocked}
            aria-label={chatCopy.inputAria}
            className="flex-1 rounded-pill border border-line bg-copy/5 px-4 py-2 text-[14px] text-copy placeholder:text-copy-faint focus:border-copy/35 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!userInput.trim() || inputLocked}
            aria-label={chatCopy.sendAria}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-copy/8 text-copy transition hover:bg-copy/14 disabled:opacity-40"
          >
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </FunnelShell>
  );
}
