import {
  accountOf,
  cashBook,
  ledgers,
  money,
  signed,
  type AccountId,
  type TrustState,
} from "@/lib/trust";

const q = (v: string | number | undefined) =>
  `"${String(v ?? "").replace(/"/g, '""')}"`;

export function download(name: string, text: string, type = "text/csv") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/** Cash book, client ledgers and signed reconciliations for one account, as a single CSV. */
export function exportAuditPack(t: TrustState, id: AccountId) {
  const acc = accountOf(t, id);
  const rows: string[] = [];
  rows.push(
    `${q("Trust audit pack")},${q(acc.name)},${q(`${acc.bank} BSB ${acc.bsb} ending ${acc.last4}`)}`,
  );
  rows.push("");
  rows.push(
    [
      "Cash book",
      "Reference",
      "Date",
      "Type",
      "Property",
      "Held for",
      "Method",
      "Authority",
      "Authority ref",
      "Amount",
      "Status",
    ]
      .map(q)
      .join(","),
  );
  [...t.entries]
    .filter((e) => e.account === id)
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((e) =>
      rows.push(
        [
          "",
          e.ref,
          e.date,
          e.kind,
          e.propertyId,
          e.party,
          e.method,
          e.authority,
          e.authorityRef,
          signed(e).toFixed(2),
          e.reconId ? "Signed" : e.lineId ? "Matched" : "Unmatched",
        ]
          .map(q)
          .join(","),
      ),
    );
  rows.push("");
  rows.push(
    ["Client ledgers", "Property", "Held for", "Balance"].map(q).join(","),
  );
  ledgers(t, id).forEach((l) =>
    rows.push(
      ["", l.propertyId, l.party, l.balance.toFixed(2)].map(q).join(","),
    ),
  );
  rows.push(
    ["", "", "Cash book total", cashBook(t, id).toFixed(2)].map(q).join(","),
  );
  rows.push("");
  rows.push(
    [
      "Reconciliations",
      "Period end",
      "Bank closing",
      "Cash book",
      "Deposits in transit",
      "Payments outstanding",
      "Difference",
      "Signed by",
      "Signed at",
    ]
      .map(q)
      .join(","),
  );
  t.recons
    .filter((r) => r.account === id)
    .forEach((r) =>
      rows.push(
        [
          "",
          r.periodEnd,
          r.statementClosing,
          r.cashBook,
          r.outstandingDeposits,
          r.outstandingPayments,
          r.difference,
          r.signedBy,
          r.signedAt,
        ]
          .map(q)
          .join(","),
      ),
    );
  rows.push("");
  rows.push(
    `${q("Exported")},${q(new Date().toISOString())},${q(money(cashBook(t, id)))}`,
  );
  download(`trust-audit-pack-${id}.csv`, rows.join("\n"));
}
