"use client";

import { useState } from "react";
import { nowLocal, todayISO } from "@/lib/format";
import { MAX_PROOF_BYTES, ACCEPT, formatSize } from "@/lib/proofs";
import {
  isRequired,
  isVisible,
  validate,
  type Field,
  type Values,
} from "@/lib/registers";
import { me, team } from "@/lib/demo-data";
import { useStore } from "./DemoStore";
import { btnDark, btnLight } from "./ui";

const input =
  "mt-1.5 w-full rounded-lg border bg-bg px-3 py-2.5 text-sm text-ink focus:border-ink aria-[invalid=true]:border-ink aria-[invalid=true]:bg-accent/[0.06]";

const BLANK_DATE = [
  "docExpiry",
  "followDue",
  "acquiredOn",
  "expiresOn",
  "newExpiry",
  "cpdYearEnd",
  "due",
];
const BLANK_DATETIME = ["expectedBack", "endAt"];
const DEFAULT_ME = [
  "recordedBy",
  "checkedBy",
  "receivedBy",
  "closedBy",
  "disclosedBy",
  "assignee",
];

function initial(fields: Field[]): Values {
  const v: Values = {};
  for (const f of fields) {
    if (f.type === "date")
      v[f.name] = BLANK_DATE.includes(f.name) ? "" : todayISO();
    else if (f.type === "datetime")
      v[f.name] = BLANK_DATETIME.includes(f.name) ? "" : nowLocal();
    else if (f.type === "person")
      v[f.name] = DEFAULT_ME.includes(f.name) ? me.name : "";
    else if (f.type === "check") v[f.name] = false;
    else if (f.type === "checks") v[f.name] = [];
    else v[f.name] = "";
  }
  return v;
}

export function RegisterForm({
  fields,
  submitLabel,
  intro,
  onSubmit,
  onCancel,
  defaults,
}: {
  fields: Field[];
  defaults?: Values;
  submitLabel: string;
  intro?: string;
  onSubmit: (
    values: Values,
    files: Record<string, File | undefined>,
  ) => Promise<void>;
  onCancel: () => void;
}) {
  const { properties } = useStore();
  const [values, setValues] = useState<Values>(() => ({
    ...initial(fields),
    ...defaults,
  }));
  const [files, setFiles] = useState<Record<string, File | undefined>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [fail, setFail] = useState("");

  const set = (name: string, val: string | string[] | boolean) => {
    setValues((v) => ({ ...v, [name]: val }));
    setErrors((e) => (e[name] ? { ...e, [name]: "" } : e));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(fields, values, files);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`field-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    // drop values for fields that are not in play, so nothing stale is saved
    const clean: Values = {};
    for (const f of fields)
      if (isVisible(f, values) && f.type !== "file")
        clean[f.name] = values[f.name];
    const keep: Record<string, File | undefined> = {};
    for (const f of fields)
      if (isVisible(f, values)) keep[f.name] = files[f.name];
    setSaving(true);
    setFail("");
    try {
      await onSubmit(clean, keep);
    } catch {
      setFail(
        "Could not save. This browser may have blocked storage for the file. Try again.",
      );
      setSaving(false);
    }
  };

  const shown = fields.filter((f) => isVisible(f, values));

  return (
    <form onSubmit={submit} noValidate>
      {intro && <p className="mb-4 text-sm text-ink-soft">{intro}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {shown.map((f) => {
          const id = `field-${f.name}`;
          const err = errors[f.name];
          const req = isRequired(f, values);
          const wrap = `${f.wide || f.type === "textarea" || f.type === "checks" ? "sm:col-span-2" : ""}`;
          const label = (
            <span className="text-sm font-medium">
              {f.label}
              {req ? (
                <span className="text-ink-soft"> *</span>
              ) : (
                <span className="font-normal text-ink-soft"> (optional)</span>
              )}
            </span>
          );
          const common = {
            id,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": f.help || err ? `${id}-note` : undefined,
          } as const;
          const val = values[f.name];

          return (
            <div key={f.name} className={wrap}>
              {f.type === "checks" ? (
                <fieldset id={id} tabIndex={-1}>
                  <legend>{label}</legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {f.options?.map((o) => {
                      const on = Array.isArray(val) && val.includes(o);
                      return (
                        <label
                          key={o}
                          className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm ${on ? "border-ink bg-accent/[0.08]" : "border-line"}`}
                        >
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() =>
                              set(
                                f.name,
                                on
                                  ? (val as string[]).filter((x) => x !== o)
                                  : [...(Array.isArray(val) ? val : []), o],
                              )
                            }
                          />
                          {o}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ) : f.type === "check" ? (
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 text-sm ${val ? "border-ink bg-accent/[0.08]" : "border-line"}`}
                >
                  <input
                    {...common}
                    type="checkbox"
                    checked={val === true}
                    onChange={(e) => set(f.name, e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="font-medium">{f.label}</span>
                    {req && <span className="text-ink-soft"> *</span>}
                  </span>
                </label>
              ) : (
                <label className="block">
                  {label}
                  {f.type === "textarea" ? (
                    <textarea
                      {...common}
                      rows={3}
                      value={String(val)}
                      onChange={(e) => set(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      className={`${input} ${err ? "border-ink" : "border-line"}`}
                    />
                  ) : f.type === "select" ||
                    f.type === "person" ||
                    f.type === "property" ? (
                    <select
                      {...common}
                      value={String(val)}
                      onChange={(e) => set(f.name, e.target.value)}
                      className={`${input} ${err ? "border-ink" : "border-line"}`}
                    >
                      <option value="">{req ? "Choose" : "None"}</option>
                      {f.type === "select" &&
                        f.options?.map((o) => <option key={o}>{o}</option>)}
                      {f.type === "person" &&
                        team.map((m) => <option key={m.name}>{m.name}</option>)}
                      {f.type === "property" && (
                        <>
                          {properties.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.address}, {p.suburb}
                            </option>
                          ))}
                          <option value="office">
                            Office, not at a property
                          </option>
                        </>
                      )}
                    </select>
                  ) : f.type === "file" ? (
                    <span className="mt-1.5 flex flex-wrap items-center gap-3">
                      <input
                        {...common}
                        type="file"
                        accept={ACCEPT}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.size > MAX_PROOF_BYTES) {
                            setErrors((x) => ({
                              ...x,
                              [f.name]: "That file is over 10 MB.",
                            }));
                            e.target.value = "";
                            return;
                          }
                          setFiles((x) => ({ ...x, [f.name]: file }));
                          setErrors((x) => ({ ...x, [f.name]: "" }));
                        }}
                        className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-tint file:px-4 file:py-2 file:text-sm file:font-semibold"
                      />
                      {files[f.name] && (
                        <span className="text-xs text-ink-soft">
                          {formatSize(files[f.name]!.size)}
                        </span>
                      )}
                    </span>
                  ) : (
                    <input
                      {...common}
                      type={
                        f.type === "money" || f.type === "number"
                          ? "number"
                          : f.type === "datetime"
                            ? "datetime-local"
                            : f.type === "date"
                              ? "date"
                              : f.type === "time"
                                ? "time"
                                : "text"
                      }
                      min={
                        f.type === "money" || f.type === "number"
                          ? 0
                          : undefined
                      }
                      step={f.type === "money" ? "0.01" : undefined}
                      value={String(val)}
                      onChange={(e) => set(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      className={`${input} ${err ? "border-ink" : "border-line"}`}
                    />
                  )}
                </label>
              )}
              {(f.help || err) && (
                <p
                  id={`${id}-note`}
                  className={`mt-1 text-xs ${err ? "font-semibold text-ink" : "text-ink-soft"}`}
                  role={err ? "alert" : undefined}
                >
                  {err || f.help}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className={`${btnDark} disabled:opacity-60`}
        >
          {saving ? "Saving" : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className={btnLight}>
          Cancel
        </button>
        {Object.values(errors).some(Boolean) && (
          <p role="alert" className="text-sm font-semibold">
            {Object.values(errors).filter(Boolean).length === 1
              ? "1 field needs attention."
              : `${Object.values(errors).filter(Boolean).length} fields need attention.`}
          </p>
        )}
        {fail && (
          <p role="alert" className="text-sm font-semibold">
            {fail}
          </p>
        )}
      </div>
      <p className="mt-3 text-xs text-ink-soft">
        Fields marked * are required. Once saved, an entry cannot be edited or
        deleted.
      </p>
    </form>
  );
}
