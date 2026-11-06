/** Sample data for the demo workspace. Nothing here is a real agency, person or amount. */

export const agency = { name: "Inner West Realty", plan: "Boutique" };
export const me = {
  name: "Dana Whitfield",
  initials: "DW",
  role: "Licensee in charge",
};

export type ChecklistItem = {
  id: string;
  t: string;
  who: string;
  done: boolean;
  due?: string;
  file?: string;
};
export type Property = {
  id: string;
  address: string;
  suburb: string;
  status: "Listed" | "Under offer" | "Managed" | "Appraised";
  kind: "Sales campaign" | "Management period";
  agent: string;
  detail: string;
  checklist: ChecklistItem[];
};

export const properties: Property[] = [
  {
    id: "12-smith-st",
    address: "12 Smith Street",
    suburb: "Newtown",
    status: "Listed",
    kind: "Sales campaign",
    agent: "Sam Taylor",
    detail: "Listed 29 Aug · Guide A$1.15m to A$1.25m",
    checklist: [
      {
        id: "a",
        t: "Form 6, agency agreement",
        who: "ST",
        done: true,
        file: "Form6.pdf",
      },
      {
        id: "b",
        t: "Vendor disclosure",
        who: "PN",
        done: true,
        file: "Disclosure.pdf",
      },
      {
        id: "c",
        t: "Material fact notice",
        who: "ST",
        done: true,
        file: "Notice.pdf",
      },
      {
        id: "d",
        t: "Identity verification",
        who: "AC",
        done: false,
        due: "Due today",
      },
      {
        id: "e",
        t: "Smoke alarms checked",
        who: "JA",
        done: false,
        due: "Due Fri",
      },
    ],
  },
  {
    id: "41-norton-st",
    address: "41 Norton Street",
    suburb: "Leichhardt",
    status: "Under offer",
    kind: "Sales campaign",
    agent: "Priya Nair",
    detail: "Offer received 2 Nov · Deposit held in trust",
    checklist: [
      {
        id: "a",
        t: "Form 6, agency agreement",
        who: "PN",
        done: true,
        file: "Form6.pdf",
      },
      {
        id: "b",
        t: "Contract for sale on file",
        who: "PN",
        done: true,
        file: "Contract.pdf",
      },
      { id: "c", t: "Deposit receipted", who: "DW", done: true },
      {
        id: "d",
        t: "Cooling-off release",
        who: "PN",
        done: false,
        due: "Due Tue",
      },
    ],
  },
  {
    id: "3-bay-st",
    address: "3 Bay Street",
    suburb: "Rozelle",
    status: "Managed",
    kind: "Management period",
    agent: "Alex Chen",
    detail: "A$720 a week · Lease ends 14 Mar",
    checklist: [
      {
        id: "a",
        t: "Management agreement",
        who: "AC",
        done: true,
        file: "Agreement.pdf",
      },
      {
        id: "b",
        t: "Routine inspection report",
        who: "AC",
        done: true,
        file: "Inspection.pdf",
      },
      {
        id: "c",
        t: "Arrears follow-up",
        who: "AC",
        done: false,
        due: "Overdue 3 days",
      },
    ],
  },
  {
    id: "22-hill-st",
    address: "22 Hill Street",
    suburb: "Balmain",
    status: "Appraised",
    kind: "Sales campaign",
    agent: "Sam Taylor",
    detail: "Appraised 30 Oct · Awaiting agreement",
    checklist: [
      { id: "a", t: "Appraisal recorded", who: "ST", done: true },
      {
        id: "b",
        t: "Form 6, agency agreement",
        who: "ST",
        done: false,
        due: "Due Mon",
      },
    ],
  },
  {
    id: "15-wharf-rd",
    address: "15 Wharf Road",
    suburb: "Balmain",
    status: "Under offer",
    kind: "Sales campaign",
    agent: "Priya Nair",
    detail: "Exchanged 28 Oct · Settlement in 6 weeks",
    checklist: [
      {
        id: "a",
        t: "Form 6, agency agreement",
        who: "PN",
        done: true,
        file: "Form6.pdf",
      },
      { id: "b", t: "Deposit receipted", who: "DW", done: true },
      {
        id: "c",
        t: "Identity verified",
        who: "PN",
        done: true,
        file: "ID-check.pdf",
      },
    ],
  },
  {
    id: "8-jones-ave",
    address: "4/8 Jones Avenue",
    suburb: "Glebe",
    status: "Managed",
    kind: "Management period",
    agent: "Alex Chen",
    detail: "A$780 a week · Rent receipted",
    checklist: [
      { id: "a", t: "Management agreement", who: "AC", done: true },
      { id: "b", t: "Entry notice filed", who: "AC", done: true },
      {
        id: "c",
        t: "Routine inspection booked",
        who: "AC",
        done: false,
        due: "Due 18 Nov",
      },
    ],
  },
];

export type Receipt = {
  ref: string;
  date: string;
  against: string;
  party: string;
  amount: number;
};
export const trust = {
  sales: {
    label: "Sales trust",
    held: 292000,
    receipts: [
      {
        ref: "R-0841",
        date: "27 Oct",
        against: "Deposit, 15 Wharf Rd",
        party: "A. Moretti",
        amount: 175000,
      },
      {
        ref: "R-0842",
        date: "29 Oct",
        against: "Deposit, 6 Rose St",
        party: "K. Ohlsson",
        amount: 117000,
      },
    ] as Receipt[],
  },
  rentals: {
    label: "Rentals trust",
    held: 48210,
    receipts: [
      {
        ref: "R-1201",
        date: "1 Nov",
        against: "Rent, 4/8 Jones Ave",
        party: "T. Nguyen",
        amount: 3120,
      },
      {
        ref: "R-1202",
        date: "1 Nov",
        against: "Rent, 3 Bay St",
        party: "M. Haddad",
        amount: 2880,
      },
      {
        ref: "R-1203",
        date: "2 Nov",
        against: "Bond, 88 Elliott St",
        party: "L. Fraser",
        amount: 3600,
      },
    ] as Receipt[],
  },
};

export const people = [
  {
    n: "Dana Whitfield",
    i: "DW",
    role: "Licensee in charge · Class 1",
    exp: "Mar 2027",
    pct: 88,
    status: "Active",
    tone: "ok" as const,
  },
  {
    n: "J. Alvarez",
    i: "JA",
    role: "Class 2 licence",
    exp: "2 Dec",
    pct: 14,
    status: "Renews in 25 days",
    tone: "owed" as const,
  },
  {
    n: "Priya Nair",
    i: "PN",
    role: "Certificate of registration",
    exp: "Aug 2027",
    pct: 70,
    status: "Active",
    tone: "ok" as const,
  },
  {
    n: "Tom Becker",
    i: "TB",
    role: "Class 2 licence",
    exp: "Jun 2027",
    pct: 45,
    status: "CPD short 6 hrs",
    tone: "neutral" as const,
  },
  {
    n: "Alex Chen",
    i: "AC",
    role: "Certificate of registration",
    exp: "Jan 2028",
    pct: 80,
    status: "Active",
    tone: "ok" as const,
  },
];

export const registers = [
  {
    name: "Keys",
    entries: 14,
    latest: "12 Smith St signed out for the open",
    open: 2,
  },
  {
    name: "Material facts",
    entries: 9,
    latest: "Flooding of the rear yard disclosed",
    open: 0,
  },
  {
    name: "Complaints",
    entries: 3,
    latest: "Rear fence repair took six weeks",
    open: 1,
  },
  {
    name: "Gifts",
    entries: 4,
    latest: "Bottle of wine after the first open",
    open: 0,
  },
  {
    name: "Risks and incidents",
    entries: 5,
    latest: "Slip on wet entry, 41 Norton St",
    open: 1,
  },
  {
    name: "Identity checks",
    entries: 22,
    latest: "Vendor, 12 Smith St, owed",
    open: 1,
  },
  {
    name: "Open homes",
    entries: 11,
    latest: "12 Smith St, Saturday 10am",
    open: 0,
  },
];

export const policies = [
  { name: "Work health and safety", version: "v2", signed: 5, total: 5 },
  { name: "Trust accounting procedures", version: "v3", signed: 4, total: 5 },
  { name: "Anti-money laundering", version: "v1", signed: 3, total: 5 },
  { name: "Complaints handling", version: "v2", signed: 5, total: 5 },
  { name: "Privacy and data retention", version: "v3", signed: 3, total: 4 },
  { name: "Supervision guidelines", version: "v1", signed: 5, total: 5 },
];

export type AuditEvent = {
  t: string;
  day: string;
  who: string;
  name: string;
  act: string;
  from: string;
  to: string;
  area: "Trust" | "Registers" | "Properties";
};
export const audit: AuditEvent[] = [
  {
    t: "11:41",
    day: "Today",
    who: "DW",
    name: "Dana Whitfield",
    act: "locked the October sales reconciliation",
    from: "Draft",
    to: "Locked",
    area: "Trust",
  },
  {
    t: "11:40",
    day: "Today",
    who: "DW",
    name: "Dana Whitfield",
    act: "approved the identity check, 15 Wharf Rd",
    from: "Owed",
    to: "Verified",
    area: "Registers",
  },
  {
    t: "09:15",
    day: "Today",
    who: "ST",
    name: "Sam Taylor",
    act: "filed the material fact notice, 12 Smith St",
    from: "Missing",
    to: "Filed",
    area: "Properties",
  },
  {
    t: "09:14",
    day: "Today",
    who: "AC",
    name: "Alex Chen",
    act: "recorded a gift, bottle of wine",
    from: "No entry",
    to: "Gifts register",
    area: "Registers",
  },
  {
    t: "16:02",
    day: "Yesterday",
    who: "DW",
    name: "Dana Whitfield",
    act: "receipted a deposit, 6 Rose St",
    from: "No entry",
    to: "R-0842",
    area: "Trust",
  },
  {
    t: "14:20",
    day: "Yesterday",
    who: "PN",
    name: "Priya Nair",
    act: "uploaded the contract for sale, 41 Norton St",
    from: "Missing",
    to: "Filed",
    area: "Properties",
  },
];

export type Task = {
  id: string;
  t: string;
  from: "Checklist" | "By hand" | "Review";
  status: "Open" | "In progress" | "Done";
  where: string;
};
export const tasks: Task[] = [
  {
    id: "t1",
    t: "Book the smoke alarm check",
    from: "Checklist",
    status: "Open",
    where: "12 Smith St",
  },
  {
    id: "t2",
    t: "Verify the vendor's identity",
    from: "Checklist",
    status: "Open",
    where: "12 Smith St",
  },
  {
    id: "t3",
    t: "Order the signboard",
    from: "Checklist",
    status: "Open",
    where: "22 Hill St",
  },
  {
    id: "t4",
    t: "Chase arrears",
    from: "By hand",
    status: "In progress",
    where: "3 Bay St",
  },
  {
    id: "t5",
    t: "Review the trust policy",
    from: "Review",
    status: "In progress",
    where: "Policies",
  },
  {
    id: "t6",
    t: "Send the contract for sale",
    from: "By hand",
    status: "Done",
    where: "41 Norton St",
  },
  {
    id: "t7",
    t: "Receipt the Rose St deposit",
    from: "By hand",
    status: "Done",
    where: "6 Rose St",
  },
];

export const kpis = [
  { name: "Appraisals", pct: 86 },
  { name: "Listings", pct: 64 },
  { name: "New managements", pct: 42 },
];

export const upcoming = [
  { d: "Tue 11", t: "Cooling-off release, 41 Norton St" },
  { d: "Fri 14", t: "Smoke alarm check, 12 Smith St" },
  { d: "Tue 18", t: "Routine inspection, 4/8 Jones Ave" },
  { d: "Tue 2 Dec", t: "J. Alvarez, licence renewal" },
];

export const aud = (n: number) => `A$${n.toLocaleString("en-AU")}`;
