import type { Member, PlanName } from "./demo-data";
import { PLANS } from "./demo-data";
import type { Accreditation } from "./accreditations";
import type { Property } from "./demo-data";
import type { RegisterEntry } from "./registers";

/** Auditors are free and read-only, so they never count against the plan. */
export const billablePeople = (members: Member[]) =>
  members.filter((m) => m.access !== "Auditor");

/** Bytes of proof files stored in this browser, across checklists, registers and accreditations. */
export function storedBytes(
  properties: Property[],
  entries: RegisterEntry[],
  accreditations: Accreditation[],
) {
  let n = 0;
  for (const p of properties) for (const c of p.checklist) n += c.size ?? 0;
  for (const e of entries) for (const f of Object.values(e.files)) n += f.size;
  for (const a of accreditations) {
    n += a.file?.size ?? 0;
    for (const c of a.cpdLog) n += c.file?.size ?? 0;
    for (const r of a.renewals) n += r.file?.size ?? 0;
  }
  return n;
}

/** Why a plan cannot hold the agency as it stands, or null if it fits. */
export function planBlocker(plan: PlanName, members: Member[]): string | null {
  const limits = PLANS[plan];
  const people = billablePeople(members).length;
  if (people > limits.people)
    return `${plan} allows ${limits.people} people and you have ${people}.`;
  return null;
}

export const gstOn = (price: number) => Math.round(price * 10) / 100;
