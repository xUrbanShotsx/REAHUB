"use client";

import { useStore } from "@/components/app/DemoStore";
import { Card, Pill } from "@/components/app/ui";
import { cashBook, ledgers, money, type AccountId } from "@/lib/trust";

/** One ledger per client: the money held for a named party against a named property. */
export function LedgersTab({ account }: { account: AccountId }) {
  const { trust, properties } = useStore();
  const list = ledgers(trust, account);
  const total = list.reduce((n, l) => n + l.balance, 0);
  const book = cashBook(trust, account);
  const addr = (id: string) => {
    const p = properties.find((x) => x.id === id);
    return p ? `${p.address}, ${p.suburb}` : id;
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-ink-soft">
              <th className="px-5 py-3 font-medium">Property</th>
              <th className="px-5 py-3 font-medium">Held for</th>
              <th className="px-5 py-3 text-right font-medium">Balance</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((l) => (
              <tr
                key={l.key}
                className="border-b border-line last:border-0 hover:bg-tint/60"
              >
                <td className="px-5 py-3.5 font-semibold">
                  {addr(l.propertyId)}
                </td>
                <td className="px-5 py-3.5 text-ink-soft">{l.party}</td>
                <td className="px-5 py-3.5 text-right font-semibold tabular-nums">
                  {money(l.balance)}
                </td>
                <td className="px-5 py-3.5">
                  {l.balance < 0 ? (
                    <Pill tone="owed">Overdrawn</Pill>
                  ) : l.balance === 0 ? (
                    <Pill tone="neutral">Nil</Pill>
                  ) : (
                    <Pill tone="ok">Held</Pill>
                  )}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-ink-soft"
                >
                  No client ledgers yet.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-line bg-bg font-bold">
              <td className="px-5 py-3.5" colSpan={2}>
                Trust ledger total
              </td>
              <td className="px-5 py-3.5 text-right tabular-nums">
                {money(total)}
              </td>
              <td className="px-5 py-3.5 text-xs font-medium text-ink-soft">
                {money(book) === money(total)
                  ? "Agrees with the cash book"
                  : `Cash book ${money(book)}`}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}
