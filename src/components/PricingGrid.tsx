"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "./Icons";

type Plan = {
  name: string;
  icon: IconName;
  blurb: string;
  price: string;
  badge?: string;
  top: string[];
  lead: string;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Agent Pro",
    icon: "user",
    blurb: "For one sales team inside an agency, bought by its agent.",
    price: "A$99",
    top: [
      "Up to 5 people, never charged per seat",
      "10 GB in the document vault",
      "500 assistant queries a month",
    ],
    lead: "What's included:",
    features: [
      "One team: the agent, an associate, a PA and marketing",
      "Unlimited properties and engagements",
      "Sales and rentals trust accounting",
      "The policy library, with sign-off tracked by person and version",
      "Licence and CPD alerts at 90, 60, 30 and 7 days",
    ],
  },
  {
    name: "Boutique",
    icon: "store",
    blurb:
      "For a single-office agency: a few sales teams and property management.",
    price: "A$249",
    badge: "Popular",
    top: [
      "Up to 40 people, never charged per seat",
      "40 GB in the document vault",
      "2,000 assistant queries a month",
    ],
    lead: "Everything in Agent Pro, for the whole agency:",
    features: [
      "Up to four teams, each seeing its own engagements",
      "Accreditations that gate signing",
      "The underquoting guard on every listing",
      "One-click audit pack export",
      "Priority support",
    ],
  },
  {
    name: "Large",
    icon: "building",
    blurb: "For a large or multi-branch agency.",
    price: "A$369",
    top: [
      "Up to 80 people, never charged per seat",
      "100 GB in the document vault",
      "Unlimited assistant queries",
    ],
    lead: "Everything in Boutique:",
    features: [
      "Agency-wide compliance reporting",
      "Bulk import of the rent roll",
      "Registers rolled up across branches",
      "Unlimited assistant queries",
      "Priority support",
    ],
  },
];

const DEFAULT = "Boutique";

export function PricingGrid() {
  const [active, setActive] = useState(DEFAULT);

  return (
    <div
      data-stagger
      className="mx-auto mt-14 grid max-w-6xl items-stretch gap-6 px-5 sm:px-8 md:grid-cols-3"
      onMouseLeave={() => setActive(DEFAULT)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setActive(DEFAULT);
      }}
    >
      {plans.map((p) => {
        const on = active === p.name;
        return (
          <article
            key={p.name}
            onMouseEnter={() => setActive(p.name)}
            onFocus={() => setActive(p.name)}
            className={`flex flex-col rounded-[2rem] border p-8 transition-all duration-300 ease-out ${
              on
                ? "z-10 border-ink bg-ink text-bg shadow-[0_30px_70px_-30px_oklch(0.24_0.05_258/0.6)] md:-translate-y-2 md:scale-[1.04]"
                : "border-line bg-surface"
            }`}
          >
            <div className="flex items-start justify-between">
              <span className={on ? "text-accent" : "text-ink"}>
                <Icon name={p.icon} className="h-9 w-9" />
              </span>
              {p.badge && (
                <span className="rounded-full bg-accent px-3 py-1 font-mono text-[0.65rem] font-medium uppercase tracking-widest text-ink">
                  {p.badge}
                </span>
              )}
            </div>

            <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight">
              {p.name}
            </h2>
            <p
              className={`mt-2 min-h-12 text-sm ${on ? "text-bg/75" : "text-ink-soft"}`}
            >
              {p.blurb}
            </p>

            <p className="mt-6 font-display text-4xl font-extrabold tracking-tight">
              {p.price}
            </p>
            <p
              className={`mt-1 text-sm ${on ? "text-bg/75" : "text-ink-soft"}`}
            >
              per month + GST
            </p>
            <p className={`text-sm ${on ? "text-bg/75" : "text-ink-soft"}`}>
              Billed monthly · No lock-in contract · Cancel anytime
            </p>
            <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink">
              7-day free trial
            </p>

            <Link
              href="https://auth.briesa.com/signup"
              className={`mt-7 rounded-xl px-5 py-3.5 text-center font-semibold transition-colors duration-200 ${
                on
                  ? "bg-bg text-ink hover:bg-surface"
                  : "bg-ink text-bg hover:bg-ink/85"
              }`}
            >
              Start your free trial
            </Link>

            <hr className={`my-7 ${on ? "border-bg/20" : "border-line"}`} />

            <ul className="space-y-3 font-medium">
              {p.top.map((t) => (
                <li key={t} className="flex gap-3">
                  <span
                    className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${on ? "bg-accent" : "bg-ink"}`}
                  />
                  {t}
                </li>
              ))}
            </ul>

            <p className="mt-7 font-bold">{p.lead}</p>
            <ul
              className={`mt-4 space-y-3 text-sm ${on ? "text-bg/80" : "text-ink-soft"}`}
            >
              {p.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <Icon
                    name="check"
                    className={`mt-0.5 h-4 w-4 shrink-0 ${on ? "text-accent" : "text-ink"}`}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
