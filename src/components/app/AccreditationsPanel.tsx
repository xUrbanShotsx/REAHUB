"use client";

import Link from "next/link";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { ReminderRow } from "@/components/app/Reminders";
import {
  Avatar,
  btnDark,
  Card,
  CardHead,
  Pill,
  Progress,
} from "@/components/app/ui";
import {
  cpdDone,
  remindersFor,
  statusOf,
  typeName,
} from "@/lib/accreditations";
import { fmtDate } from "@/lib/format";
import { initialsOf } from "@/lib/demo-data";

/** The Accreditations tab: what needs doing, then everyone's accreditations. */
export function AccreditationsPanel() {
  const { accreditations, ready } = useStore();
  const reminders = ready ? remindersFor(accreditations) : [];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-ink-soft">
          Record when each accreditation was acquired and when it expires.
          Reminders start 90 days out, and again at 60, 30 and 7 days, for
          renewals and for CPD hours still owing.
        </p>
        <Link
          href="/dashboard/compliance/accreditations/new"
          className={btnDark}
        >
          <Icon name="plus" className="h-4 w-4" /> Add accreditation
        </Link>
      </div>

      <Card className="mb-6">
        <CardHead
          title="Reminders"
          sub="Renewals and CPD that need action"
          right={
            reminders.length ? (
              <Pill tone="owed">{reminders.length} to do</Pill>
            ) : (
              <Pill tone="ok">All clear</Pill>
            )
          }
        />
        {reminders.length === 0 ? (
          <p className="px-5 py-6 text-sm text-ink-soft">
            {ready ? "Nothing is due in the next 90 days." : "Checking dates"}
          </p>
        ) : (
          <div className="divide-y divide-line">
            {reminders.map((r) => (
              <ReminderRow key={r.id} r={r} />
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardHead
          title="Accreditations"
          sub={`${accreditations.length} on record`}
        />
        <ul>
          {accreditations.map((a, i) => {
            const st = ready
              ? statusOf(a)
              : { label: "", tone: "neutral" as const };
            const done = cpdDone(a);
            return (
              <li key={a.id} className="border-b border-line last:border-0">
                <Link
                  href={`/dashboard/compliance/accreditations/${a.id}`}
                  className="grid items-center gap-3 px-5 py-4 transition-colors hover:bg-tint/60 md:grid-cols-[1.4fr_1fr_1fr_auto]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar
                      initials={initialsOf(a.person)}
                      tone={(i % 3) as 0 | 1 | 2}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {a.person}
                      </span>
                      <span className="block truncate text-xs text-ink-soft">
                        {typeName(a)}
                      </span>
                    </span>
                  </span>
                  <span className="text-xs text-ink-soft">
                    <span className="block">
                      Acquired {fmtDate(a.acquiredOn)}
                    </span>
                    <span className="block font-medium text-ink">
                      Expires {fmtDate(a.expiresOn)}
                    </span>
                  </span>
                  <span className="min-w-0">
                    {a.cpdRequired > 0 ? (
                      <>
                        <span className="mb-1 flex justify-between text-xs text-ink-soft">
                          <span>CPD</span>
                          <span className="tabular-nums">
                            {done} of {a.cpdRequired} hrs
                          </span>
                        </span>
                        <Progress
                          pct={Math.min(
                            100,
                            Math.round((done / a.cpdRequired) * 100),
                          )}
                        />
                      </>
                    ) : (
                      <span className="text-xs text-ink-soft">
                        CPD not tracked
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-2 justify-self-start md:justify-self-end">
                    {st.label && <Pill tone={st.tone}>{st.label}</Pill>}
                    <Icon name="arrow" className="h-4 w-4 text-ink-soft" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}
