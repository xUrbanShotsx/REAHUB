"use client";

import Link from "next/link";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { Avatar, btnLight, Card, CardHead } from "@/components/app/ui";
import { me } from "@/lib/demo-data";

export function AccountSection() {
  const {
    properties,
    templates,
    entries,
    audit,
    accreditations,
    members,
    settings,
    resetDemo,
  } = useStore();

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      note: "Sample data from the REAHUB demo workspace.",
      settings,
      members,
      properties,
      templates,
      registerEntries: entries,
      accreditations,
      auditLog: audit,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "reahub-demo-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHead title="Your profile" />
        <div className="flex items-center gap-4 p-5">
          <Avatar initials={me.initials} tone={0} />
          <div className="min-w-0 text-sm">
            <p className="font-semibold">{me.name}</p>
            <p className="text-ink-soft">
              {me.role} · {members.find((m) => m.name === me.name)?.email}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHead
          title="Your data"
          sub="Everything in this demo is sample data kept in this browser"
        />
        <div className="flex flex-wrap gap-3 p-5">
          <button type="button" onClick={exportData} className={btnLight}>
            <Icon name="download" className="h-4 w-4" /> Export everything as
            JSON
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Reset the demo workspace to its starting data? Your changes and stored files will be cleared.",
                )
              )
                resetDemo();
            }}
            className={btnLight}
          >
            Reset demo data
          </button>
        </div>
      </Card>

      <Card>
        <CardHead title="Session" />
        <div className="p-5">
          <Link href="/" className={btnLight}>
            <Icon name="logout" className="h-4 w-4" /> Sign out
          </Link>
        </div>
      </Card>
    </div>
  );
}
