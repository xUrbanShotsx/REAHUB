"use client";

import { useState } from "react";
import { Icon } from "@/components/Icons";
import {
  Card,
  CardHead,
  PageHeading,
  Pill,
  Progress,
} from "@/components/app/ui";
import { kpis, tasks as seed, upcoming, type Task } from "@/lib/demo-data";

const COLUMNS: Task["status"][] = ["Open", "In progress", "Done"];
const NEXT: Record<Task["status"], Task["status"]> = {
  Open: "In progress",
  "In progress": "Done",
  Done: "Open",
};

export function OperationsView() {
  const [tasks, setTasks] = useState<Task[]>(seed);
  const advance = (id: string) =>
    setTasks((all) =>
      all.map((t) => (t.id === id ? { ...t, status: NEXT[t.status] } : t)),
    );

  return (
    <>
      <PageHeading
        title="Operations"
        sub="The day's work, tied to the properties it is about."
      />

      <div className="space-y-6">
        <div>
          <div className="grid gap-4 md:grid-cols-3">
            {COLUMNS.map((col) => {
              const items = tasks.filter((t) => t.status === col);
              return (
                <section
                  key={col}
                  aria-label={col}
                  className="rounded-2xl bg-bg p-3"
                >
                  <h2 className="mb-3 flex items-center justify-between px-1 text-xs font-bold uppercase tracking-wider text-ink-soft">
                    {col}
                    <span className="rounded-full bg-tint px-2 py-0.5 font-medium normal-case tracking-normal">
                      {items.length}
                    </span>
                  </h2>
                  <ul className="space-y-2">
                    {items.map((t) => (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => advance(t.id)}
                          className="w-full rounded-xl border border-line bg-surface p-3.5 text-left shadow-sm transition-shadow hover:shadow-md"
                          aria-label={`${t.t}. Move to ${NEXT[t.status]}`}
                        >
                          <span
                            className={`block text-sm font-semibold ${t.status === "Done" ? "text-ink-soft line-through" : ""}`}
                          >
                            {t.t}
                          </span>
                          <span className="mt-1 block text-xs text-ink-soft">
                            {t.where}
                          </span>
                          <span className="mt-2 flex items-center justify-between">
                            <Pill tone="neutral">
                              From {t.from.toLowerCase()}
                            </Pill>
                            {t.status === "Done" && (
                              <Icon name="check" className="h-4 w-4" />
                            )}
                          </span>
                        </button>
                      </li>
                    ))}
                    {items.length === 0 && (
                      <li className="px-2 py-6 text-center text-xs text-ink-soft">
                        Nothing here.
                      </li>
                    )}
                  </ul>
                </section>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-ink-soft">
            Select a task to move it along. Tasks come from checklists, reviews
            and by hand.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHead title="KPIs against target" sub="This month" />
            <ul className="space-y-4 p-5">
              {kpis.map((k) => (
                <li key={k.name}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-semibold">{k.name}</span>
                    <span className="tabular-nums text-ink-soft">{k.pct}%</span>
                  </div>
                  <Progress pct={k.pct} tone={k.pct >= 80 ? "ink" : "accent"} />
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="Coming up" sub="Statutory dates and inspections" />
            <ul>
              {upcoming.map((u) => (
                <li
                  key={u.t}
                  className="flex items-center gap-4 border-b border-line px-5 py-3.5 last:border-0"
                >
                  <span className="w-16 shrink-0 font-mono text-xs text-ink-soft">
                    {u.d}
                  </span>
                  <span className="text-sm font-medium">{u.t}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
