"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const TABS = [
  { href: "/dashboard/tools/calendar", label: "Calendar" },
  { href: "/dashboard/tools/meetings", label: "Meetings" },
  { href: "/dashboard/tools/diary", label: "Diary" },
  { href: "/dashboard/tools/tasks", label: "Task list" },
];

/** Tools is one module, like Compliance: a title, the tabs across the top, then whichever tool is open. */
export default function ToolsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          Tools
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Your calendar, meetings, diary and tasks in one place.
        </p>
      </div>

      <nav
        aria-label="Tools"
        className="mb-6 flex gap-1 overflow-x-auto border-b border-line"
      >
        {TABS.map((t) => {
          const active = pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${
                active
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </>
  );
}
