"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { RegisterForm } from "@/components/app/RegisterForm";
import { btnDark, btnLight, Card, Pill } from "@/components/app/ui";
import { fmtDate } from "@/lib/format";
import type { Field, Values } from "@/lib/registers";
import {
  AUTHORITIES,
  cents,
  ledgers,
  lockedUntil,
  METHODS,
  money,
  signed,
  type AccountId,
} from "@/lib/trust";

export function CashBookTab({ account }: { account: AccountId }) {
  const { trust, properties, ready, addTrustEntry } = useStore();
  const [mode, setMode] = useState<null | "receipt" | "payment">(null);
  const [notice, setNotice] = useState("");
  const addr = (id: string) => {
    const p = properties.find((x) => x.id === id);
    return p ? `${p.address}, ${p.suburb}` : id;
  };

  const lock = lockedUntil(trust, account);
  const rows = useMemo(
    () =>
      trust.entries
        .filter((e) => e.account === account)
        .sort((a, b) => `${b.date}${b.ref}`.localeCompare(`${a.date}${a.ref}`)),
    [trust.entries, account],
  );
  const held = useMemo(
    () => ledgers(trust, account).filter((l) => l.balance > 0),
    [trust, account],
  );
  const heldLabels = held.map(
    (l) => `${addr(l.propertyId)} · ${l.party} · ${money(l.balance)} held`,
  );

  const base: Field[] = [
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true,
      notFuture: true,
    },
    { name: "amount", label: "Amount (A$)", type: "money", required: true },
    {
      name: "method",
      label: "Method",
      type: "select",
      required: true,
      options: METHODS.filter((m) => m !== "Cash" || account === "rentals"),
    },
  ];
  const receiptFields: Field[] = [
    {
      name: "property",
      label: "Property the money is for",
      type: "property",
      required: true,
    },
    {
      name: "party",
      label: "Held for",
      type: "text",
      required: true,
      placeholder: "Full name of the person the money belongs to",
    },
    ...base,
    {
      name: "narration",
      label: "Description",
      type: "textarea",
      wide: true,
      placeholder: account === "sales" ? "Deposit on exchange" : "Rent, bond",
    },
  ];
  const paymentFields: Field[] = [
    {
      name: "ledger",
      label: "Pay from",
      type: "select",
      required: true,
      options: heldLabels,
      wide: true,
      help: "Only money held for that client can be paid out.",
    },
    // authority first: an auditor reads a payment in this order
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
      placeholder: "Statement, agreement or invoice number",
    },
    { name: "payee", label: "Paid to", type: "text", required: true },
    ...base,
    { name: "narration", label: "Description", type: "textarea", wide: true },
  ];

  const check = (v: Values) => {
    const errs: Record<string, string> = {};
    const date = String(v.date ?? "");
    if (date && date <= lock)
      errs.date = `That period is signed. Use a date after ${fmtDate(lock)}.`;
    const amt = Number(v.amount);
    if (v.amount !== "" && !(amt > 0))
      errs.amount = "The amount must be more than nil.";
    if (mode === "receipt" && v.property === "office")
      errs.property = "Choose the property the money is held against.";
    if (mode === "payment" && v.ledger && amt > 0) {
      const l = held[heldLabels.indexOf(String(v.ledger))];
      if (l && cents(amt) > cents(l.balance))
        errs.amount = `Only ${money(l.balance)} is held for that client.`;
    }
    return errs;
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode(mode === "receipt" ? null : "receipt");
            setNotice("");
          }}
          className={btnDark}
        >
          <Icon name="plus" className="h-4 w-4" /> Receipt money
        </button>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "payment" ? null : "payment");
            setNotice("");
          }}
          className={btnLight}
          disabled={held.length === 0}
        >
          Pay out
        </button>
        {lock && (
          <span className="self-center text-xs text-ink-soft">
            Signed up to {fmtDate(lock)}. New entries must be dated after that.
          </span>
        )}
      </div>

      {notice && (
        <p
          role="status"
          className="mb-4 flex items-center gap-2 rounded-xl bg-tint px-4 py-3 text-sm font-semibold"
        >
          <Icon name="check" className="h-4 w-4" /> {notice}
        </p>
      )}

      {mode && (
        <Card className="mb-6 p-5">
          <h2 className="mb-1 font-display text-lg font-extrabold">
            {mode === "receipt"
              ? "Receipt money into trust"
              : "Pay money out of trust"}
          </h2>
          <p className="mb-4 text-sm text-ink-soft">
            {mode === "receipt"
              ? "A receipt names the amount, the person it is held for, the property and the engagement."
              : "A payment names its authority before the amount. The client ledger cannot go below nil."}
          </p>
          <RegisterForm
            key={mode}
            fields={mode === "receipt" ? receiptFields : paymentFields}
            submitLabel={mode === "receipt" ? "Save receipt" : "Save payment"}
            extraValidate={check}
            onCancel={() => setMode(null)}
            onSubmit={async (v) => {
              if (mode === "receipt") {
                addTrustEntry({
                  account,
                  kind: "receipt",
                  date: String(v.date),
                  propertyId: String(v.property),
                  party: String(v.party).trim(),
                  amount: Number(v.amount),
                  method: String(v.method),
                  narration: String(v.narration ?? ""),
                });
                setNotice(
                  "Receipt saved. It is in the cash book and the client ledger.",
                );
              } else {
                const l = held[heldLabels.indexOf(String(v.ledger))];
                addTrustEntry({
                  account,
                  kind: "payment",
                  date: String(v.date),
                  propertyId: l.propertyId,
                  party: l.party,
                  amount: Number(v.amount),
                  method: String(v.method),
                  authority: String(v.authority),
                  authorityRef: String(v.authorityRef),
                  payee: String(v.payee),
                  narration: String(v.narration ?? ""),
                });
                setNotice(
                  "Payment saved against its authority, and taken from the client ledger.",
                );
              }
              setMode(null);
            }}
          />
        </Card>
      )}

      <Card>
        {!ready ? (
          <p className="px-5 py-10 text-center text-sm text-ink-soft">
            Loading the cash book
          </p>
        ) : rows.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-ink-soft">
            No entries yet. Receipt the first deposit.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-ink-soft">
                  {[
                    "Ref",
                    "Date",
                    "Property and client",
                    "Method",
                    "Money in",
                    "Money out",
                    "Status",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3 font-medium ${i === 4 || i === 5 ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-line last:border-0 hover:bg-tint/60"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-ink-soft">
                      {e.ref}
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft">
                      {fmtDate(e.date)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="block font-semibold">
                        {addr(e.propertyId)}
                      </span>
                      <span className="block text-xs text-ink-soft">
                        {e.party}
                        {e.kind === "payment" && e.authority
                          ? ` · ${e.authority}, ${e.authorityRef}`
                          : ""}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft">{e.method}</td>
                    <td className="px-5 py-3.5 text-right font-semibold tabular-nums">
                      {e.kind === "receipt" ? money(e.amount) : ""}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold tabular-nums">
                      {e.kind === "payment" ? money(e.amount) : ""}
                    </td>
                    <td className="px-5 py-3.5">
                      {e.reconId ? (
                        <Pill tone="solid">Signed</Pill>
                      ) : e.lineId ? (
                        <Pill tone="ok">Matched</Pill>
                      ) : (
                        <Pill tone="owed">Unmatched</Pill>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="border-t border-line bg-bg px-5 py-3 text-xs text-ink-soft">
          Entries cannot be edited or deleted. A mistake is corrected by a later
          entry. Running total: {money(rows.reduce((n, e) => n + signed(e), 0))}
          .
        </p>
      </Card>
    </>
  );
}
