"use client";

import { useStore } from "@/components/app/DemoStore";
import { Card, CardHead, Progress } from "@/components/app/ui";
import { PLANS } from "@/lib/demo-data";
import { formatSize } from "@/lib/proofs";
import { billablePeople, storedBytes } from "@/lib/usage";

/** A baseline so the demo vault is not empty. It is sample data, like everything else here. */
const BASELINE_GB = 3.2;
const QUERIES_USED = 612;

function Meter({
  label,
  used,
  of,
  display,
  note,
}: {
  label: string;
  used: number;
  of: number | null;
  display: string;
  note?: string;
}) {
  const pct = of ? Math.min(100, Math.round((used / of) * 100)) : 0;
  return (
    <div className="px-5 py-4">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm tabular-nums text-ink-soft">{display}</p>
      </div>
      {of ? (
        <Progress pct={pct} tone={pct >= 90 ? "accent" : "ink"} />
      ) : (
        <p className="text-xs text-ink-soft">Unlimited on your plan.</p>
      )}
      {note && <p className="mt-1.5 text-xs text-ink-soft">{note}</p>}
    </div>
  );
}

export function UsageSection() {
  const { members, properties, entries, accreditations, settings, ready } =
    useStore();
  const plan = PLANS[settings.plan];
  const people = billablePeople(members).length;
  const bytes = ready ? storedBytes(properties, entries, accreditations) : 0;
  const vaultGb = BASELINE_GB + bytes / 1024 ** 3;
  const campaigns = properties.filter((p) => p.type === "sale").length;
  const managed = properties.length - campaigns;
  const trustMoves = 5;

  return (
    <div className="space-y-6">
      <Card>
        <CardHead
          title="What your plan includes"
          sub={`${settings.plan} plan`}
        />
        <div className="divide-y divide-line">
          <Meter
            label="People who sign in"
            used={people}
            of={plan.people}
            display={`${people} of ${plan.people}`}
            note="Auditors are free and do not count. Teams and team leaders are unlimited."
          />
          <Meter
            label="Document vault"
            used={vaultGb}
            of={plan.vaultGb}
            display={`${vaultGb.toFixed(2)} of ${plan.vaultGb} GB`}
            note={`Sample baseline of ${BASELINE_GB} GB plus ${formatSize(bytes) || "0 B"} of files kept in this browser.`}
          />
          <Meter
            label="Assistant queries this month"
            used={QUERIES_USED}
            of={plan.queries}
            display={
              plan.queries
                ? `${QUERIES_USED} of ${plan.queries.toLocaleString("en-AU")}`
                : `${QUERIES_USED}`
            }
            note="Sample figure. The assistant is not connected in the demo."
          />
        </div>
      </Card>

      <Card>
        <CardHead
          title="Unlimited on every plan"
          sub="Nothing here is metered or capped"
        />
        <dl className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0">
          {[
            ["Properties", String(properties.length)],
            ["Sales campaigns", String(campaigns)],
            ["Management periods", String(managed)],
            ["Trust movements this month", String(trustMoves)],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-3 px-5 py-4 sm:border-b sm:border-line"
            >
              <dt className="text-sm text-ink-soft">{k}</dt>
              <dd className="font-display text-xl font-extrabold tabular-nums">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
