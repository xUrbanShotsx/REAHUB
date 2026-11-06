"use client";

import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { Card, Pill } from "@/components/app/ui";
import { fmtDate } from "@/lib/format";
import { money, type AccountId } from "@/lib/trust";

export function HistoryTab({ account }: { account: AccountId }) {
  const { trust } = useStore();
  const list = trust.recons.filter((r) => r.account === account);

  return (
    <Card>
      {list.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="font-semibold">No reconciliations signed yet.</p>
          <p className="mt-1 text-sm text-ink-soft">
            Signed months are kept here and can never be changed.
          </p>
        </div>
      ) : (
        <ul>
          {list.map((r) => (
            <li
              key={r.id}
              className="grid gap-3 border-b border-line px-5 py-4 last:border-0 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center"
            >
              <span>
                <span className="block font-semibold">
                  To {fmtDate(r.periodEnd)}
                </span>
                <span className="block text-xs text-ink-soft">
                  Signed by {r.signedBy} · {r.entryCount} entries
                </span>
              </span>
              <span className="text-sm">
                <span className="block text-xs text-ink-soft">Cash book</span>
                <span className="font-semibold tabular-nums">
                  {money(r.cashBook)}
                </span>
              </span>
              <span className="text-sm">
                <span className="block text-xs text-ink-soft">
                  Bank closing
                </span>
                <span className="font-semibold tabular-nums">
                  {money(r.statementClosing)}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <Pill tone="solid">
                  <Icon name="lock" className="h-3 w-3" /> Locked
                </Pill>
                <Pill tone="ok">Difference {money(r.difference)}</Pill>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
