import type { Metadata } from "next";
import { CtaBand, FeatureCard, PageHeader } from "@/components/Sections";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About REAHUB" title="Compliance shouldn't slow down closings.">
        REAHUB exists because real estate professionals spend too much time chasing paperwork and too little time
        serving clients. We build software that makes doing the right thing the easy thing.
      </PageHeader>

      <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard icon="shield" title="Mission">
            Help every brokerage and agent stay compliant with confidence, without the spreadsheet scramble.
          </FeatureCard>
          <FeatureCard icon="scale" title="Principles">
            Clarity over complexity. Accuracy you can trace. Privacy and security treated as defaults.
          </FeatureCard>
          <FeatureCard icon="users" title="Who we serve">
            Independent agents, growing brokerages, franchises and compliance teams across residential and commercial.
          </FeatureCard>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-ink">Our story</h2>
        <div className="mt-4 space-y-4 text-muted-foreground">
          <p>
            Rules differ by state, brokerage and transaction type, and they keep changing. Teams end up with
            checklists in one place, licenses in another and approvals buried in email.
          </p>
          <p>
            REAHUB brings it together: one source of truth for people, properties and paperwork, built with
            the people who run compliance every day.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
