/**
 * Reads the statement files Australian banks let customers download: CSV (with or without a heading row),
 * OFX/QFX and QIF. Everything runs in the browser; nothing is uploaded.
 */

export type ImportLine = {
  date: string;
  description: string;
  /** Credits are positive, debits negative. */
  amount: number;
  balance?: number;
  /** The bank's own transaction id (OFX FITID), when the file has one. */
  ref?: string;
};

export type Mapping = {
  /** The first row holds column names. */
  header: boolean;
  date: number;
  description: number;
  /** One signed amount column, or -1 when the file splits debits and credits. */
  amount: number;
  debit: number;
  credit: number;
  balance: number;
};

export type BankFile = {
  format: "CSV" | "OFX" | "QIF";
  lines: ImportLine[];
  /** Rows that could not be read, with the reason. */
  skipped: string[];
  /** Closing balance stated in the file (OFX ledger balance). */
  closing?: number;
  /** Last four digits of the account number the file names, if it names one. */
  accountLast4?: string;
  /** For CSV: the raw rows and the column mapping in use, so it can be changed. */
  csv?: { rows: string[][]; mapping: Mapping; columns: string[] };
};

export const MAX_FILE_BYTES = 5 * 1024 * 1024;

/* ---------- values ---------- */

const MONTHS: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  sept: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

const iso = (y: number, m: number, d: number) => {
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCMonth() !== m - 1) return null; // 31 Feb and the like
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
};
const fullYear = (y: string) => (y.length === 2 ? 2000 + Number(y) : Number(y));

/** The two leading numbers of a numeric date like 12/11/2025, used to work out day and month order. */
function numericParts(v: string): [number, number] | null {
  const m = /^(\d{1,2})[/.\-'](\d{1,2})[/.\-'](\d{2,4})$/.exec(v.trim());
  return m ? [Number(m[1]), Number(m[2])] : null;
}

/** Australian banks write the day first. Only a file whose second number goes above 12 is read month first. */
export function dayFirstFor(values: string[]): boolean {
  let firstOver = false;
  let secondOver = false;
  for (const v of values) {
    const p = numericParts(v);
    if (!p) continue;
    if (p[0] > 12) firstOver = true;
    if (p[1] > 12) secondOver = true;
  }
  return firstOver || !secondOver;
}

export function parseBankDate(raw: string, dayFirst = true): string | null {
  const v = raw.trim().replace(/^"|"$/g, "");
  if (!v) return null;
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(v);
  if (m) return iso(Number(m[1]), Number(m[2]), Number(m[3]));
  m = /^(\d{4})(\d{2})(\d{2})/.exec(v); // OFX: 20261112 or 20261112120000[+10:AEST]
  if (m) return iso(Number(m[1]), Number(m[2]), Number(m[3]));
  m = /^(\d{1,2})[/.\-'](\d{1,2})[/.\-'](\d{2,4})$/.exec(v);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    return dayFirst ? iso(fullYear(m[3]), b, a) : iso(fullYear(m[3]), a, b);
  }
  m = /^(\d{1,2})[\s\-/]([a-z]{3,4})[a-z]*[\s\-/,]+(\d{2,4})$/i.exec(v); // 12 Nov 25, 12-Nov-2026
  if (m && MONTHS[m[2].toLowerCase()])
    return iso(fullYear(m[3]), MONTHS[m[2].toLowerCase()], Number(m[1]));
  m = /^([a-z]{3,4})[a-z]*\s+(\d{1,2}),?\s+(\d{4})$/i.exec(v); // Nov 12, 2026
  if (m && MONTHS[m[1].toLowerCase()])
    return iso(Number(m[3]), MONTHS[m[1].toLowerCase()], Number(m[2]));
  return null;
}

/** Reads money as banks write it: $1,234.56, -12.34, (12.34), 12.34-, 12.34 CR, 12.34 DR, +12.34. */
export function parseMoney(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  let v = raw.trim().replace(/^"|"$/g, "").replace(/\s+/g, " ");
  if (!v) return null;
  let sign = 1;
  const cr = /\s*(cr|dr)\.?$/i.exec(v);
  if (cr) {
    if (cr[1].toLowerCase() === "dr") sign = -1;
    v = v.slice(0, cr.index);
  }
  if (/^\(.*\)$/.test(v)) {
    sign = -sign;
    v = v.slice(1, -1);
  }
  if (/-$/.test(v)) {
    sign = -sign;
    v = v.slice(0, -1);
  }
  v = v.replace(/[$,\s]|AUD/gi, "");
  if (!/^[+-]?\d*\.?\d+$/.test(v)) return null;
  const n = Number(v) * sign;
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

const last4 = (v: string | undefined) => {
  const d = (v ?? "").replace(/\D/g, "");
  return d.length >= 4 ? d.slice(-4) : undefined;
};

/* ---------- CSV ---------- */

/** Splits CSV text into rows, honouring quotes (including line breaks inside quotes). */
export function csvRows(text: string): string[][] {
  const src = text.replace(/^﻿/, "");
  const firstLine = src.split(/\r?\n/, 1)[0] ?? "";
  const counts = [",", ";", "\t"].map((d) => firstLine.split(d).length - 1);
  const delim = [",", ";", "\t"][counts.indexOf(Math.max(...counts))] || ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (q) {
      if (ch === '"' && src[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === delim) {
      row.push(cur.trim());
      cur = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cur.trim());
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
      cur = "";
    } else cur += ch;
  }
  row.push(cur.trim());
  if (row.some((c) => c !== "")) rows.push(row);
  return rows;
}

const has = (h: string, words: string[]) => words.some((w) => h.includes(w));

/** Works out which column is which, from headings if the file has them, otherwise from the values. */
export function guessMapping(rows: string[][]): Mapping {
  const none: Mapping = {
    header: false,
    date: -1,
    description: -1,
    amount: -1,
    debit: -1,
    credit: -1,
    balance: -1,
  };
  if (!rows.length) return none;
  const first = rows[0];
  const header =
    !first.some((c) => parseBankDate(c) !== null) &&
    first.some((c) => /[a-z]/i.test(c) && parseMoney(c) === null);

  if (header) {
    const h = first.map((c) => c.toLowerCase().trim());
    const used = new Set<number>();
    const pick = (test: (x: string) => boolean) => {
      const i = h.findIndex((x, j) => !used.has(j) && test(x));
      if (i >= 0) used.add(i);
      return i;
    };
    const exact = pick((x) =>
      ["date", "transaction date", "posted date", "posting date"].includes(x),
    );
    const date =
      exact >= 0
        ? exact
        : pick((x) => x.includes("date") && !x.includes("value"));
    const debit = pick((x) =>
      has(x, ["debit", "withdrawal", "money out", "paid out"]),
    );
    const credit = pick((x) =>
      has(x, ["credit", "deposit", "money in", "paid in"]),
    );
    const balance = pick((x) => x.includes("balance"));
    const amount = pick(
      (x) => x.includes("amount") || x === "value" || x === "amt",
    );
    let description = -1;
    for (const word of [
      "description",
      "narrative",
      "narration",
      "transaction details",
      "details",
      "particulars",
      "payee",
      "merchant",
      "memo",
      "reference",
    ]) {
      description = pick((x) => x.includes(word));
      if (description >= 0) break;
    }
    return {
      header: true,
      date,
      description,
      amount,
      debit: amount >= 0 ? -1 : debit,
      credit: amount >= 0 ? -1 : credit,
      balance,
    };
  }

  // No headings (CommBank, ANZ, older NAB): read the values.
  // Judge columns only on rows that carry a date, so footers like "Closing balance" don't skew it.
  const dated = rows
    .slice(0, 40)
    .filter((r) => r.some((c) => parseBankDate(c) !== null));
  const sample = (dated.length ? dated : rows).slice(0, 30);
  const width = Math.max(...sample.map((r) => r.length));
  const score = (i: number, test: (v: string) => boolean) => {
    const vals = sample.map((r) => r[i] ?? "").filter((v) => v !== "");
    return vals.length >= sample.length * 0.8
      ? vals.filter(test).length / vals.length
      : 0;
  };
  const cols = Array.from({ length: width }, (_, i) => i);
  const date =
    cols.find((i) => score(i, (v) => parseBankDate(v) !== null) >= 0.9) ?? -1;
  const numeric = cols.filter(
    (i) => i !== date && score(i, (v) => parseMoney(v) !== null) >= 0.9,
  );
  const textLen = (i: number) =>
    sample.reduce((n, r) => n + (r[i] ?? "").length, 0);
  const description =
    cols
      .filter((i) => i !== date && !numeric.includes(i))
      .sort((a, b) => textLen(b) - textLen(a))[0] ?? -1;
  return {
    ...none,
    date,
    description,
    amount: numeric[0] ?? -1,
    balance: numeric[1] ?? -1,
  };
}

export function mappingReady(m: Mapping) {
  return m.date >= 0 && (m.amount >= 0 || (m.debit >= 0 && m.credit >= 0));
}

/** Turns CSV rows into lines with a given mapping. */
export function applyMapping(
  rows: string[][],
  m: Mapping,
): { lines: ImportLine[]; skipped: string[] } {
  const body = m.header ? rows.slice(1) : rows;
  const offset = m.header ? 2 : 1;
  const skipped: string[] = [];
  if (!mappingReady(m))
    return {
      lines: [],
      skipped: [
        "Choose a Date column and an Amount (or Debit and Credit) column.",
      ],
    };
  const dayFirst = dayFirstFor(body.map((r) => r[m.date] ?? ""));
  const lines: ImportLine[] = [];
  body.forEach((r, i) => {
    const date = parseBankDate(r[m.date] ?? "", dayFirst);
    let amount: number | null;
    if (m.amount >= 0) amount = parseMoney(r[m.amount]);
    else {
      const out = parseMoney(r[m.debit]);
      const inn = parseMoney(r[m.credit]);
      amount =
        out === null && inn === null
          ? null
          : Math.round((Math.abs(inn ?? 0) - Math.abs(out ?? 0)) * 100) / 100;
    }
    if (!date) {
      // Footer lines such as "Closing balance" or "Total" are expected; only report rows that look like data.
      if (r.filter((c) => c !== "").length > 1)
        skipped.push(
          `Row ${i + offset}: the date "${r[m.date] ?? ""}" could not be read.`,
        );
      return;
    }
    if (amount === null || amount === 0) {
      skipped.push(`Row ${i + offset}: no amount.`);
      return;
    }
    const balance = m.balance >= 0 ? parseMoney(r[m.balance]) : null;
    lines.push({
      date,
      description:
        (m.description >= 0 ? r[m.description] : "")
          ?.replace(/\s+/g, " ")
          .trim() || "Bank transaction",
      amount,
      ...(balance !== null ? { balance } : {}),
    });
  });
  return { lines: chronological(lines), skipped };
}

/** Banks list newest first or oldest first. Store oldest first, keeping same-day order. */
function chronological(lines: ImportLine[]) {
  if (lines.length > 1 && lines[0].date > lines[lines.length - 1].date)
    return [...lines].reverse();
  return lines;
}

/* ---------- OFX / QFX ---------- */

function ofxTag(block: string, tag: string) {
  const m = new RegExp(`<${tag}>([^<\\r\\n]*)`, "i").exec(block);
  return m ? m[1].trim() : undefined;
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'");

function parseOfx(text: string): BankFile {
  const blocks = text.split(/<STMTTRN>/i).slice(1);
  const skipped: string[] = [];
  const lines: ImportLine[] = [];
  blocks.forEach((raw, i) => {
    const b = raw.split(/<\/STMTTRN>/i)[0];
    const date = parseBankDate(ofxTag(b, "DTPOSTED") ?? "");
    const amount = parseMoney(ofxTag(b, "TRNAMT"));
    if (!date || amount === null || amount === 0) {
      skipped.push(`Transaction ${i + 1}: ${!date ? "no date" : "no amount"}.`);
      return;
    }
    const name = decode(ofxTag(b, "NAME") ?? "");
    const memo = decode(ofxTag(b, "MEMO") ?? "");
    const description =
      [name, memo && memo !== name ? memo : ""]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      ofxTag(b, "TRNTYPE") ||
      "Bank transaction";
    const ref = ofxTag(b, "FITID");
    lines.push({ date, description, amount, ...(ref ? { ref } : {}) });
  });
  lines.sort((a, b) => a.date.localeCompare(b.date));
  const ledger =
    /<LEDGERBAL>([\s\S]*?)(<\/LEDGERBAL>|<AVAILBAL>|$)/i.exec(text)?.[1] ?? "";
  const closing = parseMoney(ofxTag(ledger, "BALAMT"));
  const asOf = parseBankDate(ofxTag(ledger, "DTASOF") ?? "");
  // The ledger balance is the closing balance when it is dated on or after the last transaction.
  if (
    closing !== null &&
    lines.length &&
    (!asOf || asOf >= lines[lines.length - 1].date)
  )
    lines[lines.length - 1] = { ...lines[lines.length - 1], balance: closing };
  return {
    format: "OFX",
    lines,
    skipped,
    ...(closing !== null ? { closing } : {}),
    accountLast4: last4(ofxTag(text, "ACCTID")),
  };
}

/* ---------- QIF ---------- */

function parseQif(text: string): BankFile {
  const records: Record<string, string>[] = [];
  let cur: Record<string, string> = {};
  for (const raw of text.replace(/^﻿/, "").split(/\r?\n/)) {
    const l = raw.trimEnd();
    if (!l || l.startsWith("!")) continue;
    if (l === "^") {
      if (Object.keys(cur).length) records.push(cur);
      cur = {};
      continue;
    }
    const k = l[0];
    if (!(k in cur)) cur[k] = l.slice(1).trim();
  }
  if (Object.keys(cur).length) records.push(cur);
  const dayFirst = dayFirstFor(records.map((r) => r.D ?? ""));
  const skipped: string[] = [];
  const lines: ImportLine[] = [];
  records.forEach((r, i) => {
    const date = parseBankDate(r.D ?? "", dayFirst);
    const amount = parseMoney(r.T ?? r.U);
    if (!date || amount === null || amount === 0) {
      skipped.push(`Transaction ${i + 1}: ${!date ? "no date" : "no amount"}.`);
      return;
    }
    const description =
      [r.P, r.M && r.M !== r.P ? r.M : ""].filter(Boolean).join(" ").trim() ||
      "Bank transaction";
    lines.push({ date, description, amount });
  });
  return { format: "QIF", lines: chronological(lines), skipped };
}

/* ---------- entry point ---------- */

export function readBankFile(
  name: string,
  text: string,
): BankFile | { error: string } {
  const lower = name.toLowerCase();
  if (/\.(xlsx?|xlsm)$/.test(lower) || text.startsWith("PK"))
    return {
      error:
        "That is an Excel file. In internet banking choose CSV, OFX or QIF instead, or open it in Excel and save it as CSV.",
    };
  if (lower.endsWith(".pdf") || text.startsWith("%PDF"))
    return {
      error:
        "PDF statements can't be read. In internet banking, export your transactions as CSV, OFX or QIF.",
    };
  if (
    /<STMTTRN>/i.test(text) ||
    /^\s*(OFXHEADER|<\?xml[\s\S]*<OFX>)/i.test(text)
  ) {
    const f = parseOfx(text);
    return f.lines.length || f.skipped.length
      ? f
      : { error: "That OFX file has no transactions in it." };
  }
  if (/^\s*!Type:/im.test(text) || /\.qif$/.test(lower)) {
    const f = parseQif(text);
    return f.lines.length || f.skipped.length
      ? f
      : { error: "That QIF file has no transactions in it." };
  }
  const rows = csvRows(text);
  if (!rows.length) return { error: "The file is empty." };
  const mapping = guessMapping(rows);
  const { lines, skipped } = applyMapping(rows, mapping);
  const width = Math.max(...rows.slice(0, 30).map((r) => r.length));
  const columns = Array.from({ length: width }, (_, i) =>
    mapping.header && rows[0][i] ? rows[0][i] : `Column ${i + 1}`,
  );
  const acctCol = mapping.header
    ? rows[0].findIndex((h) => /account/i.test(h) && !/type|name/i.test(h))
    : -1;
  return {
    format: "CSV",
    lines,
    skipped,
    accountLast4: acctCol >= 0 ? last4(rows[1]?.[acctCol]) : undefined,
    csv: { rows, mapping, columns },
  };
}
