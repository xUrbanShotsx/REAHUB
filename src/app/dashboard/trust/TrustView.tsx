"use client";

import { useState } from "react";
import { Icon } from "@/components/Icons";
import {
  btnDark,
  btnLight,
  Card,
  CardHead,
  PageHeading,
  Pill,
  Stat,
} from "@/components/app/ui";
import { aud, trust } from "@/lib/demo-data";

type Key = "sales" | "rentals";

export function TrustView() {
  const [key, setKey] = useState<Key>("sales");
  const [signed, setSigned] = useState<Record<Key, boolean>>({
    sales: false,
    rentals: false,
  });
  const acc = trust[key];
  const total = acc.receipts.reduce((n, r) => n + r.amount, 0);

  const exportPack = () => {
    const rows = [
      ["Reference", "Date", "Against", "Held for", "Amount (AUD)"],
      ...acc.receipts.map((r) => [
        r.ref,
        r.date,
        r.against,
        r.party,
        String(r.amount),
      ]),
      [],
      ["Cash book", "", "", "", String(acc.held)],
      ["Bank statement", "", "", "", String(acc.held)],
      ["Trust ledger", "", "", "", String(acc.held)],
      ["Difference", "", "", "", "0"],
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-pack-${key}-october.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeading
        title="Trust accounts"
        sub="Every movement against a named party, property and engagement."
        actions={
          <button type="button" onClick={exportPack} className={btnLight}>
            <Icon name="download" className="h-4 w-4" /> Export audit pack
          </button>
        }
      />

      <div
        role="tablist"
        aria-label="Trust account"
        className="mb-6 inline-flex rounded-full bg-tint p-1"
      >
        {(["sales", "rentals"] as Key[]).map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={key === k}
            onClick={() => setKey(k)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              key === k
                ? "bg-surface shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {trust[k].label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Held in trust" value={aud(acc.held)} />
        <Stat
          label="Unreconciled"
          value="A$0"
          note="Ledger, bank and cash book agree"
        />
        <Stat
          label="Receipts this month"
          value={aud(total)}
          note={`${acc.receipts.length} receipts`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHead
            title="Receipts"
            sub="Each one names four things: amount, party, property, engagement"
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-ink-soft">
                  {["Ref", "Date", "Against", "Held for", "Amount"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3 font-medium ${i === 4 ? "text-right" : ""}`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {acc.receipts.map((r) => (
                  <tr
                    key={r.ref}
                    className="border-b border-line last:border-0 hover:bg-tint/60"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-ink-soft">
                      {r.ref}
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft">{r.date}</td>
                    <td className="px-5 py-3.5 font-semibold">{r.against}</td>
                    <td className="px-5 py-3.5 text-ink-soft">{r.party}</td>
                    <td className="px-5 py-3.5 text-right font-semibold tabular-nums">
                      +{aud(r.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="self-start">
          <CardHead
            title="October reconciliation"
            right={
              signed[key] ? (
                <Pill tone="solid">Locked</Pill>
              ) : (
                <Pill tone="ok">Matched</Pill>
              )
            }
          />
          <dl className="space-y-2.5 p-5 text-sm">
            {["Cash book", "Bank statement", "Trust ledger"].map((k) => (
              <div key={k} className="flex justify-between">
                <dt className="text-ink-soft">{k}</dt>
                <dd className="tabular-nums">{aud(acc.held)}</dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-3 font-bold">
              <dt>Difference</dt>
              <dd className="tabular-nums">A$0</dd>
            </div>
          </dl>
          <div className="border-t border-line p-4">
            {signed[key] ? (
              <p className="flex items-center gap-2 text-sm text-ink-soft">
                <Icon name="lock" className="h-4 w-4" /> Signed by Dana
                Whitfield and locked. A later correction is a later entry.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setSigned((s) => ({ ...s, [key]: true }))}
                className={`${btnDark} w-full justify-center`}
              >
                Sign reconciliation
              </button>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
