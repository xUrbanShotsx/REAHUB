import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

import { ChecklistMock, LicenseMock, TrustMock } from "@/components/Mocks";
import { CtaBand, Eyebrow, PageHeader } from "@/components/Sections";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = pageMeta({
  title: "Real Estate Compliance Resources and Docs",
  description:
    "Guides, docs and research for NSW licensees in charge: supervision guidelines, trust reconciliation, registers and migration. Plain language, not legal advice.",
  path: "/resources",
});

const items = [
  [
    "Guide",
    "The 2024 Supervision Guidelines, explained",
    "What a licensee in charge is expected to supervise, in plain language.",
    "https://briesa.com/guides/supervision-guidelines",
  ],
  [
    "Docs",
    "Bringing your data across",
    "What carries from your current system, what does not, and the order to do it in.",
    "https://briesa.com/migration",
  ],
  [
    "Docs",
    "Reconciling the trust account",
    "Receipting, disbursements, and the month prepared as you go.",
    "https://briesa.com/docs/trust",
  ],
  [
    "Docs",
    "Keeping the registers",
    "The seven registers, accreditations and the audit log.",
    "https://briesa.com/docs/compliance",
  ],
  [
    "Blog",
    "Reconciled by the month, not by the miracle",
    "What building sales and rentals trust accounting to the NSW rules taught us.",
    "https://briesa.com/blog",
  ],
  [
    "Blog",
    "Why you will never pay per seat",
    "Per-seat pricing makes hiring a budget conversation. Plans should not punish growth.",
    "https://briesa.com/blog",
  ],
];

const rows = [
  {
    n: "01",
    eyebrow: "Properties",
    title: "One file per property, and the paperwork it owes on it.",
    body: "The address is created once. Campaigns and management periods hang off it, so the history outlives any single deal and nothing is retyped for the next one.",
    points: [
      "Listing, marketing and safety checklists with evidence",
      "Parties, documents and trust on the same file",
      "Never two records for one address",
    ],
    visual: <ChecklistMock />,
  },
  {
    n: "02",
    eyebrow: "Trust",
    title: "Sales and rentals trust accounts that reconcile themselves.",
    body: "Every receipt names the party, the property and the engagement. The difference is itemised as the month goes, so month end is when you sign, not when you start.",
    points: [
      "Separate sales and rentals ledgers",
      "Disbursements ask for the authority first",
      "Signed reconciliations are locked",
    ],
    visual: <TrustMock />,
  },
  {
    n: "03",
    eyebrow: "Compliance",
    title:
      "Registers that fill from the work, and licences that warn you early.",
    body: "Keys, gifts, material facts and complaints are recorded as they happen. A licence class decides who may sign, and alerts arrive at 90, 60, 30 and 7 days.",
    points: [
      "Seven registers, each entry against a property",
      "Accreditations that gate signing",
      "A policy library with sign-off by person and version",
    ],
    visual: <LicenseMock />,
  },
];

export default function Resources() {
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
        ])}
      />
      <PageHeader
        eyebrow="Resources"
        title={
          <>
            Guides and docs for people who keep the{" "}
            <span className="tape">files</span>.
          </>
        }
      >
        Plain-language material on the rules a NSW licensee in charge answers
        for. None of it is legal advice.
      </PageHeader>

      <section className="mx-auto mt-16 grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
        <article
          data-reveal
          className="flex flex-col justify-between rounded-3xl bg-ink p-8 text-bg sm:p-10 lg:min-h-96"
        >
          <Eyebrow>Research</Eyebrow>
          <div className="mt-16">
            <h2 className="font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.02] tracking-tight">
              NSW Fair Trading inspections: what one year of unannounced visits
              found
            </h2>
            <p className="mt-4 max-w-sm text-bg/75">
              The 2024 to 25 inspection year for a licensee in charge, and the
              penalties behind it.
            </p>
            <a
              href="https://briesa.com/guides"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-bg"
            >
              Read the research <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>
        </article>

        <ul data-stagger className="border-t border-ink">
          {items.map(([type, title, desc, href]) => (
            <li key={title} className="border-b border-line">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="row-hover block py-6"
              >
                <span className="eyebrow">{type}</span>
                <h3 className="mt-2 font-display text-2xl font-bold leading-tight">
                  {title}
                </h3>
                <p className="mt-1 max-w-md text-sm text-ink-soft">{desc}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* product tour */}
      <section className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <div data-reveal className="mb-16">
          <Eyebrow>Product tour</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
            See how REAHUB handles the file, the trust account and the
            registers.
          </h2>
        </div>
        <div className="space-y-28">
          {rows.map((r, i) => (
            <div
              key={r.n}
              className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-2"
            >
              <div data-reveal className={i % 2 ? "lg:order-2" : ""}>
                <p className="font-mono text-sm text-ink-soft">{r.n}</p>
                <div className="mt-3">
                  <Eyebrow>{r.eyebrow}</Eyebrow>
                </div>
                <h2 className="mt-5 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-tight">
                  {r.title}
                </h2>
                <p className="mt-5 max-w-md text-ink-soft">{r.body}</p>
                <ul
                  data-stagger
                  className="mt-6 divide-y divide-line border-y border-line"
                >
                  {r.points.map((p) => (
                    <li key={p} className="row-hover py-3 text-sm font-medium">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div data-reveal>{r.visual}</div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
