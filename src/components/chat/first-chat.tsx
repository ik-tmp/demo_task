"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Companion } from "@/types/companion";
import { FunnelShell } from "@/components/funnel/funnel-shell";
import { TypingText } from "./typing-text";
import { Paywall, type PaywallStatus } from "./paywall";

type Source = "browse" | "match" | "create" | "direct";

type Message = {
  id: string;
  author: "companion" | "user";
  text: string;
  typing?: boolean;
};

const PAYWALL_AFTER_USER_MESSAGES = 3;

type FirstChatProps = {
  companion: Companion;
};

export function FirstChat({ companion }: FirstChatProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sourceParam = searchParams.get("from");
  const source: Source = useMemo(() => {
    if (sourceParam === "browse" || sourceParam === "match" || sourceParam === "create")
      return sourceParam;
    return "direct";
  }, [sourceParam]);

  const opener = useMemo(() => arrivalOpener(companion, source), [companion, source]);

  const [messages, setMessages] = useState<Message[]>([
    { id: "opener", author: "companion", text: opener, typing: true },
  ]);
  const [openerDone, setOpenerDone] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [companionTyping, setCompanionTyping] = useState(false);
  const [paywall, setPaywall] = useState<PaywallStatus>("hidden");
  const userMessageCount = messages.filter((m) => m.author === "user").length;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const idCounter = useRef(0);
  const nextId = (prefix: string) => {
    idCounter.current += 1;
    return `${prefix}-${idCounter.current}`;
  };

  // Auto-scroll on new message.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, openerDone]);

  const sendUser = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = {
      id: nextId("u"),
      author: "user",
      text: trimmed,
    };
    setMessages((m) => [...m, userMsg]);
    setUserInput("");

    // After Nth user message, trigger paywall — don't respond.
    const nextCount = userMessageCount + 1;
    if (nextCount > PAYWALL_AFTER_USER_MESSAGES) {
      setPaywall("open");
      return;
    }

    // Companion response after a short "typing" delay.
    setCompanionTyping(true);
    window.setTimeout(() => {
      const respIndex = userMessageCount % companion.responses.length;
      const respText = companion.responses[respIndex];
      setMessages((m) => [
        ...m,
        { id: nextId("c"), author: "companion", text: respText, typing: true },
      ]);
      setCompanionTyping(false);
      if (nextCount === PAYWALL_AFTER_USER_MESSAGES) {
        // Surface paywall after the companion's last response.
        window.setTimeout(() => setPaywall("open"), 1200);
      }
    }, 850);
  };

  const onSuggested = (text: string) => sendUser(text);

  const onContinue = () => {
    // Mock success.
    setPaywall("success");
    window.setTimeout(() => setPaywall("hidden"), 1600);
  };
  const onDismiss = () => setPaywall("dismissed");
  const onTryAnother = () => router.push("/");
  const onRestoreError = () => setPaywall("error");

  // Suggested replies — from companion data; only shown when companion has just spoken
  // and paywall isn't open.
  const lastMessage = messages[messages.length - 1];
  const showSuggested =
    lastMessage?.author === "companion" &&
    !companionTyping &&
    paywall !== "open" &&
    paywall !== "success";

  return (
    <FunnelShell
      portrait={{
        src: companion.assets.finalChat,
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
          aria-label="conversation"
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
                    speed={m.id === "opener" ? 32 : 22}
                    onDone={() => {
                      if (m.id === "opener") setOpenerDone(true);
                      // Mark this message as no-longer-typing so future re-renders don't re-type.
                      setMessages((cur) =>
                        cur.map((x) => (x.id === m.id ? { ...x, typing: false } : x)),
                      );
                    }}
                  />
                ) : (
                  m.text
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {companionTyping ? (
            <div className="self-start text-[12px] italic text-copy-faint">
              {companion.name.toLowerCase()} is typing…
            </div>
          ) : null}
        </div>

        {showSuggested && openerDone ? (
          <div className="flex flex-wrap gap-1.5">
            {companion.suggestedReplies.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSuggested(s)}
                className="rounded-pill border border-line bg-copy/6 px-3 py-1 text-[12.5px] text-copy-muted transition hover:bg-copy/12 hover:text-copy"
              >
                {s}
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
            sendUser(userInput);
          }}
          className="mt-1 flex items-center gap-2"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={paywall === "open" ? "preview is full" : `say something to ${companion.name}`}
            disabled={paywall === "open"}
            aria-label="say something"
            className="flex-1 rounded-pill border border-line bg-copy/5 px-4 py-2 text-[14px] text-copy placeholder:text-copy-faint focus:border-copy/35 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!userInput.trim() || paywall === "open"}
            aria-label="send"
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-copy/8 text-copy transition hover:bg-copy/14 disabled:opacity-40"
          >
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </FunnelShell>
  );
}

function arrivalOpener(companion: Companion, source: Source): string {
  switch (source) {
    case "browse":
      return companion.openers.browse;
    case "match":
      return companion.openers.match;
    case "create":
      return companion.openers.create;
    case "direct":
    default:
      return companion.openers.browse;
  }
}
