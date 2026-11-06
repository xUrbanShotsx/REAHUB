"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  audit as seedAudit,
  initialsOf,
  me,
  properties as seedProperties,
  STATUSES,
  templates as seedTemplates,
  seedDiary,
  seedEvents,
  seedMeetings,
  tasks as seedTasks,
  seedMembers,
  seedSettings,
  PLANS,
  type AuditEvent,
  type CalEvent,
  type DiaryEntry,
  type Meeting,
  type Task,
  type TaskStatus,
  type Member,
  type PlanName,
  type Settings,
  type Property,
  type PropertyType,
  type Template,
} from "@/lib/demo-data";
import { clearProofs, deleteProof, putProof } from "@/lib/proofs";
import {
  autoMatchPairs,
  cents,
  ledgers,
  lockedUntil,
  money,
  nextRef,
  seedTrust,
  summarise,
  type AccountId,
  type BankLine,
  type EntryKind,
  type ParsedLine,
  type TrustEntry,
  type TrustState,
} from "@/lib/trust";
import {
  addYears,
  seedAccreditations,
  type Accreditation,
  type CpdEntry,
  type Renewal,
} from "@/lib/accreditations";
import {
  registerById,
  seedEntries,
  type EntryFile,
  type RegisterEntry,
  type Values,
} from "@/lib/registers";

const KEY = "reahub-demo-v7";

type Saved = {
  properties: Property[];
  templates: Template[];
  entries: RegisterEntry[];
  audit: AuditEvent[];
  accreditations: Accreditation[];
  members: Member[];
  settings: Settings;
  tasks: Task[];
  events: CalEvent[];
  meetings: Meeting[];
  diary: DiaryEntry[];
  trust: TrustState;
};
const SEED: Saved = {
  properties: seedProperties,
  templates: seedTemplates,
  entries: seedEntries,
  audit: seedAudit,
  accreditations: seedAccreditations,
  members: seedMembers,
  settings: seedSettings,
  tasks: seedTasks,
  events: seedEvents,
  meetings: seedMeetings,
  diary: seedDiary,
  trust: seedTrust,
};

export type NewProperty = {
  type: PropertyType;
  address: string;
  suburb: string;
  owner: string;
  price: string;
  agent: string;
  templateId: string;
};

type Files = Record<string, File | undefined>;

type Store = {
  ready: boolean;
  properties: Property[];
  templates: Template[];
  entries: RegisterEntry[];
  audit: AuditEvent[];
  accreditations: Accreditation[];
  members: Member[];
  settings: Settings;
  tasks: Task[];
  events: CalEvent[];
  meetings: Meeting[];
  diary: DiaryEntry[];
  trust: TrustState;
  addProperty: (input: NewProperty) => string;
  updateProperty: (id: string, patch: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  attachProof: (pid: string, itemId: string, file: File) => Promise<void>;
  removeProof: (pid: string, itemId: string) => void;
  addItem: (pid: string, text: string) => void;
  removeItem: (pid: string, itemId: string) => void;
  renameItem: (pid: string, itemId: string, text: string) => void;
  saveTemplate: (name: string, type: PropertyType, items: string[]) => Template;
  deleteTemplate: (id: string) => void;
  addEntry: (
    registerId: string,
    values: Values,
    files: Files,
  ) => Promise<string>;
  applyAction: (
    entryId: string,
    actionId: string,
    values: Values,
    files: Files,
  ) => Promise<void>;
  addAccreditation: (values: Values, files: Files) => Promise<string>;
  addCpd: (id: string, values: Values, files: Files) => Promise<void>;
  recordRenewal: (id: string, values: Values, files: Files) => Promise<void>;
  startNextCpdYear: (id: string) => void;
  updateAgency: (patch: Partial<Settings["agency"]>) => void;
  setPlan: (plan: PlanName) => void;
  setNotify: (patch: Partial<Settings["notify"]>) => void;
  inviteMember: (input: Omit<Member, "id" | "status" | "lastActive">) => void;
  updateMember: (id: string, patch: Partial<Member>) => void;
  dropMember: (id: string) => void;
  addTask: (input: {
    t: string;
    assignee: string;
    due?: string;
    where?: string;
    from?: Task["from"];
    meetingId?: string;
  }) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  dropTask: (id: string) => void;
  addEvent: (input: Omit<CalEvent, "id">) => void;
  dropEvent: (id: string) => void;
  addMeeting: (input: Omit<Meeting, "id">) => string;
  addDiary: (input: Omit<DiaryEntry, "id" | "time">) => void;
  dropDiary: (id: string) => void;
  addTrustEntry: (input: NewTrustEntry) => string;
  importStatement: (account: AccountId, lines: ParsedLine[]) => number;
  matchLine: (lineId: string, entryId: string) => void;
  unmatchLine: (lineId: string) => void;
  autoMatch: (account: AccountId) => number;
  recordFromLine: (
    lineId: string,
    input: Omit<NewTrustEntry, "account" | "kind" | "amount" | "date">,
  ) => void;
  signReconciliation: (
    account: AccountId,
    periodEnd: string,
    statementClosing: number,
  ) => void;
  resetDemo: () => void;
};

export type NewTrustEntry = {
  account: AccountId;
  kind: EntryKind;
  date: string;
  propertyId: string;
  party: string;
  amount: number;
  method: string;
  authority?: string;
  authorityRef?: string;
  payee?: string;
  narration: string;
};

/* ---- a tiny external store over localStorage, so state survives navigation and reloads ---- */

const listeners = new Set<() => void>();
let cacheRaw: string | null | undefined;
let cacheVal: Saved | null = null;

function readSaved(): Saved | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // blocked storage: stay on the in-memory copy
    return cacheVal;
  }
  if (raw === cacheRaw) return cacheVal;
  cacheRaw = raw;
  try {
    const p = raw ? (JSON.parse(raw) as Saved) : null;
    cacheVal =
      p &&
      Array.isArray(p.properties) &&
      Array.isArray(p.templates) &&
      Array.isArray(p.entries) &&
      Array.isArray(p.accreditations) &&
      Array.isArray(p.members) &&
      !!p.settings &&
      Array.isArray(p.tasks) &&
      Array.isArray(p.events) &&
      Array.isArray(p.meetings) &&
      Array.isArray(p.diary) &&
      !!p.trust &&
      Array.isArray(p.trust.entries) &&
      Array.isArray(p.audit)
        ? p
        : null;
  } catch {
    cacheVal = null;
  }
  return cacheVal;
}

function writeSaved(next: Saved) {
  cacheVal = next;
  try {
    const raw = JSON.stringify(next);
    localStorage.setItem(KEY, raw);
    cacheRaw = raw;
  } catch {
    // storage full or blocked: the demo still works for this visit
    cacheRaw = undefined;
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

const current = (): Saved => readSaved() ?? cacheVal ?? SEED;
const update = (fn: (s: Saved) => Saved) => writeSaved(fn(current()));

const uid = () =>
  Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const nowTime = () =>
  new Date().toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

function event(
  area: AuditEvent["area"],
  act: string,
  from: string,
  to: string,
): AuditEvent {
  return {
    t: nowTime(),
    day: "Today",
    who: me.initials,
    name: me.name,
    act,
    from,
    to,
    area,
  };
}
const withEvent = (s: Saved, e: AuditEvent): Saved => ({
  ...s,
  audit: [e, ...s.audit],
});

const patchProperty = (id: string, fn: (p: Property) => Property) =>
  update((s) => ({
    ...s,
    properties: s.properties.map((p) => (p.id === id ? fn(p) : p)),
  }));

const findItem = (pid: string, itemId: string) =>
  current()
    .properties.find((p) => p.id === pid)
    ?.checklist.find((c) => c.id === itemId);

async function storeFiles(files: Files): Promise<Record<string, EntryFile>> {
  const out: Record<string, EntryFile> = {};
  for (const [name, file] of Object.entries(files)) {
    if (!file) continue;
    const proofId = uid();
    await putProof(proofId, file);
    out[name] = { name: file.name, size: file.size, mime: file.type, proofId };
  }
  return out;
}

const actions: Omit<
  Store,
  | "ready"
  | "properties"
  | "templates"
  | "entries"
  | "audit"
  | "accreditations"
  | "tasks"
  | "events"
  | "meetings"
  | "diary"
  | "trust"
  | "members"
  | "settings"
> = {
  addProperty: (input) => {
    const tpl = current().templates.find((t) => t.id === input.templateId);
    const id = `${slug(input.address) || "property"}-${uid()}`;
    const initials = initialsOf(input.agent);
    const property: Property = {
      id,
      type: input.type,
      address: input.address.trim(),
      suburb: input.suburb.trim(),
      status: STATUSES[input.type][0],
      agent: input.agent,
      owner: input.owner.trim(),
      price: input.price.trim(),
      note: "Added today",
      templateName: tpl?.name ?? "Start blank",
      createdAt: "Today",
      checklist: (tpl?.items ?? []).map((t) => ({
        id: uid(),
        t,
        who: initials,
        done: false,
      })),
    };
    update((s) =>
      withEvent(
        { ...s, properties: [property, ...s.properties] },
        event(
          "Properties",
          `added ${property.address} with the ${property.templateName} checklist`,
          "No file",
          "Property file",
        ),
      ),
    );
    return id;
  },

  updateProperty: (id, patch) => patchProperty(id, (p) => ({ ...p, ...patch })),

  deleteProperty: (id) => {
    current()
      .properties.find((p) => p.id === id)
      ?.checklist.forEach(
        (c) => c.proofId && deleteProof(c.proofId).catch(() => {}),
      );
    update((s) => ({
      ...s,
      properties: s.properties.filter((p) => p.id !== id),
    }));
  },

  attachProof: async (pid, itemId, file) => {
    const proofId = uid();
    await putProof(proofId, file);
    const old = findItem(pid, itemId);
    if (old?.proofId) deleteProof(old.proofId).catch(() => {});
    update((s) => {
      const prop = s.properties.find((p) => p.id === pid);
      const next: Saved = {
        ...s,
        properties: s.properties.map((p) =>
          p.id !== pid
            ? p
            : {
                ...p,
                checklist: p.checklist.map((c) =>
                  c.id === itemId
                    ? {
                        ...c,
                        done: true,
                        file: file.name,
                        proofId,
                        size: file.size,
                        mime: file.type,
                        addedAt: "Today",
                      }
                    : c,
                ),
              },
        ),
      };
      return withEvent(
        next,
        event(
          "Properties",
          `completed "${old?.t ?? "an item"}" on ${prop?.address ?? "a property"} with proof`,
          "Owed",
          file.name,
        ),
      );
    });
  },

  removeProof: (pid, itemId) => {
    const old = findItem(pid, itemId);
    if (old?.proofId) deleteProof(old.proofId).catch(() => {});
    update((s) => {
      const prop = s.properties.find((p) => p.id === pid);
      const next: Saved = {
        ...s,
        properties: s.properties.map((p) =>
          p.id !== pid
            ? p
            : {
                ...p,
                checklist: p.checklist.map((c) =>
                  c.id === itemId
                    ? {
                        ...c,
                        done: false,
                        file: undefined,
                        proofId: undefined,
                        size: undefined,
                        mime: undefined,
                        addedAt: undefined,
                      }
                    : c,
                ),
              },
        ),
      };
      return withEvent(
        next,
        event(
          "Properties",
          `removed the proof for "${old?.t ?? "an item"}" on ${prop?.address ?? "a property"}`,
          old?.file ?? "Done",
          "Owed",
        ),
      );
    });
  },

  addItem: (pid, text) =>
    patchProperty(pid, (p) => ({
      ...p,
      checklist: [
        ...p.checklist,
        { id: uid(), t: text.trim(), who: initialsOf(p.agent), done: false },
      ],
    })),

  removeItem: (pid, itemId) => {
    const old = findItem(pid, itemId);
    if (old?.proofId) deleteProof(old.proofId).catch(() => {});
    patchProperty(pid, (p) => ({
      ...p,
      checklist: p.checklist.filter((c) => c.id !== itemId),
    }));
  },

  renameItem: (pid, itemId, text) =>
    patchProperty(pid, (p) => ({
      ...p,
      checklist: p.checklist.map((c) =>
        c.id === itemId ? { ...c, t: text.trim() || c.t } : c,
      ),
    })),

  saveTemplate: (name, type, items) => {
    const tpl: Template = {
      id: `tpl-${uid()}`,
      name: name.trim(),
      type,
      items,
    };
    update((s) => ({ ...s, templates: [...s.templates, tpl] }));
    return tpl;
  },

  deleteTemplate: (id) =>
    update((s) => ({
      ...s,
      templates: s.templates.filter((t) => t.id !== id),
    })),

  addEntry: async (registerId, values, files) => {
    const def = registerById(registerId);
    if (!def) throw new Error("Unknown register");
    const stored = await storeFiles(files);
    const status = def.status(values);
    const entry: RegisterEntry = {
      id: `e-${uid()}`,
      registerId,
      createdAt: new Date().toISOString().slice(0, 16),
      createdBy: me.name,
      status,
      values,
      files: stored,
      history: [
        {
          at: `Today ${nowTime()}`,
          by: me.name,
          act:
            status === def.statuses[0]
              ? "Recorded the entry"
              : `Recorded the entry as ${status}`,
        },
      ],
    };
    update((s) =>
      withEvent(
        { ...s, entries: [entry, ...s.entries] },
        event(
          "Registers",
          `added an entry to the ${def.name} register`,
          "No entry",
          status,
        ),
      ),
    );
    return entry.id;
  },

  applyAction: async (entryId, actionId, values, files) => {
    const entry = current().entries.find((e) => e.id === entryId);
    const def = entry && registerById(entry.registerId);
    const action = def?.actions.find((a) => a.id === actionId);
    if (!entry || !def || !action) throw new Error("Unknown action");
    const stored = await storeFiles(files);
    const to =
      typeof action.to === "string"
        ? action.to
        : String(values[action.to.fromField] ?? entry.status);
    update((s) =>
      withEvent(
        {
          ...s,
          entries: s.entries.map((e) =>
            e.id !== entryId
              ? e
              : {
                  ...e,
                  status: to,
                  values: { ...e.values, ...values },
                  files: { ...e.files, ...stored },
                  history: [
                    ...e.history,
                    {
                      at: `Today ${nowTime()}`,
                      by: me.name,
                      act: `${action.label}: now ${to}`,
                    },
                  ],
                },
          ),
        },
        event(
          "Registers",
          `${action.label.toLowerCase()} in the ${def.name} register`,
          entry.status,
          to,
        ),
      ),
    );
  },

  addAccreditation: async (values, files) => {
    const stored = await storeFiles(files);
    const num = Number(values.cpdRequired);
    const acc: Accreditation = {
      id: `acc-${uid()}`,
      person: String(values.person),
      type: String(values.type),
      typeOther: values.typeOther ? String(values.typeOther) : undefined,
      number: values.number ? String(values.number) : undefined,
      issuedBy: String(values.issuedBy),
      acquiredOn: String(values.acquiredOn),
      expiresOn: String(values.expiresOn),
      cpdRequired: Number.isFinite(num) && num > 0 ? num : 0,
      cpdYearEnd: values.cpdYearEnd
        ? String(values.cpdYearEnd)
        : String(values.expiresOn),
      file: stored.file,
      cpdLog: [],
      renewals: [],
    };
    update((s) =>
      withEvent(
        { ...s, accreditations: [acc, ...s.accreditations] },
        event(
          "Registers",
          `added the ${acc.type === "Other" ? acc.typeOther : acc.type} for ${acc.person}`,
          "No record",
          `Expires ${acc.expiresOn}`,
        ),
      ),
    );
    return acc.id;
  },

  addCpd: async (id, values, files) => {
    const stored = await storeFiles(files);
    const entry: CpdEntry = {
      id: uid(),
      date: String(values.date),
      activity: String(values.activity),
      provider: String(values.provider),
      category: String(values.category),
      hours: Number(values.hours),
      file: stored.file,
    };
    const acc = current().accreditations.find((a) => a.id === id);
    update((s) =>
      withEvent(
        {
          ...s,
          accreditations: s.accreditations.map((a) =>
            a.id === id
              ? {
                  ...a,
                  cpdLog: [entry, ...a.cpdLog].sort((x, y) =>
                    y.date.localeCompare(x.date),
                  ),
                }
              : a,
          ),
        },
        event(
          "Registers",
          `logged ${entry.hours} CPD hours for ${acc?.person ?? "a team member"}`,
          "CPD",
          entry.activity,
        ),
      ),
    );
  },

  recordRenewal: async (id, values, files) => {
    const stored = await storeFiles(files);
    const renewal: Renewal = {
      id: uid(),
      renewedOn: String(values.renewedOn),
      newExpiry: String(values.newExpiry),
      reference: values.reference ? String(values.reference) : undefined,
      by: me.name,
      file: stored.file,
    };
    const acc = current().accreditations.find((a) => a.id === id);
    update((s) =>
      withEvent(
        {
          ...s,
          accreditations: s.accreditations.map((a) =>
            a.id === id
              ? {
                  ...a,
                  expiresOn: renewal.newExpiry,
                  renewals: [renewal, ...a.renewals],
                }
              : a,
          ),
        },
        event(
          "Registers",
          `renewed the ${acc ? acc.type : "accreditation"} for ${acc?.person ?? "a team member"}`,
          acc?.expiresOn ?? "Expiring",
          `Expires ${renewal.newExpiry}`,
        ),
      ),
    );
  },

  startNextCpdYear: (id) =>
    update((s) => ({
      ...s,
      accreditations: s.accreditations.map((a) =>
        a.id === id ? { ...a, cpdYearEnd: addYears(a.cpdYearEnd, 1) } : a,
      ),
    })),

  updateAgency: (patch) =>
    update((s) =>
      withEvent(
        {
          ...s,
          settings: {
            ...s.settings,
            agency: { ...s.settings.agency, ...patch },
          },
        },
        event(
          "Settings",
          "updated the agency details",
          "Details",
          Object.keys(patch).join(", "),
        ),
      ),
    ),

  setPlan: (plan) =>
    update((s) => {
      const from = s.settings.plan;
      return withEvent(
        { ...s, settings: { ...s.settings, plan } },
        event(
          "Settings",
          `changed the plan to ${plan} (A$${PLANS[plan].price} a month + GST)`,
          from,
          plan,
        ),
      );
    }),

  setNotify: (patch) =>
    update((s) => ({
      ...s,
      settings: { ...s.settings, notify: { ...s.settings.notify, ...patch } },
    })),

  inviteMember: (input) =>
    update((s) =>
      withEvent(
        {
          ...s,
          members: [
            ...s.members,
            {
              ...input,
              id: `m-${uid()}`,
              status: "Invited",
              lastActive: "Not yet",
            },
          ],
        },
        event(
          "Settings",
          `invited ${input.name} as ${input.access}`,
          "No access",
          input.access,
        ),
      ),
    ),

  updateMember: (id, patch) =>
    update((s) => {
      const m = s.members.find((x) => x.id === id);
      const next = {
        ...s,
        members: s.members.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      };
      return patch.access && m
        ? withEvent(
            next,
            event(
              "Settings",
              `changed ${m.name}'s access`,
              m.access,
              patch.access,
            ),
          )
        : next;
    }),

  dropMember: (id) =>
    update((s) => {
      const m = s.members.find((x) => x.id === id);
      const next = { ...s, members: s.members.filter((x) => x.id !== id) };
      return m
        ? withEvent(
            next,
            event(
              "Settings",
              `took ${m.name} off the agency`,
              m.access,
              "No access",
            ),
          )
        : next;
    }),

  addTask: (input) =>
    update((s) => ({
      ...s,
      tasks: [
        {
          id: `t-${uid()}`,
          t: input.t.trim(),
          from: input.from ?? "By hand",
          status: "Open",
          where: input.where?.trim() || "General",
          assignee: input.assignee,
          due: input.due || undefined,
          meetingId: input.meetingId,
        },
        ...s.tasks,
      ],
    })),

  setTaskStatus: (id, status) =>
    update((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    })),

  dropTask: (id) =>
    update((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),

  addEvent: (input) =>
    update((s) => ({
      ...s,
      events: [...s.events, { ...input, id: `ev-${uid()}` }],
    })),

  dropEvent: (id) =>
    update((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) })),

  addMeeting: (input) => {
    const id = `mt-${uid()}`;
    update((s) => ({ ...s, meetings: [{ ...input, id }, ...s.meetings] }));
    return id;
  },

  addDiary: (input) =>
    update((s) => ({
      ...s,
      diary: [{ ...input, id: `d-${uid()}`, time: nowTime() }, ...s.diary],
    })),

  dropDiary: (id) =>
    update((s) => ({ ...s, diary: s.diary.filter((d) => d.id !== id) })),

  addTrustEntry: (input) => {
    const t = current().trust;
    const lock = lockedUntil(t, input.account);
    if (input.date <= lock)
      throw new Error(
        `That period is signed. Entries must be dated after ${lock}.`,
      );
    if (input.kind === "payment") {
      const held =
        ledgers(t, input.account).find(
          (l) => l.propertyId === input.propertyId && l.party === input.party,
        )?.balance ?? 0;
      if (cents(input.amount) > cents(held))
        throw new Error(
          `Only ${money(held)} is held for that client, so ${money(input.amount)} cannot be paid out.`,
        );
    }
    const entry: TrustEntry = {
      id: `te-${uid()}`,
      account: input.account,
      kind: input.kind,
      date: input.date,
      ref: nextRef(t, input.kind),
      propertyId: input.propertyId,
      party: input.party,
      amount: input.amount,
      method: input.method,
      engagement:
        input.account === "sales" ? "Sales campaign" : "Management period",
      authority: input.authority,
      authorityRef: input.authorityRef,
      payee: input.payee,
      narration: input.narration,
      by: me.name,
    };
    update((s) =>
      withEvent(
        { ...s, trust: { ...s.trust, entries: [entry, ...s.trust.entries] } },
        event(
          "Trust",
          `${input.kind === "receipt" ? "receipted" : "paid out"} ${money(input.amount)} (${entry.ref})`,
          "No entry",
          entry.ref,
        ),
      ),
    );
    return entry.id;
  },

  importStatement: (account, lines) => {
    const have = new Set(
      current()
        .trust.lines.filter((l) => l.account === account)
        .map((l) => `${l.date}|${l.description}|${cents(l.amount)}`),
    );
    const fresh: BankLine[] = lines
      .filter((l) => !have.has(`${l.date}|${l.description}|${cents(l.amount)}`))
      .map((l) => ({
        id: `bl-${uid()}`,
        account,
        date: l.date,
        description: l.description,
        amount: l.amount,
        balance: l.balance,
      }));
    if (fresh.length)
      update((s) =>
        withEvent(
          { ...s, trust: { ...s.trust, lines: [...s.trust.lines, ...fresh] } },
          event(
            "Trust",
            `imported ${fresh.length} bank statement lines`,
            "No lines",
            `${fresh.length} lines`,
          ),
        ),
      );
    return fresh.length;
  },

  matchLine: (lineId, entryId) =>
    update((s) => ({
      ...s,
      trust: {
        ...s.trust,
        lines: s.trust.lines.map((l) =>
          l.id === lineId ? { ...l, entryId } : l,
        ),
        entries: s.trust.entries.map((e) =>
          e.id === entryId ? { ...e, lineId } : e,
        ),
      },
    })),

  unmatchLine: (lineId) =>
    update((s) => {
      const line = s.trust.lines.find((l) => l.id === lineId);
      const entry = s.trust.entries.find((e) => e.id === line?.entryId);
      if (!line || !entry || entry.reconId) return s;
      return {
        ...s,
        trust: {
          ...s.trust,
          lines: s.trust.lines.map((l) =>
            l.id === lineId ? { ...l, entryId: undefined } : l,
          ),
          entries: s.trust.entries.map((e) =>
            e.id === entry.id ? { ...e, lineId: undefined } : e,
          ),
        },
      };
    }),

  autoMatch: (account) => {
    const pairs = autoMatchPairs(current().trust, account);
    if (!pairs.length) return 0;
    update((s) => {
      const byLine = new Map(pairs.map((p) => [p.lineId, p.entryId]));
      const byEntry = new Map(pairs.map((p) => [p.entryId, p.lineId]));
      return withEvent(
        {
          ...s,
          trust: {
            ...s.trust,
            lines: s.trust.lines.map((l) =>
              byLine.has(l.id) ? { ...l, entryId: byLine.get(l.id) } : l,
            ),
            entries: s.trust.entries.map((e) =>
              byEntry.has(e.id) ? { ...e, lineId: byEntry.get(e.id) } : e,
            ),
          },
        },
        event(
          "Trust",
          `matched ${pairs.length} bank lines to the cash book`,
          "Unmatched",
          "Matched",
        ),
      );
    });
    return pairs.length;
  },

  recordFromLine: (lineId, input) => {
    const t = current().trust;
    const line = t.lines.find((l) => l.id === lineId);
    if (!line) return;
    const kind: EntryKind = line.amount > 0 ? "receipt" : "payment";
    const id = actions.addTrustEntry({
      ...input,
      account: line.account,
      kind,
      amount: Math.abs(line.amount),
      date: line.date,
    });
    actions.matchLine(lineId, id);
  },

  signReconciliation: (account, periodEnd, statementClosing) => {
    const t = current().trust;
    const sum = summarise(t, account, periodEnd, statementClosing);
    if (!sum.canSign) throw new Error(sum.blockers[0]);
    const id = `rc-${uid()}`;
    update((s) =>
      withEvent(
        {
          ...s,
          trust: {
            ...s.trust,
            entries: s.trust.entries.map((e) =>
              e.account === account && e.date <= periodEnd && !e.reconId
                ? { ...e, reconId: id }
                : e,
            ),
            recons: [
              {
                id,
                account,
                periodEnd,
                statementClosing,
                cashBook: sum.cashBook,
                outstandingDeposits: sum.outstandingDeposits,
                outstandingPayments: sum.outstandingPayments,
                difference: sum.difference,
                signedBy: me.name,
                signedAt: new Date().toISOString().slice(0, 16),
                entryCount: sum.entriesInPeriod,
              },
              ...s.trust.recons,
            ],
          },
        },
        event(
          "Trust",
          `signed and locked the ${account} reconciliation to ${periodEnd}`,
          "Draft",
          "Locked",
        ),
      ),
    );
  },

  resetDemo: () => {
    clearProofs().catch(() => {});
    writeSaved(SEED);
  },
};

const Ctx = createContext<Store | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const saved = useSyncExternalStore(subscribe, readSaved, () => null);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const state = saved ?? SEED;

  const value = useMemo<Store>(
    () => ({
      ready,
      properties: state.properties,
      templates: state.templates,
      entries: state.entries,
      audit: state.audit,
      accreditations: state.accreditations,
      members: state.members,
      settings: state.settings,
      tasks: state.tasks,
      events: state.events,
      meetings: state.meetings,
      diary: state.diary,
      trust: state.trust,
      ...actions,
    }),
    [ready, state],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside DemoStoreProvider");
  return v;
}
