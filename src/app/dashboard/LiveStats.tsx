"use client";

import { useStore } from "@/components/app/DemoStore";
import { useReminders } from "@/components/app/useReminders";
import { Stat } from "@/components/app/ui";
import { aud, trust } from "@/lib/demo-data";

/** Stat cards that follow whatever is in the demo workspace right now. */
export function LiveStats() {
  const { properties } = useStore();
  const renewals = useReminders().filter((r) => r.kind === "renewal");
  const next = renewals[0];
  const open = properties.reduce(
    (n, p) => n + p.checklist.filter((c) => !c.done).length,
    0,
  );
  const overdue = properties.reduce(
    (n, p) =>
      n +
      p.checklist.filter(
        (c) =>
          !c.done && (c.due === "Due today" || c.due?.startsWith("Overdue")),
      ).length,
    0,
  );
  const sales = properties.filter((p) => p.type === "sale").length;
  const managed = properties.length - sales;
  const held = trust.sales.held + trust.rentals.held;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <Stat
        label="Held in trust"
        value={aud(held)}
        note="Both accounts reconciled"
      />
      <Stat
        label="Open checklist items"
        value={String(open)}
        note={`${overdue} due today or overdue`}
        tone="owed"
      />
      <Stat
        label="Live properties"
        value={String(properties.length)}
        note={`${sales} for sale, ${managed} managed`}
      />
      <Stat
        label="Licences expiring"
        value={String(renewals.length)}
        note={
          next
            ? `${next.person}, ${next.daysLeft < 0 ? "expired" : `in ${next.daysLeft} days`}`
            : "None in 90 days"
        }
        tone={renewals.length ? "owed" : undefined}
      />
    </div>
  );
}
