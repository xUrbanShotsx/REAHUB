import type { Metadata } from "next";
import { CtaBand, PageHeader } from "@/components/Sections";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = { title: "Resources" };

const items = [
  ["Guide", "The brokerage compliance checklist", "A practical walkthrough of the records every brokerage should keep."],
  ["Guide", "Preparing for a regulatory audit", "Organize agent, trust and transaction files before the request arrives."],
  ["Template", "Transaction file checklist", "A starting checklist you can adapt for each transaction type."],
  ["Template", "Agent onboarding compliance plan", "Steps for licensing, training and supervision in an agent's first 90 days."],
  ["Article", "Disclosures: delivery and proof", "Why timestamps and signatures matter, and how to keep them organized."],
  ["Article", "License renewals without the scramble", "Build a reminder cadence that catches CE gaps early."],
];

export default function Resources() {
  return (
    <>
      <PageHeader eyebrow="Resources" title="Guides and templates for compliance teams.">
        Practical material for agents, brokers and compliance managers. New content is on the way.
      </PageHeader>

      <section className="mx-auto mt-12 grid max-w-6xl gap-5 px-4 sm:px-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(([type, title, desc]) => (
          <article key={title} className="flex flex-col rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name="book" />
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Coming soon</span>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">{type}</p>
            <h2 className="mt-1 text-lg font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </article>
        ))}
      </section>

      <CtaBand />
    </>
  );
}
