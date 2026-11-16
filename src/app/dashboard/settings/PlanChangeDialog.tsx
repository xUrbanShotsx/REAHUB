"use client";

import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/Icons";
import { btnDark, btnLight } from "@/components/app/ui";
import {
  MIN_CHARGE,
  prorate,
  withGst,
  type ChangeKind,
  type Proration,
} from "@/lib/billing";
import { PLANS, type PlanName } from "@/lib/demo-data";

const money = (n: number) =>
  `${n < 0 ? "−" : ""}A$${Math.abs(n).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const longDate = (d: Date) =>
  d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const shortDate = (d: Date) =>
  d.toLocaleDateString("en-AU", { day: "numeric", month: "short" });

/** Shows what a plan change costs and when it starts, then confirms it. */
export function PlanChangeDialog({
  from,
  to,
  kind,
  trialEnds,
  card,
  people,
  onClose,
  onUpgrade,
  onDowngrade,
  onTrialSwitch,
}: {
  from: PlanName;
  to: PlanName;
  kind: ChangeKind;
  trialEnds?: string;
  card?: { brand: string; last4: string };
  people: number;
  onClose: () => void;
  onUpgrade: (p: Proration) => void;
  onDowngrade: (on: Date) => void;
  onTrialSwitch: () => void;
}) {
  const uid = useId();
  // Priced once, when the dialog opens, like a Stripe preview invoice.
  const [p] = useState(() => prorate(from, to, new Date()));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const next = PLANS[to];
  const cardText = card
    ? `${card.brand} ending ${card.last4}`
    : "the card on file";
  const carried = kind === "upgrade" && p.total < MIN_CHARGE;
  const lastDay = new Date(p.periodEnd.getTime() - 86_400_000);
  const daysLeft = Math.max(1, Math.round(p.daysLeft));

  const title =
    kind === "upgrade"
      ? `Upgrade to ${to}`
      : kind === "downgrade"
        ? `Move to ${to}`
        : `Switch to ${to}`;

  const confirm = () => {
    setBusy(true);
    if (kind === "upgrade") onUpgrade(p);
    else if (kind === "downgrade") onDowngrade(p.periodEnd);
    else onTrialSwitch();
  };

  const row = (label: string, value: string, strong = false, sub?: string) => (
    <div
      className={`flex items-start justify-between gap-4 py-2 ${strong ? "font-semibold" : ""}`}
    >
      <span>
        {label}
        {sub && (
          <span className="block text-xs font-normal text-ink-soft">{sub}</span>
        )}
      </span>
      <span className="shrink-0 tabular-nums">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-ink/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-t`}
        data-lenis-prevent
        className="relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-bg p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              {from} → {to}
            </p>
            <h2
              id={`${uid}-t`}
              className="mt-1 font-display text-2xl font-extrabold tracking-tight"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 rounded-full p-2 text-ink-soft hover:bg-tint hover:text-ink"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        {kind === "upgrade" && (
          <>
            <p className="mt-2 text-sm text-ink-soft">
              {to} starts now. You pay the difference for the {daysLeft} day
              {daysLeft === 1 ? "" : "s"} left in this billing period.
            </p>
            <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface px-4 text-sm">
              {row(
                `${to} for the rest of the period`,
                money(p.charge),
                false,
                `${shortDate(new Date())} to ${shortDate(lastDay)}, A$${next.price} a month`,
              )}
              {row(
                `Less unused time on ${from}`,
                money(-p.credit),
                false,
                `A$${PLANS[from].price} a month, already paid`,
              )}
              {row("Subtotal", money(p.subtotal))}
              {row("GST (10%)", money(p.gst))}
              {row("Due today", money(carried ? 0 : p.total), true)}
            </div>
            <p className="mt-3 text-xs text-ink-soft">
              {carried
                ? `${money(p.total)} is below the smallest card charge, so it is added to your ${shortDate(p.periodEnd)} invoice instead.`
                : `Charged to ${cardText} today, with a tax invoice.`}{" "}
              Then A${next.price} + GST ({money(withGst(next.price))}) a month
              from {longDate(p.periodEnd)}.
            </p>
          </>
        )}

        {kind === "downgrade" && (
          <>
            <p className="mt-2 text-sm text-ink-soft">
              You keep {from} until the end of this billing period, then move to{" "}
              {to}.
            </p>
            <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface px-4 text-sm">
              {row(`${from} until`, longDate(lastDay))}
              {row(`${to} from`, longDate(p.periodEnd), true)}
              {row(
                "New monthly price",
                `A$${next.price} + GST`,
                false,
                `${money(withGst(next.price))} including GST`,
              )}
              {row("Due today", money(0))}
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-ink-soft">
              <li className="flex gap-2">
                <Icon
                  name="check"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
                />
                No refund for the rest of this month, as you keep {from} until
                then.
              </li>
              <li className="flex gap-2">
                <Icon
                  name="check"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
                />
                {to} allows {next.people} people. You have {people}.
              </li>
              <li className="flex gap-2">
                <Icon
                  name="check"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
                />
                You can cancel the change any time before{" "}
                {longDate(p.periodEnd)}.
              </li>
            </ul>
          </>
        )}

        {kind === "trial" && (
          <>
            <p className="mt-2 text-sm text-ink-soft">
              You are on a free trial, so the switch happens now and nothing is
              charged.
            </p>
            <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface px-4 text-sm">
              {row("Due today", money(0), true)}
              {row(
                trialEnds
                  ? `From ${longDate(new Date(`${trialEnds}T00:00:00`))}`
                  : "When the trial ends",
                `A$${next.price} + GST a month`,
                false,
                `${money(withGst(next.price))} including GST, charged to ${cardText}`,
              )}
            </div>
          </>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`${btnLight} justify-center`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={busy}
            className={`${btnDark} justify-center disabled:opacity-60`}
          >
            {kind === "upgrade"
              ? carried
                ? `Upgrade to ${to}`
                : `Pay ${money(p.total)} and upgrade`
              : kind === "downgrade"
                ? `Move to ${to} on ${shortDate(p.periodEnd)}`
                : `Switch to ${to}`}
          </button>
        </div>
        <p className="mt-4 text-center text-[11px] text-ink-soft">
          Worked out to the minute, the same way the payment provider will. Demo
          only: no card is charged.
        </p>
      </div>
    </div>
  );
}
