"use client";

import { useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { btnDark, Card, CardHead } from "@/components/app/ui";

const field =
  "mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-ink focus:border-ink aria-[invalid=true]:border-ink aria-[invalid=true]:bg-accent/[0.06]";

const FIELDS = [
  {
    key: "name",
    label: "Agency name",
    help: "Shown across REAHUB.",
    required: true,
  },
  {
    key: "trading",
    label: "Registered business name",
    help: "Used on invoices.",
    required: true,
  },
  {
    key: "licenceNo",
    label: "Agency licence number",
    help: "The corporation licence, as issued by NSW Fair Trading.",
    required: true,
  },
  { key: "abn", label: "ABN", help: "11 digits.", required: true },
  { key: "address", label: "Office address", required: true, wide: true },
  { key: "phone", label: "Office phone", required: false },
] as const;

export function AgencySection() {
  const { settings, updateAgency } = useStore();
  // key remounts the form whenever the saved details change, so edits start from what is stored
  return (
    <AgencyForm
      key={JSON.stringify(settings.agency)}
      initial={settings.agency}
      onSave={updateAgency}
    />
  );
}

function AgencyForm({
  initial,
  onSave,
}: {
  initial: Record<string, string>;
  onSave: (patch: Record<string, string>) => void;
}) {
  const [draft, setDraft] = useState<Record<string, string>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found: Record<string, string> = {};
    for (const f of FIELDS)
      if (f.required && !draft[f.key]?.trim())
        found[f.key] = "This is required.";
    if (draft.abn && !/^\d{11}$/.test(draft.abn.replace(/\s/g, "")))
      found.abn = "An ABN has 11 digits.";
    setErrors(found);
    setSaved(false);
    if (Object.keys(found).length) return;
    const changed: Record<string, string> = {};
    for (const f of FIELDS)
      if (draft[f.key] !== initial[f.key]) changed[f.key] = draft[f.key].trim();
    if (Object.keys(changed).length) onSave(changed);
    setSaved(true);
  };

  return (
    <Card>
      <CardHead title="Agency details" sub="New South Wales" />
      <form onSubmit={submit} noValidate className="p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <label
              key={f.key}
              className={`text-sm font-medium ${"wide" in f && f.wide ? "sm:col-span-2" : ""}`}
            >
              {f.label}
              {!f.required && (
                <span className="font-normal text-ink-soft"> (optional)</span>
              )}
              <input
                value={draft[f.key] ?? ""}
                onChange={(e) => {
                  setDraft((d) => ({ ...d, [f.key]: e.target.value }));
                  setSaved(false);
                }}
                aria-invalid={errors[f.key] ? true : undefined}
                className={field}
              />
              {(errors[f.key] || ("help" in f && f.help)) && (
                <span
                  className={`mt-1 block text-xs ${errors[f.key] ? "font-semibold text-ink" : "font-normal text-ink-soft"}`}
                >
                  {errors[f.key] || ("help" in f ? f.help : "")}
                </span>
              )}
            </label>
          ))}
          <div className="sm:col-span-2">
            <p className="text-sm font-medium">State</p>
            <p className="mt-1.5 rounded-lg bg-tint px-3 py-2.5 text-sm text-ink-soft">
              New South Wales. Templates, checklists and rules follow NSW law.
              Other states open once their content has been reviewed.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="submit" className={btnDark}>
            Save changes
          </button>
          {saved && (
            <p
              role="status"
              className="flex items-center gap-1.5 text-sm font-semibold"
            >
              <Icon name="check" className="h-4 w-4" /> Saved
            </p>
          )}
        </div>
      </form>
    </Card>
  );
}
