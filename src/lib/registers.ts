/** Register definitions: what each register records, and how much detail an entry must carry. */

import { todayISO } from "./format";

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "date"
  | "datetime"
  | "number"
  | "money"
  | "property"
  | "person"
  | "check"
  | "checks"
  | "file";

export type Condition = { field: string; in: string[] };

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  help?: string;
  placeholder?: string;
  minLength?: number;
  wide?: boolean;
  /** Only shown, and only validated, when another field has one of these values. */
  showWhen?: Condition;
  /** Required only when another field has one of these values. */
  requiredWhen?: Condition;
  /** Required only when another field has been filled in. */
  requiredIfFilled?: string;
  /** The date must be later than this other date field. */
  after?: string;
  /** The date cannot be in the future. */
  notFuture?: boolean;
};

export type RegisterAction = {
  id: string;
  label: string;
  from: string[];
  /** Fixed target status, or the name of a field whose value becomes the status. */
  to: string | { fromField: string };
  intro: string;
  fields: Field[];
};

export type RegisterDef = {
  id: string;
  name: string;
  blurb: string;
  fields: Field[];
  /** Field names shown as columns in the list. The first one titles the row. */
  columns: string[];
  status: (values: Values) => string;
  statuses: string[];
  actions: RegisterAction[];
};

export type Values = Record<string, string | string[] | boolean>;
export type EntryFile = {
  name: string;
  size: number;
  mime: string;
  proofId: string;
};
export type HistoryItem = { at: string; by: string; act: string };
export type RegisterEntry = {
  id: string;
  registerId: string;
  createdAt: string;
  createdBy: string;
  status: string;
  values: Values;
  files: Record<string, EntryFile>;
  history: HistoryItem[];
};

export const OPEN_STATUSES = ["Out", "Open", "Pending", "Unable to verify"];

const person = (
  name: string,
  label: string,
  extra: Partial<Field> = {},
): Field => ({
  name,
  label,
  type: "person",
  required: true,
  ...extra,
});

const property = (
  name = "property",
  label = "Property",
  extra: Partial<Field> = {},
): Field => ({
  name,
  label,
  type: "property",
  required: true,
  ...extra,
});

export const registerDefs: RegisterDef[] = [
  {
    id: "keys",
    name: "Keys",
    blurb:
      "Every key signed out and back in, with who held it, why and when it was due back.",
    columns: ["keyRef", "property", "heldBy", "expectedBack"],
    statuses: ["Out", "Returned"],
    status: () => "Out",
    fields: [
      {
        name: "keyRef",
        label: "Key tag or reference",
        type: "text",
        required: true,
        placeholder: "K-045",
      },
      property(),
      {
        name: "heldBy",
        label: "Signed out to",
        type: "text",
        required: true,
        placeholder: "Full name, and company if a tradesperson",
      },
      {
        name: "phone",
        label: "Contact phone",
        type: "text",
        required: true,
        placeholder: "04xx xxx xxx",
      },
      {
        name: "purpose",
        label: "Purpose",
        type: "select",
        required: true,
        options: [
          "Open home",
          "Inspection",
          "Tradesperson or repairs",
          "Photographer or stylist",
          "Valuer",
          "Cleaner",
          "Other",
        ],
      },
      { name: "outAt", label: "Signed out", type: "datetime", required: true },
      {
        name: "expectedBack",
        label: "Due back",
        type: "datetime",
        required: true,
      },
      person("authorisedBy", "Authorised by"),
      {
        name: "purposeNote",
        label: "Explain the purpose",
        type: "text",
        required: true,
        wide: true,
        showWhen: { field: "purpose", in: ["Other"] },
      },
    ],
    actions: [
      {
        id: "return",
        label: "Mark returned",
        from: ["Out"],
        to: "Returned",
        intro:
          "Record the key back in, so the register shows who has it and when it came home.",
        fields: [
          {
            name: "returnedAt",
            label: "Returned",
            type: "datetime",
            required: true,
          },
          person("receivedBy", "Received by"),
          {
            name: "condition",
            label: "Keys returned",
            type: "select",
            required: true,
            options: [
              "All keys returned in order",
              "Returned, but damaged",
              "Not all keys returned",
            ],
          },
          {
            name: "returnNote",
            label: "What is missing or damaged",
            type: "textarea",
            required: true,
            wide: true,
            minLength: 10,
            showWhen: {
              field: "condition",
              in: ["Returned, but damaged", "Not all keys returned"],
            },
          },
        ],
      },
    ],
  },
  {
    id: "material-facts",
    name: "Material facts",
    blurb:
      "Facts a buyer would want to know, when you learned them, and proof they were disclosed.",
    columns: ["property", "category", "fact", "dateKnown"],
    statuses: ["Open", "Disclosed"],
    status: (v) => (v.disclosed === "Yes" ? "Disclosed" : "Open"),
    fields: [
      property(),
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          "Structural or building defect",
          "Flooding or drainage",
          "Boundary or neighbour dispute",
          "Planning, zoning or approvals",
          "Environmental or contamination",
          "Past event at the property",
          "Other",
        ],
      },
      {
        name: "fact",
        label: "The material fact",
        type: "textarea",
        required: true,
        minLength: 20,
        wide: true,
        help: "Describe what the fact is, where it applies and how serious it is. At least 20 characters.",
      },
      {
        name: "dateKnown",
        label: "Date you became aware",
        type: "date",
        required: true,
      },
      {
        name: "source",
        label: "How it came to light",
        type: "select",
        required: true,
        options: [
          "Told by the vendor",
          "Building or pest inspection",
          "Council or search result",
          "Neighbour or other party",
          "Seen by our team",
          "Other",
        ],
      },
      person("recordedBy", "Recorded by"),
      {
        name: "disclosed",
        label: "Disclosed yet?",
        type: "select",
        required: true,
        options: ["Yes", "Not yet"],
      },
      {
        name: "disclosedTo",
        label: "Disclosed to",
        type: "text",
        required: true,
        placeholder: "All enquirers, or named buyers",
        showWhen: { field: "disclosed", in: ["Yes"] },
      },
      {
        name: "method",
        label: "How it was disclosed",
        type: "select",
        required: true,
        options: [
          "Written notice",
          "Added to the listing",
          "Added to the contract documents",
          "Signage at the open home",
          "Verbally, and noted",
        ],
        showWhen: { field: "disclosed", in: ["Yes"] },
      },
      {
        name: "dateDisclosed",
        label: "Date disclosed",
        type: "date",
        required: true,
        showWhen: { field: "disclosed", in: ["Yes"] },
      },
      {
        name: "evidence",
        label: "Evidence of disclosure",
        type: "file",
        showWhen: { field: "disclosed", in: ["Yes"] },
        help: "The notice, email or screenshot. Strongly recommended.",
      },
    ],
    actions: [
      {
        id: "disclose",
        label: "Record disclosure",
        from: ["Open"],
        to: "Disclosed",
        intro:
          "A material fact stays open until you can show who it was disclosed to, how and when.",
        fields: [
          {
            name: "disclosedTo",
            label: "Disclosed to",
            type: "text",
            required: true,
            placeholder: "All enquirers, or named buyers",
          },
          {
            name: "method",
            label: "How it was disclosed",
            type: "select",
            required: true,
            options: [
              "Written notice",
              "Added to the listing",
              "Added to the contract documents",
              "Signage at the open home",
              "Verbally, and noted",
            ],
          },
          {
            name: "dateDisclosed",
            label: "Date disclosed",
            type: "date",
            required: true,
          },
          person("disclosedBy", "Disclosed by"),
          { name: "evidence", label: "Evidence of disclosure", type: "file" },
        ],
      },
    ],
  },
  {
    id: "complaints",
    name: "Complaints",
    blurb:
      "Every complaint from receipt to outcome, with who owns it and what was done.",
    columns: ["complainant", "category", "severity", "dateReceived"],
    statuses: ["Open", "Resolved"],
    status: () => "Open",
    fields: [
      {
        name: "complainant",
        label: "Complainant",
        type: "text",
        required: true,
        placeholder: "Full name",
      },
      {
        name: "contact",
        label: "Contact details",
        type: "text",
        required: true,
        placeholder: "Phone or email",
      },
      {
        name: "dateReceived",
        label: "Date received",
        type: "date",
        required: true,
      },
      {
        name: "via",
        label: "Received by",
        type: "select",
        required: true,
        options: ["Email", "Phone", "In person", "Letter", "Online form"],
      },
      property("property", "Related property", { required: false }),
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          "Service or communication",
          "Fees or commission",
          "Conduct of a staff member",
          "Marketing or advertising",
          "Property condition",
          "Privacy",
          "Trust money",
          "Other",
        ],
      },
      {
        name: "severity",
        label: "Severity",
        type: "select",
        required: true,
        options: ["Low", "Medium", "High"],
      },
      {
        name: "details",
        label: "What the complaint is",
        type: "textarea",
        required: true,
        minLength: 20,
        wide: true,
        help: "In the complainant's words where possible. At least 20 characters.",
      },
      person("owner", "Handled by"),
      {
        name: "acknowledgedOn",
        label: "Acknowledged on",
        type: "date",
        required: true,
        help: "The date the complainant was told it was received.",
      },
    ],
    actions: [
      {
        id: "resolve",
        label: "Resolve complaint",
        from: ["Open"],
        to: "Resolved",
        intro:
          "Record what was done and that the complainant was told, so the file can be closed.",
        fields: [
          {
            name: "outcome",
            label: "Outcome and action taken",
            type: "textarea",
            required: true,
            minLength: 20,
            wide: true,
          },
          {
            name: "resolvedOn",
            label: "Resolved on",
            type: "date",
            required: true,
          },
          {
            name: "told",
            label: "Complainant told of the outcome",
            type: "select",
            required: true,
            options: ["Yes", "No, they could not be reached"],
          },
          {
            name: "prevention",
            label: "Change made to prevent it happening again",
            type: "textarea",
            wide: true,
          },
        ],
      },
    ],
  },
  {
    id: "gifts",
    name: "Gifts",
    blurb:
      "Gifts and benefits offered or received, who approved what happened to them.",
    columns: ["gift", "direction", "value", "date"],
    statuses: ["Recorded"],
    status: () => "Recorded",
    fields: [
      {
        name: "gift",
        label: "Gift or benefit",
        type: "text",
        required: true,
        placeholder: "Bottle of wine, tickets, hamper",
      },
      {
        name: "direction",
        label: "Received or offered",
        type: "select",
        required: true,
        options: ["Received", "Offered or given"],
      },
      {
        name: "value",
        label: "Estimated value (A$)",
        type: "money",
        required: true,
      },
      { name: "date", label: "Date", type: "date", required: true },
      {
        name: "party",
        label: "From or to",
        type: "text",
        required: true,
        placeholder: "Person or business",
      },
      {
        name: "relationship",
        label: "Relationship",
        type: "select",
        required: true,
        options: [
          "Client or vendor",
          "Buyer or tenant",
          "Contractor or supplier",
          "Another agency",
          "Other",
        ],
      },
      person("staff", "Staff member"),
      property("property", "Related property", { required: false }),
      {
        name: "disposition",
        label: "What happened to it",
        type: "select",
        required: true,
        options: [
          "Kept",
          "Shared with the team",
          "Returned or declined",
          "Donated",
        ],
      },
      person("approvedBy", "Approved by", {
        help: "Someone other than the staff member.",
      }),
      {
        name: "reason",
        label: "Why it was acceptable",
        type: "textarea",
        required: true,
        minLength: 10,
        wide: true,
      },
    ],
    actions: [],
  },
  {
    id: "risks-and-incidents",
    name: "Risks and incidents",
    blurb:
      "Incidents, near misses and risks, what was done straight away and what follows.",
    columns: ["type", "property", "severity", "occurredAt"],
    statuses: ["Open", "Closed"],
    status: () => "Open",
    fields: [
      {
        name: "type",
        label: "Type",
        type: "select",
        required: true,
        options: ["Incident", "Near miss", "Risk identified"],
      },
      {
        name: "occurredAt",
        label: "When it happened",
        type: "datetime",
        required: true,
      },
      property("property", "Where", {
        help: "Choose the property, or pick the office if it was not at a property.",
      }),
      {
        name: "description",
        label: "What happened",
        type: "textarea",
        required: true,
        minLength: 20,
        wide: true,
        help: "Facts only: what, how and who saw it. At least 20 characters.",
      },
      {
        name: "people",
        label: "People involved",
        type: "text",
        required: true,
        placeholder: "Names and roles",
      },
      {
        name: "harm",
        label: "Injury or damage",
        type: "select",
        required: true,
        options: ["None", "Minor injury or damage", "Serious injury or damage"],
      },
      {
        name: "severity",
        label: "Severity",
        type: "select",
        required: true,
        options: ["Low", "Medium", "High"],
      },
      {
        name: "immediate",
        label: "Immediate action taken",
        type: "textarea",
        required: true,
        minLength: 10,
        wide: true,
      },
      {
        name: "reportedTo",
        label: "Reported to",
        type: "select",
        required: true,
        options: [
          "Licensee in charge",
          "WHS officer",
          "Insurer",
          "Police or emergency services",
          "No one else",
        ],
      },
      person("recordedBy", "Recorded by"),
      {
        name: "followUp",
        label: "Follow-up action",
        type: "textarea",
        required: true,
        wide: true,
        showWhen: { field: "severity", in: ["Medium", "High"] },
      },
      {
        name: "followOwner",
        label: "Follow-up owner",
        type: "person",
        required: true,
        showWhen: { field: "severity", in: ["Medium", "High"] },
      },
      {
        name: "followDue",
        label: "Follow-up due",
        type: "date",
        required: true,
        showWhen: { field: "severity", in: ["Medium", "High"] },
      },
    ],
    actions: [
      {
        id: "close",
        label: "Close out",
        from: ["Open"],
        to: "Closed",
        intro:
          "Close the item once the follow-up is done, and say what was done.",
        fields: [
          {
            name: "closeOutcome",
            label: "What was done",
            type: "textarea",
            required: true,
            minLength: 20,
            wide: true,
          },
          {
            name: "closedOn",
            label: "Closed on",
            type: "date",
            required: true,
          },
          person("closedBy", "Closed by"),
        ],
      },
    ],
  },
  {
    id: "identity-checks",
    name: "Identity checks",
    blurb:
      "Who was verified, how, by whom and when, tied to the property and the deal.",
    columns: ["party", "role", "property", "method"],
    statuses: ["Pending", "Verified", "Unable to verify"],
    status: (v) => String(v.outcome ?? "Pending"),
    fields: [
      {
        name: "party",
        label: "Person or entity",
        type: "text",
        required: true,
        placeholder: "Full legal name",
      },
      {
        name: "role",
        label: "Role in the deal",
        type: "select",
        required: true,
        options: [
          "Vendor",
          "Purchaser",
          "Landlord",
          "Tenant",
          "Authorised representative",
          "Other",
        ],
      },
      property(),
      {
        name: "engagement",
        label: "Engagement",
        type: "select",
        required: true,
        options: ["Sales campaign", "Management period"],
      },
      {
        name: "method",
        label: "How it was checked",
        type: "select",
        required: true,
        options: ["In person", "Video call", "Electronic verification service"],
      },
      {
        name: "documents",
        label: "Documents sighted",
        type: "checks",
        required: true,
        options: [
          "Driver licence",
          "Passport",
          "Proof of age card",
          "Medicare card",
          "Birth certificate",
          "Company extract (ASIC)",
          "Trust deed",
        ],
      },
      {
        name: "docRef",
        label: "Document reference, last four digits only",
        type: "text",
        required: true,
        placeholder: "1234",
        help: "Never store a full document number here.",
      },
      { name: "docExpiry", label: "Document expiry", type: "date" },
      {
        name: "checkedOn",
        label: "Date checked",
        type: "date",
        required: true,
      },
      person("checkedBy", "Checked by"),
      {
        name: "outcome",
        label: "Outcome",
        type: "select",
        required: true,
        options: ["Pending", "Verified", "Unable to verify"],
      },
      {
        name: "evidence",
        label: "Copy of what was sighted",
        type: "file",
        requiredWhen: { field: "outcome", in: ["Verified"] },
        help: "Required when the outcome is Verified.",
      },
      { name: "notes", label: "Notes", type: "textarea", wide: true },
    ],
    actions: [
      {
        id: "outcome",
        label: "Record outcome",
        from: ["Pending", "Unable to verify"],
        to: { fromField: "outcome" },
        intro:
          "Finish the check. A Verified outcome needs the copy of what was sighted.",
        fields: [
          {
            name: "outcome",
            label: "Outcome",
            type: "select",
            required: true,
            options: ["Verified", "Unable to verify"],
          },
          {
            name: "checkedOn",
            label: "Date checked",
            type: "date",
            required: true,
          },
          person("checkedBy", "Checked by"),
          {
            name: "evidence",
            label: "Copy of what was sighted",
            type: "file",
            requiredWhen: { field: "outcome", in: ["Verified"] },
          },
        ],
      },
    ],
  },
  {
    id: "open-homes",
    name: "Open homes",
    blurb:
      "Each open home: who ran it, how many came and that safety was checked.",
    columns: ["property", "startAt", "agent", "groups"],
    statuses: ["Recorded"],
    status: () => "Recorded",
    fields: [
      property(),
      { name: "startAt", label: "Start", type: "datetime", required: true },
      { name: "endAt", label: "Finish", type: "datetime", required: true },
      person("agent", "Agent in charge"),
      {
        name: "groups",
        label: "Groups through",
        type: "number",
        required: true,
        help: "Count of groups or households.",
      },
      {
        name: "safety",
        label: "Safety check completed before opening",
        type: "check",
        required: true,
        help: "Hazards, access and smoke alarms.",
      },
      {
        name: "signIn",
        label: "Visitor sign-in sheet",
        type: "file",
        required: true,
        help: "A photo or scan of the sheet.",
      },
      { name: "notes", label: "Notes", type: "textarea", wide: true },
    ],
    actions: [],
  },
];

export const registerById = (id: string) =>
  registerDefs.find((r) => r.id === id);

/** Is this field in play for the current values? */
export function isVisible(f: Field, v: Values) {
  if (!f.showWhen) return true;
  const cur = v[f.showWhen.field];
  return typeof cur === "string" && f.showWhen.in.includes(cur);
}

export function isRequired(f: Field, v: Values) {
  if (!isVisible(f, v)) return false;
  if (f.required) return true;
  if (f.requiredIfFilled) {
    const other = v[f.requiredIfFilled];
    if (typeof other === "string" && other.trim() !== "") return true;
  }
  if (f.requiredWhen) {
    const cur = v[f.requiredWhen.field];
    return typeof cur === "string" && f.requiredWhen.in.includes(cur);
  }
  return false;
}

export function validate(
  fields: Field[],
  v: Values,
  files: Record<string, File | undefined>,
) {
  const errors: Record<string, string> = {};
  const today = todayISO();
  for (const f of fields) {
    if (!isVisible(f, v)) continue;
    const required = isRequired(f, v);
    if (f.type === "file") {
      if (required && !files[f.name]) errors[f.name] = "Attach the file.";
      continue;
    }
    const val = v[f.name];
    if (f.type === "check") {
      if (required && val !== true)
        errors[f.name] = "Confirm this before saving.";
      continue;
    }
    if (f.type === "checks") {
      if (required && (!Array.isArray(val) || val.length === 0))
        errors[f.name] = "Choose at least one.";
      continue;
    }
    const s = typeof val === "string" ? val.trim() : "";
    if (!s) {
      if (required) errors[f.name] = "This is required.";
      continue;
    }
    if (f.minLength && s.length < f.minLength)
      errors[f.name] =
        `Add more detail (${s.length} of ${f.minLength} characters).`;
    else if (f.type === "money" || f.type === "number") {
      if (Number.isNaN(Number(s)) || Number(s) < 0)
        errors[f.name] = "Enter a number.";
    } else if (f.type === "date" || f.type === "datetime") {
      if (f.notFuture && s.slice(0, 10) > today)
        errors[f.name] = "This cannot be a future date.";
      const base = f.after ? v[f.after] : "";
      if (
        !errors[f.name] &&
        f.after &&
        typeof base === "string" &&
        base &&
        s <= base
      )
        errors[f.name] = "This must be later than the earlier date.";
    }
  }
  return errors;
}

/* ---------- sample entries ---------- */

const hist = (by: string, act: string, at = "Earlier"): HistoryItem => ({
  at,
  by,
  act,
});

export const seedEntries: RegisterEntry[] = [
  {
    id: "e-k1",
    registerId: "keys",
    createdAt: "2026-11-07T08:30",
    createdBy: "Priya Nair",
    status: "Out",
    values: {
      keyRef: "K-014",
      property: "12-smith-st",
      heldBy: "Sam Taylor",
      phone: "0400 111 222",
      purpose: "Open home",
      outAt: "2026-11-07T08:30",
      expectedBack: "2026-11-07T13:00",
      authorisedBy: "Priya Nair",
    },
    files: {},
    history: [hist("Priya Nair", "Recorded the entry", "Today 8:30")],
  },
  {
    id: "e-k2",
    registerId: "keys",
    createdAt: "2026-11-06T14:00",
    createdBy: "Alex Chen",
    status: "Out",
    values: {
      keyRef: "K-022",
      property: "41-norton-st",
      heldBy: "Jim Doyle, Doyle Plumbing",
      phone: "0411 222 333",
      purpose: "Tradesperson or repairs",
      outAt: "2026-11-06T14:00",
      expectedBack: "2026-11-08T17:00",
      authorisedBy: "Alex Chen",
    },
    files: {},
    history: [hist("Alex Chen", "Recorded the entry", "Yesterday 2:00 pm")],
  },
  {
    id: "e-k3",
    registerId: "keys",
    createdAt: "2026-11-03T10:00",
    createdBy: "Alex Chen",
    status: "Returned",
    values: {
      keyRef: "K-031",
      property: "3-bay-st",
      heldBy: "Priya Nair",
      phone: "0422 333 444",
      purpose: "Inspection",
      outAt: "2026-11-03T10:00",
      expectedBack: "2026-11-03T12:00",
      authorisedBy: "Alex Chen",
      returnedAt: "2026-11-03T11:40",
      receivedBy: "Alex Chen",
      condition: "All keys returned in order",
    },
    files: {},
    history: [
      hist("Alex Chen", "Recorded the entry", "3 Nov"),
      hist("Alex Chen", "Marked returned: all keys returned in order", "3 Nov"),
    ],
  },
  {
    id: "e-m1",
    registerId: "material-facts",
    createdAt: "2026-10-20T09:00",
    createdBy: "Sam Taylor",
    status: "Disclosed",
    values: {
      property: "12-smith-st",
      category: "Flooding or drainage",
      fact: "Flooding of the rear yard during heavy rain, reported by the vendor in 2024. No water entered the dwelling.",
      dateKnown: "2026-10-18",
      source: "Told by the vendor",
      recordedBy: "Sam Taylor",
      disclosed: "Yes",
      disclosedTo: "All enquirers",
      method: "Written notice",
      dateDisclosed: "2026-10-20",
    },
    files: {},
    history: [
      hist("Sam Taylor", "Recorded the entry and the disclosure", "20 Oct"),
    ],
  },
  {
    id: "e-m2",
    registerId: "material-facts",
    createdAt: "2026-11-05T15:30",
    createdBy: "Sam Taylor",
    status: "Open",
    values: {
      property: "22-hill-st",
      category: "Boundary or neighbour dispute",
      fact: "Neighbour has raised a dispute over the position of the side boundary fence. No formal notice received yet.",
      dateKnown: "2026-11-05",
      source: "Neighbour or other party",
      recordedBy: "Sam Taylor",
      disclosed: "Not yet",
    },
    files: {},
    history: [
      hist(
        "Sam Taylor",
        "Recorded the entry. Disclosure still to do",
        "Thu 3:30 pm",
      ),
    ],
  },
  {
    id: "e-c1",
    registerId: "complaints",
    createdAt: "2026-10-12T11:00",
    createdBy: "Dana Whitfield",
    status: "Open",
    values: {
      complainant: "M. Haddad",
      contact: "m.haddad@example.com",
      dateReceived: "2026-10-12",
      via: "Email",
      property: "3-bay-st",
      category: "Property condition",
      severity: "Medium",
      details:
        "Rear fence repair took six weeks after it was first reported, and the tenant was not kept updated.",
      owner: "Alex Chen",
      acknowledgedOn: "2026-10-12",
    },
    files: {},
    history: [hist("Dana Whitfield", "Recorded the entry", "12 Oct")],
  },
  {
    id: "e-g1",
    registerId: "gifts",
    createdAt: "2026-11-02T17:00",
    createdBy: "Sam Taylor",
    status: "Recorded",
    values: {
      gift: "Bottle of wine",
      direction: "Received",
      value: "35",
      date: "2026-11-02",
      party: "R. Hargreaves",
      relationship: "Client or vendor",
      staff: "Sam Taylor",
      property: "12-smith-st",
      disposition: "Shared with the team",
      approvedBy: "Dana Whitfield",
      reason: "Token thanks after the first open home. Shared at the office.",
    },
    files: {},
    history: [hist("Sam Taylor", "Recorded the entry", "2 Nov")],
  },
  {
    id: "e-r1",
    registerId: "risks-and-incidents",
    createdAt: "2026-11-04T10:15",
    createdBy: "Priya Nair",
    status: "Open",
    values: {
      type: "Incident",
      occurredAt: "2026-11-04T10:05",
      property: "41-norton-st",
      description:
        "A visitor slipped on the wet entry tiles during an inspection and grazed a knee. No ambulance needed.",
      people: "Visitor (name taken), Priya Nair",
      harm: "Minor injury or damage",
      severity: "Medium",
      immediate: "First aid given, tiles dried and a warning sign placed.",
      reportedTo: "Licensee in charge",
      recordedBy: "Priya Nair",
      followUp: "Ask the owner to fit non-slip matting at the entry.",
      followOwner: "Priya Nair",
      followDue: "2026-11-14",
    },
    files: {},
    history: [hist("Priya Nair", "Recorded the entry", "4 Nov")],
  },
  {
    id: "e-i1",
    registerId: "identity-checks",
    createdAt: "2026-11-05T09:00",
    createdBy: "Alex Chen",
    status: "Pending",
    values: {
      party: "R. Hargreaves",
      role: "Vendor",
      property: "12-smith-st",
      engagement: "Sales campaign",
      method: "In person",
      documents: ["Driver licence"],
      docRef: "4821",
      checkedOn: "2026-11-05",
      checkedBy: "Alex Chen",
      outcome: "Pending",
      notes: "Copy of the licence still to be scanned.",
    },
    files: {},
    history: [
      hist("Alex Chen", "Recorded the entry. Outcome pending", "5 Nov"),
    ],
  },
  {
    id: "e-i2",
    registerId: "identity-checks",
    createdAt: "2026-10-02T13:00",
    createdBy: "Priya Nair",
    status: "Verified",
    values: {
      party: "A. Moretti",
      role: "Vendor",
      property: "15-wharf-rd",
      engagement: "Sales campaign",
      method: "In person",
      documents: ["Passport"],
      docRef: "7733",
      checkedOn: "2026-10-02",
      checkedBy: "Priya Nair",
      outcome: "Verified",
    },
    files: {
      evidence: {
        name: "id-check-moretti.pdf",
        size: 0,
        mime: "application/pdf",
        proofId: "",
      },
    },
    history: [hist("Priya Nair", "Recorded the entry. Verified", "2 Oct")],
  },
  {
    id: "e-o1",
    registerId: "open-homes",
    createdAt: "2026-11-07T10:00",
    createdBy: "Sam Taylor",
    status: "Recorded",
    values: {
      property: "12-smith-st",
      startAt: "2026-11-07T10:00",
      endAt: "2026-11-07T10:45",
      agent: "Sam Taylor",
      groups: "14",
      safety: true,
      notes: "Strong interest. Two groups asked for the contract.",
    },
    files: {
      signIn: {
        name: "sign-in-12-smith-st.jpg",
        size: 0,
        mime: "image/jpeg",
        proofId: "",
      },
    },
    history: [hist("Sam Taylor", "Recorded the entry", "Today 10:00")],
  },
];
