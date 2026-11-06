"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import {
  btnDark,
  Card,
  PageHeading,
  Pill,
  Progress,
} from "@/components/app/ui";
import { STATUSES, TYPE_LABEL, type PropertyType } from "@/lib/demo-data";

const TYPES: PropertyType[] = ["sale", "management"];

export function PropertiesView() {
  const { properties, ready } = useStore();
  const [type, setType] = useState<PropertyType>("sale");
  const [status, setStatus] = useState("All");
  const [q, setQ] = useState("");

  const counts = useMemo(
    () => ({
      sale: properties.filter((p) => p.type === "sale").length,
      management: properties.filter((p) => p.type === "management").length,
    }),
    [properties],
  );

  const list = useMemo(
    () =>
      properties.filter(
        (p) =>
          p.type === type &&
          (status === "All" || p.status === status) &&
          `${p.address} ${p.suburb} ${p.owner}`
            .toLowerCase()
            .includes(q.toLowerCase()),
      ),
    [properties, type, status, q],
  );

  const switchType = (t: PropertyType) => {
    setType(t);
    setStatus("All");
  };

  return (
    <>
      <PageHeading
        title="Properties"
        sub="One file per address. Sales and property management are kept apart but share the same list."
        actions={
          <Link href="/dashboard/properties/new" className={btnDark}>
            <Icon name="plus" className="h-4 w-4" /> Add property
          </Link>
        }
      />

      <div
        role="tablist"
        aria-label="Property type"
        className="mb-5 inline-flex rounded-full bg-tint p-1"
      >
        {TYPES.map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={type === t}
            onClick={() => switchType(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5 ${
              type === t
                ? "bg-surface shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {TYPE_LABEL[t]}{" "}
            <span className="ml-1 text-ink-soft">{counts[t]}</span>
          </button>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-3">
          <label className="flex min-w-[12rem] flex-1 items-center gap-2 rounded-full bg-bg px-3 py-2 text-sm text-ink-soft focus-within:ring-2 focus-within:ring-accent">
            <Icon name="search" className="h-4 w-4" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search address, suburb or owner"
              aria-label="Search properties"
              className="w-full bg-transparent text-ink outline-none placeholder:text-ink-soft"
            />
          </label>
          <div className="flex flex-wrap gap-1.5">
            {["All", ...STATUSES[type]].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                aria-pressed={status === s}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  status === s
                    ? "bg-ink text-bg"
                    : "bg-tint text-ink-soft hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {!ready ? (
          <p className="px-5 py-10 text-center text-sm text-ink-soft">
            Loading properties
          </p>
        ) : list.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-semibold">No properties here yet.</p>
            <p className="mt-1 text-sm text-ink-soft">
              Add one and choose a checklist template to start from.
            </p>
            <Link
              href="/dashboard/properties/new"
              className={`${btnDark} mt-4`}
            >
              <Icon name="plus" className="h-4 w-4" /> Add property
            </Link>
          </div>
        ) : (
          <ul>
            {list.map((p) => {
              const done = p.checklist.filter((c) => c.done).length;
              const total = p.checklist.length;
              const owed = total - done;
              return (
                <li key={p.id} className="border-b border-line last:border-0">
                  <Link
                    href={`/dashboard/properties/${p.id}`}
                    className="grid items-center gap-3 px-5 py-4 transition-colors hover:bg-tint/60 md:grid-cols-[1.6fr_1fr_1fr_auto]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">
                        {p.address}, {p.suburb}
                      </span>
                      <span className="block truncate text-xs text-ink-soft">
                        {[p.owner, p.price].filter(Boolean).join(" · ") ||
                          "No vendor or price yet"}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Pill tone="neutral">{p.status}</Pill>
                      <span className="text-xs text-ink-soft">{p.agent}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="mb-1 flex justify-between text-xs text-ink-soft">
                        <span>Checklist</span>
                        <span className="tabular-nums">
                          {done}/{total}
                        </span>
                      </span>
                      <Progress
                        pct={total ? Math.round((done / total) * 100) : 0}
                      />
                    </span>
                    <span className="flex items-center gap-2 justify-self-end">
                      {owed > 0 ? (
                        <Pill tone="owed">{owed} owed</Pill>
                      ) : (
                        <Pill tone="ok">Complete</Pill>
                      )}
                      <Icon name="arrow" className="h-4 w-4 text-ink-soft" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
