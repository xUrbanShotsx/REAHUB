"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { btnLight } from "@/components/app/ui";
import { buildContext } from "@/lib/assistant-context";
import { me } from "@/lib/demo-data";
import { Mascot, MascotHead } from "@/components/app/Mascot";
import { todayISO } from "@/lib/format";
import { Markdown } from "./Markdown";
import {
  readChat,
  serverChat,
  subscribeChat,
  writeChat,
  type ChatMessage,
} from "./chatStore";

const uid = () => Math.random().toString(36).slice(2, 10);

export function AssistantView() {
  const store = useStore();
  const messages = useSyncExternalStore(subscribeChat, readChat, serverChat);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<{ code: string; text: string } | null>(
    null,
  );
  const abort = useRef<AbortController | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setProblem(null);
    setInput("");
    const history: ChatMessage[] = [
      ...readChat(),
      { id: uid(), role: "user", content: q },
    ];
    const reply: ChatMessage = { id: uid(), role: "assistant", content: "" };
    writeChat([...history, reply]);
    setBusy(true);
    const ctrl = new AbortController();
    abort.current = ctrl;

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
          context: buildContext(store, todayISO()),
        }),
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        writeChat(history);
        setProblem({
          code: data.error ?? "error",
          text: data.message ?? "The assistant could not answer. Try again.",
        });
        return;
      }

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        writeChat([...history, { ...reply, content: acc }]);
      }
      if (!acc.trim())
        writeChat([
          ...history,
          {
            ...reply,
            content: "I did not get an answer back. Try asking again.",
          },
        ]);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      writeChat(history);
      setProblem({
        code: "network",
        text: "Could not reach the assistant. Check your connection and try again.",
      });
    } finally {
      setBusy(false);
      abort.current = null;
    }
  };

  const stop = () => abort.current?.abort();
  const reset = () => {
    abort.current?.abort();
    writeChat([]);
    setProblem(null);
    setBusy(false);
    box.current?.focus();
  };

  const empty = messages.length === 0;
  const first = me.name.split(" ")[0];

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-11rem)] max-w-3xl flex-col">
      {!empty && (
        <div className="mb-4 flex justify-end">
          <button type="button" onClick={reset} className={btnLight}>
            <Icon name="plus" className="h-4 w-4" /> New chat
          </button>
        </div>
      )}

      <div className="flex-1 space-y-6 pb-6">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-lg bg-ink px-4 py-3 text-[15px] leading-relaxed text-bg shadow-sm">
                {m.content}
              </p>
            </div>
          ) : (
            <div key={m.id} className="flex gap-3">
              <MascotHead className="mt-0.5 h-10 w-10 shrink-0" />
              <div className="min-w-0 flex-1">
                {m.content ? (
                  <div className="rounded-3xl rounded-tl-lg border border-line bg-surface px-4 py-3.5 shadow-sm">
                    <Markdown text={m.content} />
                  </div>
                ) : busy && i === messages.length - 1 ? (
                  <div
                    className="inline-flex items-center gap-1.5 rounded-3xl rounded-tl-lg border border-line bg-surface px-4 py-3.5"
                    role="status"
                    aria-label="Thinking"
                  >
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="h-2 w-2 animate-bounce rounded-full bg-accent"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ),
        )}

        {problem && (
          <div role="alert" className="flex gap-3">
            <MascotHead className="mt-0.5 h-10 w-10 shrink-0" />
            <div className="min-w-0 flex-1 rounded-3xl rounded-tl-lg border border-accent/50 bg-accent/10 px-4 py-3.5 text-sm">
              <p className="font-semibold">
                {problem.code === "not_configured"
                  ? "I'm not connected yet"
                  : "Something went wrong"}
              </p>
              <p className="mt-1 text-ink-soft">
                {problem.code === "not_configured"
                  ? "Ask whoever manages REAHUB to switch me on."
                  : problem.text}
              </p>
              {problem.code === "not_configured" && (
                <p className="mt-2 text-xs text-ink-soft">
                  For whoever sets this up: add{" "}
                  <code className="rounded bg-tint px-1 py-0.5 font-mono">
                    ANTHROPIC_API_KEY=...
                  </code>{" "}
                  to{" "}
                  <code className="rounded bg-tint px-1 py-0.5 font-mono">
                    .env.local
                  </code>{" "}
                  and restart the server.
                </p>
              )}
            </div>
          </div>
        )}
        <div ref={bottom} />
      </div>

      <div className="sticky bottom-0 -mx-4 bg-gradient-to-t from-bg from-70% to-transparent px-4 pb-4 pt-2 sm:-mx-8 sm:px-8">
        <div className="flex items-end gap-3">
          <Mascot
            className={`mascot-bob hidden h-24 w-24 shrink-0 sm:block ${busy ? "opacity-90" : ""}`}
          />
          <div className="min-w-0 flex-1">
            {empty && (
              <Mascot className="mascot-bob mb-2 h-20 w-20 sm:hidden" />
            )}
            {empty && (
              <div className="relative mb-3 max-w-md rounded-3xl rounded-bl-lg bg-ink px-5 py-3 text-bg shadow-lg">
                <p className="font-display text-lg font-extrabold leading-snug">
                  G&apos;day {first}. What are we sorting out today?
                </p>
                <p className="mt-1 text-sm text-bg/75">
                  Ask about NSW compliance, check what is outstanding in the
                  office, or ask me to explain a rule.
                </p>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex items-end gap-2 rounded-[1.75rem] border border-line bg-surface p-2 shadow-[0_12px_40px_-16px_oklch(0.23_0.02_255/0.35)] focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30"
            >
              <label className="min-w-0 flex-1">
                <span className="sr-only">Ask the assistant</span>
                <textarea
                  ref={box}
                  value={input}
                  rows={1}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                  placeholder="Ask me anything"
                  className="outline-none max-h-44 w-full resize-none bg-transparent px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-soft"
                />
              </label>
              {busy ? (
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Stop"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-bg"
                >
                  <span className="h-3 w-3 rounded-sm bg-bg" />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-bg transition-opacity disabled:opacity-30"
                >
                  <Icon name="arrow" className="h-4 w-4 -rotate-90" />
                </button>
              )}
            </form>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-ink-soft">
          The assistant can make mistakes. Compliance answers are general
          information, not legal advice. Your office data is sent with each
          question.
        </p>
      </div>
    </div>
  );
}
