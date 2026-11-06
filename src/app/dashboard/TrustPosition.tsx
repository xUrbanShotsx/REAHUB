"use client";

import Link from "next/link";
import { useStore } from "@/components/app/DemoStore";
import { btnDark, Card, CardHead, Pill } from "@/components/app/ui";
import {
  accountOf,
  cashBook,
  lockedUntil,
  money,
  summarise,
  type AccountId,
} from "@/lib/trust";
import { fmtDate } from "@/lib/format";

/** Each trust account's balance and where its reconciliation has got to. */
export function TrustPosition() {
  const { trust } = useStore();
  const ids: AccountId[] = ["sales", "rentals"];
  const open = ids.filter((id) =>
    trust.entries.some((e) => e.account === id && !e.lineId),
  );

  return (
    <Card>
      <CardHead
        title="Trust position"
        sub="Cash book balances"
        right={
          open.length ? (
            <Pill tone="owed">{open.length} to reconcile</Pill>
          ) : (
            <Pill tone="ok">Reconciled</Pill>
          )
        }
      />
      <div className="divide-y divide-line">
        {ids.map((id) => {
          const lock = lockedUntil(trust, id);
          const unmatched =
            summarise(trust, id, "9999-12-31", null).unmatchedDeposits.length +
            summarise(trust, id, "9999-12-31", null).unmatchedPayments.length;
          return (
            <div
              key={id}
              className="flex items-center justify-between gap-3 px-5 py-4"
            >
              <div>
                <p className="text-sm font-semibold">
                  {accountOf(trust, id).name.replace(" account", "")}
                </p>
                <p className="text-xs text-ink-soft">
                  {lock ? `Signed to ${fmtDate(lock)}` : "Not yet reconciled"}
                  {unmatched ? ` · ${unmatched} unmatched` : ""}
                </p>
              </div>
              <p className="font-display text-lg font-extrabold tabular-nums">
                {money(cashBook(trust, id))}
              </p>
            </div>
          );
        })}
      </div>
      <div className="p-4">
        <Link
          href="/dashboard/trust"
          className={`${btnDark} w-full justify-center`}
        >
          Open trust accounts
        </Link>
      </div>
    </Card>
  );
}
