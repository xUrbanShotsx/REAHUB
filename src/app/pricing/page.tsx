import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, faqPage, software } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

import { Eyebrow, PageHeader } from "@/components/Sections";
import { Icon } from "@/components/Icons";
import { PricingGrid } from "@/components/PricingGrid";

export const metadata: Metadata = pageMeta({
  title: "Pricing from A$99 a Month, 7-Day Free Trial",
  description:
    "REAHUB plans from A$99 a month plus GST. 7-day free trial, no lock-in contract, cancel anytime. Priced per team, never per seat.",
  path: "/pricing",
});

const faqs = [
  [
    "Is there a free trial?",
    "Yes. Every plan starts with a 7-day free trial, and your first charge is on day 8.",
  ],
  [
    "Do you charge per seat?",
    "No. The number of people who sign in decides which plan fits, and everyone inside it has an account of their own.",
  ],
  [
    "Is GST added to the prices?",
    "Yes. All prices are in AUD plus 10% GST, billed monthly with no lock-in contract.",
  ],
  [
    "What happens when we cancel?",
    "Cancel any time and access continues to the end of the month you have paid for.",
  ],
  [
    "Can we change plan later?",
    "Yes. A plan is a limit, not a different system, so your data stays exactly as it is when you move up or down.",
  ],
  [
    "Does our auditor need a seat?",
    "No. An auditor invited by an agency gets a free read-only account that sees everything and changes nothing.",
  ],
];

const limits = [
  ["People who sign in", "5", "40", "80"],
  ["Teams", "1", "4", "8"],
  ["Document vault", "10 GB", "40 GB", "100 GB"],
  ["Assistant queries a month", "500", "2,000", "Unlimited"],
  ["Properties, campaigns, trust", "Unlimited", "Unlimited", "Unlimited"],
];

export default function Pricing() {
  return (
    <>
      <JsonLd
        data={[
          software,
          faqPage(faqs.map(([q, a]) => ({ q, a }))),
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="Pricing"
        title={
          <>
            Priced per team, never per <span className="tape">seat</span>.
          </>
        }
      >
        Every plan starts with a 7-day free trial, with no lock-in contract and
        cancel anytime. Hover a plan to compare.
      </PageHeader>

      <ul
        data-reveal
        className="mx-auto mt-10 flex max-w-6xl flex-wrap gap-x-8 gap-y-3 px-5 font-semibold sm:px-8"
      >
        {["7-day free trial", "No lock-in contracts", "Cancel anytime"].map(
          (t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-bg">
                <Icon name="check" className="h-3.5 w-3.5" />
              </span>
              {t}
            </li>
          ),
        )}
      </ul>

      <PricingGrid />

      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <div data-reveal>
          <Eyebrow>Limits by plan</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-tight">
            Everything else is unlimited, on every plan.
          </h2>
        </div>
        <div data-reveal className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-t border-ink text-left text-sm">
            <thead>
              <tr className="font-mono text-xs uppercase tracking-widest text-ink-soft">
                <th className="py-4 font-medium">&nbsp;</th>
                <th className="py-4 font-medium">Agent Pro</th>
                <th className="py-4 font-medium">Boutique</th>
                <th className="py-4 font-medium">Large</th>
              </tr>
            </thead>
            <tbody>
              {limits.map(([k, ...v]) => (
                <tr key={k} className="row-hover border-t border-line">
                  <th className="py-4 pr-4 font-semibold">{k}</th>
                  {v.map((c, i) => (
                    <td key={i} className="py-4">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p data-reveal className="mt-8 max-w-2xl text-ink-soft">
          Outgrown the bands? The Group plan is for multi-office networks:
          several trust accounts, single sign-on, white label and a named
          contact. We price it with you.
        </p>
      </section>

      <section className="mx-auto mt-24 grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-reveal>
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight">
            Before you ask.
          </h2>
        </div>
        <div data-reveal className="border-t border-ink">
          {faqs.map(([q, a]) => (
            <details key={q} className="group border-b border-line py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold">
                {q}
                <span className="font-mono text-lg transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-lg text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
