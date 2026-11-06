"use client";

import { useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { btnLight, Card, PageHeading, Pill, Stat } from "@/components/app/ui";
import {
  accountOf,
  cashBook,
  ledgers,
  money,
  type AccountId,
} from "@/lib/trust";
import { CashBookTab } from "./CashBookTab";
import { HistoryTab } from "./HistoryTab";
import { LedgersTab } from "./LedgersTab";
import { ReconcileTab } from "./ReconcileTab";
import { exportAuditPack } from "./export";

const TABS = ["Cash book", "Ledgers", "Reconcile", "History"] as const;

export function TrustView() {
  const { trust, ready } = useStore();
  const [account, setAccount] = useState<AccountId>("sales");
  const [tab, setTab] = useState<(typeof TABS)[number]>("Cash book");
  const [feedInfo, setFeedInfo] = useState(false);

  const acc = accountOf(trust, account);
  const book = cashBook(trust, account);
  const ledgerTotal = ledgers(trust, account).reduce(
    (n, l) => n + l.balance,
    0,
  );
  const lines = trust.lines.filter((l) => l.account === account);
  const unmatched =
    lines.filter((l) => !l.entryId).length +
    trust.entries.filter((e) => e.account === account && !e.lineId).length;
  const lastBalance = [...lines]
    .sort((a, b) => b.date.localeCompare(a.date))
    .find((l) => l.balance !== undefined)?.balance;

  return (
    <>
      <PageHeading
        title="Trust accounts"
        sub="Every movement against a named party, property and engagement. Reconcile to the bank statement and lock it."
        actions={
          <button
            type="button"
            onClick={() => exportAuditPack(trust, account)}
            className={btnLight}
          >
            <Icon name="download" className="h-4 w-4" /> Export audit pack
          </button>
        }
      />

      <div
        role="tablist"
        aria-label="Trust account"
        className="mb-5 inline-flex rounded-full bg-tint p-1"
      >
        {(["sales", "rentals"] as AccountId[]).map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={account === k}
            onClick={() => setAccount(k)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              account === k
                ? "bg-surface shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {accountOf(trust, k).name.replace(" trust account", "")}
          </button>
        ))}
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-display text-lg font-extrabold">{acc.name}</p>
            <p className="text-sm text-ink-soft">
              {acc.bank} · BSB {acc.bsb} · account ending {acc.last4}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              Sample account details. Only the last four digits are ever shown.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="neutral">Statement import</Pill>
            <button
              type="button"
              onClick={() => setFeedInfo((f) => !f)}
              className={btnLight}
            >
              Connect bank feed
            </button>
          </div>
        </div>
        {feedInfo && (
          <div className="border-t border-line bg-bg px-5 py-4 text-sm text-ink-soft">
            <p className="font-semibold text-ink">
              Live bank feeds are not connected yet.
            </p>
            <p className="mt-1">
              A live feed needs an Australian open banking provider and your
              bank&apos;s consent, which this demo does not have. Until then,
              download your statement from internet banking as a CSV and import
              it under Reconcile. REAHUB matches each line to the cash book,
              lists what is left, and locks the month when the difference is
              nil.
            </p>
          </div>
        )}
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="Cash book balance"
          value={ready ? money(book) : "..."}
          note="Receipts less payments"
        />
        <Stat
          label="Client ledgers"
          value={ready ? money(ledgerTotal) : "..."}
          note={
            book === ledgerTotal
              ? "Agrees with the cash book"
              : "Does not agree"
          }
          tone={book === ledgerTotal ? undefined : "owed"}
        />
        <Stat
          label="Last bank balance"
          value={lastBalance !== undefined ? money(lastBalance) : "None yet"}
          note={
            lines.length
              ? `${lines.length} statement lines`
              : "Import a statement"
          }
        />
        <Stat
          label="Unmatched items"
          value={String(unmatched)}
          note={unmatched ? "Need attention" : "All matched"}
          tone={unmatched ? "owed" : undefined}
        />
      </div>

      <div
        role="tablist"
        aria-label="Trust sections"
        className="mb-5 flex gap-1 overflow-x-auto border-b border-line"
      >
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${
              tab === t
                ? "border-accent text-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Cash book" && <CashBookTab account={account} />}
      {tab === "Ledgers" && <LedgersTab account={account} />}
      {tab === "Reconcile" && <ReconcileTab account={account} />}
      {tab === "History" && <HistoryTab account={account} />}
    </>
  );
}
