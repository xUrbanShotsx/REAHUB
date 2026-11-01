import type { Metadata } from "next";
import { CtaBand, FeatureCard, PageHeader } from "@/components/Sections";
import { Icon, type IconName } from "@/components/Icons";

export const metadata: Metadata = { title: "Solutions" };

const audiences: { icon: IconName; title: string; points: string[] }[] = [
  {
    icon: "home",
    title: "Independent agents",
    points: ["License and CE reminders", "Guided transaction checklists", "Disclosure storage and proof of delivery"],
  },
  {
    icon: "building",
    title: "Brokerages",
    points: ["Broker review queues", "Office-wide compliance dashboard", "Agent onboarding and offboarding workflows"],
  },
  {
    icon: "users",
    title: "Franchises & enterprise",
    points: ["Multi-office oversight", "Custom checklists per market", "Role-based access and audit exports"],
  },
];

export default function Solutions() {
  return (
    <>
      <PageHeader eyebrow="Solutions" title="Built for how your team works.">
        From a solo agent to a multi-office franchise, REAHUB adapts to your size, markets and review process.
      </PageHeader>

      <section className="mx-auto mt-12 grid max-w-6xl gap-5 px-4 sm:px-6 md:grid-cols-3">
        {audiences.map((a) => (
          <div key={a.title} className="rounded-2xl border border-border bg-card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon name={a.icon} className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-xl font-semibold text-ink">{a.title}</h2>
            <ul className="mt-4 space-y-2">
              {a.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-ink">Core capabilities</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <FeatureCard icon="id" title="License management">
            Central records for every license, jurisdiction, expiration and CE requirement.
          </FeatureCard>
          <FeatureCard icon="file" title="Transaction compliance">
            State- and type-specific checklists with document status and review sign-off.
          </FeatureCard>
          <FeatureCard icon="scale" title="Disclosures & agreements">
            Track required forms from request to signature, with a time-stamped history.
          </FeatureCard>
          <FeatureCard icon="clock" title="Audit readiness">
            Generate organized audit packages for any agent, listing or time period.
          </FeatureCard>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
