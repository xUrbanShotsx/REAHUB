"use client";

import Link from "next/link";
import { Icon } from "@/components/Icons";
import { Pill, type Tone } from "@/components/app/ui";
import type { Reminder, Urgency } from "@/lib/accreditations";

export const urgencyTone = (u: Urgency): Tone =>
  u === "upcoming" ? "neutral" : "owed";
export const urgencyLabel = (r: Reminder) =>
  r.urgency === "overdue"
    ? r.kind === "cpd"
      ? "Year ended"
      : "Expired"
    : `${r.daysLeft} day${r.daysLeft === 1 ? "" : "s"}`;

/** One renewal or CPD reminder, linking to the accreditation it is about. */
export function ReminderRow({
  r,
  onNavigate,
}: {
  r: Reminder;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={`/dashboard/compliance/accreditations/${r.accId}`}
      onClick={onNavigate}
      className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-tint/60"
    >
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          r.urgency === "upcoming"
            ? "bg-tint text-ink-soft"
            : "bg-accent text-bg"
        }`}
      >
        <Icon name={r.kind === "cpd" ? "book" : "bell"} className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-snug">
          {r.title}
        </span>
        <span className="block text-xs text-ink-soft">{r.detail}</span>
        {r.stage && (
          <span className="mt-1 block text-[11px] font-medium text-ink-soft">
            {r.stage}-day reminder sent
          </span>
        )}
      </span>
      <Pill tone={urgencyTone(r.urgency)}>{urgencyLabel(r)}</Pill>
    </Link>
  );
}
