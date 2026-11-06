"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import {
  Avatar,
  btnDark,
  btnLight,
  Card,
  CardHead,
  Pill,
  Progress,
} from "@/components/app/ui";
import { STATUSES, TYPE_LABEL } from "@/lib/demo-data";

export function PropertyOverview({ id }: { id: string }) {
  const router = useRouter();
  const { properties, ready, updateProperty, deleteProperty } = useStore();
  const p = properties.find((x) => x.id === id);

  if (!ready)
    return <p className="py-10 text-sm text-ink-soft">Loading property</p>;
  if (!p)
    return (
      <div className="py-10">
        <h1 className="font-display text-2xl font-extrabold">
          Property not found
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          It may have been deleted, or it was created in another browser.
        </p>
        <Link href="/dashboard/properties" className={`${btnDark} mt-5`}>
          Back to properties
        </Link>
      </div>
    );

  const done = p.checklist.filter((c) => c.done).length;
  const total = p.checklist.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const open = p.checklist.filter((c) => !c.done);

  const details: [string, string][] = [
    ["Type", TYPE_LABEL[p.type]],
    [p.type === "sale" ? "Vendor" : "Landlord", p.owner || "Not set"],
    [p.type === "sale" ? "Price guide" : "Weekly rent", p.price || "Not set"],
    ["Agent", p.agent],
    ["Added", p.createdAt],
    ["Checklist started from", p.templateName],
  ];

  return (
    <>
      <Link
        href="/dashboard/properties"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <Icon name="arrow" className="h-4 w-4 rotate-180" /> Properties
      </Link>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2">
            <Pill tone="neutral">{TYPE_LABEL[p.type]}</Pill>
          </p>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {p.address}, {p.suburb}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{p.note}</p>
        </div>
        <label className="text-xs font-medium text-ink-soft">
          Status
          <select
            value={p.status}
            onChange={(e) => updateProperty(p.id, { status: e.target.value })}
            className="mt-1 block rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink"
          >
            {STATUSES[p.type].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHead
            title="Compliance checklist"
            sub={`${done} of ${total} done`}
            right={
              <Link
                href={`/dashboard/properties/${p.id}/checklist`}
                className={btnDark}
              >
                Open checklist <Icon name="arrow" className="h-4 w-4" />
              </Link>
            }
          />
          <div className="px-5 pt-4">
            <Progress pct={pct} />
          </div>
          {total === 0 ? (
            <p className="px-5 py-8 text-sm text-ink-soft">
              This checklist is empty. Open it to add items.
            </p>
          ) : open.length === 0 ? (
            <p className="flex items-center gap-2 px-5 py-8 text-sm font-semibold">
              <Icon name="check" className="h-4 w-4" /> Everything is filed.
            </p>
          ) : (
            <ul className="mt-3 border-t border-line">
              {open.slice(0, 5).map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 border-b border-line px-5 py-3.5 last:border-0"
                >
                  <span className="flex h-5 w-5 shrink-0 rounded-full border-[1.5px] border-dashed border-ink-soft/60" />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                    {c.t}
                  </span>
                  {c.due && <Pill tone="owed">{c.due}</Pill>}
                  <Avatar initials={c.who} tone={0} />
                </li>
              ))}
              {open.length > 5 && (
                <li className="px-5 py-3 text-xs text-ink-soft">
                  and {open.length - 5} more
                </li>
              )}
            </ul>
          )}
        </Card>

        <Card className="self-start">
          <CardHead title="Details" />
          <dl className="divide-y divide-line text-sm">
            {details.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-5 py-3">
                <dt className="text-ink-soft">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <Link
          href={`/dashboard/properties/${p.id}/checklist`}
          className={btnLight}
        >
          View and edit checklist
        </Link>
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                `Delete ${p.address}? This cannot be undone in the demo.`,
              )
            ) {
              deleteProperty(p.id);
              router.push("/dashboard/properties");
            }
          }}
          className="text-sm font-semibold text-ink-soft underline hover:text-ink"
        >
          Delete property
        </button>
      </div>
    </>
  );
}
