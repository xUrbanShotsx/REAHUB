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
  /** Name of the file that proves the item is done. Every ticked item has one. */
  file?: string;
  /** Key of the stored file in this browser. Sample files have none. */
  proofId?: string;
  size?: number;
  mime?: string;
  addedAt?: string;
};
export type PropertyType = "sale" | "management";

export const STATUSES: Record<PropertyType, string[]> = {
  sale: ["Appraised", "Listed", "Under offer", "Sold"],
  management: ["Managed", "Vacant", "Notice given"],
};

export const TYPE_LABEL: Record<PropertyType, string> = {
  sale: "For sale",
  management: "Property management",
};

export type Property = {
  id: string;
  type: PropertyType;
  address: string;
  suburb: string;
  status: string;
  agent: string;
  owner: string;
  /** Price guide for a sale, weekly rent for a management. */
  price: string;
  note: string;
  templateName: string;
  createdAt: string;
  checklist: ChecklistItem[];
};

export type Template = {
  id: string;
  name: string;
  type: PropertyType | "any";
  items: string[];
  builtIn?: boolean;
};

export const team = [
  { name: "Sam Taylor", initials: "ST" },
  { name: "Priya Nair", initials: "PN" },
  { name: "Alex Chen", initials: "AC" },
  { name: "Dana Whitfield", initials: "DW" },
  { name: "Tom Becker", initials: "TB" },
];
export const initialsOf = (name: string) =>
  team.find((t) => t.name === name)?.initials ??
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const templates: Template[] = [
  {
    id: "tpl-residential-sale",
    name: "Residential sale",
    type: "sale",
    builtIn: true,
    items: [
      "Form 6, agency agreement",
      "Vendor identity verification",
      "Vendor disclosure",
      "Material fact notice",
      "Estimated selling price recorded",
      "Price guide check",
      "Advertising approval",
      "Smoke alarms checked",
      "Contract for sale on file",
      "Deposit receipted",
      "Cooling-off release",
    ],
  },
  {
    id: "tpl-auction",
    name: "Auction",
    type: "sale",
    builtIn: true,
    items: [
      "Form 6, agency agreement",
      "Vendor identity verification",
      "Material fact notice",
      "Estimated selling price recorded",
      "Auction authority signed",
      "Reserve price recorded",
      "Open home register",
      "Contract for sale on file",
      "Bidder registration records",
    ],
  },
  {
    id: "tpl-new-tenancy",
    name: "New tenancy",
    type: "management",
    builtIn: true,
    items: [
      "Management agreement signed",
      "Owner identity verified",
      "Lease signed",
      "Bond lodged",
      "Condition report",
      "Smoke alarm compliance",
      "Routine inspection scheduled",
    ],
  },
  {
    id: "tpl-blank",
    name: "Start blank",
    type: "any",
    builtIn: true,
    items: [],
  },
];

const item = (
  id: string,
  t: string,
  who: string,
  done: boolean,
  extra: Partial<ChecklistItem> = {},
): ChecklistItem => ({
  id,
  t,
  who,
  done,
  // a ticked item always carries proof, so sample items get a sample file name
  ...(done
    ? {
        file: `${t
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}.pdf`,
        addedAt: "Earlier",
      }
    : {}),
  ...extra,
});

export const properties: Property[] = [
  {
    id: "12-smith-st",
    type: "sale",
    address: "12 Smith Street",
    suburb: "Newtown",
    status: "Listed",
    agent: "Sam Taylor",
    owner: "R. Hargreaves",
    price: "A$1.15m to A$1.25m",
    note: "Listed 29 Aug",
    templateName: "Residential sale",
    createdAt: "29 Aug",
    checklist: [
      item("a", "Form 6, agency agreement", "ST", true, { file: "Form6.pdf" }),
      item("b", "Vendor disclosure", "PN", true, { file: "Disclosure.pdf" }),
      item("c", "Material fact notice", "ST", true, { file: "Notice.pdf" }),
      item("d", "Identity verification", "AC", false, { due: "Due today" }),
      item("e", "Smoke alarms checked", "JA", false, { due: "Due Fri" }),
    ],
  },
  {
    id: "41-norton-st",
    type: "sale",
    address: "41 Norton Street",
    suburb: "Leichhardt",
    status: "Under offer",
    agent: "Priya Nair",
    owner: "L. and T. Bianchi",
    price: "A$1.42m",
    note: "Offer received 2 Nov",
    templateName: "Residential sale",
    createdAt: "12 Sep",
    checklist: [
      item("a", "Form 6, agency agreement", "PN", true, { file: "Form6.pdf" }),
      item("b", "Contract for sale on file", "PN", true, {
        file: "Contract.pdf",
      }),
      item("c", "Deposit receipted", "DW", true),
      item("d", "Cooling-off release", "PN", false, { due: "Due Tue" }),
    ],
  },
  {
    id: "22-hill-st",
    type: "sale",
    address: "22 Hill Street",
    suburb: "Balmain",
    status: "Appraised",
    agent: "Sam Taylor",
    owner: "M. Okafor",
    price: "A$1.9m to A$2.05m",
    note: "Appraised 30 Oct",
    templateName: "Residential sale",
    createdAt: "30 Oct",
    checklist: [
      item("a", "Appraisal recorded", "ST", true),
      item("b", "Form 6, agency agreement", "ST", false, { due: "Due Mon" }),
    ],
  },
  {
    id: "15-wharf-rd",
    type: "sale",
    address: "15 Wharf Road",
    suburb: "Balmain",
    status: "Under offer",
    agent: "Priya Nair",
    owner: "A. Moretti",
    price: "A$1.75m",
    note: "Exchanged 28 Oct",
    templateName: "Residential sale",
    createdAt: "2 Oct",
    checklist: [
      item("a", "Form 6, agency agreement", "PN", true, { file: "Form6.pdf" }),
      item("b", "Deposit receipted", "DW", true),
      item("c", "Identity verified", "PN", true, { file: "ID-check.pdf" }),
    ],
  },
  {
    id: "3-bay-st",
    type: "management",
    address: "3 Bay Street",
    suburb: "Rozelle",
    status: "Managed",
    agent: "Alex Chen",
    owner: "M. Haddad",
    price: "A$720 a week",
    note: "Lease ends 14 Mar",
    templateName: "New tenancy",
    createdAt: "14 Mar",
    checklist: [
      item("a", "Management agreement", "AC", true, { file: "Agreement.pdf" }),
      item("b", "Routine inspection report", "AC", true, {
        file: "Inspection.pdf",
      }),
      item("c", "Arrears follow-up", "AC", false, { due: "Overdue 3 days" }),
    ],
  },
  {
    id: "8-jones-ave",
    type: "management",
    address: "4/8 Jones Avenue",
    suburb: "Glebe",
    status: "Managed",
    agent: "Alex Chen",
    owner: "T. Nguyen",
    price: "A$780 a week",
    note: "Rent receipted monthly",
    templateName: "New tenancy",
    createdAt: "3 Jun",
    checklist: [
      item("a", "Management agreement", "AC", true),
      item("b", "Entry notice filed", "AC", true),
      item("c", "Routine inspection booked", "AC", false, {
        due: "Due 18 Nov",
      }),
    ],
  },
  {
    id: "88-elliott-st",
    type: "management",
    address: "88 Elliott Street",
    suburb: "Balmain",
    status: "Managed",
    agent: "Tom Becker",
    owner: "L. Fraser",
    price: "A$850 a week",
    note: "Bond lodged 2 Nov",
    templateName: "New tenancy",
    createdAt: "2 Nov",
    checklist: [
      item("a", "Management agreement signed", "TB", true),
      item("b", "Lease signed", "TB", true),
      item("c", "Bond lodged", "TB", true),
      item("d", "Condition report", "TB", false, { due: "Due Wed" }),
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
