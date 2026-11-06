"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { RegisterForm } from "@/components/app/RegisterForm";
import { btnDark, Card, PageHeading, Pill } from "@/components/app/ui";
import { DIARY_TAGS } from "@/lib/demo-data";
import { fmtDate, todayISO } from "@/lib/format";
import type { Field } from "@/lib/registers";

const fields: Field[] = [
  {
    name: "date",
    label: "Date",
    type: "date",
    required: true,
    notFuture: true,
  },
  {
    name: "tag",
    label: "Type",
    type: "select",
    required: true,
    options: DIARY_TAGS,
  },
  {
    name: "text",
    label: "Entry",
    type: "textarea",
    required: true,
    minLength: 5,
    wide: true,
    placeholder: "What happened, who you spoke to, what comes next",
  },
];

export function DiaryView() {
  const { diary, ready, addDiary, dropDiary } = useStore();
  const [adding, setAdding] = useState(false);
  const [tag, setTag] = useState("All");
  const [q, setQ] = useState("");

  const list = useMemo(
    () =>
      [...diary]
        .filter(
          (d) =>
            (tag === "All" || d.tag === tag) &&
            `${d.text} ${d.tag}`.toLowerCase().includes(q.toLowerCase()),
        )
        .sort((a, b) =>
          `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`),
        ),
    [diary, tag, q],
  );

  const days = useMemo(() => {
    const map = new Map<string, typeof list>();
    for (const d of list) map.set(d.date, [...(map.get(d.date) ?? []), d]);
    return [...map.entries()];
  }, [list]);

  const today = ready ? todayISO() : "";

  return (
    <>
      <PageHeading
        title="Diary"
        sub="A running record of calls, viewings and follow-ups, kept in date order."
        actions={
          <button
            type="button"
            onClick={() => setAdding((a) => !a)}
            className={btnDark}
          >
            <Icon name="plus" className="h-4 w-4" /> New entry
          </button>
        }
      />

      {adding && (
        <Card className="mb-6 p-5">
          <h2 className="mb-4 font-display text-lg font-extrabold">
            New diary entry
          </h2>
          <RegisterForm
            fields={fields}
            submitLabel="Save entry"
            onCancel={() => setAdding(false)}
            onSubmit={async (v) => {
              addDiary({
                date: String(v.date),
                tag: String(v.tag),
                text: String(v.text).trim(),
              });
              setAdding(false);
            }}
          />
        </Card>
      )}

      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-3 p-3">
          <label className="flex min-w-[12rem] flex-1 items-center gap-2 rounded-full bg-bg px-3 py-2 text-sm text-ink-soft">
            <Icon name="search" className="h-4 w-4" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the diary"
              aria-label="Search the diary"
              className="w-full bg-transparent text-ink outline-none placeholder:text-ink-soft"
            />
          </label>
          <div className="flex flex-wrap gap-1.5">
            {["All", ...DIARY_TAGS].map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tag === t}
                onClick={() => setTag(t)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  tag === t
                    ? "bg-ink text-bg"
                    : "bg-tint text-ink-soft hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {!ready ? (
        <p className="py-10 text-center text-sm text-ink-soft">
          Loading the diary
        </p>
      ) : days.length === 0 ? (
        <Card>
          <p className="px-5 py-12 text-center text-sm text-ink-soft">
            No entries yet. Add the first one.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {days.map(([date, items]) => (
            <section key={date}>
              <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-ink-soft">
                {date === today ? "Today" : fmtDate(date)}
              </h2>
              <Card>
                <ul>
                  {items.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-start gap-4 border-b border-line px-5 py-4 last:border-0"
                    >
                      <span className="w-12 shrink-0 pt-0.5 font-mono text-xs text-ink-soft">
                        {d.time}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-relaxed">{d.text}</p>
                        <p className="mt-2">
                          <Pill tone="neutral">{d.tag}</Pill>
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Delete this diary entry"
                        onClick={() => {
                          if (window.confirm("Delete this diary entry?"))
                            dropDiary(d.id);
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-tint hover:text-ink"
                      >
                        <Icon name="close" className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
