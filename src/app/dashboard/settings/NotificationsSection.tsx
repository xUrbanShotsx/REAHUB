"use client";

import { useStore } from "@/components/app/DemoStore";
import { Card, CardHead } from "@/components/app/ui";
import { REMINDER_DAYS } from "@/lib/accreditations";

function Switch({
  on,
  onChange,
  label,
  note,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  note: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-0.5 text-xs text-ink-soft">{note}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(!on)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-ink" : "bg-line"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow transition-all ${on ? "left-[1.375rem]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

export function NotificationsSection() {
  const { settings, setNotify } = useStore();
  return (
    <div className="space-y-6">
      <Card>
        <CardHead
          title="Reminders"
          sub="Shown under the bell, on the dashboard and on each accreditation"
        />
        <div className="divide-y divide-line">
          <Switch
            label="Licence and certificate renewals"
            note="Remind us before an accreditation expires."
            on={settings.notify.renewals}
            onChange={(v) => setNotify({ renewals: v })}
          />
          <Switch
            label="CPD hours still owing"
            note="Remind us when CPD hours are short as the CPD year runs out."
            on={settings.notify.cpd}
            onChange={(v) => setNotify({ cpd: v })}
          />
        </div>
      </Card>

      <Card>
        <CardHead title="When reminders go out" />
        <div className="p-5">
          <p className="text-sm text-ink-soft">
            Reminders go out this many days before a renewal or CPD deadline,
            and stay until it is dealt with.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {REMINDER_DAYS.map((d) => (
              <li
                key={d}
                className="rounded-full bg-tint px-4 py-1.5 text-sm font-semibold"
              >
                {d} days
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-soft">
            The schedule is fixed. In this demo reminders appear in the app and
            email is not sent.
          </p>
        </div>
      </Card>
    </div>
  );
}
