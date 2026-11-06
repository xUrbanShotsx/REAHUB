"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { RegisterForm } from "@/components/app/RegisterForm";
import {
  btnDark,
  Card,
  CardHead,
  PageHeading,
  Pill,
} from "@/components/app/ui";
import { typeName } from "@/lib/accreditations";
import { EVENT_KINDS, type CalEvent } from "@/lib/demo-data";
import { fmtDate, todayISO } from "@/lib/format";
import type { Field } from "@/lib/registers";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Item = {
  id: string;
  title: string;
  date: string;
  time?: string;
  kind: string;
  href?: string;
  event?: CalEvent;
};

const eventFields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true, wide: true },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "time", label: "Time", type: "time" },
  {
    name: "kind",
    label: "Type",
    type: "select",
    required: true,
    options: EVENT_KINDS,
  },
  { name: "property", label: "Related property", type: "property" },
  { name: "notes", label: "Notes", type: "textarea", wide: true },
];

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export function CalendarView() {
  const {
    events,
    tasks,
    meetings,
    accreditations,
    properties,
    ready,
    addEvent,
    dropEvent,
  } = useStore();
  const today = ready ? todayISO() : "2026-01-01";
  const [ty, tm] = today.split("-").map(Number);
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const view = cursor ?? { y: ty, m: tm - 1 };
  const selected = picked ?? today;

  // everything that lands on a date, from every part of the workspace
  const items = useMemo(() => {
    const out: Item[] = [];
    for (const e of events)
      out.push({
        id: e.id,
        title: e.title,
        date: e.date,
        time: e.time,
        kind: e.kind,
        event: e,
      });
    for (const t of tasks)
      if (t.due && t.status !== "Done")
        out.push({
          id: `t-${t.id}`,
          title: t.t,
          date: t.due,
          kind: "Task due",
          href: "/dashboard/tools/tasks",
        });
    for (const m of meetings)
      out.push({
        id: `m-${m.id}`,
        title: m.title,
        date: m.date,
        time: m.time,
        kind: "Meeting",
        href: "/dashboard/tools/meetings",
      });
    for (const a of accreditations) {
      out.push({
        id: `x-${a.id}`,
        title: `${a.person}, ${typeName(a)} expires`,
        date: a.expiresOn,
        kind: "Renewal due",
        href: `/dashboard/compliance/accreditations/${a.id}`,
      });
      if (a.cpdRequired > 0)
        out.push({
          id: `c-${a.id}`,
          title: `${a.person}, CPD year ends`,
          date: a.cpdYearEnd,
          kind: "CPD deadline",
          href: `/dashboard/compliance/accreditations/${a.id}`,
        });
    }
    return out.sort((x, y) =>
      `${x.date}${x.time ?? ""}`.localeCompare(`${y.date}${y.time ?? ""}`),
    );
  }, [events, tasks, meetings, accreditations]);

  const byDate = useMemo(() => {
    const m = new Map<string, Item[]>();
    for (const i of items) m.set(i.date, [...(m.get(i.date) ?? []), i]);
    return m;
  }, [items]);

  // month grid starting on Monday
  const first = new Date(view.y, view.m, 1);
  const lead = (first.getDay() + 6) % 7;
  const dim = new Date(view.y, view.m + 1, 0).getDate();
  const cells = Array.from(
    { length: Math.ceil((lead + dim) / 7) * 7 },
    (_, i) => {
      const d = i - lead + 1;
      return d >= 1 && d <= dim ? iso(view.y, view.m, d) : null;
    },
  );

  const step = (n: number) => {
    const d = new Date(view.y, view.m + n, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  };

  const dayItems = byDate.get(selected) ?? [];
  const propLabel = (id?: string) => {
    const p = properties.find((x) => x.id === id);
    return p ? `${p.address}, ${p.suburb}` : "";
  };

  return (
    <>
      <PageHeading
        title="Calendar"
        compact
        sub="Inspections, open homes, meetings and statutory dates, with task deadlines and licence renewals alongside."
        actions={
          <button
            type="button"
            onClick={() => {
              setAdding((a) => !a);
              setPicked(picked ?? today);
            }}
            className={btnDark}
          >
            <Icon name="plus" className="h-4 w-4" /> Add event
          </button>
        }
      />

      {adding && (
        <Card className="mb-6 p-5">
          <h2 className="mb-4 font-display text-lg font-extrabold">
            New event
          </h2>
          <RegisterForm
            key={selected}
            fields={eventFields}
            defaults={{ date: selected, kind: "Appointment" }}
            submitLabel="Add event"
            onCancel={() => setAdding(false)}
            onSubmit={async (v) => {
              addEvent({
                title: String(v.title),
                date: String(v.date),
                time: v.time ? String(v.time) : undefined,
                kind: String(v.kind) as CalEvent["kind"],
                property: v.property ? String(v.property) : undefined,
                notes: v.notes ? String(v.notes) : undefined,
              });
              setPicked(String(v.date));
              const [y, m] = String(v.date).split("-").map(Number);
              setCursor({ y, m: m - 1 });
              setAdding(false);
            }}
          />
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="font-display text-lg font-extrabold tracking-tight">
              {MONTHS[view.m]} {view.y}
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => step(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-tint"
              >
                <Icon name="arrow" className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCursor(null);
                  setPicked(null);
                }}
                className="rounded-full px-3 py-1.5 text-xs font-semibold hover:bg-tint"
              >
                Today
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => step(1)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-tint"
              >
                <Icon name="arrow" className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-line text-center text-[11px] font-bold uppercase tracking-wider text-ink-soft">
            {DAYS.map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((date, i) => {
              if (!date)
                return (
                  <div
                    key={i}
                    className="min-h-[3.5rem] border-b border-r border-line bg-bg/60 sm:min-h-[6rem]"
                  />
                );
              const list = byDate.get(date) ?? [];
              const isToday = date === today;
              const isSel = date === selected;
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setPicked(date)}
                  aria-pressed={isSel}
                  aria-label={`${fmtDate(date)}, ${list.length} item${list.length === 1 ? "" : "s"}`}
                  className={`flex min-h-[3.5rem] flex-col items-start gap-1 border-b border-r border-line p-1.5 text-left transition-colors hover:bg-tint/60 sm:min-h-[6rem] sm:p-2 ${
                    isSel ? "bg-accent/[0.08]" : ""
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isToday ? "bg-accent text-bg" : ""
                    }`}
                  >
                    {Number(date.slice(8))}
                  </span>
                  <span className="hidden w-full space-y-0.5 sm:block">
                    {list.slice(0, 2).map((it) => (
                      <span
                        key={it.id}
                        className="block truncate rounded bg-tint px-1.5 py-0.5 text-[10px] font-semibold"
                      >
                        {it.title}
                      </span>
                    ))}
                    {list.length > 2 && (
                      <span className="block px-1.5 text-[10px] text-ink-soft">
                        +{list.length - 2} more
                      </span>
                    )}
                  </span>
                  {list.length > 0 && (
                    <span className="flex gap-0.5 sm:hidden">
                      {list.slice(0, 3).map((it) => (
                        <span
                          key={it.id}
                          className="h-1.5 w-1.5 rounded-full bg-accent"
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="self-start">
          <CardHead
            title={selected === today ? "Today" : fmtDate(selected)}
            sub={`${dayItems.length} item${dayItems.length === 1 ? "" : "s"}`}
          />
          {dayItems.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ink-soft">
              Nothing on this day.
            </p>
          ) : (
            <ul>
              {dayItems.map((it) => {
                const body = (
                  <>
                    <span className="block text-sm font-semibold leading-snug">
                      {it.title}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                      <Pill
                        tone={
                          ["Renewal due", "CPD deadline", "Task due"].includes(
                            it.kind,
                          )
                            ? "owed"
                            : "neutral"
                        }
                      >
                        {it.kind}
                      </Pill>
                      {it.time && <span className="font-mono">{it.time}</span>}
                      {it.event?.property && (
                        <span>{propLabel(it.event.property)}</span>
                      )}
                    </span>
                    {it.event?.notes && (
                      <span className="mt-1 block text-xs text-ink-soft">
                        {it.event.notes}
                      </span>
                    )}
                  </>
                );
                return (
                  <li
                    key={it.id}
                    className="flex items-start gap-2 border-b border-line last:border-0"
                  >
                    {it.href ? (
                      <Link
                        href={it.href}
                        className="block flex-1 px-5 py-3.5 hover:bg-tint/60"
                      >
                        {body}
                      </Link>
                    ) : (
                      <div className="flex-1 px-5 py-3.5">{body}</div>
                    )}
                    {it.event && (
                      <button
                        type="button"
                        aria-label={`Delete ${it.title}`}
                        onClick={() => dropEvent(it.event!.id)}
                        className="mr-3 mt-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-tint hover:text-ink"
                      >
                        <Icon name="close" className="h-4 w-4" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
