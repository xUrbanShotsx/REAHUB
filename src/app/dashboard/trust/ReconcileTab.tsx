"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { RegisterForm } from "@/components/app/RegisterForm";
import { btnDark, btnLight, Card, CardHead, Pill } from "@/components/app/ui";
import { fmtDate, todayISO } from "@/lib/format";
import type { Field } from "@/lib/registers";
import {
  AUTHORITIES,
  METHODS,
  money,
  parseStatement,
  signed,
  statementCsv,
  summarise,
  type AccountId,
  type ParsedLine,
} from "@/lib/trust";
import { download } from "./export";

const monthEnd = (iso: string) => {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
};
const nextDay = (iso: string) =>
  new Date(Date.parse(iso) + 86_400_000).toISOString().slice(0, 10);

export function ReconcileTab({ account }: { account: AccountId }) {
  const {
    trust,
    properties,
    importStatement,
    autoMatch,
    matchLine,
    unmatchLine,
    recordFromLine,
    signReconciliation,
  } = useStore();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [recordFor, setRecordFor] = useState<string | null>(null);
  const [pe, setPe] = useState("");
  const [closing, setClosing] = useState<string | null>(null);
  const [signErr, setSignErr] = useState("");

  const lines = useMemo(
    () =>
      trust.lines
        .filter((l) => l.account === account)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [trust.lines, account],
  );
  const entries = trust.entries.filter((e) => e.account === account);
  const addr = (id: string) => {
    const p = properties.find((x) => x.id === id);
    return p ? `${p.address}, ${p.suburb}` : id;
  };

  const defaultEnd = lines.length
    ? monthEnd(lines[lines.length - 1].date)
    : monthEnd(todayISO());
  const periodEnd = pe || defaultEnd;
  const lastBal = [...lines]
    .filter((l) => l.date <= periodEnd && l.balance !== undefined)
    .pop()?.balance;
  const closingStr = closing ?? (lastBal !== undefined ? String(lastBal) : "");
  const closingNum =
    closingStr.trim() === "" || Number.isNaN(Number(closingStr))
      ? null
      : Number(closingStr);
  const sum = summarise(trust, account, periodEnd, closingNum);

  const unmatchedEntries = entries.filter((e) => !e.lineId);
  const matchOptions = (amount: number) =>
    unmatchedEntries.filter(
      (e) => Math.round(signed(e) * 100) === Math.round(amount * 100),
    );

  /* ----- import ----- */
  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const { lines: parsed, errors } = parseStatement(await file.text());
    if (parsed.length === 0)
      return setMsg({
        ok: false,
        text: errors[0] ?? "No transactions found in that file.",
      });
    const added = importStatement(account, parsed);
    const auto = autoMatch(account);
    setPe("");
    setClosing(null);
    setMsg({
      ok: true,
      text: `Imported ${added} new line${added === 1 ? "" : "s"}${parsed.length - added ? ` (${parsed.length - added} already imported)` : ""}. ${auto} matched automatically.${errors.length ? ` ${errors.length} row${errors.length === 1 ? "" : "s"} skipped.` : ""}`,
    });
  };

  const sampleLines = (): ParsedLine[] => {
    const cleared = entries.filter((e) => e.reconId);
    const open = entries
      .filter((e) => !e.reconId && !e.lineId)
      .sort((a, b) => a.date.localeCompare(b.date));
    // leave the newest payment off the statement so it shows as a payment still to clear
    const lastPay = [...open].reverse().find((e) => e.kind === "payment");
    const onStatement = open.filter((e) => e.id !== lastPay?.id);
    let bal = cleared.reduce((n, e) => n + signed(e), 0);
    const out: ParsedLine[] = onStatement.map((e) => {
      bal += signed(e);
      return {
        date: nextDay(e.date),
        description:
          `${e.method} ${e.kind === "receipt" ? "credit" : "debit"} ${e.party}`.toUpperCase(),
        amount: signed(e),
        balance: bal,
      };
    });
    if (account === "sales") {
      const d = "2026-10-30";
      bal += 5000;
      out.push({
        date: d,
        description: "EFT CREDIT HOLDING DEPOSIT 22 HILL ST",
        amount: 5000,
        balance: bal,
      });
    }
    return out.sort((a, b) => a.date.localeCompare(b.date));
  };

  const useSample = () => {
    const s = sampleLines();
    if (!s.length)
      return setMsg({
        ok: false,
        text: "There is nothing uncleared in the cash book to build a sample statement from.",
      });
    // recompute running balance in date order
    const base = entries
      .filter((e) => e.reconId)
      .reduce((n, e) => n + signed(e), 0);
    let bal = base;
    const ordered = s.map((l) => ((bal += l.amount), { ...l, balance: bal }));
    const added = importStatement(account, ordered);
    const auto = autoMatch(account);
    setPe("");
    setClosing(null);
    setMsg({
      ok: true,
      text: `Loaded a sample statement: ${added} lines, ${auto} matched automatically. This is demo data, not a real bank file.`,
    });
  };

  const templateCsv = () => {
    const s = sampleLines();
    download(
      "bank-statement-sample.csv",
      statementCsv(
        s,
        entries.filter((e) => e.reconId).reduce((n, e) => n + signed(e), 0),
      ),
    );
  };

  /* ----- record a bank line as a cash book entry ----- */
  const recordFields = (isPayment: boolean): Field[] => [
    { name: "property", label: "Property", type: "property", required: true },
    {
      name: "party",
      label: isPayment ? "Paid from the ledger of" : "Held for",
      type: "text",
      required: true,
      placeholder: "Full name",
    },
    {
      name: "method",
      label: "Method",
      type: "select",
      required: true,
      options: METHODS,
    },
    ...(isPayment
      ? ([
          {
            name: "authority",
            label: "Authority for the payment",
            type: "select",
            required: true,
            options: AUTHORITIES,
          },
          {
            name: "authorityRef",
            label: "Authority reference",
            type: "text",
            required: true,
          },
          { name: "payee", label: "Paid to", type: "text", required: true },
        ] as Field[])
      : []),
    { name: "narration", label: "Description", type: "textarea", wide: true },
  ];

  const doSign = () => {
    setSignErr("");
    try {
      signReconciliation(account, periodEnd, closingNum ?? 0);
      setMsg({
        ok: true,
        text: `Reconciliation to ${fmtDate(periodEnd)} signed and locked. Matched entries can no longer be changed.`,
      });
    } catch (e) {
      setSignErr(e instanceof Error ? e.message : "Could not sign.");
    }
  };

  const num =
    "mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm";

  return (
    <div className="space-y-6">
      {msg && (
        <p
          role={msg.ok ? "status" : "alert"}
          className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${msg.ok ? "bg-tint" : "border border-accent/40 bg-accent/10"}`}
        >
          {msg.ok && <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />}{" "}
          {msg.text}
        </p>
      )}

      <Card>
        <CardHead
          title="1. Import the bank statement"
          sub="Download a CSV from internet banking. It needs a Date column and an Amount (or Debit and Credit) column."
        />
        <div className="flex flex-wrap items-center gap-3 p-5">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg hover:bg-ink/85 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2">
            <Icon name="download" className="h-4 w-4 rotate-180" /> Choose CSV
            file
            <input
              type="file"
              accept=".csv,.txt,text/csv"
              className="sr-only"
              onChange={(e) => {
                void onFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <button type="button" onClick={useSample} className={btnLight}>
            Try a sample statement
          </button>
          <button
            type="button"
            onClick={templateCsv}
            className="text-sm font-semibold underline"
          >
            Download a sample CSV
          </button>
        </div>
        <p className="border-t border-line bg-bg px-5 py-3 text-xs text-ink-soft">
          Live bank feeds are not connected. Importing a file reads it in your
          browser and nothing is sent anywhere.
        </p>
      </Card>

      <Card>
        <CardHead
          title="2. Match the statement to the cash book"
          sub={`${lines.filter((l) => l.entryId).length} of ${lines.length} lines matched`}
          right={
            <button
              type="button"
              disabled={lines.every((l) => l.entryId)}
              onClick={() =>
                setMsg({
                  ok: true,
                  text: `${autoMatch(account)} more lines matched by amount and date.`,
                })
              }
              className={`${btnLight} disabled:opacity-50`}
            >
              Auto-match
            </button>
          }
        />
        {lines.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-soft">
            No statement imported for this account yet.
          </p>
        ) : (
          <ul>
            {lines.map((l) => {
              const matched = entries.find((e) => e.id === l.entryId);
              const options = matchOptions(l.amount);
              return (
                <li key={l.id} className="border-b border-line last:border-0">
                  <div className="grid items-center gap-3 px-5 py-3.5 md:grid-cols-[6rem_1.5fr_8rem_1.4fr]">
                    <span className="text-xs text-ink-soft">
                      {fmtDate(l.date)}
                    </span>
                    <span className="min-w-0 truncate text-sm font-medium">
                      {l.description}
                    </span>
                    <span
                      className={`text-sm font-semibold tabular-nums md:text-right`}
                    >
                      {money(l.amount)}
                    </span>
                    <span className="flex flex-wrap items-center gap-2 md:justify-end">
                      {matched ? (
                        <>
                          <Pill tone="ok">Matched {matched.ref}</Pill>
                          {!matched.reconId ? (
                            <button
                              type="button"
                              onClick={() => unmatchLine(l.id)}
                              className="text-xs font-semibold underline"
                            >
                              Unmatch
                            </button>
                          ) : (
                            <Icon
                              name="lock"
                              className="h-3.5 w-3.5 text-ink-soft"
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <Pill tone="owed">Not in cash book</Pill>
                          {options.length > 0 && (
                            <label>
                              <span className="sr-only">
                                Match {l.description} to an entry
                              </span>
                              <select
                                value=""
                                onChange={(e) =>
                                  e.target.value &&
                                  matchLine(l.id, e.target.value)
                                }
                                className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold"
                              >
                                <option value="">Match to...</option>
                                {options.map((e) => (
                                  <option key={e.id} value={e.id}>
                                    {e.ref} · {fmtDate(e.date)} ·{" "}
                                    {money(signed(e))}
                                  </option>
                                ))}
                              </select>
                            </label>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setRecordFor(recordFor === l.id ? null : l.id)
                            }
                            className="text-xs font-semibold underline"
                          >
                            Record in cash book
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                  {recordFor === l.id && !matched && (
                    <div className="border-t border-line bg-bg px-5 py-5">
                      <h3 className="mb-3 font-display text-base font-extrabold">
                        Record this {l.amount > 0 ? "receipt" : "payment"} of{" "}
                        {money(Math.abs(l.amount))}
                      </h3>
                      <RegisterForm
                        fields={recordFields(l.amount < 0)}
                        defaults={{ method: "EFT" }}
                        submitLabel="Save to cash book"
                        onCancel={() => setRecordFor(null)}
                        extraValidate={(v): Record<string, string> =>
                          v.property === "office"
                            ? {
                                property:
                                  "Choose the property the money is held against.",
                              }
                            : {}
                        }
                        onSubmit={async (v) => {
                          recordFromLine(l.id, {
                            propertyId: String(v.property),
                            party: String(v.party).trim(),
                            method: String(v.method),
                            authority: v.authority
                              ? String(v.authority)
                              : undefined,
                            authorityRef: v.authorityRef
                              ? String(v.authorityRef)
                              : undefined,
                            payee: v.payee ? String(v.payee) : undefined,
                            narration: String(v.narration ?? l.description),
                          });
                          setRecordFor(null);
                          setMsg({
                            ok: true,
                            text: "Recorded in the cash book and matched to the statement line.",
                          });
                        }}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card>
        <CardHead
          title="3. Reconcile and sign"
          sub="Bank balance, adjusted for what has not cleared, must equal the cash book."
        />
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Reconcile up to
            <input
              type="date"
              value={periodEnd}
              onChange={(e) => setPe(e.target.value)}
              className={num}
            />
          </label>
          <label className="text-sm font-medium">
            Closing balance on the bank statement (A$)
            <input
              type="number"
              step="0.01"
              value={closingStr}
              onChange={(e) => setClosing(e.target.value)}
              className={num}
            />
          </label>
        </div>

        <dl className="divide-y divide-line border-t border-line text-sm">
          {[
            [
              "Bank statement closing balance",
              money(sum.statementClosing),
              false,
            ],
            [
              `Add deposits not yet on the statement (${sum.unmatchedDeposits.length})`,
              money(sum.outstandingDeposits),
              false,
            ],
            [
              `Less payments not yet on the statement (${sum.unmatchedPayments.length})`,
              `-${money(sum.outstandingPayments).replace("-", "")}`,
              false,
            ],
            ["Adjusted bank balance", money(sum.adjustedBank), true],
            ["Cash book balance", money(sum.cashBook), true],
          ].map(([k, v, bold]) => (
            <div
              key={String(k)}
              className={`flex justify-between gap-4 px-5 py-3 ${bold ? "font-bold" : ""}`}
            >
              <dt className={bold ? "" : "text-ink-soft"}>{k}</dt>
              <dd className="tabular-nums">{v}</dd>
            </div>
          ))}
          <div
            className={`flex justify-between gap-4 px-5 py-4 font-bold ${sum.difference === 0 && closingNum !== null ? "bg-tint" : "bg-accent/[0.08]"}`}
          >
            <dt>Difference</dt>
            <dd className="font-display text-lg tabular-nums">
              {closingNum === null
                ? "Enter the closing balance"
                : money(sum.difference)}
            </dd>
          </div>
        </dl>

        {(sum.unmatchedDeposits.length > 0 ||
          sum.unmatchedPayments.length > 0) && (
          <div className="border-t border-line px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              Not yet on the statement
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {[...sum.unmatchedDeposits, ...sum.unmatchedPayments].map((e) => (
                <li key={e.id} className="flex justify-between gap-3">
                  <span className="text-ink-soft">
                    {e.ref} · {fmtDate(e.date)} · {addr(e.propertyId)}
                  </span>
                  <span className="font-semibold tabular-nums">
                    {money(signed(e))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-line bg-bg p-5">
          {sum.canSign ? (
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Icon name="check" className="h-4 w-4" /> Everything agrees. Sign
              to lock the month.
            </p>
          ) : (
            <ul className="mb-3 space-y-1 text-sm text-ink-soft">
              {sum.blockers.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{" "}
                  {b}
                </li>
              ))}
            </ul>
          )}
          {signErr && (
            <p role="alert" className="mb-3 text-sm font-semibold">
              {signErr}
            </p>
          )}
          <button
            type="button"
            onClick={doSign}
            disabled={!sum.canSign}
            className={`${btnDark} disabled:opacity-50`}
          >
            <Icon name="lock" className="h-4 w-4" /> Sign and lock
            reconciliation
          </button>
        </div>
      </Card>
    </div>
  );
}
