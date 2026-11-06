"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/Icons";
import { PageHeading } from "@/components/app/ui";
import { AccountSection } from "./AccountSection";
import { AgencySection } from "./AgencySection";
import { BillingSection } from "./BillingSection";
import { NotificationsSection } from "./NotificationsSection";
import { TeamSection } from "./TeamSection";
import { UsageSection } from "./UsageSection";

const SECTIONS: { id: string; label: string; icon: IconName; blurb: string }[] =
  [
    {
      id: "team",
      label: "Team",
      icon: "users",
      blurb: "Who has access, and at what level.",
    },
    {
      id: "usage",
      label: "Usage",
      icon: "grid",
      blurb: "What your plan includes and what you have used.",
    },
    {
      id: "billing",
      label: "Billing",
      icon: "file",
      blurb: "Your plan, invoices and payment method.",
    },
    {
      id: "agency",
      label: "Agency",
      icon: "building",
      blurb: "Licence, business and contact details.",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "bell",
      blurb: "Which reminders you receive.",
    },
    {
      id: "account",
      label: "Account",
      icon: "user",
      blurb: "Your profile, your data and signing out.",
    },
  ];

export function SettingsView() {
  const [tab, setTab] = useState("team");
  const current = SECTIONS.find((s) => s.id === tab) ?? SECTIONS[0];

  return (
    <>
      <PageHeading
        title="Settings"
        sub="Manage your team, plan and how REAHUB works for your agency."
      />

      <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div
          role="tablist"
          aria-label="Settings sections"
          aria-orientation="vertical"
          className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              role="tab"
              type="button"
              id={`tab-${s.id}`}
              aria-selected={tab === s.id}
              aria-controls={`panel-${s.id}`}
              onClick={() => setTab(s.id)}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ${
                tab === s.id
                  ? "bg-accent/15 text-ink"
                  : "text-ink-soft hover:bg-tint hover:text-ink"
              }`}
            >
              <Icon name={s.icon} className="h-[18px] w-[18px]" />
              {s.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="min-w-0"
        >
          <p className="mb-4 text-sm text-ink-soft">{current.blurb}</p>
          {tab === "team" && <TeamSection />}
          {tab === "usage" && <UsageSection />}
          {tab === "billing" && <BillingSection />}
          {tab === "agency" && <AgencySection />}
          {tab === "notifications" && <NotificationsSection />}
          {tab === "account" && <AccountSection />}
        </div>
      </div>
    </>
  );
}
