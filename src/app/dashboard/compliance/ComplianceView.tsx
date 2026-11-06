"use client";

import { useState } from "react";
import { Icon } from "@/components/Icons";
import {
  Avatar,
  Card,
  CardHead,
  PageHeading,
  Pill,
  Progress,
} from "@/components/app/ui";
import { audit, people, policies, registers } from "@/lib/demo-data";

const TABS = ["Accreditations", "Registers", "Policies", "Audit log"] as const;
const AREAS = ["All", "Trust", "Registers", "Properties"] as const;

export function ComplianceView() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Accreditations");
  const [area, setArea] = useState<(typeof AREAS)[number]>("All");

  return (
    <>
      <PageHeading
        title="Compliance"
        sub="Registers fill from the work. Accreditations decide who may sign."
      />

      <div
        role="tablist"
        aria-label="Compliance"
        className="mb-6 flex gap-1 overflow-x-auto border-b border-line"
      >
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${
              tab === t
                ? "border-accent text-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Accreditations" && (
        <>
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-accent/25 bg-accent/[0.08] p-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-bg">
              <Icon name="bell" className="h-4 w-4" />
            </span>
            <p className="text-sm">
              <span className="font-bold">
                J. Alvarez&apos;s Class 2 licence renews in 25 days.
              </span>{" "}
              <span className="text-ink-soft">
                Alerts go out at 90, 60, 30 and 7 days.
              </span>
            </p>
          </div>
          <Card>
            <ul>
              {people.map((p, i) => (
                <li
                  key={p.n}
                  className="flex items-center gap-4 border-b border-line px-5 py-4 last:border-0"
                >
                  <Avatar initials={p.i} tone={(i % 3) as 0 | 1 | 2} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.n}</p>
                    <p className="truncate text-xs text-ink-soft">
                      {p.role} · exp. {p.exp}
                    </p>
                    <div className="mt-2 max-w-[14rem]">
                      <Progress pct={p.pct} />
                    </div>
                  </div>
                  <Pill tone={p.tone}>{p.status}</Pill>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      {tab === "Registers" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-ink-soft">
                  {["Register", "Entries", "Latest entry", "Open"].map((h) => (
                    <th key={h} className="px-5 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registers.map((r) => (
                  <tr
                    key={r.name}
                    className="border-b border-line last:border-0 hover:bg-tint/60"
                  >
                    <td className="px-5 py-3.5 font-semibold">{r.name}</td>
                    <td className="px-5 py-3.5 tabular-nums">{r.entries}</td>
                    <td className="px-5 py-3.5 text-ink-soft">{r.latest}</td>
                    <td className="px-5 py-3.5">
                      {r.open ? (
                        <Pill tone="owed">{r.open} open</Pill>
                      ) : (
                        <Pill tone="ok">Clear</Pill>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "Policies" && (
        <Card>
          <CardHead
            title="Policy library"
            sub="One current version of each policy, signed by person and version"
          />
          <ul>
            {policies.map((p) => {
              const full = p.signed === p.total;
              return (
                <li
                  key={p.name}
                  className="flex items-center gap-4 border-b border-line px-5 py-4 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-ink-soft">
                      Version {p.version.slice(1)}
                    </p>
                  </div>
                  <div className="hidden w-32 sm:block">
                    <Progress
                      pct={Math.round((p.signed / p.total) * 100)}
                      tone={full ? "ink" : "accent"}
                    />
                  </div>
                  <Pill tone={full ? "ok" : "owed"}>
                    {p.signed} of {p.total} signed
                  </Pill>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {tab === "Audit log" && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
            <div className="flex gap-1.5">
              {AREAS.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={area === a}
                  onClick={() => setArea(a)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    area === a
                      ? "bg-ink text-bg"
                      : "bg-tint text-ink-soft hover:text-ink"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <span className="flex items-center gap-1.5 text-xs text-ink-soft">
              <Icon name="lock" className="h-3.5 w-3.5" /> Entries cannot be
              edited or deleted
            </span>
          </div>
          <ol>
            {audit
              .filter((e) => area === "All" || e.area === area)
              .map((e) => (
                <li
                  key={e.day + e.t + e.act}
                  className="flex gap-3 border-b border-line px-5 py-4 last:border-0"
                >
                  <Avatar initials={e.who} tone={1} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">
                      <span className="font-semibold">{e.name}</span>{" "}
                      <span className="text-ink-soft">{e.act}</span>
                    </p>
                    <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
                      <span className="rounded-md bg-tint px-1.5 py-0.5 text-ink-soft line-through">
                        {e.from}
                      </span>
                      <Icon name="arrow" className="h-3 w-3 opacity-50" />
                      <span className="rounded-md bg-accent/15 px-1.5 py-0.5">
                        {e.to}
                      </span>
                    </p>
                  </div>
                  <span className="shrink-0 pt-0.5 text-right font-mono text-xs text-ink-soft">
                    {e.day}
                    <br />
                    {e.t}
                  </span>
                </li>
              ))}
          </ol>
        </Card>
      )}
    </>
  );
}
