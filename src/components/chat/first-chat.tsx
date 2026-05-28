"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { surfaceDialogue } from "@/data/surface-dialogue";
import { cn } from "@/lib/utils";
import { useFunnelStore } from "@/store/funnel-store";
import type { Companion, PortraitState } from "@/types/companion";
import type { DialogueBeat, Source } from "@/types/dialogue";
import type { NameMode } from "@/types/session";
import {
  MAX_USER_TURNS,
  getBeat,
  getDialogue,
  portraitAsset,
  routeFreeText,
  startBeat,
} from "@/lib/dialogue";
import { cleanName, personalizeStartBeat } from "@/lib/chat-personalization";
import { motionMs, prefersReducedMotion } from "@/lib/motion";
import { FunnelShell } from "@/components/funnel/funnel-shell";
import { HostLine } from "@/components/funnel/host-line";
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
const preludeCopy = chatCopy.prelude;
type PreludeStep = "checking" | "name" | "context" | "chat";

export function FirstChat({ companion }: FirstChatProps) {
  const searchParams = useSearchParams();
  const hasHydrated = useFunnelStore((state) => state.hasHydrated);
  const displayName = useFunnelStore((state) => state.displayName);
  const nameMode = useFunnelStore((state) => state.nameMode);
  const helloContext = useFunnelStore((state) => state.helloContext);
  const setDisplayName = useFunnelStore((state) => state.setDisplayName);
  const setHelloContext = useFunnelStore((state) => state.setHelloContext);
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

  const personalizedStart = useMemo(
    () =>
      start
        ? personalizeStartBeat(start, {
            companion,
            displayName,
            nameMode,
            helloContext,
          })
        : null,
    [start, companion, displayName, nameMode, helloContext],
  );
  const preludeStep = resolvePreludeStep(hasHydrated, displayName, helloContext);
  const [beat, setBeat] = useState<DialogueBeat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [repliesReady, setRepliesReady] = useState(false);
  const [companionTyping, setCompanionTyping] = useState(false);
  const [portrait, setPortrait] = useState<PortraitState>(start?.portrait ?? "warm");
  const [paywall, setPaywall] = useState<PaywallStatus>("hidden");
  const [userInput, setUserInput] = useState("");

  const lineQueueRef = useRef<string[]>([]);
  const unlockedRef = useRef(false);
  const userTurnsRef = useRef(0);
  const idCounter = useRef(1);
  const startedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const paywallRef = useRef<HTMLDivElement | null>(null);
  const nextId = (prefix: string) => `${prefix}-${(idCounter.current += 1)}`;

  useEffect(() => {
    if (preludeStep !== "chat" || !personalizedStart || startedRef.current) return;
    startedRef.current = true;
    setBeat(personalizedStart);
    setRepliesReady(false);
    setPortrait(personalizedStart.portrait ?? "warm");
    lineQueueRef.current = personalizedStart.lines.slice(1);
    setMessages([
      {
        id: "c-1",
        author: "companion",
        text: personalizedStart.lines[0],
        typing: true,
      },
    ]);
  }, [personalizedStart, preludeStep]);

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

  // When the wall appears, bring it fully into view — it should never be
  // something the user has to scroll down to discover.
  useEffect(() => {
    if (paywall === "open") {
      paywallRef.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "end",
      });
    }
  }, [paywall]);

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
    if (
      (beat?.paywall && !unlockedRef.current) ||
      userTurnsRef.current >= MAX_USER_TURNS
    ) {
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
    if (reply) {
      advance(reply.next, trimmed);
      return;
    }
    // Post-unlock: scripted branches are spent, but premium keeps replying.
    if (unlockedRef.current) {
      setRepliesReady(false);
      setUserInput("");
      setMessages((m) => [...m, { id: nextId("u"), author: "user", text: trimmed }]);
      setCompanionTyping(true);
      window.setTimeout(() => {
        setCompanionTyping(false);
        setMessages((m) => [
          ...m,
          { id: nextId("c"), author: "companion", text: chatCopy.unlockedAck, typing: true },
        ]);
      }, motionMs(380));
    }
  };

  // Paywall handlers (mock). "Unlock" briefly confirms, then streams the
  // beat's bonus lines and re-enables the input — premium, faked.
  const onContinue = () => {
    unlockedRef.current = true;
    setPaywall("success");
    const bonus = beat?.unlockLines ?? [];
    window.setTimeout(() => {
      setPaywall("hidden");
      if (bonus.length > 0) {
        lineQueueRef.current = bonus.slice(1);
        setMessages((m) => [
          ...m,
          { id: nextId("c"), author: "companion", text: bonus[0], typing: true },
        ]);
      } else {
        setRepliesReady(true);
      }
    }, motionMs(1500));
  };
  const onDismiss = () => setPaywall("dismissed");

  // Any non-hidden paywall state hard-blocks the conversation: input
  // disabled and suggested replies hidden. Only "Unlock" (mock) lifts it.
  const paywallBlocking = paywall === "open" || paywall === "dismissed";
  const showReplies =
    repliesReady &&
    !companionTyping &&
    paywall === "hidden" &&
    Boolean(beat?.replies?.length);
  const inputLocked = paywallBlocking || !repliesReady || companionTyping;

  if (preludeStep !== "chat") {
    return (
      <FunnelShell
        portrait={{
          src: portraitAsset(companion, portrait),
          alt: companion.name,
          faceSafe: companion.faceSafe,
        }}
      >
        {preludeStep === "checking" ? (
          <HostLine variant="secondary">{preludeCopy.loading}</HostLine>
        ) : null}

        {preludeStep === "name" ? (
          <PreludePrompt
            host={preludeCopy.nameHost}
            placeholder={preludeCopy.namePlaceholder}
            choices={preludeCopy.nameChoices}
            onSubmit={(value, mode) => setDisplayName(cleanName(value), mode)}
          />
        ) : null}

        {preludeStep === "context" ? (
          <PreludePrompt
            host={preludeCopy.contextHost}
            placeholder={preludeCopy.contextPlaceholder}
            choices={preludeCopy.contextChoices}
            onSubmit={(value) => setHelloContext(value)}
          />
        ) : null}
      </FunnelShell>
    );
  }

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
          className={cn(
            "flex flex-col gap-2.5 overflow-y-auto transition-[filter,opacity] duration-300",
            paywallBlocking && "pointer-events-none select-none blur-[3px] opacity-45",
          )}
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
          <div className="flex flex-wrap justify-end gap-1.5">
            {beat!.replies!.map((r) => (
              <button
                key={r.next + r.label}
                type="button"
                data-suggested-reply
                onClick={() => chooseReply(r.next, r.said ?? r.label)}
                className="group rounded-pill border border-copy/30 bg-transparent px-3.5 py-1.5 text-[13px] transition hover:border-copy hover:bg-copy active:bg-copy"
              >
                <span className="text-copy transition-colors group-hover:text-ink group-active:text-ink">
                  {r.label}
                </span>
              </button>
            ))}
          </div>
        ) : null}

        <div ref={paywallRef}>
          <Paywall
            status={paywall}
            companionName={companion.name}
            onContinue={onContinue}
            onDismiss={onDismiss}
          />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendFreeText(userInput);
          }}
          className="mt-1 flex items-center gap-2"
        >
          <div className="relative flex-1">
            {paywallBlocking ? (
              <Lock
                size={14}
                aria-hidden
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-copy-faint"
              />
            ) : null}
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={
                paywallBlocking
                  ? chatCopy.inputLocked
                  : chatCopy.inputPlaceholder(companion.name)
              }
              disabled={inputLocked}
              aria-label={chatCopy.inputAria}
              className={cn(
                "w-full rounded-pill border border-line bg-copy/5 py-2 text-[14px] text-copy placeholder:text-copy-faint focus:border-copy/35 focus:outline-none disabled:opacity-50",
                paywallBlocking ? "pl-9 pr-4" : "px-4",
              )}
            />
          </div>
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

type PreludeChoice = {
  label: string;
  value: string;
  mode?: NameMode;
};

type PreludePromptProps = {
  host: string;
  placeholder: string;
  choices: PreludeChoice[];
  onSubmit: (value: string, mode?: NameMode) => void;
};

function PreludePrompt({
  host,
  placeholder,
  choices,
  onSubmit,
}: PreludePromptProps) {
  const [text, setText] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="flex flex-col gap-3"
    >
      <HostLine>{host}</HostLine>
      <div className="flex flex-wrap gap-2">
        {choices.map((choice) => (
          <button
            key={choice.label}
            type="button"
            onClick={() => onSubmit(choice.value, choice.mode)}
            className="rounded-pill border border-line bg-copy/8 px-3.5 py-1.5 text-[14px] text-copy transition hover:bg-copy/14"
          >
            {choice.label}
          </button>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = text.trim();
          if (!trimmed) return;
          onSubmit(trimmed, "given");
          setText("");
        }}
        className="mt-1 flex items-center gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="flex-1 rounded-pill border border-line bg-copy/5 px-4 py-2 text-[14px] text-copy placeholder:text-copy-faint focus:border-copy/35 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label={chatCopy.sendAria}
          className="grid h-9 w-9 place-items-center rounded-full border border-line bg-copy/8 text-copy transition hover:bg-copy/14 disabled:opacity-40"
        >
          <ArrowRight size={16} />
        </button>
      </form>
    </motion.div>
  );
}

function resolvePreludeStep(
  hasHydrated: boolean,
  displayName: string | null,
  helloContext: string | null,
): PreludeStep {
  if (!hasHydrated) return "checking";
  if (!displayName) return "name";
  if (!helloContext) return "context";
  return "chat";
}
