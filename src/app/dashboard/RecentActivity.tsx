"use client";

import Link from "next/link";
import { useStore } from "@/components/app/DemoStore";
import { Avatar, Card, CardHead } from "@/components/app/ui";

/** The newest audit entries, including anything added in this workspace. */
export function RecentActivity() {
  const { audit } = useStore();
  return (
    <Card>
      <CardHead
        title="Recent activity"
        sub="From the audit log"
        right={
          <Link
            href="/dashboard/compliance"
            className="text-xs font-semibold underline"
          >
            All
          </Link>
        }
      />
      <ol>
        {audit.slice(0, 4).map((e, i) => (
          <li
            key={e.day + e.t + e.act + i}
            className="flex gap-3 border-b border-line px-5 py-3 last:border-0"
          >
            <Avatar initials={e.who} tone={1} />
            <p className="min-w-0 flex-1 text-sm leading-snug">
              <span className="font-semibold">{e.name}</span>{" "}
              <span className="text-ink-soft">{e.act}</span>
            </p>
            <span className="shrink-0 pt-0.5 font-mono text-xs text-ink-soft">
              {e.t}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
