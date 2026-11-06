"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { RegisterForm } from "@/components/app/RegisterForm";
import {
  Avatar,
  btnDark,
  Card,
  PageHeading,
  Pill,
  Stat,
} from "@/components/app/ui";
import { initialsOf, me, type TaskStatus } from "@/lib/demo-data";
import { fmtDate, todayISO } from "@/lib/format";
import type { Field } from "@/lib/registers";

const FILTERS = ["All", "Open", "In progress", "Done"] as const;
const STATUSES: TaskStatus[] = ["Open", "In progress", "Done"];

const fields: Field[] = [
  {
    name: "t",
    label: "Task",
    type: "text",
    required: true,
    wide: true,
    placeholder: "What needs doing?",
  },
  { name: "assignee", label: "Assigned to", type: "person", required: true },
  { name: "due", label: "Due date", type: "date" },
  { name: "property", label: "Related property", type: "property" },
];

export function TasksView() {
  const { tasks, properties, ready, addTask, setTaskStatus, dropTask } =
    useStore();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [mine, setMine] = useState(false);
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const today = ready ? todayISO() : "";

  const list = useMemo(() => {
    return tasks
      .filter(
        (t) =>
          (filter === "All" || t.status === filter) &&
          (!mine || t.assignee === me.name) &&
          `${t.t} ${t.where} ${t.assignee}`
            .toLowerCase()
            .includes(q.toLowerCase()),
      )
      .sort((a, b) => {
        if ((a.status === "Done") !== (b.status === "Done"))
          return a.status === "Done" ? 1 : -1;
        return (a.due ?? "9999").localeCompare(b.due ?? "9999");
      });
  }, [tasks, filter, mine, q]);

  const open = tasks.filter((t) => t.status !== "Done");
  const overdue = open.filter((t) => t.due && t.due < today).length;
  const dueToday = open.filter((t) => t.due === today).length;

  const dueLabel = (due?: string, done?: boolean) => {
    if (!due) return null;
    if (done)
      return <span className="text-xs text-ink-soft">{fmtDate(due)}</span>;
    if (due < today) return <Pill tone="owed">Overdue {fmtDate(due)}</Pill>;
    if (due === today) return <Pill tone="owed">Due today</Pill>;
    return <span className="text-xs text-ink-soft">{fmtDate(due)}</span>;
  };

  return (
    <>
      <PageHeading
        title="Task list"
        sub="Everything that needs doing, from checklists, meetings, reviews and by hand."
        actions={
          <button
            type="button"
            onClick={() => setAdding((a) => !a)}
            className={btnDark}
          >
            <Icon name="plus" className="h-4 w-4" /> Add task
          </button>
        }
      />

      {adding && (
        <Card className="mb-6 p-5">
          <h2 className="mb-4 font-display text-lg font-extrabold">New task</h2>
          <RegisterForm
            fields={fields}
            submitLabel="Add task"
            onCancel={() => setAdding(false)}
            onSubmit={async (v) => {
              const prop = properties.find((p) => p.id === v.property);
              addTask({
                t: String(v.t),
                assignee: String(v.assignee),
                due: v.due ? String(v.due) : undefined,
                where: prop ? `${prop.address}` : undefined,
              });
              setAdding(false);
            }}
          />
        </Card>
      )}

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Stat label="Open" value={String(open.length)} />
        <Stat
          label="Due today"
          value={String(dueToday)}
          tone={dueToday ? "owed" : undefined}
        />
        <Stat
          label="Overdue"
          value={String(overdue)}
          tone={overdue ? "owed" : undefined}
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-3">
          <label className="flex min-w-[12rem] flex-1 items-center gap-2 rounded-full bg-bg px-3 py-2 text-sm text-ink-soft">
            <Icon name="search" className="h-4 w-4" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tasks"
              aria-label="Search tasks"
              className="w-full bg-transparent text-ink outline-none placeholder:text-ink-soft"
            />
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  filter === f
                    ? "bg-ink text-bg"
                    : "bg-tint text-ink-soft hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={mine}
              onClick={() => setMine((m) => !m)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                mine
                  ? "bg-accent text-bg"
                  : "bg-tint text-ink-soft hover:text-ink"
              }`}
            >
              Mine
            </button>
          </div>
        </div>

        {!ready ? (
          <p className="px-5 py-10 text-center text-sm text-ink-soft">
            Loading tasks
          </p>
        ) : list.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-ink-soft">
            No tasks match.
          </p>
        ) : (
          <ul>
            {list.map((t) => {
              const done = t.status === "Done";
              return (
                <li
                  key={t.id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-5 py-3.5 last:border-0"
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={done}
                    aria-label={`${t.t}, mark ${done ? "open" : "done"}`}
                    onClick={() => setTaskStatus(t.id, done ? "Open" : "Done")}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] ${
                      done
                        ? "border-ink bg-ink text-bg"
                        : "border-ink-soft/50 hover:border-ink"
                    }`}
                  >
                    {done && <Icon name="check" className="h-3 w-3" />}
                  </button>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-sm ${done ? "text-ink-soft line-through decoration-ink-soft/50" : "font-semibold"}`}
                    >
                      {t.t}
                    </span>
                    <span className="block truncate text-xs text-ink-soft">
                      {t.where} · from {t.from.toLowerCase()}
                    </span>
                  </span>
                  {dueLabel(t.due, done)}
                  <label className="text-xs">
                    <span className="sr-only">Status of {t.t}</span>
                    <select
                      value={t.status}
                      onChange={(e) =>
                        setTaskStatus(t.id, e.target.value as TaskStatus)
                      }
                      className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold"
                    >
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <Avatar
                    initials={initialsOf(t.assignee)}
                    tone={done ? 2 : 0}
                  />
                  <button
                    type="button"
                    aria-label={`Delete ${t.t}`}
                    onClick={() => dropTask(t.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-tint hover:text-ink"
                  >
                    <Icon name="close" className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
