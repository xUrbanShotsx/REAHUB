"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { Mascot, MascotHead } from "@/components/app/Mascot";
import { btnDark, btnLight, Card, Pill } from "@/components/app/ui";
import { docToHtml, parseDoc } from "@/lib/doc-markdown";
import { me } from "@/lib/demo-data";
import { fmtDate, todayISO } from "@/lib/format";
import {
  vaultById,
  vaultStatus,
  type VaultDoc,
  type VaultQuestion,
} from "@/lib/vault";
import { buildAgencyProfile } from "@/lib/vault-profile";
import { sampleDoc, sampleQuestions } from "@/lib/vault-sample";
import { ApprovalBlock } from "../ApprovalBlock";
import { ApproveDialog } from "../ApproveDialog";
import { DocPaper } from "../DocPaper";
import { useTypewriter } from "../useTypewriter";

type Phase = "intro" | "asking" | "questions" | "writing" | "done";
type Problem = { code: string; text: string };

const ERR = "␞";

async function readProblem(res: Response): Promise<Problem> {
  const d = (await res.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
  };
  return {
    code: d.error ?? "error",
    text: d.message ?? "That did not work. Try again.",
  };
}

export function DocFlow({ id }: { id: string }) {
  const def = vaultById(id)!;
  const store = useStore();
  const existing = store.documents.find((d) => d.id === id);
  const agencyName = store.settings.agency.name;

  const [phase, setPhase] = useState<Phase>("intro");
  // a saved document opens straight to the page, once the browser copy has loaded
  const view: Phase = phase === "intro" && existing ? "done" : phase;
  const [questions, setQuestions] = useState<VaultQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const [streamDone, setStreamDone] = useState(false);
  const [skip, setSkip] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const abort = useRef<AbortController | null>(null);
  const demo = useRef(false);

  useEffect(() => () => abort.current?.abort(), []);

  const profile = () =>
    buildAgencyProfile({
      settings: store.settings,
      members: store.members,
      properties: store.properties,
      trust: store.trust,
    });

  const post = (body: object, ctrl: AbortController) =>
    fetch("/api/vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        docId: id,
        agency: profile(),
        today: todayISO(),
        ...body,
      }),
    });

  /* step 1: the writer decides what it still needs to ask */
  const begin = async () => {
    setProblem(null);
    setPhase("asking");
    const ctrl = new AbortController();
    abort.current = ctrl;
    try {
      const res = await post({ mode: "questions" }, ctrl);
      if (!res.ok) {
        const p = await readProblem(res);
        if (p.code === "not_configured") {
          // not connected: run the whole flow with sample text so it can still be seen
          demo.current = true;
          await new Promise((r) => setTimeout(r, 1600));
          setQuestions(sampleQuestions(def));
          setAnswers({});
          setPhase("questions");
          return;
        }
        setProblem(p);
        setPhase(existing ? "done" : "intro");
        return;
      }
      demo.current = false;
      const data = (await res.json()) as { questions?: VaultQuestion[] };
      const qs = data.questions ?? [];
      setQuestions(qs);
      setAnswers({});
      if (qs.length === 0) await write([], ctrl);
      else setPhase("questions");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setProblem({
        code: "network",
        text: "Could not reach the writer. Check your connection and try again.",
      });
      setPhase(existing ? "done" : "intro");
    }
  };

  /* step 2: the document streams in */
  const write = async (
    qa: { q: string; a: string }[],
    ctrl: AbortController = new AbortController(),
  ) => {
    abort.current = ctrl;
    setProblem(null);
    setText("");
    setStreamDone(false);
    setSkip(false);
    setPhase("writing");
    try {
      if (demo.current) {
        await new Promise((r) => setTimeout(r, 1800));
        const content = sampleDoc(def, {
          agency: agencyName,
          entity: store.settings.agency.trading,
          owner: me.name,
          today: todayISO(),
        });
        for (let i = 0; i < content.length; i += 40) {
          if (ctrl.signal.aborted) return;
          setText(content.slice(0, i + 40));
          await new Promise((r) => setTimeout(r, 18));
        }
        store.saveDoc({
          id,
          title: def.name,
          content,
          createdAt: `${todayISO()}T${new Date().toTimeString().slice(0, 5)}`,
          answers: qa,
          version: (existing?.version ?? 0) + 1,
          sample: true,
        });
        setText(content);
        setStreamDone(true);
        return;
      }
      const res = await post({ mode: "write", answers: qa }, ctrl);
      if (!res.ok || !res.body) {
        setProblem(await readProblem(res));
        setPhase(existing ? "done" : questions.length ? "questions" : "intro");
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setText(acc.split(ERR)[0]);
      }
      const [body, err] = acc.split(ERR);
      if (err || body.trim().length < 80) {
        setProblem({
          code: "write",
          text: err ?? "The writer sent back nothing. Try again.",
        });
        setPhase(existing ? "done" : "intro");
        return;
      }
      const content = body.trim();
      const title =
        parseDoc(content).find((b) => b.kind === "h1")?.lines[0] ?? def.name;
      store.saveDoc({
        id,
        title: title.replace(/\*\*/g, ""),
        content,
        createdAt: `${todayISO()}T${new Date().toTimeString().slice(0, 5)}`,
        answers: qa,
        version: (existing?.version ?? 0) + 1,
      });
      setText(content);
      setStreamDone(true);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setProblem({
        code: "network",
        text: "The connection dropped while writing. Try again.",
      });
      setPhase(existing ? "done" : "intro");
    }
  };

  const submitAnswers = () =>
    void write(
      questions
        .map((q) => ({ q: q.question, a: (answers[q.id] ?? "").trim() }))
        .filter((x) => x.a),
    );

  return (
    <div>
      <Link
        href="/dashboard/vault"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <Icon name="arrow" className="h-4 w-4 rotate-180" /> Document Vault
      </Link>

      {problem && <ProblemCard problem={problem} />}

      {view === "intro" && store.ready && (
        <Intro
          name={def.name}
          why={def.why}
          sections={def.sections}
          agency={agencyName}
          onStart={begin}
        />
      )}

      {view === "asking" && <Asking agency={agencyName} name={def.name} />}

      {view === "questions" && (
        <Questions
          agency={agencyName}
          questions={questions}
          answers={answers}
          setAnswer={(qid, v) => setAnswers((a) => ({ ...a, [qid]: v }))}
          onSubmit={submitAnswers}
          onSkip={() => void write([])}
        />
      )}

      {view === "writing" && (
        <Writing
          name={def.name}
          agency={agencyName}
          sections={def.sections}
          target={text}
          streamDone={streamDone}
          skip={skip}
          onSkip={() => setSkip(true)}
          onFinished={() => setPhase("done")}
        />
      )}

      {view === "done" && existing && (
        <Done
          key={existing.version}
          doc={existing}
          agency={agencyName}
          onRegenerate={begin}
          onDelete={() => {
            if (
              window.confirm(
                `Delete this ${def.name.toLowerCase()} from the vault? This cannot be undone.`,
              )
            ) {
              store.dropDoc(id);
              setPhase("intro");
              setText("");
            }
          }}
          justWritten={streamDone}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ProblemCard({ problem }: { problem: Problem }) {
  const off = problem.code === "not_configured";
  return (
    <div role="alert" className="mb-5 flex gap-3">
      <MascotHead className="mt-0.5 h-10 w-10 shrink-0" />
      <div className="min-w-0 flex-1 rounded-3xl rounded-tl-lg border border-accent/50 bg-accent/10 px-4 py-3.5 text-sm">
        <p className="font-semibold">
          {off ? "I'm not connected yet" : "That did not work"}
        </p>
        <p className="mt-1 text-ink-soft">
          {off
            ? "Ask whoever manages REAHUB to switch me on, then I can write your documents."
            : problem.text}
        </p>
        {off && (
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
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative max-w-md rounded-3xl rounded-bl-lg bg-ink px-5 py-3 text-bg shadow-lg">
      {children}
    </div>
  );
}

function Intro({
  name,
  why,
  sections,
  agency,
  onStart,
}: {
  name: string;
  why: string;
  sections: string[];
  agency: string;
  onStart: () => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          {name}
        </h1>
        <p className="mt-2 max-w-xl text-ink-soft">{why}</p>

        <div className="mt-6 flex items-end gap-3">
          <Mascot className="mascot-bob h-24 w-24 shrink-0" />
          <Bubble>
            <p className="font-display text-lg font-extrabold leading-snug">
              I&apos;ll write this for {agency}.
            </p>
            <p className="mt-1 text-sm text-bg/75">
              I may ask a few quick questions first, only where the answer
              changes the document.
            </p>
          </Bubble>
        </div>

        <button type="button" onClick={onStart} className={`${btnDark} mt-6`}>
          <Icon name="sparkle" className="h-4 w-4" /> Start writing
        </button>
        <p className="mt-3 max-w-md text-xs text-ink-soft">
          The result is a draft for you to review and approve. It is general
          guidance, not legal advice.
        </p>
      </div>

      <Card className="self-start">
        <div className="border-b border-line px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            What will be in it
          </p>
        </div>
        <ol className="space-y-2 px-5 py-4 text-sm">
          {sections.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="w-5 shrink-0 text-right font-mono text-xs leading-5 text-accent">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function Asking({ agency, name }: { agency: string; name: string }) {
  return (
    <div className="mx-auto max-w-xl py-10 text-center" role="status">
      <Mascot className="mascot-bob mx-auto h-32 w-32" />
      <p className="mt-4 font-display text-xl font-extrabold">
        Reading {agency}&apos;s details
      </p>
      <p className="mt-1 text-sm text-ink-soft">
        Working out what I still need to know for your {name.toLowerCase()}.
      </p>
      <div className="mx-auto mt-5 h-1 w-48 overflow-hidden rounded-full bg-tint">
        <div className="vault-sheen h-full w-full" />
      </div>
    </div>
  );
}

function Questions({
  agency,
  questions,
  answers,
  setAnswer,
  onSubmit,
  onSkip,
}: {
  agency: string;
  questions: VaultQuestion[];
  answers: Record<string, string>;
  setAnswer: (id: string, v: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
}) {
  const filled = questions.filter((q) => (answers[q.id] ?? "").trim()).length;
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-end gap-3">
        <Mascot className="mascot-bob h-20 w-20 shrink-0" />
        <Bubble>
          <p className="font-display text-lg font-extrabold leading-snug">
            A few quick questions first.
          </p>
          <p className="mt-1 text-sm text-bg/75">
            These make the document fit {agency}. Skip any you are unsure about
            and I&apos;ll leave a clear placeholder.
          </p>
        </Bubble>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {questions.map((q, i) => {
          const val = answers[q.id] ?? "";
          return (
            <Card key={q.id} className="vault-in p-5">
              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`q-${q.id}`}
                    className="block text-[15px] font-semibold leading-snug"
                  >
                    {q.question}
                  </label>
                  {q.hint && (
                    <p className="mt-1 text-xs text-ink-soft">{q.hint}</p>
                  )}
                  {q.options && q.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {q.options.map((o) => (
                        <button
                          key={o}
                          type="button"
                          aria-pressed={val === o}
                          onClick={() => setAnswer(q.id, val === o ? "" : o)}
                          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                            val === o
                              ? "border-accent bg-accent text-bg"
                              : "border-line bg-surface hover:border-ink"
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  )}
                  <input
                    id={`q-${q.id}`}
                    value={val}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    placeholder={
                      q.options?.length
                        ? "Or type your own answer"
                        : "Your answer"
                    }
                    className="mt-3 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px]"
                  />
                </div>
              </div>
            </Card>
          );
        })}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button type="submit" className={btnDark}>
            <Icon name="sparkle" className="h-4 w-4" /> Write my document
          </button>
          <button type="button" onClick={onSkip} className={btnLight}>
            Skip the questions
          </button>
          <span className="text-xs text-ink-soft">
            {filled} of {questions.length} answered
          </span>
        </div>
      </form>
    </div>
  );
}

function Writing({
  name,
  agency,
  sections,
  target,
  streamDone,
  skip,
  onSkip,
  onFinished,
}: {
  name: string;
  agency: string;
  sections: string[];
  target: string;
  streamDone: boolean;
  skip: boolean;
  onSkip: () => void;
  onFinished: () => void;
}) {
  const shown = useTypewriter(target, skip);
  const caughtUp = streamDone && shown.length >= target.length;
  const scroller = useRef<HTMLDivElement>(null);
  const stick = useRef(true);

  useEffect(() => {
    if (!caughtUp) return;
    const t = setTimeout(onFinished, 900);
    return () => clearTimeout(t);
  }, [caughtUp, onFinished]);

  useEffect(() => {
    const el = scroller.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [shown]);

  const heads = parseDoc(shown)
    .filter((b) => b.kind === "h2")
    .map((b) => b.lines[0].replace(/\*\*/g, "").replace(/^\d+[.)]\s*/, ""));
  const count = heads.length;
  const started = shown.length > 0;
  const pct = caughtUp
    ? 100
    : started
      ? Math.min(
          97,
          Math.round((Math.max(count - 0.5, 0.3) / sections.length) * 100),
        )
      : 3;
  const current = heads[heads.length - 1];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[oklch(0.2_0.03_265)] p-3 sm:p-6">
      <div
        aria-hidden="true"
        className="vault-aura pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-70 blur-3xl"
        style={{ background: "var(--accent)" }}
      />
      <div
        aria-hidden="true"
        className="vault-aura pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full opacity-40 blur-3xl [animation-delay:-2s]"
        style={{ background: "var(--accent)" }}
      />

      <div className="relative grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        {/* contents rail */}
        <aside className="hidden lg:block">
          <Mascot
            className={`mascot-bob h-28 w-28 ${caughtUp ? "" : "opacity-95"}`}
          />
          <p className="mt-3 font-display text-base font-extrabold text-white">
            {caughtUp ? "Done. Have a read." : "Writing your document"}
          </p>
          <p className="mt-0.5 text-xs text-white/60">{agency}</p>
          <ol className="mt-5 space-y-2.5 text-sm">
            {sections.map((s, i) => {
              const state =
                caughtUp || i < count - 1
                  ? "done"
                  : i === count - 1
                    ? "now"
                    : "next";
              return (
                <li
                  key={s}
                  className={`flex items-start gap-2.5 transition-colors duration-500 ${
                    state === "next" ? "text-white/35" : "text-white"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] ${
                      state === "done"
                        ? "bg-accent text-white"
                        : state === "now"
                          ? "bg-white text-ink"
                          : "border border-white/25"
                    }`}
                  >
                    {state === "done" ? (
                      <Icon name="check" className="h-2.5 w-2.5" />
                    ) : state === "now" ? (
                      <span className="vault-skel h-1.5 w-1.5 rounded-full bg-accent" />
                    ) : null}
                  </span>
                  <span className="leading-snug">{s}</span>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* the page */}
        <div className="min-w-0">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
            <div className="h-1 w-full bg-tint">
              <div
                className={`h-full w-full ${caughtUp ? "bg-accent" : "vault-sheen"}`}
              />
            </div>
            <div className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-6">
              <MascotHead className="h-8 w-8 shrink-0 lg:hidden" />
              <div className="min-w-0 flex-1">
                <p className="hidden truncate text-sm font-bold sm:block">
                  {name}
                </p>
                <p className="truncate text-xs text-ink-soft" role="status">
                  {caughtUp
                    ? "Finished and saved to your vault"
                    : !started
                      ? "Planning the structure"
                      : current
                        ? `Writing: ${current}`
                        : "Setting out the document"}
                </p>
              </div>
              <span className="font-mono text-xs text-ink-soft">{pct}%</span>
              {!caughtUp && started && (
                <button
                  type="button"
                  onClick={onSkip}
                  className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-soft hover:bg-tint hover:text-ink"
                >
                  Skip<span className="hidden sm:inline"> animation</span>
                </button>
              )}
            </div>

            <div
              ref={scroller}
              data-lenis-prevent
              onScroll={(e) => {
                const el = e.currentTarget;
                stick.current =
                  el.scrollHeight - el.scrollTop - el.clientHeight < 80;
              }}
              className="max-h-[62vh] min-h-[22rem] overflow-y-auto overscroll-contain px-5 py-6 sm:px-10 sm:py-8"
            >
              {started ? (
                <DocPaper text={shown} caret={!caughtUp} animate />
              ) : (
                <div className="space-y-3" aria-hidden="true">
                  <div className="vault-skel h-7 w-3/5 rounded-md bg-tint" />
                  {[92, 100, 84, 96, 60].map((w, i) => (
                    <div
                      key={i}
                      className="vault-skel h-3 rounded bg-tint"
                      style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Done({
  doc,
  agency,
  onRegenerate,
  onDelete,
  justWritten,
}: {
  doc: VaultDoc;
  agency: string;
  onRegenerate: () => void;
  onDelete: () => void;
  justWritten: boolean;
}) {
  const store = useStore();
  const [copied, setCopied] = useState(false);
  const [signing, setSigning] = useState(false);
  const { title: docTitle, content, version, approval } = doc;
  const status = vaultStatus(doc, todayISO());

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy the document text:", content);
    }
  };

  const download = () => {
    const blob = new Blob(
      [docToHtml(docTitle, content, approval && { ...approval, version })],
      { type: "application/msword" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${docTitle.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "document"}${approval ? "-approved" : "-draft"}.doc`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const rewrite = () => {
    if (
      !approval ||
      window.confirm(
        "This document is approved. Writing it again replaces it with a new draft that must be approved and signed again. Continue?",
      )
    )
      onRegenerate();
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {docTitle}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
            {status === "draft" && <Pill tone="neutral">Draft v{version}</Pill>}
            {status === "approved" && (
              <Pill tone="ok">Approved v{version}</Pill>
            )}
            {(status === "review-soon" || status === "review-due") && (
              <Pill tone="owed">
                {status === "review-due" ? "Review overdue" : "Review due soon"}
              </Pill>
            )}
            {approval
              ? `Approved by ${approval.name} on ${fmtDate(approval.date)}`
              : `Written for ${agency} on ${fmtDate(doc.createdAt.slice(0, 10))}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!approval && (
            <button
              type="button"
              onClick={() => setSigning(true)}
              className={btnDark}
            >
              <Icon name="check" className="h-4 w-4" /> Approve and sign
            </button>
          )}
          <button type="button" onClick={copy} className={btnLight}>
            <Icon name={copied ? "check" : "clip"} className="h-4 w-4" />
            {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" onClick={download} className={btnLight}>
            <Icon name="download" className="h-4 w-4" /> Word
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className={btnLight}
          >
            <Icon name="file" className="h-4 w-4" /> Print or PDF
          </button>
          <button type="button" onClick={rewrite} className={btnLight}>
            <Icon name="sparkle" className="h-4 w-4" />{" "}
            {approval ? "New version" : "Write again"}
          </button>
        </div>
      </div>

      {approval ? (
        <p
          className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
            status === "review-due" || status === "review-soon"
              ? "border-amber-400/50 bg-amber-400/10"
              : "border-emerald-500/30 bg-emerald-500/10"
          }`}
        >
          {status === "review-due"
            ? `This was approved by ${approval.name} but its review date, ${fmtDate(approval.nextReview)}, has passed. Write a new version or review it and approve it again.`
            : status === "review-soon"
              ? `Approved by ${approval.name}. It is due for review on ${fmtDate(approval.nextReview)}.`
              : `Approved and signed by ${approval.name}, ${approval.role}, on ${fmtDate(approval.date)}. Next review ${fmtDate(approval.nextReview)}.`}
        </p>
      ) : (
        <p className="mb-4 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
          {doc.sample
            ? "This is sample text, shown because the writer is not connected yet. Once it is connected, each document is written from your agency details and your answers. "
            : "This is a draft written by AI from your agency details. Read it through, then approve and sign it when it is ready to adopt. "}
          It is not in force until it is signed.
        </p>
      )}

      <div
        className={`vault-print overflow-hidden rounded-2xl border border-line bg-white px-5 py-7 shadow-sm sm:px-12 sm:py-10 ${
          justWritten ? "vault-in" : ""
        }`}
      >
        <DocPaper text={content} />
        <ApprovalBlock approval={approval} version={version} />
      </div>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        {doc.answers.length > 0 ? (
          <details className="min-w-0 max-w-xl text-sm">
            <summary className="cursor-pointer font-semibold">
              Answers this was based on
            </summary>
            <dl className="mt-2 space-y-2 text-ink-soft">
              {doc.answers.map((a) => (
                <div key={a.q}>
                  <dt className="font-medium text-ink">{a.q}</dt>
                  <dd>{a.a}</dd>
                </div>
              ))}
            </dl>
          </details>
        ) : (
          <span />
        )}
        <div className="flex gap-4">
          {approval && (
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Withdraw the approval? The document goes back to a draft and the signature is removed. This is recorded in the audit log.",
                  )
                )
                  store.withdrawApproval(doc.id);
              }}
              className="text-sm font-semibold text-ink-soft underline hover:text-ink"
            >
              Withdraw approval
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="text-sm font-semibold text-ink-soft underline hover:text-ink"
          >
            Delete from vault
          </button>
        </div>
      </div>

      {signing && (
        <ApproveDialog
          docTitle={docTitle}
          content={content}
          agency={agency}
          onClose={() => setSigning(false)}
          onApprove={(a) => {
            store.approveDoc(doc.id, a);
            setSigning(false);
          }}
        />
      )}
    </div>
  );
}
