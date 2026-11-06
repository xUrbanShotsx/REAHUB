"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { btnLight } from "@/components/app/ui";
import { buildContext, SUGGESTIONS } from "@/lib/assistant-context";
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

  return (
    <div className="mx-auto flex min-h-[calc(100vh-11rem)] max-w-3xl flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Assistance
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Ask about real estate compliance, or anything about your office.
          </p>
        </div>
        {!empty && (
          <button type="button" onClick={reset} className={btnLight}>
            <Icon name="plus" className="h-4 w-4" /> New chat
          </button>
        )}
      </div>

      <div className="flex-1 space-y-6 pb-6">
        {empty && (
          <div className="pt-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-bg">
              <Icon name="sparkle" className="h-6 w-6" />
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight">
              How can I help?
            </h2>
            <p className="mt-2 max-w-xl text-ink-soft">
              I can explain NSW agency compliance, and I can see your
              agency&apos;s properties, tasks, licences, registers and trust
              accounts, so I can tell you what is outstanding.
            </p>

            {(
              [
                ["Compliance", SUGGESTIONS.compliance],
                ["Your office", SUGGESTIONS.office],
              ] as const
            ).map(([label, list]) => (
              <div key={label} className="mt-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-soft">
                  {label}
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {list.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void send(q)}
                      className="rounded-2xl border border-line bg-surface p-4 text-left text-sm font-medium transition-colors hover:border-ink hover:bg-tint/60"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-ink px-4 py-3 text-[15px] leading-relaxed text-bg">
                {m.content}
              </p>
            </div>
          ) : (
            <div key={m.id} className="flex gap-3">
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-bg">
                <Icon name="sparkle" className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 pt-1">
                {m.content ? (
                  <Markdown text={m.content} />
                ) : busy && i === messages.length - 1 ? (
                  <p className="text-sm text-ink-soft">Thinking</p>
                ) : null}
              </div>
            </div>
          ),
        )}

        {problem && (
          <div
            role="alert"
            className="rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm"
          >
            <p className="font-semibold">
              {problem.code === "not_configured"
                ? "The assistant is not connected yet"
                : "Something went wrong"}
            </p>
            <p className="mt-1 text-ink-soft">
              {problem.code === "not_configured"
                ? "Ask whoever manages REAHUB to switch it on."
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
        )}
        <div ref={bottom} />
      </div>

      <div className="sticky bottom-0 -mx-4 bg-gradient-to-t from-bg from-70% to-transparent px-4 pb-4 pt-2 sm:-mx-8 sm:px-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2 rounded-3xl border border-line bg-surface p-2 shadow-sm focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30"
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
              placeholder="Ask about compliance, or about your office"
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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-bg disabled:opacity-30"
            >
              <Icon name="arrow" className="h-4 w-4 -rotate-90" />
            </button>
          )}
        </form>
        <p className="mt-2 text-center text-[11px] text-ink-soft">
          The assistant can make mistakes. Compliance answers are general
          information, not legal advice. Your office data is sent with each
          question.
        </p>
      </div>
    </div>
  );
}
