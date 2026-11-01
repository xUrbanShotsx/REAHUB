import { BoardMock, ChecklistMock, LicenseMock, TrailMock } from "@/components/Mocks";
import { ButtonLink, CtaBand, Eyebrow } from "@/components/Sections";
import { Magnetic } from "@/components/Magnetic";

const rows = [
  {
    n: "01",
    eyebrow: "Licenses",
    title: "Know who is licensed, until when, and with how many CE hours left.",
    body: "Every agent and broker in one list. Renewals and continuing education surface 90, 60 and 30 days out, to the agent and to you.",
    points: ["Multi-state license records", "CE hours tracked against requirements", "Reminders that stop when the renewal is filed"],
    visual: <LicenseMock />,
  },
  {
    n: "02",
    eyebrow: "Transactions",
    title: "A checklist for the exact deal, not a generic form.",
    body: "Pick the state and transaction type and REAHUB builds the list. Missing items get flagged the moment they become late, not at closing.",
    points: ["Checklists by state and deal type", "Broker review queue with sign-off", "Nothing marked cleared until it is"],
    visual: <ChecklistMock />,
  },
];

export default function Home() {
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div data-load>
              <Eyebrow>Real estate compliance software</Eyebrow>
            </div>
            <h1
              data-load
              className="mt-6 font-display text-[clamp(2.7rem,6.4vw,5.7rem)] font-bold leading-[0.98] tracking-tight"
            >
              Every closing file, <span className="tape">cleared</span> before the audit.
            </h1>
            <p data-load className="mt-7 max-w-lg text-lg text-ink-soft">
              REAHUB tracks licenses, transaction files and disclosures in one place, and flags what is missing while
              there is still time to fix it.
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
        <ul className="marquee flex w-max gap-10 whitespace-nowrap" aria-label="What REAHUB covers">
          {[0, 1, 2, 3].flatMap((k) =>
            ["Licenses", "CE credits", "Transaction files", "Disclosures", "Audit exports"].map((t) => (
              <li key={`${k}-${t}`} className="flex items-center gap-10" aria-hidden={k > 0}>
                {t}
                <span className="text-accent">/</span>
              </li>
            )),
          )}
        </ul>
      </div>

      {/* problem */}
      <section className="mx-auto mt-28 grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1fr]">
        <div data-reveal>
          <Eyebrow>The problem</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
            Compliance fails in the gaps between the spreadsheet, the inbox and the folder.
          </h2>
          <p className="mt-6 max-w-md text-ink-soft">
            Each tool holds a piece. Nobody holds the whole file, so the missing disclosure is found by the regulator
            instead of by you.
          </p>
        </div>
        <div data-reveal className="relative min-h-72 sm:min-h-80">
          {[
            ["Renewals.xlsx", "last edited by someone in March", "left-0 top-2 -rotate-3"],
            ["Re: Re: signed disclosure?", "14 unread replies", "right-0 top-24 rotate-2"],
            ["Closed files / 2024 / misc", "not sure what is in here", "left-6 bottom-0 -rotate-1"],
          ].map(([t, s, pos]) => (
            <div key={t} className={`absolute w-64 max-w-[80%] border border-line bg-surface p-4 shadow-md ${pos}`}>
              <p className="font-mono text-xs uppercase tracking-wider">{t}</p>
              <p className="mt-1 text-sm text-ink-soft">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* feature rows */}
      <section className="mx-auto mt-28 max-w-6xl space-y-28 px-5 sm:px-8">
        {rows.map((r, i) => (
          <div key={r.n} className="grid items-center gap-12 lg:grid-cols-2">
            <div data-reveal className={i % 2 ? "lg:order-2" : ""}>
              <p className="font-mono text-sm text-ink-soft">{r.n}</p>
              <div className="mt-3">
                <Eyebrow>{r.eyebrow}</Eyebrow>
              </div>
              <h2 className="mt-5 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-tight">
                {r.title}
              </h2>
              <p className="mt-5 max-w-md text-ink-soft">{r.body}</p>
              <ul data-stagger className="mt-6 divide-y divide-line border-y border-line">
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
            Set up in an afternoon. Cleared from there.
          </h2>
        </div>
        <ol data-stagger className="mt-12 grid gap-10 border-t border-ink pt-8 md:grid-cols-3">
          {[
            ["Connect", "Import agents, licenses and open transactions from the files you already keep."],
            ["Check", "REAHUB applies the right checklist to each deal and flags what is late."],
            ["Prove", "Export a complete, ordered audit file for any agent, listing or date range."],
          ].map(([t, d], i) => (
            <li key={t}>
              <span className="font-mono text-sm text-ink-soft">Step {i + 1}</span>
              <h3 className="mt-2 font-display text-3xl font-bold">{t}</h3>
              <p className="mt-3 max-w-xs text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* audit */}
      <section className="mt-28 bg-ink py-24 text-bg">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
          <div data-reveal>
            <Eyebrow>Audit ready</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
              The audit letter arrives. The file is already built.
            </h2>
            <p className="mt-6 max-w-md text-bg/75">
              Every upload, signature and approval is timestamped as it happens. Exporting the proof is one click, not a
              week of digging.
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
