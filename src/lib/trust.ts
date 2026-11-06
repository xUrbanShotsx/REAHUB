/** Trust accounting: a cash book per account, client ledgers, bank statement lines and signed reconciliations. */

export type AccountId = "sales" | "rentals";
export type EntryKind = "receipt" | "payment";

export type TrustAccount = {
  id: AccountId;
  name: string;
  bank: string;
  bsb: string;
  /** Last four digits only. Full account numbers are never stored here. */
  last4: string;
  opening: number;
  openingDate: string;
};

export type TrustEntry = {
  id: string;
  account: AccountId;
  kind: EntryKind;
  date: string;
  ref: string;
  propertyId: string;
  party: string;
  amount: number;
  method: string;
  engagement: string;
  authority?: string;
  authorityRef?: string;
  payee?: string;
  narration: string;
  by: string;
  lineId?: string;
  reconId?: string;
};

export type BankLine = {
  id: string;
  account: AccountId;
  date: string;
  description: string;
  /** Credits are positive, debits negative. */
  amount: number;
  balance?: number;
  entryId?: string;
};

export type Recon = {
  id: string;
  account: AccountId;
  periodEnd: string;
  statementClosing: number;
  cashBook: number;
  outstandingDeposits: number;
  outstandingPayments: number;
  difference: number;
  signedBy: string;
  signedAt: string;
  entryCount: number;
};

export type TrustState = {
  accounts: TrustAccount[];
  entries: TrustEntry[];
  lines: BankLine[];
  recons: Recon[];
};

export const METHODS = ["Direct deposit", "EFT", "Cheque", "Cash", "Card"];
export const AUTHORITIES = [
  "Settlement statement",
  "Written instruction from the owner",
  "Management agreement",
  "Contract for sale",
  "Approved invoice",
  "Refund of bond or deposit",
  "Other written authority",
];

export const cents = (n: number) => Math.round(n * 100);
export const dollars = (c: number) => c / 100;
export const money = (n: number) =>
  `${n < 0 ? "-" : ""}A$${Math.abs(n).toLocaleString("en-AU", { minimumFractionDigits: Number.isInteger(Math.abs(n)) ? 0 : 2, maximumFractionDigits: 2 })}`;

export const signed = (e: TrustEntry) =>
  e.kind === "receipt" ? e.amount : -e.amount;

/* ---------- balances ---------- */

export const accountOf = (s: TrustState, id: AccountId) =>
  s.accounts.find((a) => a.id === id)!;

export function cashBook(s: TrustState, id: AccountId, upTo?: string) {
  const a = accountOf(s, id);
  const sum = s.entries
    .filter((e) => e.account === id && (!upTo || e.date <= upTo))
    .reduce((n, e) => n + cents(signed(e)), cents(a.opening));
  return dollars(sum);
}

export type Ledger = {
  key: string;
  propertyId: string;
  party: string;
  balance: number;
};

/** One ledger per client: the property and the party the money is held for. */
export function ledgers(s: TrustState, id: AccountId): Ledger[] {
  const map = new Map<string, Ledger>();
  for (const e of s.entries) {
    if (e.account !== id) continue;
    const key = `${e.propertyId}|${e.party}`;
    const cur = map.get(key) ?? {
      key,
      propertyId: e.propertyId,
      party: e.party,
      balance: 0,
    };
    cur.balance = dollars(cents(cur.balance) + cents(signed(e)));
    map.set(key, cur);
  }
  return [...map.values()].sort((a, b) => b.balance - a.balance);
}

/** The latest period end that has been signed. New entries cannot be dated on or before it. */
export const lockedUntil = (s: TrustState, id: AccountId) =>
  s.recons
    .filter((r) => r.account === id)
    .reduce((m, r) => (r.periodEnd > m ? r.periodEnd : m), "");

export function nextRef(s: TrustState, kind: EntryKind) {
  const prefix = kind === "receipt" ? "R" : "P";
  const nums = s.entries
    .filter((e) => e.kind === kind)
    .map((e) => Number(e.ref.replace(/\D/g, "")) || 0);
  return `${prefix}-${String(Math.max(0, ...nums) + 1).padStart(4, "0")}`;
}

/* ---------- matching ---------- */

const dayDiff = (a: string, b: string) =>
  Math.abs((Date.parse(a) - Date.parse(b)) / 86_400_000);

/** Pair unmatched statement lines with unmatched cash book entries of the same amount, closest date first. */
export function autoMatchPairs(
  s: TrustState,
  id: AccountId,
  windowDays = 7,
): { lineId: string; entryId: string }[] {
  const taken = new Set<string>();
  const pairs: { lineId: string; entryId: string }[] = [];
  const lines = s.lines.filter((l) => l.account === id && !l.entryId);
  const entries = s.entries.filter((e) => e.account === id && !e.lineId);
  for (const l of lines) {
    const best = entries
      .filter(
        (e) =>
          !taken.has(e.id) &&
          cents(signed(e)) === cents(l.amount) &&
          dayDiff(e.date, l.date) <= windowDays,
      )
      .sort((x, y) => dayDiff(x.date, l.date) - dayDiff(y.date, l.date))[0];
    if (best) {
      taken.add(best.id);
      pairs.push({ lineId: l.id, entryId: best.id });
    }
  }
  return pairs;
}

/* ---------- reconciliation ---------- */

export type ReconSummary = {
  periodEnd: string;
  cashBook: number;
  statementClosing: number;
  outstandingDeposits: number;
  outstandingPayments: number;
  adjustedBank: number;
  difference: number;
  unmatchedLines: BankLine[];
  unmatchedDeposits: TrustEntry[];
  unmatchedPayments: TrustEntry[];
  negativeLedgers: Ledger[];
  entriesInPeriod: number;
  canSign: boolean;
  blockers: string[];
};

export function summarise(
  s: TrustState,
  id: AccountId,
  periodEnd: string,
  statementClosing: number | null,
): ReconSummary {
  const lock = lockedUntil(s, id);
  const inPeriod = s.entries.filter(
    (e) => e.account === id && e.date <= periodEnd,
  );
  const unmatchedDeposits = inPeriod.filter(
    (e) => e.kind === "receipt" && !e.lineId,
  );
  const unmatchedPayments = inPeriod.filter(
    (e) => e.kind === "payment" && !e.lineId,
  );
  const unmatchedLines = s.lines.filter(
    (l) => l.account === id && !l.entryId && l.date <= periodEnd,
  );
  const cb = cashBook(s, id, periodEnd);
  const dep = dollars(
    unmatchedDeposits.reduce((n, e) => n + cents(e.amount), 0),
  );
  const pay = dollars(
    unmatchedPayments.reduce((n, e) => n + cents(e.amount), 0),
  );
  const closing = statementClosing ?? 0;
  const adjusted = dollars(cents(closing) + cents(dep) - cents(pay));
  const difference = dollars(cents(adjusted) - cents(cb));
  const negativeLedgers = ledgers(s, id).filter((l) => l.balance < 0);

  const blockers: string[] = [];
  if (statementClosing === null)
    blockers.push("Enter the closing balance from the bank statement.");
  if (periodEnd <= lock)
    blockers.push(`This period is already signed (up to ${lock}).`);
  if (unmatchedLines.length)
    blockers.push(
      `${unmatchedLines.length} bank line${unmatchedLines.length === 1 ? "" : "s"} still not in the cash book.`,
    );
  if (statementClosing !== null && cents(difference) !== 0)
    blockers.push(`The difference is ${money(difference)}, not nil.`);
  if (negativeLedgers.length) blockers.push("A client ledger is overdrawn.");
  if (s.lines.filter((l) => l.account === id).length === 0)
    blockers.push("Import the bank statement first.");

  return {
    periodEnd,
    cashBook: cb,
    statementClosing: closing,
    outstandingDeposits: dep,
    outstandingPayments: pay,
    adjustedBank: adjusted,
    difference,
    unmatchedLines,
    unmatchedDeposits,
    unmatchedPayments,
    negativeLedgers,
    entriesInPeriod: inPeriod.length,
    canSign: blockers.length === 0,
    blockers,
  };
}

/* ---------- bank statement CSV ---------- */

function splitCsv(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

export function parseDate(v: string): string | null {
  const t = v.trim();
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(t);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/.exec(t);
  if (m) {
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${y}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  }
  return null;
}

const num = (v: string | undefined) => {
  if (v === undefined || v.trim() === "") return null;
  const cleaned = v.replace(/[$,\s]/g, "").replace(/^\((.*)\)$/, "-$1");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

export type ParsedLine = {
  date: string;
  description: string;
  amount: number;
  balance?: number;
};

/** Reads a bank export. Needs a Date column and either Amount, or Debit and Credit columns. */
export function parseStatement(text: string): {
  lines: ParsedLine[];
  errors: string[];
} {
  const rows = text.split(/\r?\n/).filter((r) => r.trim() !== "");
  const errors: string[] = [];
  if (rows.length < 2)
    return { lines: [], errors: ["The file has no data rows."] };
  const head = splitCsv(rows[0]).map((h) => h.toLowerCase());
  const col = (...names: string[]) =>
    head.findIndex((h) => names.some((n) => h.includes(n)));
  const iDate = col("date");
  const iDesc = col(
    "description",
    "narration",
    "details",
    "particulars",
    "memo",
  );
  const iAmt = head.findIndex((h) => h === "amount" || h.includes("amount"));
  const iDeb = col("debit", "withdrawal");
  const iCre = col("credit", "deposit");
  const iBal = col("balance");
  if (iDate < 0) errors.push("No Date column found.");
  if (iAmt < 0 && (iDeb < 0 || iCre < 0))
    errors.push("Need an Amount column, or both Debit and Credit columns.");
  if (errors.length) return { lines: [], errors };

  const lines: ParsedLine[] = [];
  rows.slice(1).forEach((r, i) => {
    const c = splitCsv(r);
    const date = parseDate(c[iDate] ?? "");
    const amount =
      iAmt >= 0 ? num(c[iAmt]) : (num(c[iCre]) ?? 0) - (num(c[iDeb]) ?? 0);
    if (!date || amount === null || amount === 0) {
      errors.push(
        `Row ${i + 2} skipped: ${!date ? "unreadable date" : "no amount"}.`,
      );
      return;
    }
    const bal = iBal >= 0 ? num(c[iBal]) : null;
    lines.push({
      date,
      description: (iDesc >= 0 ? c[iDesc] : "") || "Bank transaction",
      amount,
      ...(bal !== null ? { balance: bal } : {}),
    });
  });
  return { lines, errors };
}

export function statementCsv(
  lines: { date: string; description: string; amount: number }[],
  openingBalance = 0,
) {
  let bal = openingBalance;
  const body = lines.map((l) => {
    bal = dollars(cents(bal) + cents(l.amount));
    return `${l.date},"${l.description.replace(/"/g, '""')}",${l.amount.toFixed(2)},${bal.toFixed(2)}`;
  });
  return ["Date,Description,Amount,Balance", ...body].join("\n");
}

/* ---------- sample data ---------- */

const entry = (
  e: Omit<TrustEntry, "by" | "engagement" | "narration"> &
    Partial<Pick<TrustEntry, "narration" | "engagement">>,
): TrustEntry => ({
  by: "Dana Whitfield",
  engagement: e.account === "sales" ? "Sales campaign" : "Management period",
  narration: "",
  ...e,
});

export const seedTrust: TrustState = {
  accounts: [
    {
      id: "sales",
      name: "Sales trust account",
      bank: "Example Bank",
      bsb: "062-000",
      last4: "4412",
      opening: 0,
      openingDate: "2026-10-01",
    },
    {
      id: "rentals",
      name: "Rentals trust account",
      bank: "Example Bank",
      bsb: "062-000",
      last4: "7788",
      opening: 0,
      openingDate: "2026-10-01",
    },
  ],
  entries: [
    entry({
      id: "ob1",
      account: "rentals",
      kind: "receipt",
      date: "2026-09-30",
      ref: "OB-001",
      propertyId: "3-bay-st",
      party: "M. Haddad",
      amount: 12400,
      method: "Opening balance",
      narration: "Balance brought forward",
      lineId: "opening",
      reconId: "opening",
    }),
    entry({
      id: "ob2",
      account: "rentals",
      kind: "receipt",
      date: "2026-09-30",
      ref: "OB-002",
      propertyId: "8-jones-ave",
      party: "T. Nguyen",
      amount: 14610,
      method: "Opening balance",
      narration: "Balance brought forward",
      lineId: "opening",
      reconId: "opening",
    }),
    entry({
      id: "ob3",
      account: "rentals",
      kind: "receipt",
      date: "2026-09-30",
      ref: "OB-003",
      propertyId: "88-elliott-st",
      party: "L. Fraser",
      amount: 14000,
      method: "Opening balance",
      narration: "Balance brought forward",
      lineId: "opening",
      reconId: "opening",
    }),
    entry({
      id: "te1",
      account: "sales",
      kind: "receipt",
      date: "2026-10-27",
      ref: "R-0841",
      propertyId: "15-wharf-rd",
      party: "A. Moretti",
      amount: 175000,
      method: "EFT",
      narration: "Deposit on exchange",
    }),
    entry({
      id: "te2",
      account: "sales",
      kind: "receipt",
      date: "2026-10-29",
      ref: "R-0842",
      propertyId: "41-norton-st",
      party: "K. Ohlsson",
      amount: 117000,
      method: "EFT",
      narration: "Deposit on exchange",
    }),
    entry({
      id: "te3",
      account: "rentals",
      kind: "receipt",
      date: "2026-11-01",
      ref: "R-1201",
      propertyId: "8-jones-ave",
      party: "T. Nguyen",
      amount: 3120,
      method: "Direct deposit",
      narration: "Rent, November",
    }),
    entry({
      id: "te4",
      account: "rentals",
      kind: "receipt",
      date: "2026-11-01",
      ref: "R-1202",
      propertyId: "3-bay-st",
      party: "M. Haddad",
      amount: 2880,
      method: "Direct deposit",
      narration: "Rent, November",
    }),
    entry({
      id: "te5",
      account: "rentals",
      kind: "receipt",
      date: "2026-11-02",
      ref: "R-1203",
      propertyId: "88-elliott-st",
      party: "L. Fraser",
      amount: 3600,
      method: "Direct deposit",
      narration: "Bond",
    }),
    entry({
      id: "te6",
      account: "rentals",
      kind: "payment",
      date: "2026-11-03",
      ref: "P-0001",
      propertyId: "3-bay-st",
      party: "M. Haddad",
      amount: 2400,
      method: "EFT",
      authority: "Management agreement",
      authorityRef: "MA-3-Bay",
      payee: "M. Haddad",
      narration: "Rent paid to the landlord",
    }),
  ],
  lines: [],
  recons: [],
};
