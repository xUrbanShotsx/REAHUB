import Link from "next/link";
import { KpiPanel } from "@/components/app/KpiPanel";
import { ExpiringSoon } from "./ExpiringSoon";
import { LiveStats } from "./LiveStats";
import { RecentActivity } from "./RecentActivity";
import { TrustPosition } from "./TrustPosition";
import { Icon } from "@/components/Icons";
import {
  Avatar,
  btnDark,
  btnLight,
  Card,
  CardHead,
  PageHeading,
  Pill,
} from "@/components/app/ui";
import { me } from "@/lib/demo-data";

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

        <TrustPosition />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <KpiPanel />

        <ExpiringSoon />

        <RecentActivity />
      </div>
    </>
  );
}
