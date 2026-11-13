import {
  cpdDone,
  daysUntil,
  typeName,
  type Accreditation,
} from "./accreditations";
import type {
  CalEvent,
  DiaryEntry,
  Kpi,
  Meeting,
  Member,
  Property,
  Settings,
  Task,
} from "./demo-data";
import { registerById, OPEN_STATUSES, type RegisterEntry } from "./registers";
import {
  cashBook,
  ledgers,
  lockedUntil,
  money,
  summarise,
  type TrustState,
} from "./trust";

export type Snapshot = {
  settings: Settings;
  members: Member[];
  properties: Property[];
  tasks: Task[];
  accreditations: Accreditation[];
  entries: RegisterEntry[];
  trust: TrustState;
  kpis: Kpi[];
  meetings: Meeting[];
  events: CalEvent[];
  diary: DiaryEntry[];
};

const MAX = 24_000;

/**
 * A compact, plain-text picture of the agency as it stands today, sent with each question so the
 * assistant can answer about the office. Proof files are never included, only their names.
 */
export function buildContext(s: Snapshot, today: string): string {
  const out: string[] = [];
  const addr = (id: string) => {
    const p = s.properties.find((x) => x.id === id);
    return p ? `${p.address}, ${p.suburb}` : id === "office" ? "Office" : id;
  };

  out.push(`Today is ${today}.`);
  out.push(
    `AGENCY: ${s.settings.agency.name} (${s.settings.agency.trading}), licence ${s.settings.agency.licenceNo}, plan ${s.settings.plan}.`,
  );

  out.push("\nTEAM:");
  for (const m of s.members)
    out.push(
      `- ${m.name}: ${m.access}, ${m.team}, ${m.status}${m.until ? `, auditor until ${m.until}` : ""}`,
    );

  out.push("\nPROPERTIES (each with its compliance checklist):");
  for (const p of s.properties) {
    const done = p.checklist.filter((c) => c.done).length;
    const open = p.checklist
      .filter((c) => !c.done)
      .map((c) => `${c.t}${c.due ? ` (${c.due})` : ""}`);
    out.push(
      `- ${p.address}, ${p.suburb} | ${p.type === "sale" ? "for sale" : "managed"} | ${p.status} | agent ${p.agent} | ${p.type === "sale" ? "vendor" : "landlord"} ${p.owner || "n/a"} | ${p.price || "no price"} | checklist ${done}/${p.checklist.length}${open.length ? ` | still owed: ${open.join("; ")}` : " | complete"}`,
    );
  }

  out.push("\nOPEN TASKS:");
  const openTasks = s.tasks.filter((t) => t.status !== "Done");
  if (!openTasks.length) out.push("- none");
  for (const t of openTasks)
    out.push(
      `- ${t.t} | ${t.where} | ${t.assignee} | ${t.status} | due ${t.due ?? "no date"} | from ${t.from}`,
    );

  out.push("\nACCREDITATIONS AND CPD:");
  for (const a of s.accreditations) {
    const left = daysUntil(a.expiresOn, new Date(today));
    const cpd =
      a.cpdRequired > 0
        ? `CPD ${cpdDone(a)}/${a.cpdRequired} hours, year ends ${a.cpdYearEnd}`
        : "CPD not tracked";
    out.push(
      `- ${a.person}: ${typeName(a)}, acquired ${a.acquiredOn}, expires ${a.expiresOn} (${left < 0 ? `expired ${-left} days ago` : `${left} days left`}), ${cpd}`,
    );
  }

  out.push(
    "\nCOMPLIANCE REGISTERS (open items listed, older entries counted):",
  );
  for (const id of [
    "keys",
    "material-facts",
    "complaints",
    "gifts",
    "risks-and-incidents",
    "identity-checks",
    "open-homes",
  ]) {
    const def = registerById(id);
    const list = s.entries.filter((e) => e.registerId === id);
    const open = list.filter((e) => OPEN_STATUSES.includes(e.status));
    out.push(`- ${def?.name}: ${list.length} entries, ${open.length} open`);
    for (const e of open.slice(0, 6)) {
      const v = e.values;
      const bits = [
        v.property ? addr(String(v.property)) : "",
        v.fact ?? v.details ?? v.description ?? v.heldBy ?? v.party ?? "",
        v.expectedBack ? `due back ${v.expectedBack}` : "",
      ].filter(Boolean);
      out.push(`    * ${e.status}: ${bits.join(" | ")}`.slice(0, 220));
    }
  }

  out.push("\nTRUST ACCOUNTS:");
  for (const a of s.trust.accounts) {
    const sum = summarise(s.trust, a.id, "9999-12-31", null);
    const lock = lockedUntil(s.trust, a.id);
    out.push(
      `- ${a.name}: cash book ${money(cashBook(s.trust, a.id))}, ${lock ? `reconciled and signed up to ${lock}` : "not yet reconciled"}, ${s.trust.lines.filter((l) => l.account === a.id && !l.entryId).length} bank lines unmatched, ${sum.unmatchedDeposits.length + sum.unmatchedPayments.length} cash book items not on a statement`,
    );
    for (const l of ledgers(s.trust, a.id).filter((x) => x.balance !== 0))
      out.push(
        `    * ${addr(l.propertyId)} held for ${l.party}: ${money(l.balance)}`,
      );
  }

  out.push("\nKPIs:");
  for (const k of s.kpis)
    out.push(
      `- ${k.name} (${k.owner}, ${k.period.toLowerCase()}): ${k.actual} of ${k.target}${k.unit === "A$" ? " dollars" : ""} = ${Math.round((k.actual / k.target) * 100)}%`,
    );

  out.push("\nMEETINGS (newest first):");
  for (const m of [...s.meetings]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)) {
    out.push(
      `- ${m.date} ${m.title} (${m.status}); attendees ${m.attendees.join(", ")}${m.notes ? `; notes: ${m.notes.slice(0, 300)}` : ""}`,
    );
  }

  out.push("\nCALENDAR EVENTS:");
  for (const e of [...s.events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((e) => e.date >= today)
    .slice(0, 12)) {
    out.push(`- ${e.date}${e.time ? ` ${e.time}` : ""} ${e.title} (${e.kind})`);
  }

  out.push("\nRECENT DIARY:");
  for (const d of [...s.diary]
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
    .slice(0, 6))
    out.push(`- ${d.date} ${d.tag}: ${d.text.slice(0, 240)}`);

  const text = out.join("\n");
  return text.length > MAX ? `${text.slice(0, MAX)}\n[context trimmed]` : text;
}

export type Suggestion = {
  /** Short heading on the card. */
  title: string;
  /** What gets sent when it is chosen. */
  prompt: string;
};

export const SUGGESTIONS: { label: string; items: Suggestion[] }[] = [
  {
    label: "Get things done",
    items: [
      {
        title: "Clear what is overdue",
        prompt:
          "Find everything overdue across properties and tasks, and set up tasks for whoever owns each item so nothing is missed.",
      },
      {
        title: "Get inspection ready",
        prompt:
          "Get us ready for a NSW Fair Trading inspection. Check our registers, licences, trust accounts and policies, tell me the gaps, and create tasks to close them.",
      },
      {
        title: "Plan an open home",
        prompt:
          "Help me book an open home. Ask me which property and when, then put it in the calendar and add a task to prepare.",
      },
      {
        title: "Add a new listing",
        prompt:
          "I want to add a new property. Ask me for the details you need, then set it up with the right checklist.",
      },
    ],
  },
  {
    label: "Ask about your office",
    items: [
      {
        title: "This week's priorities",
        prompt:
          "What is outstanding across the office this week? Rank it by urgency.",
      },
      {
        title: "Licences and CPD",
        prompt:
          "Whose licences or CPD need attention soon, and what should they do?",
      },
      {
        title: "Trust position",
        prompt: "Summarise the trust accounts and what is left to reconcile.",
      },
      {
        title: "Policy gaps",
        prompt:
          "Which policies and procedures in the Document Vault are missing, unsigned or due for review?",
      },
    ],
  },
];
