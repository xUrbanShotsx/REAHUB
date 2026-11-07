"use client";

import { useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { AccreditationsPanel } from "@/components/app/AccreditationsPanel";
import { RegistersTable } from "@/components/app/RegistersTable";
import {
  Avatar,
  Card,
  CardHead,
  PageHeading,
  Pill,
  Progress,
} from "@/components/app/ui";
import { policies } from "@/lib/demo-data";

const TABS = ["Accreditations", "Registers", "Policies", "Audit log"] as const;
const AREAS = [
  "All",
  "Trust",
  "Registers",
  "Properties",
  "Documents",
  "Settings",
] as const;

export function ComplianceView() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Accreditations");
  const { audit } = useStore();
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

      {tab === "Accreditations" && <AccreditationsPanel />}

      {tab === "Registers" && <RegistersTable />}

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
