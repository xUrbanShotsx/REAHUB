import { BoardMock, TrailMock } from "@/components/Mocks";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { JsonLd } from "@/components/JsonLd";
import { software } from "@/lib/schema";
import { ButtonLink, CtaBand, Eyebrow } from "@/components/Sections";
import { Magnetic } from "@/components/Magnetic";

/** Descriptors of the agencies REAHUB was built with. Add named customers here once they have agreed to be listed. */
const clients = [
  "Inner West agencies",
  "Rent rolls",
  "Two-office groups",
  "Boutique offices",
  "Licensees in charge",
];

const pains: [string, string][] = [
  [
    "Trust month end takes days, and starts from scratch every time.",
    "The cash book, bank and ledger are matched as the month goes, so month end is a signature.",
  ],
  [
    "The same property sits in four systems under three spellings.",
    "One file per address, created once. Sales and management share it.",
  ],
  [
    "Nobody can find the disclosure when the regulator asks.",
    "Documents land on the property, under the engagement, with who filed them and when.",
  ],
  [
    "Inspections, arrears and repairs live in an inbox.",
    "They sit on the property where the next person would look for them.",
  ],
  [
    "A licence lapses because the reminder was in someone's calendar.",
    "Alerts at 90, 60, 30 and 7 days, and an expired accreditation stops the signature.",
  ],
  [
    "An audit means days of digging through folders.",
    "Every write is logged with the previous value, and the audit pack is an export.",
  ],
];

export default function Home() {
  return (
    <>
      <JsonLd data={software} />
      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[0.9fr_1.1fr]">
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
          <div data-load className="">
            <div data-parallax="6">
              <div className="float">
                <BoardMock />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* scope strip */}
      <div className="relative overflow-hidden bg-[linear-gradient(110deg,oklch(0.19_0.05_262),oklch(0.3_0.11_266)_55%,oklch(0.2_0.06_262))] py-5 font-mono text-xs uppercase tracking-[0.18em] text-bg shadow-[inset_0_1px_0_oklch(1_0_0/0.18),inset_0_-1px_0_oklch(0_0_0/0.4)]">
        <div
          aria-hidden="true"
          className="glow-x pointer-events-none absolute h-24 w-72 rounded-full bg-accent/70 blur-3xl"
        />
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

      {/* who we build with + pain points */}
      <section className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <div
          data-reveal
          className="flex flex-col gap-4 border-y border-line py-6 lg:flex-row lg:items-center lg:gap-10"
        >
          <p className="shrink-0 font-mono text-xs uppercase tracking-widest text-ink-soft">
            Built with licensees at
          </p>
          <ul className="flex flex-wrap gap-2">
            {clients.map((c) => (
              <li
                key={c}
                className="rounded-full bg-tint px-4 py-2 text-sm font-semibold"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Where it goes wrong</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-tight">
              Six places agencies lose the file.
            </h2>
            <p className="mt-5 max-w-sm text-ink-soft">
              These are the gaps licensees tell us about. Each one has a fix
              that does not depend on someone remembering.
            </p>
          </div>
          <ol data-stagger className="border-t border-ink">
            {pains.map(([pain, fix], i) => (
              <li
                key={pain}
                className="row-hover grid gap-3 border-b border-line py-6 md:grid-cols-[2.5rem_1fr_1fr] md:gap-6"
              >
                <span className="font-mono text-sm text-ink-soft">
                  0{i + 1}
                </span>
                <p className="font-display text-xl font-bold leading-snug">
                  {pain}
                </p>
                <p className="text-ink-soft">
                  <span className="mb-1 block font-mono text-[0.7rem] uppercase tracking-widest text-ink">
                    With REAHUB
                  </span>
                  {fix}
                </p>
              </li>
            ))}
          </ol>
        </div>
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
            <TrailMock />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <div data-reveal>
          <Eyebrow>Guides</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.02] tracking-tight">
            Plain-language compliance guides for NSW agencies.
          </h2>
        </div>
        <ul
          data-stagger
          className="mt-10 grid border-t border-ink md:grid-cols-2 md:gap-x-10"
        >
          {guides.slice(0, 4).map((g) => (
            <li key={g.slug} className="border-b border-line">
              <Link href={`/guides/${g.slug}`} className="row-hover block py-5">
                <span className="eyebrow">{g.category}</span>
                <span className="mt-2 block font-display text-2xl font-bold leading-tight">
                  {g.h1}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href="/guides" className="font-semibold underline">
            All compliance guides
          </Link>
        </p>
      </section>

      <CtaBand />
    </>
  );
}
