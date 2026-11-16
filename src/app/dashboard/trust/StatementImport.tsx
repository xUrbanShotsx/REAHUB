"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/Icons";
import { btnDark, btnLight, Card, CardHead, Pill } from "@/components/app/ui";
import {
  applyMapping,
  MAX_FILE_BYTES,
  readBankFile,
  type BankFile,
  type Mapping,
} from "@/lib/bank-import";
import { fmtDate } from "@/lib/format";
import { money, type TrustAccount } from "@/lib/trust";

type Pending = BankFile & { name: string };

const ROLES: { key: keyof Omit<Mapping, "header">; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },
  { key: "amount", label: "Amount (+ in, − out)" },
  { key: "debit", label: "Debit / money out" },
  { key: "credit", label: "Credit / money in" },
  { key: "balance", label: "Balance" },
];

/** Step 1 of reconciling: read a bank file, show what is in it, then import on confirmation. */
export function StatementImport({
  account,
  onImport,
  extra,
}: {
  account: TrustAccount;
  /** Imports the lines and returns a message for the page. */
  onImport: (lines: BankFile["lines"]) => void;
  extra?: ReactNode;
}) {
  const [pending, setPending] = useState<Pending | null>(null);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [drag, setDrag] = useState(false);

  const read = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    if (file.size > MAX_FILE_BYTES)
      return setError(
        "That file is over 5 MB. Export a shorter date range, such as one month.",
      );
    const result = readBankFile(file.name, await file.text());
    if ("error" in result) return setError(result.error);
    setPending({ ...result, name: file.name });
    setShowMap(result.format === "CSV" && result.lines.length === 0);
  };

  const remap = (patch: Partial<Mapping>) => {
    if (!pending?.csv) return;
    const mapping = { ...pending.csv.mapping, ...patch };
    // One way of giving amounts at a time.
    if (patch.amount !== undefined && patch.amount >= 0)
      Object.assign(mapping, { debit: -1, credit: -1 });
    if (
      (patch.debit !== undefined && patch.debit >= 0) ||
      (patch.credit !== undefined && patch.credit >= 0)
    )
      mapping.amount = -1;
    const { lines, skipped } = applyMapping(pending.csv.rows, mapping);
    const columns = pending.csv.columns.map((c, i) =>
      mapping.header && pending.csv!.rows[0][i]
        ? pending.csv!.rows[0][i]
        : `Column ${i + 1}`,
    );
    setPending({
      ...pending,
      lines,
      skipped,
      csv: { ...pending.csv, mapping, columns },
    });
  };

  const lines = pending?.lines ?? [];
  const inn = lines.filter((l) => l.amount > 0);
  const out = lines.filter((l) => l.amount < 0);
  const total = (ls: typeof lines) =>
    Math.round(ls.reduce((n, l) => n + l.amount, 0) * 100) / 100;
  const closing =
    pending?.closing ??
    [...lines].reverse().find((l) => l.balance !== undefined)?.balance;
  const wrongAccount =
    pending?.accountLast4 && pending.accountLast4 !== account.last4
      ? pending.accountLast4
      : null;

  return (
    <Card>
      <CardHead
        title="1. Import the bank statement"
        sub="In internet banking, export the trust account's transactions as CSV, OFX or QIF. Every Australian bank offers at least one."
      />

      {!pending ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            void read(e.dataTransfer.files[0]);
          }}
          className={`m-5 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${drag ? "border-accent bg-accent/5" : "border-line"}`}
        >
          <Icon
            name="download"
            className="mx-auto h-6 w-6 rotate-180 text-ink-soft"
          />
          <p className="mt-2 text-sm font-semibold">
            Drop the statement file here
          </p>
          <p className="mt-0.5 text-xs text-ink-soft">
            CSV, OFX, QFX or QIF from {account.bank}, for the account ending{" "}
            {account.last4}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg hover:bg-ink/85 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2">
              Choose file
              <input
                type="file"
                accept=".csv,.txt,.ofx,.qfx,.qif,text/csv"
                className="sr-only"
                onChange={(e) => {
                  void read(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {extra}
          </div>
          {error && (
            <p role="alert" className="mt-4 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Icon name="file" className="h-4 w-4 text-ink-soft" />
            <span className="min-w-0 truncate text-sm font-semibold">
              {pending.name}
            </span>
            <Pill>{pending.format}</Pill>
            {pending.format === "CSV" && pending.csv && (
              <button
                type="button"
                onClick={() => setShowMap((s) => !s)}
                className="ml-auto text-xs font-semibold text-accent hover:underline"
              >
                {showMap ? "Hide columns" : "Change columns"}
              </button>
            )}
          </div>

          {wrongAccount && (
            <p
              role="alert"
              className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm"
            >
              <strong>Check the account.</strong> This file is for an account
              ending {wrongAccount}, but you are reconciling {account.name}{" "}
              ending {account.last4}.
            </p>
          )}

          {showMap && pending.csv && (
            <div className="rounded-xl border border-line bg-tint/30 p-4">
              <label className="mb-3 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pending.csv.mapping.header}
                  onChange={(e) => remap({ header: e.target.checked })}
                  className="h-4 w-4 accent-accent"
                />
                The first row is column names
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {ROLES.map((r) => (
                  <label
                    key={r.key}
                    className="text-xs font-semibold text-ink-soft"
                  >
                    {r.label}
                    <select
                      value={pending.csv!.mapping[r.key]}
                      onChange={(e) =>
                        remap({ [r.key]: Number(e.target.value) })
                      }
                      className="mt-1 block w-full rounded-lg border border-line bg-surface px-2.5 py-2 text-sm font-normal text-ink"
                    >
                      <option value={-1}>Not in this file</option>
                      {pending.csv!.columns.map((c, i) => (
                        <option key={i} value={i}>
                          {c}
                          {pending.csv!.rows[
                            pending.csv!.mapping.header ? 1 : 0
                          ]?.[i]
                            ? ` (e.g. ${pending.csv!.rows[pending.csv!.mapping.header ? 1 : 0][i].slice(0, 24)})`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs text-ink-soft">
                Use one Amount column, or a Debit and a Credit column.
              </p>
            </div>
          )}

          {lines.length > 0 ? (
            <>
              <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div className="rounded-xl bg-tint/50 p-3">
                  <dt className="text-xs text-ink-soft">Transactions</dt>
                  <dd className="font-semibold tabular-nums">{lines.length}</dd>
                </div>
                <div className="rounded-xl bg-tint/50 p-3">
                  <dt className="text-xs text-ink-soft">Dates</dt>
                  <dd className="font-semibold">
                    {fmtDate(lines[0].date)}
                    {lines[lines.length - 1].date !== lines[0].date &&
                      ` – ${fmtDate(lines[lines.length - 1].date)}`}
                  </dd>
                </div>
                <div className="rounded-xl bg-tint/50 p-3">
                  <dt className="text-xs text-ink-soft">
                    Money in ({inn.length}) / out ({out.length})
                  </dt>
                  <dd className="font-semibold tabular-nums">
                    {money(total(inn))} / {money(-total(out))}
                  </dd>
                </div>
                <div className="rounded-xl bg-tint/50 p-3">
                  <dt className="text-xs text-ink-soft">Closing balance</dt>
                  <dd className="font-semibold tabular-nums">
                    {closing !== undefined ? money(closing) : "Not in file"}
                  </dd>
                </div>
              </dl>

              <div className="overflow-hidden rounded-xl border border-line">
                <table className="w-full text-sm">
                  <thead className="bg-tint/50 text-left text-xs text-ink-soft">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Date</th>
                      <th className="px-3 py-2 font-semibold">Description</th>
                      <th className="px-3 py-2 text-right font-semibold">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.slice(0, 5).map((l, i) => (
                      <tr key={i} className="border-t border-line">
                        <td className="whitespace-nowrap px-3 py-2 text-xs text-ink-soft">
                          {fmtDate(l.date)}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className="line-clamp-2 break-words"
                            title={l.description}
                          >
                            {l.description}
                          </span>
                        </td>
                        <td
                          className={`whitespace-nowrap px-3 py-2 text-right tabular-nums ${l.amount < 0 ? "" : "font-semibold"}`}
                        >
                          {money(l.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {lines.length > 5 && (
                  <p className="border-t border-line bg-tint/30 px-3 py-2 text-xs text-ink-soft">
                    and {lines.length - 5} more
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="rounded-xl bg-tint/40 px-4 py-6 text-center text-sm text-ink-soft">
              No transactions could be read yet.{" "}
              {pending.format === "CSV"
                ? "Pick the Date and Amount columns above."
                : "The file may be empty."}
            </p>
          )}

          {pending.skipped.length > 0 && (
            <details className="text-xs text-ink-soft">
              <summary className="cursor-pointer font-semibold">
                {pending.skipped.length} row
                {pending.skipped.length === 1 ? "" : "s"} skipped
              </summary>
              <ul className="mt-2 list-disc space-y-0.5 pl-5">
                {pending.skipped.slice(0, 10).map((s) => (
                  <li key={s}>{s}</li>
                ))}
                {pending.skipped.length > 10 && (
                  <li>and {pending.skipped.length - 10} more</li>
                )}
              </ul>
            </details>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={lines.length === 0}
              onClick={() => {
                onImport(lines);
                setPending(null);
              }}
              className={`${btnDark} disabled:opacity-50`}
            >
              Import {lines.length} line{lines.length === 1 ? "" : "s"}
            </button>
            <button
              type="button"
              onClick={() => setPending(null)}
              className={btnLight}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <p className="border-t border-line bg-bg px-5 py-3 text-xs text-ink-soft">
        The file is read in your browser and nothing is sent anywhere. Lines you
        have already imported are skipped, so overlapping statements are safe.
      </p>
    </Card>
  );
}
