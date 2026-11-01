import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

import { Icon } from "@/components/Icons";
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

      <section className="mt-24 bg-ink py-20 text-bg">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal>
            <Eyebrow>Powered by Briesa</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
              REAHUB runs on Briesa, the agency system built for NSW.
            </h2>
            <div className="mt-6 max-w-md space-y-4 text-bg/75">
              <p>
                Briesa is the Australian platform underneath REAHUB. It holds
                the property file, both trust accounts, the seven registers, the
                policy library and the audit log, and every REAHUB workspace is
                a Briesa workspace.
              </p>
              <p>
                That is why the same account signs you in, why plans and billing
                follow Briesa&apos;s pricing, and why nothing in REAHUB is a
                bolt-on. The compliance records are the system of record, not a
                copy of one.
              </p>
              <p>
                Briesa is owned and hosted in Australia, and it is built to New
                South Wales law first, with other states opening only once their
                content has been written and reviewed.
              </p>
            </div>
            <a
              href="https://briesa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-bg px-6 py-3 font-semibold text-ink transition-colors hover:bg-surface"
            >
              Visit Briesa <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>

          <div data-reveal>
            <h3 className="font-mono text-xs uppercase tracking-widest text-bg/60">
              What Briesa brings
            </h3>
            <dl data-stagger className="mt-4 border-t border-bg/20">
              {[
                [
                  "The property is the file",
                  "One record per address. Campaigns and management periods attach to it, so history outlives any single deal.",
                ],
                [
                  "Trust, held properly",
                  "Sales and rentals accounts with separate ledgers, receipts against a named party and property, and reconciliations that lock when signed.",
                ],
                [
                  "Seven registers",
                  "Keys, gifts, material facts, complaints and the rest, filled from the work as it happens.",
                ],
                [
                  "An audit log nothing escapes",
                  "Every write records who, when and the previous value. Compliance records are never hard-deleted.",
                ],
                [
                  "One core, shared",
                  "Teams, access levels, documents and the audit log are shared by every module, on every plan.",
                ],
              ].map(([t, d]) => (
                <div key={t} className="border-b border-bg/20 py-5">
                  <dt className="font-display text-xl font-bold">{t}</dt>
                  <dd className="mt-1 text-bg/70">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
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
