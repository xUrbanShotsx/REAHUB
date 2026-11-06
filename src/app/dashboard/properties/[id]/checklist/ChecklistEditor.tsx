"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import {
  Avatar,
  btnDark,
  btnLight,
  Card,
  Pill,
  Progress,
} from "@/components/app/ui";

export function ChecklistEditor({ id }: { id: string }) {
  const {
    properties,
    ready,
    toggleItem,
    addItem,
    removeItem,
    renameItem,
    saveTemplate,
    templates,
  } = useStore();
  const p = properties.find((x) => x.id === id);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [naming, setNaming] = useState(false);
  const [tplName, setTplName] = useState("");
  const [saved, setSaved] = useState("");

  if (!ready)
    return <p className="py-10 text-sm text-ink-soft">Loading checklist</p>;
  if (!p)
    return (
      <div className="py-10">
        <h1 className="font-display text-2xl font-extrabold">
          Property not found
        </h1>
        <Link href="/dashboard/properties" className={`${btnDark} mt-5`}>
          Back to properties
        </Link>
      </div>
    );

  const done = p.checklist.filter((c) => c.done).length;
  const total = p.checklist.length;

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    addItem(p.id, draft);
    setDraft("");
  };

  const startEdit = (itemId: string, text: string) => {
    setEditing(itemId);
    setEditText(text);
  };
  const commitEdit = () => {
    if (editing) renameItem(p.id, editing, editText);
    setEditing(null);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const name = tplName.trim();
    if (!name || total === 0) return;
    saveTemplate(
      name,
      p.type,
      p.checklist.map((c) => c.t),
    );
    setSaved(name);
    setNaming(false);
    setTplName("");
  };

  const userTemplates = templates.filter((t) => !t.builtIn);

  return (
    <>
      <Link
        href={`/dashboard/properties/${p.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <Icon name="arrow" className="h-4 w-4 rotate-180" /> {p.address}
      </Link>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Checklist
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {p.address}, {p.suburb} · started from {p.templateName}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setNaming((n) => !n)}
          disabled={total === 0}
          className={`${btnLight} disabled:opacity-50`}
        >
          <Icon name="file" className="h-4 w-4" /> Save as template
        </button>
      </div>

      {naming && (
        <form
          onSubmit={save}
          className="mb-5 flex flex-wrap items-end gap-3 rounded-2xl border border-accent/30 bg-accent/[0.06] p-4"
        >
          <label className="min-w-[14rem] flex-1 text-sm font-medium">
            Template name
            <input
              autoFocus
              value={tplName}
              onChange={(e) => setTplName(e.target.value)}
              placeholder="Off-market sale"
              className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm"
            />
          </label>
          <button type="submit" className={btnDark}>
            Save template
          </button>
          <button
            type="button"
            onClick={() => setNaming(false)}
            className={btnLight}
          >
            Cancel
          </button>
          <p className="w-full text-xs text-ink-soft">
            Saves the {total} items below, without their ticks, so you can pick
            it when you add another {p.type === "sale" ? "sale" : "management"}.
          </p>
        </form>
      )}

      {saved && (
        <p
          role="status"
          className="mb-5 flex items-center gap-2 rounded-xl bg-tint px-4 py-3 text-sm font-semibold"
        >
          <Icon name="check" className="h-4 w-4" /> Saved &ldquo;{saved}&rdquo;.
          It is now in the template list when you add a property.
        </p>
      )}

      <Card>
        <div className="flex items-center gap-4 border-b border-line px-5 py-4">
          <div className="flex-1">
            <div className="mb-1.5 flex justify-between text-xs text-ink-soft">
              <span>Progress</span>
              <span className="tabular-nums">
                {done} of {total} done
              </span>
            </div>
            <Progress pct={total ? Math.round((done / total) * 100) : 0} />
          </div>
        </div>

        {total === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-soft">
            Nothing on this checklist yet. Add the first item below.
          </p>
        ) : (
          <ul>
            {p.checklist.map((c) => (
              <li
                key={c.id}
                className="group flex items-center gap-3 border-b border-line px-5 py-3 last:border-0"
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={c.done}
                  aria-label={`${c.t}, mark ${c.done ? "not done" : "done"}`}
                  onClick={() => toggleItem(p.id, c.id)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] ${
                    c.done
                      ? "border-ink bg-ink text-bg"
                      : "border-ink-soft/50 hover:border-ink"
                  }`}
                >
                  {c.done && <Icon name="check" className="h-3 w-3" />}
                </button>

                {editing === c.id ? (
                  <input
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit();
                      if (e.key === "Escape") setEditing(null);
                    }}
                    aria-label="Edit item"
                    className="min-w-0 flex-1 rounded-md border border-ink bg-surface px-2 py-1 text-sm"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(c.id, c.t)}
                    title="Select to rename"
                    className={`min-w-0 flex-1 truncate text-left text-sm ${c.done ? "text-ink-soft line-through decoration-ink-soft/50" : "font-semibold"}`}
                  >
                    {c.t}
                  </button>
                )}

                {c.file && (
                  <span className="hidden items-center gap-1 rounded-md bg-tint px-2 py-1 text-[11px] font-medium text-ink-soft md:inline-flex">
                    <Icon name="clip" className="h-3 w-3" />
                    {c.file}
                  </span>
                )}
                {!c.done && c.due && <Pill tone="owed">{c.due}</Pill>}
                <Avatar initials={c.who} tone={c.done ? 2 : 0} />
                <button
                  type="button"
                  onClick={() => removeItem(p.id, c.id)}
                  aria-label={`Remove ${c.t}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-tint hover:text-ink"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={add}
          className="flex gap-2 border-t border-line bg-bg p-3"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add an item, for example Pool certificate"
            aria-label="New checklist item"
            className="min-w-0 flex-1 rounded-full border border-line bg-surface px-4 py-2.5 text-sm"
          />
          <button type="submit" className={btnDark} disabled={!draft.trim()}>
            <Icon name="plus" className="h-4 w-4" /> Add
          </button>
        </form>
      </Card>

      {userTemplates.length > 0 && (
        <p className="mt-5 text-sm text-ink-soft">
          Your templates: {userTemplates.map((t) => t.name).join(", ")}.
        </p>
      )}
    </>
  );
}
