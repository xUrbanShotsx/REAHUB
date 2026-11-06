"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { agency, me } from "@/lib/demo-data";
import { Icon, type IconName } from "../Icons";
import { useStore } from "./DemoStore";
import { NotificationsBell } from "./NotificationsBell";
import { Avatar } from "./ui";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/dashboard/properties", label: "Properties", icon: "building" },
  { href: "/dashboard/trust", label: "Trust", icon: "scale" },
  { href: "/dashboard/compliance", label: "Compliance", icon: "shield" },
  { href: "/dashboard/operations", label: "Operations", icon: "clock" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { resetDemo } = useStore();
  const current = NAV.find((n) =>
    n.href === "/dashboard" ? pathname === n.href : pathname.startsWith(n.href),
  );

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link
        href="/dashboard"
        className="flex h-16 items-center px-5"
        onClick={() => setOpen(false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="REAHUB"
          width={403}
          height={82}
          className="h-6 w-auto"
        />
      </Link>

      <div className="mx-3 rounded-xl border border-line bg-surface px-3 py-2.5">
        <p className="truncate text-sm font-bold">{agency.name}</p>
        <p className="text-xs text-ink-soft">
          {agency.plan} plan · demo workspace
        </p>
      </div>

      <nav aria-label="App" className="mt-5 flex-1 space-y-1 px-3">
        {NAV.map((n) => {
          const active = n === current;
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-accent/15 text-ink"
                  : "text-ink-soft hover:bg-tint hover:text-ink"
              }`}
            >
              <Icon name={n.icon} className="h-[18px] w-[18px]" />
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl border border-line bg-surface p-3">
        <div className="flex items-center gap-3">
          <Avatar initials={me.initials} tone={0} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{me.name}</p>
            <p className="truncate text-xs text-ink-soft">{me.role}</p>
          </div>
        </div>
        <Link
          href="/"
          className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink-soft hover:text-ink"
        >
          <Icon name="logout" className="h-3.5 w-3.5" /> Sign out
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-ink lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen border-r border-line bg-bg lg:block">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-bg shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-8">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" className="h-6 w-6" />
          </button>
          <p className="font-display text-base font-extrabold tracking-tight lg:hidden">
            {current?.label ?? "Dashboard"}
          </p>
          <label className="ml-auto hidden max-w-sm flex-1 items-center gap-2 rounded-full bg-bg px-4 py-2 text-sm text-ink-soft focus-within:ring-2 focus-within:ring-accent sm:flex lg:ml-0">
            <Icon name="search" className="h-4 w-4" />
            <input
              type="search"
              placeholder="Search properties, parties, receipts"
              className="w-full bg-transparent text-ink outline-none placeholder:text-ink-soft"
              aria-label="Search"
            />
          </label>
          <span className="ml-auto flex items-center gap-3 lg:ml-auto">
            <span className="hidden rounded-full bg-tint px-3 py-1 text-[11px] font-semibold text-ink-soft sm:inline">
              Sample data
            </span>
            <NotificationsBell />
            <Avatar initials={me.initials} tone={0} />
          </span>
        </header>

        <div className="border-b border-line bg-tint/60 px-4 py-2 text-center text-xs text-ink-soft sm:px-8">
          You are viewing a demo workspace with sample data. Changes are saved
          in this browser only.{" "}
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm("Reset the demo workspace to its starting data?")
              )
                resetDemo();
            }}
            className="font-semibold underline"
          >
            Reset demo
          </button>
        </div>

        <div className="mx-auto max-w-6xl p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
