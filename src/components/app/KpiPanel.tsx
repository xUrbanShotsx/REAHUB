"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { RegisterForm } from "@/components/app/RegisterForm";
import {
  btnDark,
  btnLight,
  Card,
  CardHead,
  Pill,
  Progress,
} from "@/components/app/ui";
import { KPI_OWNERS, KPI_PERIODS, team, type Kpi } from "@/lib/demo-data";
import type { Field, Values } from "@/lib/registers";

const OWNERS = [...KPI_OWNERS, ...team.map((t) => t.name)];

const fields: Field[] = [
  {
    name: "name",
    label: "KPI",
    type: "text",
    required: true,
    wide: true,
    placeholder: "Appraisals, listings, calls, commission",
  },
  {
    name: "owner",
    label: "Whose target",
    type: "select",
    required: true,
    options: OWNERS,
    help: "A person, a team or the whole agency.",
  },
  {
    name: "period",
    label: "Period",
    type: "select",
    required: true,
    options: KPI_PERIODS,
  },
  {
    name: "unit",
    label: "Measured in",
    type: "select",
    required: true,
    options: ["Count", "A$"],
  },
  { name: "target", label: "Target", type: "number", required: true },
  { name: "actual", label: "Achieved so far", type: "number", required: true },
];

/** Green from 80% of target, amber from 50%, red below. Shown as words and bar weight, not extra colours. */
const band = (pct: number) =>
  pct >= 80
    ? { label: "On track", tone: "ok" as const }
    : pct >= 50
      ? { label: "Watch", tone: "neutral" as const }
      : { label: "Behind", tone: "owed" as const };

const fmt = (k: Kpi, n: number) =>
  k.unit === "A$"
    ? `A$${n.toLocaleString("en-AU")}`
    : n.toLocaleString("en-AU");

const check = (v: Values) => {
  const errs: Record<string, string> = {};
  if (v.target !== "" && !(Number(v.target) > 0))
    errs.target = "The target must be more than nil.";
  return errs;
};

export function KpiPanel({ editable = false }: { editable?: boolean }) {
  const { kpis, ready, addKpi, updateKpi, dropKpi } = useStore();
  const [mode, setMode] = useState<null | "add" | string>(null);
  const [notice, setNotice] = useState("");

  const editing =
    mode && mode !== "add" ? kpis.find((k) => k.id === mode) : undefined;

  const values = (v: Values): Omit<Kpi, "id"> => ({
    name: String(v.name).trim(),
    owner: String(v.owner),
    period: String(v.period) as Kpi["period"],
    unit: v.unit === "A$" ? "A$" : "Count",
    target: Number(v.target),
    actual: Number(v.actual || 0),
  });

  return (
    <Card>
      <CardHead
        title="KPIs against target"
        sub={
          editable
            ? "Set targets, then keep progress up to date"
            : "Progress against this period's targets"
        }
        right={
          editable ? (
            <button
              type="button"
              onClick={() => {
                setMode(mode === "add" ? null : "add");
                setNotice("");
              }}
              className={btnDark}
            >
              <Icon name="plus" className="h-4 w-4" /> Set a KPI
            </button>
          ) : (
            <Link
              href="/dashboard/operations"
              className="text-xs font-semibold underline"
            >
              Set KPIs
            </Link>
          )
        }
      />

      {notice && (
        <p
          role="status"
          className="mx-5 mt-4 flex items-center gap-2 rounded-xl bg-tint px-4 py-3 text-sm font-semibold"
        >
          <Icon name="check" className="h-4 w-4" /> {notice}
        </p>
      )}

      {editable && mode === "add" && (
        <div className="m-5 rounded-2xl border border-line bg-bg p-5">
          <h3 className="mb-3 font-display text-base font-extrabold">
            New KPI
          </h3>
          <RegisterForm
            fields={fields}
            defaults={{
              owner: "Sales team",
              period: "Month",
              unit: "Count",
              actual: "0",
            }}
            submitLabel="Save KPI"
            extraValidate={check}
            onCancel={() => setMode(null)}
            onSubmit={async (v) => {
              addKpi(values(v));
              setMode(null);
              setNotice("KPI added.");
            }}
          />
        </div>
      )}

      {!ready ? (
        <p className="px-5 py-8 text-sm text-ink-soft">Loading KPIs</p>
      ) : kpis.length === 0 ? (
        <p className="px-5 py-8 text-sm text-ink-soft">
          No KPIs yet.
          {editable ? " Choose Set a KPI to add the first target." : ""}
        </p>
      ) : (
        <ul className="space-y-1 p-3">
          {kpis.map((k) => {
            const pct = Math.round((k.actual / k.target) * 100);
            const b = band(pct);
            const open = editable && editing?.id === k.id;
            return (
              <li key={k.id} className="rounded-xl p-2">
                <div className="flex items-baseline justify-between gap-3 px-2 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">
                      {k.name}
                    </span>
                    <span className="block truncate text-xs text-ink-soft">
                      {k.owner} · {k.period.toLowerCase()}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-semibold tabular-nums">
                      {pct}%
                    </span>
                    <span className="block text-xs tabular-nums text-ink-soft">
                      {fmt(k, k.actual)} of {fmt(k, k.target)}
                    </span>
                  </span>
                </div>
                <div className="mt-2 px-2">
                  <Progress
                    pct={Math.min(100, pct)}
                    tone={pct >= 80 ? "ink" : "accent"}
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-2">
                  <Pill tone={b.tone}>{b.label}</Pill>
                  {editable && (
                    <span className="flex flex-wrap items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateKpi(k.id, { actual: Math.max(0, k.actual - 1) })
                        }
                        aria-label={`Take one off ${k.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm font-bold hover:bg-tint"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateKpi(k.id, { actual: k.actual + 1 })
                        }
                        aria-label={`Add one to ${k.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm font-bold hover:bg-tint"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode(open ? null : k.id)}
                        className="rounded-full px-3 py-1.5 text-xs font-semibold underline"
                      >
                        Edit
                      </button>
                    </span>
                  )}
                </div>

                {open && (
                  <div className="mt-3 rounded-2xl border border-line bg-bg p-5">
                    <h3 className="mb-3 font-display text-base font-extrabold">
                      Edit {k.name}
                    </h3>
                    <RegisterForm
                      key={k.id}
                      fields={fields}
                      defaults={{
                        name: k.name,
                        owner: k.owner,
                        period: k.period,
                        unit: k.unit,
                        target: String(k.target),
                        actual: String(k.actual),
                      }}
                      submitLabel="Save changes"
                      extraValidate={check}
                      onCancel={() => setMode(null)}
                      onSubmit={async (v) => {
                        updateKpi(k.id, values(v));
                        setMode(null);
                        setNotice(`${values(v).name} updated.`);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete the ${k.name} KPI?`)) {
                          dropKpi(k.id);
                          setMode(null);
                        }
                      }}
                      className={`${btnLight} mt-3`}
                    >
                      Delete KPI
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <p className="border-t border-line bg-bg px-5 py-3 text-xs text-ink-soft">
        On track from 80% of target, watch from 50%, behind below that.
      </p>
    </Card>
  );
}
