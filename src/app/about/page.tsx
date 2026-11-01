import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

import { CtaBand, Eyebrow, PageHeader } from "@/components/Sections";

export const metadata: Metadata = pageMeta({
  title: "About REAHUB, NSW Agency Compliance Software",
  description:
    "REAHUB is built in Australia for the people holding the licence: one file per property, trust accounting and registers that fill from the work. Powered by Briesa.",
  path: "/about",
});

const principles = [
  [
    "The record is sacred",
    "Compliance records are never hard-deleted, every write is audited, and history is not editable. If it happened, the file says so.",
  ],
  [
    "New South Wales first",
    "The rules an agency answers to are state law, so we started with NSW. The next state opens when it can be done as thoroughly.",
  ],
  [
    "Priced so hiring is free",
    "Per agency, never per head. Adding a cadet should not be a budget conversation.",
  ],
  [
    "Built with licensees",
    "Every part was checked against people who do the work, including the parts they told us were wrong.",
  ],
];

export default function About() {
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHeader
        eyebrow="About REAHUB"
        title={
          <>
            Compliance should not slow down a{" "}
            <span className="tape">closing</span>.
          </>
        }
      >
        Agents spend hours chasing paperwork that software should be chasing.
        REAHUB exists to make the right thing the easy thing.
      </PageHeader>

      <section className="mx-auto mt-20 grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Why we built it</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight">
            The property is the file.
          </h2>
        </div>
        <div data-reveal className="space-y-5 text-lg text-ink-soft">
          <p>
            An agency&apos;s memory lives in the property, yet most systems file
            the work under the transaction and lose it when the deal closes.
            Licences sit in one place, trust in another and the registers in a
            third.
          </p>
          <p>
            REAHUB puts the property first, with campaigns and management
            periods as engagements on top, and the registers falling out of the
            work instead of being bolted on the end.
          </p>
          <p>
            REAHUB is powered by Briesa, the Australian agency platform that
            holds the property file, both trust accounts, the seven registers
            and the audit log. It is owned and hosted in Australia.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <div data-reveal>
          <Eyebrow>Four things we will not compromise on</Eyebrow>
        </div>
        <ol className="mt-6 border-t border-ink">
          {principles.map(([t, d], i) => (
            <li
              key={t}
              data-reveal
              className="row-hover grid gap-3 border-b border-line py-8 md:grid-cols-[4rem_1fr_1.2fr] md:items-baseline"
            >
              <span className="font-mono text-sm text-ink-soft">0{i + 1}</span>
              <h3 className="font-display text-3xl font-bold leading-tight">
                {t}
              </h3>
              <p className="text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section data-reveal className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <p className="max-w-3xl font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-snug">
          Built for independent agents, growing brokerages, franchises and the
          compliance teams who keep them all licensed and on file.
        </p>
      </section>

      <CtaBand />
    </>
  );
}
