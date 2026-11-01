import type { Metadata } from "next";
import { CtaBand, Eyebrow, PageHeader } from "@/components/Sections";

export const metadata: Metadata = { title: "Resources" };

const items = [
  ["Template", "Transaction file checklist", "A starting list you can adapt for each transaction type."],
  ["Guide", "Preparing for a regulatory audit", "Organize agent, trust and transaction files before the request arrives."],
  ["Template", "Agent onboarding compliance plan", "Licensing, training and supervision in an agent's first 90 days."],
  ["Article", "Disclosures: delivery and proof", "Why timestamps and signatures matter, and how to keep them in order."],
  ["Article", "License renewals without the scramble", "A reminder cadence that catches CE gaps early."],
];

export default function Resources() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title={
          <>
            Checklists and guides for people who keep the <span className="tape">files</span>.
          </>
        }
      >
        Practical material for agents, brokers and compliance managers. Publishing soon.
      </PageHeader>

      <section className="mx-auto mt-16 grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
        <article data-reveal className="flex flex-col justify-between rounded-3xl bg-ink p-8 text-bg sm:p-10 lg:min-h-96">
          <Eyebrow>Featured guide</Eyebrow>
          <div className="mt-16">
            <h2 className="font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.02] tracking-tight">
              The brokerage compliance checklist
            </h2>
            <p className="mt-4 max-w-sm text-bg/75">The records every brokerage should keep, and how long to keep them.</p>
            <span className="mt-6 inline-block rounded-full bg-accent px-3 py-1 font-mono text-[0.65rem] font-medium uppercase tracking-widest text-ink">
              Coming soon
            </span>
          </div>
        </article>

        <ul className="border-t border-ink">
          {items.map(([type, title, desc]) => (
            <li key={title} data-reveal className="row-hover border-b border-line py-6">
              <div className="flex items-center justify-between gap-4">
                <span className="eyebrow">{type}</span>
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">Coming soon</span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-bold leading-tight">{title}</h3>
              <p className="mt-1 max-w-md text-sm text-ink-soft">{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </>
  );
}
