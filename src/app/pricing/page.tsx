import type { Metadata } from "next";
import { ButtonLink, Eyebrow, PageHeader } from "@/components/Sections";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = { title: "Pricing" };

const plans = [
  {
    name: "Agent",
    price: "$39",
    unit: "per agent, per month",
    blurb: "For independent agents who want every file clean.",
    features: ["License and CE tracking", "Transaction checklists", "Disclosure storage", "Email reminders"],
    cta: "Book a demo",
    featured: false,
  },
  {
    name: "Brokerage",
    price: "$29",
    unit: "per agent, per month, 10 agent minimum",
    blurb: "For offices that need review queues and oversight.",
    features: ["Everything in Agent", "Broker review queues", "Compliance board", "Audit export packages", "Role-based access"],
    cta: "Book a demo",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "priced to your offices",
    blurb: "For franchises with their own rules and systems.",
    features: ["Everything in Brokerage", "Custom checklists by market", "Single sign-on", "Dedicated onboarding"],
    cta: "Talk to us",
    featured: false,
  },
];

const faqs = [
  ["Can I change plans later?", "Yes. Move up or down as your team changes. Billing adjusts at your next cycle."],
  ["Is there a free trial?", "Book a demo and we will set up a guided trial with your own checklists."],
  ["Do the plans cover every state?", "Plans cover the markets you operate in. Enterprise supports custom rules per market."],
];

export default function Pricing() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title={
          <>
            Priced per agent. No <span className="tape">surprises</span> at renewal.
          </>
        }
      >
        Pick the plan that fits today. Prices are starting points and can change before launch.
      </PageHeader>

      <section className="mx-auto mt-14 grid max-w-6xl items-end gap-6 px-5 sm:px-8 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            data-reveal
            className={`flex flex-col rounded-3xl p-8 ${
              p.featured ? "bg-ink text-bg md:pb-12 md:pt-12" : "border border-line bg-surface"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">{p.name}</h2>
              {p.featured && (
                <span className="rounded-full bg-accent px-3 py-1 font-mono text-[0.65rem] font-medium uppercase tracking-widest text-ink">
                  Most chosen
                </span>
              )}
            </div>
            <p className="mt-6 font-display text-6xl font-bold tracking-tight">{p.price}</p>
            <p className={`mt-1 text-sm ${p.featured ? "text-bg/70" : "text-ink-soft"}`}>{p.unit}</p>
            <p className={`mt-5 ${p.featured ? "text-bg/85" : "text-ink-soft"}`}>{p.blurb}</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Icon name="check" className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? "text-accent" : ""}`} /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink href={`/demo?plan=${p.name}`} variant={p.featured ? "light" : "ghost"}>
                {p.cta}
              </ButtonLink>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-24 grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-reveal>
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight">Before you ask.</h2>
        </div>
        <div data-reveal className="border-t border-ink">
          {faqs.map(([q, a]) => (
            <details key={q} className="group border-b border-line py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold">
                {q}
                <span className="font-mono text-lg transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-lg text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
