import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/Sections";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = { title: "Pricing" };

const plans = [
  {
    name: "Agent",
    price: "$39",
    unit: "per agent / month",
    blurb: "For independent agents who want a clean, compliant file every time.",
    features: ["License & CE tracking", "Transaction checklists", "Disclosure storage", "Email reminders"],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Brokerage",
    price: "$29",
    unit: "per agent / month, 10 agent minimum",
    blurb: "For brokerages that need review workflows and office-wide oversight.",
    features: ["Everything in Agent", "Broker review queues", "Compliance dashboard", "Audit export packages", "Role-based access"],
    cta: "Book a demo",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "tailored to your offices",
    blurb: "For franchises and multi-office groups with custom rules and integrations.",
    features: ["Everything in Brokerage", "Custom checklists by market", "SSO & advanced security", "Dedicated onboarding"],
    cta: "Talk to sales",
    featured: false,
  },
];

const faqs = [
  ["Can I change plans later?", "Yes. Move between plans as your team grows; billing adjusts at your next cycle."],
  ["Is there a free trial?", "Book a demo and we will set up a guided trial using your own checklists."],
  ["Do prices include all states?", "Plans cover the markets you operate in. Enterprise supports custom rules per market."],
];

export default function Pricing() {
  return (
    <>
      <PageHeader eyebrow="Pricing" title="Simple pricing that scales with your team.">
        Pick the plan that fits today. Prices shown are illustrative starting points and can be adjusted before launch.
      </PageHeader>

      <section className="mx-auto mt-12 grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`flex flex-col rounded-3xl border p-7 ${
              p.featured ? "border-primary bg-card shadow-xl shadow-primary/15 ring-2 ring-primary" : "border-border bg-card"
            }`}
          >
            {p.featured && (
              <span className="mb-3 w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary">Most popular</span>
            )}
            <h2 className="text-xl font-semibold text-ink">{p.name}</h2>
            <p className="mt-4 text-4xl font-bold text-ink">{p.price}</p>
            <p className="text-sm text-muted-foreground">{p.unit}</p>
            <p className="mt-4 text-sm text-muted-foreground">{p.blurb}</p>
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className={`mt-8 cursor-pointer rounded-xl px-5 py-3 text-center font-semibold transition-colors duration-200 ${
                p.featured ? "bg-primary text-on-primary hover:bg-primary-dark" : "border border-primary text-primary hover:bg-primary/10"
              }`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-20 max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-ink">Frequently asked questions</h2>
        <dl className="mt-8 space-y-6">
          {faqs.map(([q, a]) => (
            <div key={q}>
              <dt className="font-semibold text-ink">{q}</dt>
              <dd className="mt-1 text-muted-foreground">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
