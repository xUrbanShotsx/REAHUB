import { fmtDate } from "./format";
import type { EntryFile, Field } from "./registers";

export type CpdEntry = {
  id: string;
  date: string;
  activity: string;
  provider: string;
  category: string;
  hours: number;
  file?: EntryFile;
};

export type Renewal = {
  id: string;
  renewedOn: string;
  newExpiry: string;
  reference?: string;
  by: string;
  file?: EntryFile;
};

export type Accreditation = {
  id: string;
  person: string;
  type: string;
  typeOther?: string;
  number?: string;
  issuedBy: string;
  acquiredOn: string;
  expiresOn: string;
  /** CPD hours needed this CPD year. 0 means none tracked. */
  cpdRequired: number;
  cpdYearEnd: string;
  file?: EntryFile;
  cpdLog: CpdEntry[];
  renewals: Renewal[];
};

export const TYPES = [
  "Class 1 licence",
  "Class 2 licence",
  "Certificate of registration",
  "First aid certificate",
  "WHS induction",
  "Other",
];

export const CPD_CATEGORIES = [
  "Course",
  "Seminar or webinar",
  "Conference",
  "Self-study",
  "Other",
];

/** How many days before a deadline a reminder goes out. */
export const REMINDER_DAYS = [90, 60, 30, 7];

export const typeName = (a: Accreditation) =>
  a.type === "Other" && a.typeOther ? a.typeOther : a.type;

/* ---------- dates ---------- */

const DAY = 86_400_000;

export const daysUntil = (iso: string, now = new Date()) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / DAY);
};

export const addDays = (iso: string, n: number) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};

export const addYears = (iso: string, n: number) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y + n, m - 1, d)).toISOString().slice(0, 10);
};

/* ---------- CPD ---------- */

/** Hours logged inside the current CPD year (the 12 months up to the year end). */
export function cpdDone(a: Accreditation) {
  const start = addYears(a.cpdYearEnd, -1);
  return a.cpdLog
    .filter((c) => c.date > start && c.date <= a.cpdYearEnd)
    .reduce((n, c) => n + c.hours, 0);
}

/* ---------- reminders ---------- */

export type Urgency = "overdue" | "urgent" | "soon" | "upcoming";

export type Reminder = {
  id: string;
  accId: string;
  kind: "renewal" | "cpd";
  person: string;
  title: string;
  detail: string;
  daysLeft: number;
  urgency: Urgency;
  /** Which of the 90, 60, 30 or 7 day reminders has most recently gone out. */
  stage: number | null;
};

const urgencyFor = (days: number): Urgency =>
  days < 0
    ? "overdue"
    : days <= 7
      ? "urgent"
      : days <= 30
        ? "soon"
        : "upcoming";
const stageFor = (days: number) =>
  days < 0 ? 7 : (REMINDER_DAYS.filter((d) => days <= d).pop() ?? null);

export function remindersFor(
  list: Accreditation[],
  now = new Date(),
): Reminder[] {
  const out: Reminder[] = [];
  for (const a of list) {
    const name = typeName(a);
    const left = daysUntil(a.expiresOn, now);
    if (left <= REMINDER_DAYS[0]) {
      out.push({
        id: `${a.id}-renew`,
        accId: a.id,
        kind: "renewal",
        person: a.person,
        title:
          left < 0
            ? `${a.person}'s ${name} has expired`
            : `${a.person}'s ${name} renews in ${left} day${left === 1 ? "" : "s"}`,
        detail:
          left < 0
            ? `Expired ${-left} day${left === -1 ? "" : "s"} ago. Renew it and record the new expiry.`
            : `Expires ${fmtDate(a.expiresOn)}. Renew it and record the new expiry date.`,
        daysLeft: left,
        urgency: urgencyFor(left),
        stage: stageFor(left),
      });
    }
    if (a.cpdRequired > 0) {
      const done = cpdDone(a);
      const short = a.cpdRequired - done;
      const cLeft = daysUntil(a.cpdYearEnd, now);
      if (short > 0 && cLeft <= REMINDER_DAYS[0]) {
        out.push({
          id: `${a.id}-cpd`,
          accId: a.id,
          kind: "cpd",
          person: a.person,
          title: `${a.person} is ${short} CPD hour${short === 1 ? "" : "s"} short`,
          detail:
            cLeft < 0
              ? `The CPD year ended ${-cLeft} day${cLeft === -1 ? "" : "s"} ago with ${done} of ${a.cpdRequired} hours.`
              : `${done} of ${a.cpdRequired} hours done, ${cLeft} day${cLeft === 1 ? "" : "s"} left in the CPD year.`,
          daysLeft: cLeft,
          urgency: urgencyFor(cLeft),
          stage: stageFor(cLeft),
        });
      }
    }
  }
  return out.sort((x, y) => x.daysLeft - y.daysLeft);
}

export function statusOf(
  a: Accreditation,
  now = new Date(),
): { label: string; tone: "ok" | "owed" | "neutral" } {
  const left = daysUntil(a.expiresOn, now);
  if (left < 0) return { label: "Expired", tone: "owed" };
  if (left <= REMINDER_DAYS[0])
    return {
      label: `Renews in ${left} day${left === 1 ? "" : "s"}`,
      tone: "owed",
    };
  if (
    a.cpdRequired > 0 &&
    cpdDone(a) < a.cpdRequired &&
    daysUntil(a.cpdYearEnd, now) <= REMINDER_DAYS[0]
  ) {
    return { label: "CPD short", tone: "owed" };
  }
  return { label: "Current", tone: "ok" };
}

/* ---------- forms ---------- */

export const accreditationFields: Field[] = [
  { name: "person", label: "Person", type: "person", required: true },
  {
    name: "type",
    label: "Accreditation",
    type: "select",
    required: true,
    options: TYPES,
  },
  {
    name: "typeOther",
    label: "Name of the accreditation",
    type: "text",
    required: true,
    showWhen: { field: "type", in: ["Other"] },
  },
  {
    name: "issuedBy",
    label: "Issued by",
    type: "text",
    required: true,
    placeholder: "NSW Fair Trading",
  },
  {
    name: "number",
    label: "Licence or certificate number",
    type: "text",
    placeholder: "Optional",
  },
  {
    name: "acquiredOn",
    label: "Date acquired",
    type: "date",
    required: true,
    notFuture: true,
    help: "The date it was first granted or issued.",
  },
  {
    name: "expiresOn",
    label: "Expires on",
    type: "date",
    required: true,
    after: "acquiredOn",
    help: "Reminders go out 90, 60, 30 and 7 days before this date.",
  },
  {
    name: "cpdRequired",
    label: "CPD hours needed this year",
    type: "number",
    help: "Leave blank if CPD is not tracked for this one. Check your requirement with NSW Fair Trading.",
  },
  {
    name: "cpdYearEnd",
    label: "CPD year ends",
    type: "date",
    requiredIfFilled: "cpdRequired",
    help: "Needed when CPD hours are set, so reminders know the deadline.",
  },
  {
    name: "file",
    label: "Copy of the licence or certificate",
    type: "file",
    help: "Recommended, so the proof sits with the record.",
  },
];

export const cpdFields: Field[] = [
  {
    name: "date",
    label: "Date completed",
    type: "date",
    required: true,
    notFuture: true,
  },
  {
    name: "activity",
    label: "Activity",
    type: "text",
    required: true,
    placeholder: "Course or session title",
  },
  { name: "provider", label: "Provider", type: "text", required: true },
  {
    name: "category",
    label: "Type",
    type: "select",
    required: true,
    options: CPD_CATEGORIES,
  },
  { name: "hours", label: "Hours", type: "number", required: true },
  {
    name: "file",
    label: "Certificate of attendance",
    type: "file",
    required: true,
    help: "Attach the certificate or confirmation that shows the hours.",
  },
];

export const renewalFields: Field[] = [
  {
    name: "renewedOn",
    label: "Date renewed",
    type: "date",
    required: true,
    notFuture: true,
  },
  {
    name: "newExpiry",
    label: "New expiry date",
    type: "date",
    required: true,
    after: "renewedOn",
  },
  {
    name: "reference",
    label: "Renewal reference",
    type: "text",
    placeholder: "Optional",
  },
  {
    name: "file",
    label: "Renewal certificate or receipt",
    type: "file",
    required: true,
    help: "Attach what shows it was renewed.",
  },
];

/* ---------- sample data ---------- */

const log = (
  id: string,
  date: string,
  activity: string,
  provider: string,
  category: string,
  hours: number,
): CpdEntry => ({
  id,
  date,
  activity,
  provider,
  category,
  hours,
  file: {
    name: `${activity.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`,
    size: 0,
    mime: "application/pdf",
    proofId: "",
  },
});

export const seedAccreditations: Accreditation[] = [
  {
    id: "acc-dana",
    person: "Dana Whitfield",
    type: "Class 1 licence",
    number: "L-100245",
    issuedBy: "NSW Fair Trading",
    acquiredOn: "2019-03-14",
    expiresOn: "2027-03-14",
    cpdRequired: 12,
    cpdYearEnd: "2027-05-31",
    cpdLog: [
      log(
        "c1",
        "2026-07-12",
        "Trust accounting update",
        "REINSW",
        "Seminar or webinar",
        4,
      ),
      log(
        "c2",
        "2026-09-03",
        "Supervision for licensees",
        "Fair Trading",
        "Course",
        5,
      ),
    ],
    renewals: [],
  },
  {
    id: "acc-alvarez",
    person: "J. Alvarez",
    type: "Class 2 licence",
    number: "L-208811",
    issuedBy: "NSW Fair Trading",
    acquiredOn: "2021-12-02",
    expiresOn: "2026-12-02",
    cpdRequired: 12,
    cpdYearEnd: "2027-06-30",
    cpdLog: [
      log("c3", "2026-08-20", "Agency law refresher", "REINSW", "Course", 12),
    ],
    renewals: [],
  },
  {
    id: "acc-sam",
    person: "Sam Taylor",
    type: "Certificate of registration",
    number: "C-331907",
    issuedBy: "NSW Fair Trading",
    acquiredOn: "2023-11-20",
    expiresOn: "2026-11-20",
    cpdRequired: 12,
    cpdYearEnd: "2027-06-30",
    cpdLog: [
      log("c4", "2026-07-30", "Negotiation skills", "REINSW", "Course", 6),
    ],
    renewals: [],
  },
  {
    id: "acc-priya",
    person: "Priya Nair",
    type: "Certificate of registration",
    number: "C-402276",
    issuedBy: "NSW Fair Trading",
    acquiredOn: "2024-08-19",
    expiresOn: "2027-08-19",
    cpdRequired: 12,
    cpdYearEnd: "2027-06-30",
    cpdLog: [
      log(
        "c5",
        "2026-09-18",
        "Open home safety",
        "Agency in-house",
        "Seminar or webinar",
        8,
      ),
    ],
    renewals: [],
  },
  {
    id: "acc-tom",
    person: "Tom Becker",
    type: "Class 2 licence",
    number: "L-250019",
    issuedBy: "NSW Fair Trading",
    acquiredOn: "2022-06-10",
    expiresOn: "2027-06-10",
    cpdRequired: 12,
    cpdYearEnd: "2026-12-31",
    cpdLog: [
      log(
        "c6",
        "2026-05-14",
        "Rental law update",
        "Property Council",
        "Seminar or webinar",
        6,
      ),
    ],
    renewals: [],
  },
  {
    id: "acc-alex",
    person: "Alex Chen",
    type: "Certificate of registration",
    number: "C-455120",
    issuedBy: "NSW Fair Trading",
    acquiredOn: "2025-01-22",
    expiresOn: "2028-01-22",
    cpdRequired: 12,
    cpdYearEnd: "2027-06-30",
    cpdLog: [
      log("c7", "2026-10-02", "Tenancy law essentials", "REINSW", "Course", 10),
    ],
    renewals: [],
  },
];
