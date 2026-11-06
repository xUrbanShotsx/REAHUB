"use client";

import Link from "next/link";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { Card, Pill } from "@/components/app/ui";
import { fmtDate } from "@/lib/format";
import { OPEN_STATUSES, registerDefs } from "@/lib/registers";

/** The seven registers with live counts. Each row opens the register itself. */
export function RegistersTable() {
  const { entries } = useStore();
  return (
    <Card>
      <ul>
        {registerDefs.map((r) => {
          const mine = entries.filter((e) => e.registerId === r.id);
          const open = mine.filter((e) =>
            OPEN_STATUSES.includes(e.status),
          ).length;
          const latest = mine[0];
          return (
            <li key={r.id} className="border-b border-line last:border-0">
              <Link
                href={`/dashboard/compliance/registers/${r.id}`}
                className="grid items-center gap-2 px-5 py-4 transition-colors hover:bg-tint/60 md:grid-cols-[1.2fr_2fr_auto_auto]"
              >
                <span className="font-semibold">{r.name}</span>
                <span className="min-w-0 text-sm text-ink-soft">
                  <span className="block truncate">{r.blurb}</span>
                  <span className="block text-xs">
                    {mine.length} {mine.length === 1 ? "entry" : "entries"}
                    {latest ? `, latest ${fmtDate(latest.createdAt)}` : ""}
                  </span>
                </span>
                {open ? (
                  <Pill tone="owed">{open} open</Pill>
                ) : (
                  <Pill tone="ok">Clear</Pill>
                )}
                <Icon
                  name="arrow"
                  className="hidden h-4 w-4 text-ink-soft md:block"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
