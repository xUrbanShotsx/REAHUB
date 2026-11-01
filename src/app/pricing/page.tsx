import type { Metadata } from "next";
import { Eyebrow, PageHeader } from "@/components/Sections";
import { PricingGrid } from "@/components/PricingGrid";

export const metadata: Metadata = { title: "Pricing" };

const faqs = [
  [
    "Can I change plans later?",
    "Yes. Move up or down as your team changes. Billing adjusts at your next cycle.",
  ],
  [
    "Is there a free trial?",
    "Every plan starts with a free trial. We will set it up with your own checklists.",
  ],
  [
    "Do the plans cover every state?",
    "Plans are built for Australian agencies, with GST shown separately.",
  ],
];

export default function Pricing() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title={
          <>
            Priced per team, never per <span className="tape">seat</span>.
          </>
        }
      >
        Billed monthly in Australian dollars. No lock-in contract, cancel
        anytime. Hover a plan to compare.
      </PageHeader>

      <PricingGrid />

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
