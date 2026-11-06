"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icons";
import { Avatar, Card, PageHeading, Pill, Progress } from "@/components/app/ui";
import { properties as seed, type Property } from "@/lib/demo-data";

const FILTERS = [
  "All",
  "Listed",
  "Under offer",
  "Managed",
  "Appraised",
] as const;

export function PropertiesView() {
  const [items, setItems] = useState<Property[]>(seed);
  const [selected, setSelected] = useState(seed[0].id);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [q, setQ] = useState("");

  const list = useMemo(
    () =>
      items.filter(
        (p) =>
          (filter === "All" || p.status === filter) &&
          `${p.address} ${p.suburb}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [items, filter, q],
  );
  const current = items.find((p) => p.id === selected) ?? items[0];
  const done = current.checklist.filter((c) => c.done).length;
  const pct = Math.round((done / current.checklist.length) * 100);

  const toggle = (itemId: string) =>
    setItems((all) =>
      all.map((p) =>
        p.id !== current.id
          ? p
          : {
              ...p,
              checklist: p.checklist.map((c) =>
                c.id === itemId ? { ...c, done: !c.done } : c,
              ),
            },
      ),
    );

  return (
    <>
      <PageHeading
        title="Properties"
        sub="One file per address. Campaigns and management periods hang off it."
      />

      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <Card className="self-start">
          <div className="border-b border-line p-3">
            <label className="flex items-center gap-2 rounded-full bg-bg px-3 py-2 text-sm text-ink-soft focus-within:ring-2 focus-within:ring-accent">
              <Icon name="search" className="h-4 w-4" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Find an address"
                aria-label="Find an address"
                className="w-full bg-transparent text-ink outline-none placeholder:text-ink-soft"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    filter === f
                      ? "bg-ink text-bg"
                      : "bg-tint text-ink-soft hover:text-ink"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <ul className="max-h-[32rem] overflow-y-auto">
            {list.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-ink-soft">
                No properties match.
              </li>
            )}
            {list.map((p) => {
              const owed = p.checklist.filter((c) => !c.done).length;
              return (
                <li key={p.id} className="border-b border-line last:border-0">
                  <button
                    type="button"
                    onClick={() => setSelected(p.id)}
                    aria-current={p.id === current.id}
                    className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                      p.id === current.id
                        ? "bg-accent/[0.08] shadow-[inset_3px_0_0_var(--accent)]"
                        : "hover:bg-tint"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {p.address}
                      </span>
                      <span className="block truncate text-xs text-ink-soft">
                        {p.suburb} · {p.status}
                      </span>
                    </span>
                    {owed > 0 && <Pill tone="owed">{owed} owed</Pill>}
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
            <div>
              <h2 className="font-display text-xl font-extrabold tracking-tight">
                {current.address}, {current.suburb}
              </h2>
              <p className="mt-0.5 text-sm text-ink-soft">
                {current.kind} · {current.detail}
              </p>
            </div>
            <Pill tone="neutral">{current.status}</Pill>
          </div>
          <div className="px-5 pt-4">
            <div className="mb-1.5 flex justify-between text-xs text-ink-soft">
              <span>Compliance checklist</span>
              <span className="tabular-nums">
                {done} of {current.checklist.length} done
              </span>
            </div>
            <Progress pct={pct} />
          </div>
          <ul className="mt-4 border-t border-line">
            {current.checklist.map((c) => (
              <li key={c.id} className="border-b border-line last:border-0">
                <label className="flex cursor-pointer items-center gap-3 px-5 py-3.5 hover:bg-tint/60">
                  <input
                    type="checkbox"
                    checked={c.done}
                    onChange={() => toggle(c.id)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] peer-focus-visible:ring-2 peer-focus-visible:ring-accent ${
                      c.done
                        ? "border-ink bg-ink text-bg"
                        : "border-ink-soft/50"
                    }`}
                  >
                    {c.done && <Icon name="check" className="h-3 w-3" />}
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate text-sm ${c.done ? "text-ink-soft" : "font-semibold"}`}
                  >
                    {c.t}
                  </span>
                  {c.file && (
                    <span className="hidden items-center gap-1 rounded-md bg-tint px-2 py-1 text-[11px] font-medium text-ink-soft md:inline-flex">
                      <Icon name="clip" className="h-3 w-3" />
                      {c.file}
                    </span>
                  )}
                  {!c.done && c.due && <Pill tone="owed">{c.due}</Pill>}
                  <Avatar initials={c.who} tone={c.done ? 2 : 0} />
                </label>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-3 border-t border-line bg-bg px-5 py-3 text-xs text-ink-soft">
            <span>Agent: {current.agent}</span>
            <span>Every change is written to the audit log</span>
          </div>
        </Card>
      </div>
    </>
  );
}
