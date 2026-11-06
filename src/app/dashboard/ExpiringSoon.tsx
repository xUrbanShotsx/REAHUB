"use client";

import Link from "next/link";
import { useStore } from "@/components/app/DemoStore";
import { ReminderRow } from "@/components/app/Reminders";
import { useReminders } from "@/components/app/useReminders";
import { Card, CardHead } from "@/components/app/ui";
import { upcoming } from "@/lib/demo-data";

/** Renewal and CPD reminders from the accreditation records, plus a few upcoming dates. */
export function ExpiringSoon() {
  const { ready } = useStore();
  const reminders = useReminders();
  return (
    <Card>
      <CardHead
        title="Expiring soon"
        sub="Renewals and CPD"
        right={
          <Link
            href="/dashboard/compliance"
            className="text-xs font-semibold underline"
          >
            All
          </Link>
        }
      />
      {reminders.length === 0 ? (
        <p className="px-5 py-6 text-sm text-ink-soft">
          {ready ? "Nothing due in the next 90 days." : "Checking dates"}
        </p>
      ) : (
        <div className="divide-y divide-line">
          {reminders.slice(0, 3).map((r) => (
            <ReminderRow key={r.id} r={r} />
          ))}
        </div>
      )}
      <ul className="border-t border-line bg-bg px-5 py-3 text-xs text-ink-soft">
        {upcoming.slice(0, 2).map((u) => (
          <li key={u.t} className="flex justify-between gap-3 py-0.5">
            <span className="truncate">{u.t}</span>
            <span className="shrink-0 font-mono">{u.d}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
