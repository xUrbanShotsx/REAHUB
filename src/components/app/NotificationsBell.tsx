"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { ReminderRow } from "@/components/app/Reminders";
import { remindersFor } from "@/lib/accreditations";

/** The bell: renewal and CPD reminders, with a dot when something needs action. */
export function NotificationsBell() {
  const { accreditations, ready } = useStore();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const reminders = ready ? remindersFor(accreditations) : [];
  const urgent = reminders.filter((r) => r.urgency !== "upcoming").length;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-label={`Notifications${reminders.length ? `, ${reminders.length} reminders` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-tint"
      >
        <Icon name="bell" className="h-5 w-5" />
        {reminders.length > 0 && (
          <span
            className={`absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-bg ${
              urgent ? "bg-accent" : "bg-ink-soft"
            }`}
          >
            {reminders.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <p className="font-display text-base font-extrabold">Reminders</p>
            <Link
              href="/dashboard/compliance"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold underline"
            >
              All accreditations
            </Link>
          </div>
          {reminders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-soft">
              Nothing is due. You are up to date.
            </p>
          ) : (
            <div className="max-h-[26rem] divide-y divide-line overflow-y-auto">
              {reminders.map((r) => (
                <ReminderRow
                  key={r.id}
                  r={r}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
