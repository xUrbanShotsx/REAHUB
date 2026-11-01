import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

import { CtaBand, Eyebrow, PageHeader } from "@/components/Sections";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = pageMeta({
  title: "Solutions for Agent Teams and Agencies",
  description:
    "Compliance and trust software sized for an agent team, a boutique agency or a large multi-branch agency in NSW. Properties, trust, registers and operations on one record.",
  path: "/solutions",
});

const audiences = [
  {
    title: "Agent team",
    line: "For the licensee who is also the admin: one team, one office, nobody spare to run the software.",
    points: [
      "A checklist on every campaign",
      "Keys, gifts, material facts and complaints recorded as you work",
      "Policies signed by person and version",
      "Trust that reconciles, with the difference shown before you sign",
    ],
  },
  {
    title: "Boutique agency",
    line: "For an office with a sales team and a rent roll, and one licensee answering for all of it.",
    points: [
      "Up to four teams, each working its own engagements",
      "Accreditations that gate who may sign",
      "The underquoting guard on every listing",
      "One-click audit pack export",
    ],
  },
  {
    title: "Large agency",
    line: "For an agency with several teams and branches, and a licensee who answers for all of them at once.",
    points: [
      "Up to eight teams on one list of properties",
      "Compliance reporting across every team and branch",
      "Registers rolled up across branches",
      "Bulk import of the rent roll",
    ],
  },
];

const modules = [
  [
    "Properties",
    "One file per address, with every campaign, management period, party and document on it.",
  ],
  [
    "Trust",
    "Sales and rentals accounts, every movement against its property, and a reconciliation that prepares itself.",
  ],
  [
    "Compliance",
    "Seven registers, accreditations that gate signing, identity checks and an audit log under all of it.",
  ],
  [
    "Operations",
    "Tasks, the calendar, meetings and KPIs, tied to the properties they are about.",
  ],
];

const levels = [
  [
    "Owner",
    "One per organisation. The only level that can close it, transfer ownership or change billing.",
  ],
  [
    "Admin",
    "Sees the whole organisation and runs it day to day, trust accounting included.",
  ],
  [
    "Team Lead",
    "Sees the agency's records and their team's work, including the team's property-linked trust entries.",
  ],
  [
    "Team Member",
    "Sees the agency's records and their own team's work, with no access to trust accounting.",
  ],
  [
    "Auditor",
    "An external, read-only, time-boxed grant. Sees everything and changes nothing.",
  ],
];

export default function Solutions() {
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ])}
      />
      <PageHeader
        eyebrow="Solutions"
        title={
          <>
            Built for the licensee who answers for{" "}
            <span className="tape">all of it</span>.
          </>
        }
      >
        The same system on every plan. What changes is how many people sign in
        and how many teams they work in.
      </PageHeader>

      <section className="mx-auto mt-16 max-w-6xl border-t border-ink px-5 sm:px-8">
        {audiences.map((a, i) => (
          <div
            key={a.title}
            data-reveal
            className="grid gap-6 border-b border-line py-12 md:grid-cols-[4rem_1.1fr_1fr]"
          >
            <span className="font-mono text-sm text-ink-soft">0{i + 1}</span>
            <div>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-tight">
                {a.title}
              </h2>
              <p className="mt-3 max-w-sm text-ink-soft">{a.line}</p>
            </div>
            <ul className="space-y-3 self-center">
              {a.points.map((p) => (
                <li key={p} className="flex items-start gap-3 font-medium">
                  <Icon name="check" className="mt-1 h-4 w-4 shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-24 bg-tint py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div data-reveal>
            <Eyebrow>Four modules, one record</Eyebrow>
            <h2 className="mt-5 max-w-xl font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-tight">
              Every module reads and writes the same property file.
            </h2>
          </div>
          <dl className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
            {modules.map(([t, d]) => (
              <div key={t} data-reveal className="border-t border-ink pt-4">
                <dt className="font-display text-2xl font-bold">{t}</dt>
                <dd className="mt-2 text-ink-soft">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Who is involved</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight">
            Five access levels. Accreditations decide who signs.
          </h2>
          <p className="mt-4 max-w-sm text-ink-soft">
            Job roles filter what someone sees. Accreditations gate what they
            may sign, and an expired one stops the signature.
          </p>
        </div>
        <ol data-stagger className="border-t border-ink">
          {levels.map(([t, d]) => (
            <li
              key={t}
              className="row-hover grid gap-1 border-b border-line py-5 sm:grid-cols-[9rem_1fr]"
            >
              <h3 className="font-display text-xl font-bold">{t}</h3>
              <p className="text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand />
    </>
  );
}
