"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { RegisterForm } from "@/components/app/RegisterForm";
import {
  btnDark,
  btnLight,
  Card,
  PageHeading,
  Pill,
  Stat,
  type Tone,
} from "@/components/app/ui";
import { fmtDate, fmtDateTime } from "@/lib/format";
import { formatSize, getProof } from "@/lib/proofs";
import {
  isVisible,
  OPEN_STATUSES,
  registerById,
  type EntryFile,
  type Field,
  type RegisterEntry,
  type Values,
} from "@/lib/registers";

const tone = (s: string): Tone =>
  OPEN_STATUSES.includes(s) ? "owed" : s === "Recorded" ? "neutral" : "ok";

export function RegisterView({ id }: { id: string }) {
  const def = registerById(id)!;
  const { entries, properties, ready, addEntry, applyAction } = useStore();
  const [adding, setAdding] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [status, setStatus] = useState("All");
  const [q, setQ] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const label = (pid: string) => {
    if (pid === "office") return "Office";
    const p = properties.find((x) => x.id === pid);
    return p ? `${p.address}, ${p.suburb}` : pid;
  };

  const fieldMap = useMemo(() => {
    const m = new Map<string, Field>();
    def.fields.forEach((f) => m.set(f.name, f));
    def.actions.forEach((a) =>
      a.fields.forEach((f) => !m.has(f.name) && m.set(f.name, f)),
    );
    return m;
  }, [def]);

  const show = (name: string, v: Values[string] | undefined) => {
    const f = fieldMap.get(name);
    if (v === undefined || v === "") return "Not recorded";
    if (Array.isArray(v)) return v.join(", ");
    if (typeof v === "boolean") return v ? "Yes" : "No";
    switch (f?.type) {
      case "property":
        return label(v);
      case "date":
        return fmtDate(v);
      case "datetime":
        return fmtDateTime(v);
      case "money":
        return `A$${Number(v).toLocaleString("en-AU")}`;
      default:
        return v;
    }
  };

  const mine = entries.filter((e) => e.registerId === id);
  const open = mine.filter((e) => OPEN_STATUSES.includes(e.status)).length;
  const list = mine.filter(
    (e) =>
      (status === "All" || e.status === status) &&
      (q === "" ||
        JSON.stringify(Object.values(e.values))
          .toLowerCase()
          .includes(q.toLowerCase())),
  );

  const openFile = async (f: EntryFile) => {
    if (!f.proofId) return;
    const blob = await getProof(f.proofId).catch(() => undefined);
    if (!blob) {
      setError("That file is no longer stored in this browser.");
      return;
    }
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const colLabel = (name: string) => fieldMap.get(name)?.label ?? name;

  return (
    <>
      <Link
        href="/dashboard/compliance/registers"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <Icon name="arrow" className="h-4 w-4 rotate-180" /> Registers
      </Link>
      <PageHeading
        title={`${def.name} register`}
        sub={def.blurb}
        actions={
          <button
            type="button"
            onClick={() => {
              setAdding((a) => !a);
              setNotice("");
            }}
            className={btnDark}
          >
            <Icon name="plus" className="h-4 w-4" /> Add entry
          </button>
        }
      />

      {notice && (
        <p
          role="status"
          className="mb-4 flex items-center gap-2 rounded-xl bg-tint px-4 py-3 text-sm font-semibold"
        >
          <Icon name="check" className="h-4 w-4" /> {notice}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold"
        >
          {error}
        </p>
      )}

      {adding && (
        <Card className="mb-6 p-5">
          <h2 className="mb-4 font-display text-lg font-extrabold">
            New {def.name.toLowerCase()} entry
          </h2>
          <RegisterForm
            fields={def.fields}
            submitLabel="Save entry"
            onCancel={() => setAdding(false)}
            onSubmit={async (values, files) => {
              await addEntry(id, values, files);
              setAdding(false);
              setStatus("All");
              setNotice(
                `Saved to the ${def.name} register and written to the audit log.`,
              );
            }}
          />
        </Card>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Entries" value={String(mine.length)} />
        <Stat
          label="Needing action"
          value={String(open)}
          tone={open ? "owed" : undefined}
          note={open ? "Open or pending" : "All clear"}
        />
        <Stat
          label="Latest"
          value={mine[0] ? fmtDate(mine[0].createdAt) : "None"}
          note={mine[0] ? `By ${mine[0].createdBy}` : "No entries yet"}
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-3">
          <label className="flex min-w-[12rem] flex-1 items-center gap-2 rounded-full bg-bg px-3 py-2 text-sm text-ink-soft focus-within:ring-2 focus-within:ring-accent">
            <Icon name="search" className="h-4 w-4" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search the ${def.name.toLowerCase()} register`}
              aria-label="Search entries"
              className="w-full bg-transparent text-ink outline-none placeholder:text-ink-soft"
            />
          </label>
          <div className="flex flex-wrap gap-1.5">
            {["All", ...def.statuses].map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={status === s}
                onClick={() => setStatus(s)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${status === s ? "bg-ink text-bg" : "bg-tint text-ink-soft hover:text-ink"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {!ready ? (
          <p className="px-5 py-10 text-center text-sm text-ink-soft">
            Loading entries
          </p>
        ) : list.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-semibold">
              {mine.length === 0 ? "No entries yet." : "No entries match."}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Add the first one as the work happens, so the register never has
              to be caught up.
            </p>
            {mine.length === 0 && (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className={`${btnDark} mt-4`}
              >
                <Icon name="plus" className="h-4 w-4" /> Add entry
              </button>
            )}
          </div>
        ) : (
          <ul>
            {list.map((e) => {
              const isOpen = openId === e.id;
              return (
                <li key={e.id} className="border-b border-line last:border-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => {
                      setOpenId(isOpen ? null : e.id);
                      setActing(null);
                    }}
                    className="grid w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-tint/60 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
                  >
                    {def.columns.map((c, i) => (
                      <span key={c} className="min-w-0">
                        <span className="block text-[11px] text-ink-soft md:hidden">
                          {colLabel(c)}
                        </span>
                        <span
                          className={`block truncate text-sm ${i === 0 ? "font-semibold" : "text-ink-soft"}`}
                        >
                          {show(c, e.values[c])}
                        </span>
                      </span>
                    ))}
                    <span className="flex items-center gap-2 justify-self-start md:justify-self-end">
                      <Pill tone={tone(e.status)}>{e.status}</Pill>
                      <Icon
                        name="arrow"
                        className={`h-4 w-4 text-ink-soft transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    </span>
                  </button>

                  {isOpen && (
                    <EntryDetail
                      entry={e}
                      defId={id}
                      fieldMap={fieldMap}
                      show={show}
                      openFile={openFile}
                      acting={acting}
                      setActing={setActing}
                      onApply={async (actionId, values, files) => {
                        await applyAction(e.id, actionId, values, files);
                        setActing(null);
                        setNotice("Updated, and written to the audit log.");
                      }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
      <p className="mt-4 flex items-center gap-2 text-xs text-ink-soft">
        <Icon name="lock" className="h-3.5 w-3.5" /> Entries cannot be edited or
        deleted. Progress is recorded as new history on the entry.
      </p>
    </>
  );
}

function EntryDetail({
  entry,
  defId,
  fieldMap,
  show,
  openFile,
  acting,
  setActing,
  onApply,
}: {
  entry: RegisterEntry;
  defId: string;
  fieldMap: Map<string, Field>;
  show: (name: string, v: Values[string] | undefined) => string;
  openFile: (f: EntryFile) => void;
  acting: string | null;
  setActing: (id: string | null) => void;
  onApply: (
    actionId: string,
    values: Values,
    files: Record<string, File | undefined>,
  ) => Promise<void>;
}) {
  const def = registerById(defId)!;
  const names = Object.keys(entry.values).filter((n) => {
    const f = fieldMap.get(n);
    return f ? isVisible(f, entry.values) || entry.values[n] !== "" : true;
  });
  const available = def.actions.filter((a) => a.from.includes(entry.status));
  const action = def.actions.find((a) => a.id === acting);

  return (
    <div className="border-t border-line bg-bg px-5 py-5">
      <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
        {names.map((n) => (
          <div key={n} className={fieldMap.get(n)?.wide ? "sm:col-span-2" : ""}>
            <dt className="text-xs text-ink-soft">
              {fieldMap.get(n)?.label ?? n}
            </dt>
            <dd className="mt-0.5 font-medium">{show(n, entry.values[n])}</dd>
          </div>
        ))}
        {Object.entries(entry.files).map(([n, f]) => (
          <div key={n}>
            <dt className="text-xs text-ink-soft">
              {fieldMap.get(n)?.label ?? n}
            </dt>
            <dd className="mt-0.5">
              {f.proofId ? (
                <button
                  type="button"
                  onClick={() => openFile(f)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-tint px-2.5 py-1 text-xs font-medium hover:bg-accent/15"
                >
                  <Icon name="clip" className="h-3 w-3" /> {f.name}{" "}
                  {f.size ? `· ${formatSize(f.size)}` : ""}
                </button>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 rounded-md bg-tint px-2.5 py-1 text-xs font-medium text-ink-soft"
                  title="Sample file from the demo data"
                >
                  <Icon name="clip" className="h-3 w-3" /> {f.name}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
          History
        </p>
        <ol className="mt-2 space-y-1.5 text-sm">
          {entry.history.map((h, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-28 shrink-0 font-mono text-xs text-ink-soft">
                {h.at}
              </span>
              <span>
                <span className="font-semibold">{h.by}</span>{" "}
                <span className="text-ink-soft">{h.act}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      {available.length > 0 && !action && (
        <div className="mt-5 flex flex-wrap gap-2">
          {available.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setActing(a.id)}
              className={btnLight}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {action && (
        <div className="mt-5 rounded-2xl border border-line bg-surface p-5">
          <h3 className="mb-3 font-display text-base font-extrabold">
            {action.label}
          </h3>
          <RegisterForm
            fields={action.fields}
            intro={action.intro}
            submitLabel={action.label}
            onCancel={() => setActing(null)}
            onSubmit={(v, f) => onApply(action.id, v, f)}
          />
        </div>
      )}
    </div>
  );
}
