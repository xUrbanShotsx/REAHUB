import Link from "next/link";
import { CtaBand, FeatureCard } from "@/components/Sections";
import { Icon } from "@/components/Icons";

const checks = [
  ["Broker supervision file", "Complete", true],
  ["Lead paint disclosure", "Complete", true],
  ["Agency agreement signed", "Complete", true],
  ["Wire fraud advisory", "Missing", false],
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-24 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-secondary/30 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-8 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
              <Icon name="shield" className="h-4 w-4" /> Real estate compliance, simplified
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-ink sm:text-6xl">
              Every file. Every license. Always audit-ready.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              REAHUB gives brokerages and agents one workspace to track licenses, review transaction files and
              manage disclosures, so problems surface before regulators find them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/demo"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-on-primary transition-colors duration-200 hover:bg-primary-dark"
              >
                Book a demo <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link
                href="/solutions"
                className="inline-flex cursor-pointer items-center rounded-xl border border-primary px-6 py-3 font-semibold text-primary transition-colors duration-200 hover:bg-primary/10"
              >
                Explore solutions
              </Link>
            </div>
          </div>

          <div className="glass relative rounded-3xl p-6 shadow-xl shadow-primary/10" role="img" aria-label="Sample transaction compliance checklist">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Sample transaction</p>
                <p className="font-semibold text-ink">142 Maple Street</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">1 item open</span>
            </div>
            <ul className="mt-5 space-y-3">
              {checks.map(([label, status, ok]) => (
                <li key={label as string} className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3 text-sm">
                  <span className="font-medium text-ink">{label}</span>
                  <span className={`flex items-center gap-1 font-semibold ${ok ? "text-primary" : "text-red-700"}`}>
                    {ok && <Icon name="check" className="h-4 w-4" />}
                    {status}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-3/4 rounded-full bg-primary" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">75% of required documents on file</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-ink">Compliance, covered end to end</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Replace spreadsheets, inbox reminders and last-minute file hunts with one system your whole office uses.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon="id" title="License & CE tracking">
            Monitor agent and broker licenses, renewals and continuing education with automatic reminders.
          </FeatureCard>
          <FeatureCard icon="file" title="Transaction file review">
            Checklists by transaction type and state flag missing documents and signatures before closing.
          </FeatureCard>
          <FeatureCard icon="scale" title="Disclosure management">
            Deliver, collect and store required disclosures with a clear, timestamped audit trail.
          </FeatureCard>
          <FeatureCard icon="bell" title="Smart alerts">
            Get notified of expiring licenses, overdue items and rule changes that affect your market.
          </FeatureCard>
          <FeatureCard icon="clock" title="Audit trail">
            Every upload, review and approval is logged so you can answer any audit request in minutes.
          </FeatureCard>
          <FeatureCard icon="users" title="Roles & oversight">
            Give agents, compliance managers and brokers the right level of access and visibility.
          </FeatureCard>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-ink">How it works</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["Connect", "Import your agents, licenses and open transactions."],
            ["Check", "REAHUB applies the right checklist and flags gaps automatically."],
            ["Prove", "Export a complete, organized audit file whenever you need it."],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-2xl border border-border bg-card p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-semibold text-on-primary">{i + 1}</span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand />
    </>
  );
}
