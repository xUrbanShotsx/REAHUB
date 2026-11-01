import type { Metadata } from "next";
import { CtaBand, Eyebrow, PageHeader } from "@/components/Sections";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = { title: "Solutions" };

const audiences = [
  {
    title: "Independent agents",
    line: "Your license, your files, one calm dashboard.",
    points: ["License and CE reminders", "Guided transaction checklists", "Disclosures stored with proof of delivery"],
  },
  {
    title: "Brokerages",
    line: "See every office and every open file without asking.",
    points: ["Broker review queues", "Office-wide compliance board", "Agent onboarding and offboarding steps"],
  },
  {
    title: "Franchises and groups",
    line: "One standard, applied to every market you operate in.",
    points: ["Multi-office oversight", "Custom checklists per market", "Role-based access and audit exports"],
  },
];

const caps = [
  ["License management", "Records for every license, state, expiration and CE requirement."],
  ["Transaction compliance", "State and deal-type checklists with document status and review sign-off."],
  ["Disclosures and agreements", "Track each form from request to signature with a timestamped history."],
  ["Audit readiness", "Ordered audit packages for any agent, listing or date range."],
];

export default function Solutions() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title={
          <>
            Sized for a solo agent. Strong enough for a <span className="tape">franchise</span>.
          </>
        }
      >
        The same checklists and audit trail, arranged for how your team actually works.
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
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-tight">{a.title}</h2>
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
            <Eyebrow>Core capabilities</Eyebrow>
            <h2 className="mt-5 max-w-xl font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-tight">
              Four jobs, done the same way every time.
            </h2>
          </div>
          <dl className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
            {caps.map(([t, d]) => (
              <div key={t} data-reveal className="border-t border-ink pt-4">
                <dt className="font-display text-2xl font-bold">{t}</dt>
                <dd className="mt-2 text-ink-soft">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
