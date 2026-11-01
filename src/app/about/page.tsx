import type { Metadata } from "next";
import { CtaBand, Eyebrow, PageHeader } from "@/components/Sections";

export const metadata: Metadata = { title: "About" };

const principles = [
  ["Clarity over cleverness", "A checklist should read like a checklist. If a compliance manager needs training to use it, we built it wrong."],
  ["Every claim traceable", "Nothing is marked cleared without a document, a signature or a person behind it."],
  ["Private by default", "Files hold client data. Access is by role, and every view is logged."],
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About REAHUB"
        title={
          <>
            Compliance should not slow down a <span className="tape">closing</span>.
          </>
        }
      >
        Agents spend hours chasing paperwork that software should be chasing. REAHUB exists to make the right thing the
        easy thing.
      </PageHeader>

      <section className="mx-auto mt-20 grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Why we built it</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight">Four tools, one missing page.</h2>
        </div>
        <div data-reveal className="space-y-5 text-lg text-ink-soft">
          <p>
            Rules differ by state, by brokerage and by transaction type, and they keep changing. Most offices keep
            licenses in a spreadsheet, checklists in a PDF, disclosures in email and approvals in someone&apos;s head.
          </p>
          <p>
            When an audit comes, a person rebuilds the file by hand. REAHUB keeps that file current from the first
            signature, so there is nothing to rebuild.
          </p>
          <p>We build it with compliance managers and brokers, and we ship what they ask for first.</p>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <div data-reveal>
          <Eyebrow>What we hold to</Eyebrow>
        </div>
        <ol className="mt-6 border-t border-ink">
          {principles.map(([t, d], i) => (
            <li
              key={t}
              data-reveal
              className="row-hover grid gap-3 border-b border-line py-8 md:grid-cols-[4rem_1fr_1.2fr] md:items-baseline"
            >
              <span className="font-mono text-sm text-ink-soft">0{i + 1}</span>
              <h3 className="font-display text-3xl font-bold leading-tight">{t}</h3>
              <p className="text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section data-reveal className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <p className="max-w-3xl font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-snug">
          Built for independent agents, growing brokerages, franchises and the compliance teams who keep them all
          licensed and on file.
        </p>
      </section>

      <CtaBand />
    </>
  );
}
