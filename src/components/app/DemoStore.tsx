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
  type AuditEvent,
  type Property,
  type PropertyType,
  type Template,
} from "@/lib/demo-data";
import { clearProofs, deleteProof, putProof } from "@/lib/proofs";
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

const KEY = "reahub-demo-v4";

type Saved = {
  properties: Property[];
  templates: Template[];
  entries: RegisterEntry[];
  audit: AuditEvent[];
  accreditations: Accreditation[];
};
const SEED: Saved = {
  properties: seedProperties,
  templates: seedTemplates,
  entries: seedEntries,
  audit: seedAudit,
  accreditations: seedAccreditations,
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
  resetDemo: () => void;
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
  "ready" | "properties" | "templates" | "entries" | "audit" | "accreditations"
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
