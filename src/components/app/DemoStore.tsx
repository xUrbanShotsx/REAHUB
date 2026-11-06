"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  initialsOf,
  properties as seedProperties,
  STATUSES,
  templates as seedTemplates,
  type Property,
  type PropertyType,
  type Template,
} from "@/lib/demo-data";
import { clearProofs, deleteProof, putProof } from "@/lib/proofs";

const KEY = "reahub-demo-v2";

type Saved = { properties: Property[]; templates: Template[] };
const SEED: Saved = { properties: seedProperties, templates: seedTemplates };

export type NewProperty = {
  type: PropertyType;
  address: string;
  suburb: string;
  owner: string;
  price: string;
  agent: string;
  templateId: string;
};

type Store = {
  ready: boolean;
  properties: Property[];
  templates: Template[];
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
    const parsed = raw ? (JSON.parse(raw) as Saved) : null;
    cacheVal =
      parsed &&
      Array.isArray(parsed.properties) &&
      Array.isArray(parsed.templates)
        ? parsed
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

const patchProperty = (id: string, fn: (p: Property) => Property) =>
  update((s) => ({
    ...s,
    properties: s.properties.map((p) => (p.id === id ? fn(p) : p)),
  }));

const actions: Omit<Store, "ready" | "properties" | "templates"> = {
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
    update((s) => ({ ...s, properties: [property, ...s.properties] }));
    return id;
  },

  updateProperty: (id, patch) => patchProperty(id, (p) => ({ ...p, ...patch })),

  deleteProperty: (id) =>
    update((s) => ({
      ...s,
      properties: s.properties.filter((p) => p.id !== id),
    })),

  attachProof: async (pid, itemId, file) => {
    const proofId = uid();
    await putProof(proofId, file);
    // replacing proof frees the old file
    const old = current()
      .properties.find((p) => p.id === pid)
      ?.checklist.find((c) => c.id === itemId)?.proofId;
    if (old) deleteProof(old).catch(() => {});
    patchProperty(pid, (p) => ({
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
    }));
  },

  removeProof: (pid, itemId) => {
    const old = current()
      .properties.find((p) => p.id === pid)
      ?.checklist.find((c) => c.id === itemId)?.proofId;
    if (old) deleteProof(old).catch(() => {});
    patchProperty(pid, (p) => ({
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
    }));
  },

  addItem: (pid, text) =>
    patchProperty(pid, (p) => ({
      ...p,
      checklist: [
        ...p.checklist,
        { id: uid(), t: text.trim(), who: initialsOf(p.agent), done: false },
      ],
    })),

  removeItem: (pid, itemId) =>
    patchProperty(pid, (p) => ({
      ...p,
      checklist: p.checklist.filter((c) => c.id !== itemId),
    })),

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
