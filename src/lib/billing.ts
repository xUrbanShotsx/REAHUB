/**
 * Plan changes, worked out the way Stripe does it:
 * - Upgrades start now. The unused part of the old plan is credited, the same part of the new plan is
 *   charged, and the difference (plus GST) is invoiced straight away.
 * - Downgrades start at the next billing date. There is no refund for the rest of the current period.
 * - During the free trial, plans switch straight away with nothing charged.
 * When Stripe is connected, its preview invoice gives these figures and this file is only the fallback.
 */

import { PLANS, type PlanName } from "./demo-data";

export const GST_RATE = 0.1;
/** Stripe's smallest card charge in AUD. Smaller amounts are carried to the next invoice. */
export const MIN_CHARGE = 0.5;
const round = (n: number) => Math.round(n * 100) / 100;

/** Billing runs by calendar month, renewing on the 1st. */
export function billingPeriod(now: Date) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end };
}

export type Proration = {
  from: PlanName;
  to: PlanName;
  periodStart: Date;
  /** The next billing date. */
  periodEnd: Date;
  daysInPeriod: number;
  /** Days left, to the minute (e.g. 14.6). */
  daysLeft: number;
  /** Charge for the new plan for the rest of the period. */
  charge: number;
  /** Credit for the unused part of the old plan (a positive number). */
  credit: number;
  subtotal: number;
  gst: number;
  total: number;
};

export function prorate(from: PlanName, to: PlanName, now: Date): Proration {
  const { start, end } = billingPeriod(now);
  const span = end.getTime() - start.getTime();
  // Count whole minutes, as a bank statement would read it; Stripe counts seconds.
  const left = Math.max(
    0,
    Math.floor((end.getTime() - now.getTime()) / 60_000) * 60_000,
  );
  const fraction = left / span;
  const charge = round(PLANS[to].price * fraction);
  const credit = round(PLANS[from].price * fraction);
  const subtotal = round(charge - credit);
  const gst = round(subtotal * GST_RATE);
  return {
    from,
    to,
    periodStart: start,
    periodEnd: end,
    daysInPeriod: Math.round(span / 86_400_000),
    daysLeft: left / 86_400_000,
    charge,
    credit,
    subtotal,
    gst,
    total: round(subtotal + gst),
  };
}

export type ChangeKind = "upgrade" | "downgrade" | "trial";

export function changeKind(
  from: PlanName,
  to: PlanName,
  inTrial: boolean,
): ChangeKind {
  if (inTrial) return "trial";
  return PLANS[to].price > PLANS[from].price ? "upgrade" : "downgrade";
}

export const withGst = (price: number) => round(price * (1 + GST_RATE));

/* ---------- invoices ---------- */

export type InvoiceLine = { label: string; amount: number };

export type Invoice = {
  id: string;
  /** ISO date issued. */
  date: string;
  /** What it covers, e.g. "November 2026" or "Plan change, Boutique to Large". */
  title: string;
  lines: InvoiceLine[];
  subtotal: number;
  gst: number;
  total: number;
  status: "Paid";
};

export function makeInvoice(
  id: string,
  date: string,
  title: string,
  lines: InvoiceLine[],
): Invoice {
  const subtotal = round(lines.reduce((n, l) => n + l.amount, 0));
  const gst = round(subtotal * GST_RATE);
  return {
    id,
    date,
    title,
    lines,
    subtotal,
    gst,
    total: round(subtotal + gst),
    status: "Paid",
  };
}

/** The demo agency's past monthly invoices, on Boutique. */
export const SEED_INVOICES: Invoice[] = [
  ["INV-2026-011", "2026-11-01", "November 2026"],
  ["INV-2026-010", "2026-10-01", "October 2026"],
  ["INV-2026-009", "2026-09-01", "September 2026"],
].map(([id, date, title]) =>
  makeInvoice(id, date, title, [
    { label: `Boutique plan, ${title}`, amount: PLANS.Boutique.price },
  ]),
);

export function nextInvoiceId(invoices: Invoice[], year: number) {
  const n = invoices.reduce((max, i) => {
    const m = /^INV-(\d{4})-(\d+)$/.exec(i.id);
    return m && Number(m[1]) === year ? Math.max(max, Number(m[2])) : max;
  }, 0);
  return `INV-${year}-${String(n + 1).padStart(3, "0")}`;
}

const dayMonth = (d: Date) =>
  d.toLocaleDateString("en-AU", { day: "numeric", month: "short" });

/** Invoice lines for an upgrade, in the wording Stripe uses. */
export function prorationLines(p: Proration): InvoiceLine[] {
  const range = `${dayMonth(new Date())} to ${dayMonth(new Date(p.periodEnd.getTime() - 86_400_000))}`;
  return [
    { label: `Remaining time on ${p.to}, ${range}`, amount: p.charge },
    { label: `Unused time on ${p.from}, ${range}`, amount: -p.credit },
  ];
}
