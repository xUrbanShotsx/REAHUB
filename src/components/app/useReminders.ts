"use client";

import { remindersFor, type Reminder } from "@/lib/accreditations";
import { useStore } from "./DemoStore";

/** Accreditation reminders, filtered by what is switched on in Settings. Empty until the browser has loaded. */
export function useReminders(): Reminder[] {
  const { accreditations, settings, ready } = useStore();
  if (!ready) return [];
  return remindersFor(accreditations).filter((r) =>
    r.kind === "renewal" ? settings.notify.renewals : settings.notify.cpd,
  );
}
