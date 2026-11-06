"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { RegisterForm } from "@/components/app/RegisterForm";
import { ReminderRow } from "@/components/app/Reminders";
import {
  btnDark,
  btnLight,
  Card,
  CardHead,
  Pill,
  Progress,
} from "@/components/app/ui";
import {
  addDays,
  cpdDone,
  cpdFields,
  daysUntil,
  REMINDER_DAYS,
  remindersFor,
  renewalFields,
  statusOf,
  typeName,
} from "@/lib/accreditations";
import { fmtDate } from "@/lib/format";
import { formatSize, openProofFile } from "@/lib/proofs";
import type { EntryFile } from "@/lib/registers";

function FileChip({ f, onMissing }: { f?: EntryFile; onMissing: () => void }) {
  if (!f) return <span className="text-xs text-ink-soft">None attached</span>;
  if (!f.proofId)
    return (
      <span
        title="Sample file from the demo data"
        className="inline-flex max-w-[14rem] items-center gap-1.5 rounded-md bg-tint px-2.5 py-1 text-xs font-medium text-ink-soft"
      >
        <Icon name="clip" className="h-3 w-3 shrink-0" />
        <span className="truncate">{f.name}</span>
      </span>
    );
  return (
    <button
      type="button"
      onClick={async () => {
        if (!(await openProofFile(f.proofId))) onMissing();
      }}
      className="inline-flex max-w-[14rem] items-center gap-1.5 rounded-md bg-tint px-2.5 py-1 text-xs font-medium hover:bg-accent/15"
    >
      <Icon name="clip" className="h-3 w-3 shrink-0" />
      <span className="truncate">{f.name}</span>
      {f.size ? (
        <span className="shrink-0 text-ink-soft">· {formatSize(f.size)}</span>
      ) : null}
    </button>
  );
}

export function AccreditationDetail({ id }: { id: string }) {
  const { accreditations, ready, addCpd, recordRenewal, startNextCpdYear } =
    useStore();
  const [panel, setPanel] = useState<null | "cpd" | "renew">(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const a = accreditations.find((x) => x.id === id);

  if (!ready)
    return <p className="py-10 text-sm text-ink-soft">Loading accreditation</p>;
  if (!a)
    return (
      <div className="py-10">
        <h1 className="font-display text-2xl font-extrabold">
          Accreditation not found
        </h1>
        <Link href="/dashboard/compliance" className={`${btnDark} mt-5`}>
          Back to compliance
        </Link>
      </div>
    );

  const missing = () =>
    setError("That file is no longer stored in this browser.");
  const st = statusOf(a);
  const left = daysUntil(a.expiresOn);
  const done = cpdDone(a);
  const cpdLeft = daysUntil(a.cpdYearEnd);
  const reminders = remindersFor([a]);

  const schedule = (label: string, deadline: string, active: boolean) =>
    REMINDER_DAYS.map((n) => {
      const date = addDays(deadline, -n);
      const sent = daysUntil(date) <= 0;
      return {
        key: `${label}-${n}`,
        label: `${label}, ${n} days before`,
        date,
        sent: sent && active,
      };
    });

  const renewSchedule = schedule("Renewal", a.expiresOn, true);
  const cpdSchedule =
    a.cpdRequired > 0
      ? schedule("CPD deadline", a.cpdYearEnd, done < a.cpdRequired)
      : [];

  return (
    <>
      <Link
        href="/dashboard/compliance"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <Icon name="arrow" className="h-4 w-4 rotate-180" /> Compliance
      </Link>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2">
            <Pill tone={st.tone}>{st.label}</Pill>
          </p>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {a.person}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {typeName(a)}
            {a.number ? ` · ${a.number}` : ""} · issued by {a.issuedBy}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {a.cpdRequired > 0 && (
            <button
              type="button"
              onClick={() => {
                setPanel(panel === "cpd" ? null : "cpd");
                setNotice("");
              }}
              className={btnLight}
            >
              <Icon name="book" className="h-4 w-4" /> Log CPD
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setPanel(panel === "renew" ? null : "renew");
              setNotice("");
            }}
            className={btnDark}
          >
            Record renewal
          </button>
        </div>
      </div>

      {notice && (
        <p
          role="status"
          className="mb-4 flex items-center gap-2 rounded-xl bg-tint px-4 py-3 text-sm font-semibold"
        >
          <Icon name="check" className="h-4 w-4" /> {notice}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold"
        >
          {error}
        </p>
      )}

      {panel === "cpd" && (
        <Card className="mb-6 p-5">
          <h2 className="mb-4 font-display text-lg font-extrabold">
            Log CPD hours
          </h2>
          <RegisterForm
            fields={cpdFields}
            intro="Each entry needs the certificate or confirmation that shows the hours."
            submitLabel="Save CPD"
            onCancel={() => setPanel(null)}
            onSubmit={async (v, f) => {
              await addCpd(a.id, v, f);
              setPanel(null);
              setNotice("CPD logged and written to the audit log.");
            }}
          />
        </Card>
      )}
      {panel === "renew" && (
        <Card className="mb-6 p-5">
          <h2 className="mb-4 font-display text-lg font-extrabold">
            Record a renewal
          </h2>
          <RegisterForm
            fields={renewalFields}
            intro="Enter the date it was renewed and the new expiry. Reminders restart from the new date."
            submitLabel="Save renewal"
            onCancel={() => setPanel(null)}
            onSubmit={async (v, f) => {
              await recordRenewal(a.id, v, f);
              setPanel(null);
              setNotice(
                "Renewal recorded. The new expiry date is in place and reminders have restarted.",
              );
            }}
          />
        </Card>
      )}

      {reminders.length > 0 && (
        <Card className="mb-6">
          <CardHead
            title="Needs action"
            sub="Reminders for this accreditation"
          />
          <div className="divide-y divide-line">
            {reminders.map((r) => (
              <ReminderRow key={r.id} r={r} />
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHead title="Key dates" />
          <dl className="divide-y divide-line text-sm">
            {[
              ["Acquired", fmtDate(a.acquiredOn)],
              [
                "Expires",
                `${fmtDate(a.expiresOn)} (${left < 0 ? `${-left} days ago` : left === 0 ? "today" : `in ${left} days`})`,
              ],
              ["Issued by", a.issuedBy],
              ["Number", a.number || "Not recorded"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-5 py-3">
                <dt className="text-ink-soft">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <dt className="text-ink-soft">Certificate</dt>
              <dd>
                <FileChip f={a.file} onMissing={missing} />
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <CardHead
            title="Continuing professional development"
            sub={
              a.cpdRequired > 0
                ? `Year ends ${fmtDate(a.cpdYearEnd)}`
                : undefined
            }
          />
          {a.cpdRequired > 0 ? (
            <div className="p-5">
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-semibold">
                  {done} of {a.cpdRequired} hours
                </span>
                <span className="text-ink-soft">
                  {cpdLeft < 0
                    ? `ended ${-cpdLeft} days ago`
                    : `${cpdLeft} days left`}
                </span>
              </div>
              <Progress
                pct={Math.min(100, Math.round((done / a.cpdRequired) * 100))}
                tone={done >= a.cpdRequired ? "ink" : "accent"}
              />
              {cpdLeft < 0 && (
                <button
                  type="button"
                  onClick={() => startNextCpdYear(a.id)}
                  className={`${btnLight} mt-4`}
                >
                  Start next CPD year
                </button>
              )}
            </div>
          ) : (
            <p className="px-5 py-6 text-sm text-ink-soft">
              CPD hours are not tracked for this accreditation.
            </p>
          )}
        </Card>

        <Card>
          <CardHead
            title="Reminder schedule"
            sub="Shown here, on the dashboard and under the bell"
          />
          <ul className="divide-y divide-line text-sm">
            {[...renewSchedule, ...cpdSchedule].map((r) => (
              <li
                key={r.key}
                className="flex items-center justify-between gap-3 px-5 py-3"
              >
                <span>
                  <span className="block font-medium">{r.label}</span>
                  <span className="block text-xs text-ink-soft">
                    {fmtDate(r.date)}
                  </span>
                </span>
                <Pill tone={r.sent ? "owed" : "neutral"}>
                  {r.sent ? "Sent" : "Scheduled"}
                </Pill>
              </li>
            ))}
          </ul>
          <p className="border-t border-line bg-bg px-5 py-3 text-xs text-ink-soft">
            In this demo reminders appear in the app. Email is not sent.
          </p>
        </Card>

        <Card>
          <CardHead
            title="CPD log"
            sub={`${a.cpdLog.length} ${a.cpdLog.length === 1 ? "activity" : "activities"}`}
          />
          {a.cpdLog.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-soft">
              Nothing logged yet. Use Log CPD to add the first activity.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {a.cpdLog.map((c) => (
                <li key={c.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {c.activity}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {c.provider} · {c.category} · {fmtDate(c.date)}
                      </p>
                    </div>
                    <Pill tone="neutral">{c.hours} hrs</Pill>
                  </div>
                  <div className="mt-2">
                    <FileChip f={c.file} onMissing={missing} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <CardHead title="Renewal history" />
        {a.renewals.length === 0 ? (
          <p className="px-5 py-6 text-sm text-ink-soft">
            No renewals recorded yet. Acquired {fmtDate(a.acquiredOn)}.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {a.renewals.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-sm"
              >
                <span>
                  <span className="block font-semibold">
                    Renewed {fmtDate(r.renewedOn)}
                  </span>
                  <span className="block text-xs text-ink-soft">
                    New expiry {fmtDate(r.newExpiry)}
                    {r.reference ? ` · ${r.reference}` : ""} · by {r.by}
                  </span>
                </span>
                <FileChip f={r.file} onMissing={missing} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
