"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icons";
import { PageHeading } from "@/components/app/ui";
import { HELP, HELP_CATEGORIES } from "@/lib/help";

export function HelpView() {
  const [q, setQ] = useState("");
  const tokens = useMemo(
    () => q.toLowerCase().split(/\s+/).filter(Boolean),
    [q],
  );
  const found = useMemo(
    () =>
      HELP.filter((a) => {
        const t =
          `${a.title} ${a.summary} ${a.category} ${a.body}`.toLowerCase();
        return tokens.every((tok) => t.includes(tok));
      }),
    [tokens],
  );

  return (
    <div>
      <PageHeading
        title="Help"
        sub="Short guides to getting around REAHUB and getting the work done."
      />

      <label className="mb-8 flex max-w-xl items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-ink-soft focus-within:border-ink-soft">
        <Icon name="search" className="h-4 w-4 shrink-0" />
        <span className="sr-only">Search help</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search help, for example reconcile or team leader"
          className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-soft"
        />
      </label>

      {found.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-ink-soft">
          No guides match “{q.trim()}”. Try another word, or{" "}
          <Link
            href="/dashboard/assistant"
            className="font-semibold text-accent underline-offset-2 hover:underline"
          >
            ask Assistance
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-9">
          {HELP_CATEGORIES.map((cat) => {
            const list = found.filter((a) => a.category === cat);
            if (!list.length) return null;
            return (
              <section key={cat} aria-labelledby={`h-${cat}`}>
                <h2
                  id={`h-${cat}`}
                  className="mb-3 font-display text-lg font-extrabold tracking-tight"
                >
                  {cat}
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {list.map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/dashboard/help/${a.id}`}
                        className="group flex h-full gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-ink"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent">
                          <Icon name={a.icon} className="h-[18px] w-[18px]" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold leading-snug">
                            {a.title}
                          </span>
                          <span className="mt-1 block text-[13px] leading-snug text-ink-soft">
                            {a.summary}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
        <div>
          <p className="font-display text-base font-extrabold">
            Can&apos;t find it?
          </p>
          <p className="mt-0.5 text-sm text-ink-soft">
            Ask Assistance. It knows REAHUB and can do much of the work for you.
          </p>
        </div>
        <Link
          href="/dashboard/assistant"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg hover:bg-ink/85"
        >
          <Icon name="sparkle" className="h-4 w-4" /> Ask Assistance
        </Link>
      </div>
    </div>
  );
}
