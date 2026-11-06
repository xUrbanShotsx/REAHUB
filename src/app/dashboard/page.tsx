import Link from "next/link";
import { LiveStats } from "./LiveStats";
import { RecentActivity } from "./RecentActivity";
import { Icon } from "@/components/Icons";
import {
  Avatar,
  btnDark,
  btnLight,
  Card,
  CardHead,
  PageHeading,
  Pill,
  Progress,
} from "@/components/app/ui";
import { aud, kpis, me, people, trust, upcoming } from "@/lib/demo-data";

const attention = [
  {
    t: "Identity verification owed",
    where: "12 Smith St",
    due: "Due today",
    href: "/dashboard/properties",
    who: "AC",
    tone: "owed" as const,
  },
  {
    t: "Arrears follow-up",
    where: "3 Bay St",
    due: "Overdue 3 days",
    href: "/dashboard/properties",
    who: "AC",
    tone: "owed" as const,
  },
  {
    t: "Cooling-off release",
    where: "41 Norton St",
    due: "Due Tue",
    href: "/dashboard/properties",
    who: "PN",
    tone: "neutral" as const,
  },
  {
    t: "J. Alvarez, licence renewal",
    where: "Compliance",
    due: "25 days",
    href: "/dashboard/compliance",
    who: "JA",
    tone: "neutral" as const,
  },
  {
    t: "Anti-money laundering policy",
    where: "2 signatures owed",
    due: "Review",
    href: "/dashboard/compliance",
    who: "DW",
    tone: "neutral" as const,
  },
];

export default function DashboardHome() {
  return (
    <>
      <PageHeading
        title={`Good morning, ${me.name.split(" ")[0]}`}
        sub="Here is what needs you today across the agency."
        actions={
          <>
            <Link href="/dashboard/compliance" className={btnLight}>
              <Icon name="download" className="h-4 w-4" /> Audit pack
            </Link>
            <Link href="/dashboard/properties/new" className={btnDark}>
              <Icon name="plus" className="h-4 w-4" /> New property
            </Link>
          </>
        }
      />

      <LiveStats />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHead
            title="Needs attention"
            sub="Overdue and due soon, across every team"
            right={<Pill tone="owed">{attention.length} items</Pill>}
          />
          <ul>
            {attention.map((a) => (
              <li key={a.t} className="border-b border-line last:border-0">
                <Link
                  href={a.href}
                  className="row-hover flex items-center gap-3 px-5 py-3.5"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-ink-soft/60" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {a.t}
                    </span>
                    <span className="block truncate text-xs text-ink-soft">
                      {a.where}
                    </span>
                  </span>
                  <Pill tone={a.tone}>{a.due}</Pill>
                  <Avatar initials={a.who} tone={1} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHead
            title="Trust position"
            sub="October"
            right={<Pill tone="ok">Matched</Pill>}
          />
          <div className="divide-y divide-line">
            {[trust.sales, trust.rentals].map((a) => (
              <div
                key={a.label}
                className="flex items-center justify-between px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold">{a.label}</p>
                  <p className="text-xs text-ink-soft">Difference A$0</p>
                </div>
                <p className="font-display text-lg font-extrabold tabular-nums">
                  {aud(a.held)}
                </p>
              </div>
            ))}
          </div>
          <div className="p-4">
            <Link
              href="/dashboard/trust"
              className={`${btnDark} w-full justify-center`}
            >
              Open trust accounts
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHead title="KPIs against target" sub="This month" />
          <ul className="space-y-4 p-5">
            {kpis.map((k) => (
              <li key={k.name}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-semibold">{k.name}</span>
                  <span className="tabular-nums text-ink-soft">{k.pct}%</span>
                </div>
                <Progress pct={k.pct} tone={k.pct >= 80 ? "ink" : "accent"} />
              </li>
            ))}
            <li className="text-xs text-ink-soft">
              Dark from 80%, blue below.
            </li>
          </ul>
        </Card>

        <Card>
          <CardHead title="Expiring soon" sub="Licences, insurances, reviews" />
          <ul>
            {people.slice(0, 3).map((p, i) => (
              <li
                key={p.n}
                className="flex items-center gap-3 border-b border-line px-5 py-3.5 last:border-0"
              >
                <Avatar initials={p.i} tone={(i % 3) as 0 | 1 | 2} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {p.n}
                  </span>
                  <span className="block truncate text-xs text-ink-soft">
                    {p.role} · exp. {p.exp}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <ul className="border-t border-line bg-bg px-5 py-3 text-xs text-ink-soft">
            {upcoming.slice(0, 2).map((u) => (
              <li key={u.t} className="flex justify-between gap-3 py-0.5">
                <span className="truncate">{u.t}</span>
                <span className="shrink-0 font-mono">{u.d}</span>
              </li>
            ))}
          </ul>
        </Card>

        <RecentActivity />
      </div>
    </>
  );
}
