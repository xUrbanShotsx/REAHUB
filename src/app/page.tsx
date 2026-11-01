import {
  BoardMock,
  ChecklistMock,
  LicenseMock,
  TrailMock,
  TrustMock,
} from "@/components/Mocks";
import { ButtonLink, CtaBand, Eyebrow } from "@/components/Sections";
import { Magnetic } from "@/components/Magnetic";

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

export default function Home() {
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div data-load>
              <Eyebrow>Compliance software for NSW agencies</Eyebrow>
            </div>
            <h1
              data-load
              className="mt-6 font-display text-[clamp(2.7rem,6.4vw,5.7rem)] font-bold leading-[0.98] tracking-tight"
            >
              Every closing file, <span className="tape">cleared</span> before
              the audit.
            </h1>
            <p data-load className="mt-7 max-w-lg text-lg text-ink-soft">
              REAHUB keeps NSW agencies audit-ready: one file per property,
              trust accounts that reconcile, and registers that fill from the
              work. It flags what is owed while there is still time to fix it.
            </p>
            <div data-load className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic>
                <ButtonLink href="/demo">Book a demo</ButtonLink>
              </Magnetic>
              <ButtonLink href="/solutions" variant="ghost">
                See how a file gets cleared
              </ButtonLink>
            </div>
          </div>
          <div data-load className="xl:-mr-16">
            <div data-parallax="6">
              <div className="float">
                <BoardMock />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* scope strip */}
      <div className="overflow-hidden border-y border-line bg-tint py-4 font-mono text-xs uppercase tracking-[0.18em]">
        <ul
          className="marquee flex w-max gap-10 whitespace-nowrap"
          aria-label="What REAHUB covers"
        >
          {[0, 1, 2, 3].flatMap((k) =>
            [
              "Property files",
              "Trust accounts",
              "Seven registers",
              "Accreditations",
              "Policy library",
              "Audit log",
            ].map((t) => (
              <li
                key={`${k}-${t}`}
                className="flex items-center gap-10"
                aria-hidden={k > 0}
              >
                {t}
                <span className="text-accent">/</span>
              </li>
            )),
          )}
        </ul>
      </div>

      {/* problem */}
      <section className="mx-auto mt-28 grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1fr]">
        <div data-reveal>
          <Eyebrow>The problem</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
            Compliance fails in the gaps between the spreadsheet, the inbox and
            the folder.
          </h2>
          <p className="mt-6 max-w-md text-ink-soft">
            Each tool holds a piece. Nobody holds the whole file, so the missing
            disclosure is found by the regulator instead of by you.
          </p>
          <p className="mt-6 max-w-md font-mono text-xs uppercase leading-relaxed tracking-wider text-ink-soft">
            NSW Fair Trading, 2024 to 25: 2,200+ unannounced visits, $1.58
            million in fines, 55 licences suspended.
          </p>
        </div>
        <div data-reveal className="relative min-h-72 sm:min-h-80">
          {[
            [
              "Renewals.xlsx",
              "last edited by someone in March",
              "left-0 top-2 -rotate-3",
            ],
            [
              "Re: Re: signed disclosure?",
              "14 unread replies",
              "right-0 top-24 rotate-2",
            ],
            [
              "Closed files / 2024 / misc",
              "not sure what is in here",
              "left-6 bottom-0 -rotate-1",
            ],
          ].map(([t, s, pos]) => (
            <div
              key={t}
              className={`absolute w-64 max-w-[80%] border border-line bg-surface p-4 shadow-md ${pos}`}
            >
              <p className="font-mono text-xs uppercase tracking-wider">{t}</p>
              <p className="mt-1 text-sm text-ink-soft">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* feature rows */}
      <section className="mx-auto mt-28 max-w-6xl space-y-28 px-5 sm:px-8">
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
      </section>

      {/* how it works */}
      <section className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <div data-reveal>
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
            Three steps from first file to audit pack.
          </h2>
        </div>
        <ol
          data-stagger
          className="mt-12 grid gap-10 border-t border-ink pt-8 md:grid-cols-3"
        >
          {[
            [
              "Bring across",
              "Properties, parties and open campaigns come over from the system you use now.",
            ],
            [
              "Work",
              "Checklists, registers and trust fill as the work is filed, and anything owed is flagged.",
            ],
            [
              "Prove",
              "Export the audit pack for the period an auditor names, or give them read-only access.",
            ],
          ].map(([t, d], i) => (
            <li key={t}>
              <span className="font-mono text-sm text-ink-soft">
                Step {i + 1}
              </span>
              <h3 className="mt-2 font-display text-3xl font-bold">{t}</h3>
              <p className="mt-3 max-w-xs text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* audit */}
      <section className="mt-28 bg-ink py-24 text-bg">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
          <div data-reveal>
            <Eyebrow>Audit ready</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
              Fair Trading asks. The pack is already built.
            </h2>
            <p className="mt-6 max-w-md text-bg/75">
              Every write leaves an entry: who, what, when and the previous
              value. Compliance records are never hard-deleted, so the proof is
              an export, not a week of digging.
            </p>
            <div className="mt-8">
              <ButtonLink href="/solutions" variant="light">
                See the capabilities
              </ButtonLink>
            </div>
          </div>
          <div data-reveal>
            <TrailMock dark />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
