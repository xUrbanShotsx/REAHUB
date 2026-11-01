import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icons";

/* ---------- stage + browser window (the screenshot treatment) ---------- */

const NAV: { icon: IconName; id: string }[] = [
  { icon: "home", id: "properties" },
  { icon: "scale", id: "trust" },
  { icon: "shield", id: "compliance" },
  { icon: "clock", id: "operations" },
  { icon: "users", id: "people" },
];

function AppWindow({
  url,
  tab,
  active,
  children,
}: {
  url: string;
  tab: string;
  active: string;
  children: ReactNode;
}) {
  return (
    <div className="lift relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(140deg,oklch(0.19_0.05_262),oklch(0.3_0.11_266))] pl-4 pt-5 shadow-[0_40px_90px_-40px_oklch(0.24_0.05_258/0.7)] sm:pl-8 sm:pt-8">
      {/* light spilling in from the left edge */}
      <div
        aria-hidden="true"
        className="glow pointer-events-none absolute h-56 w-56 rounded-full bg-accent/80 blur-3xl"
      />
      <div className="relative -mr-4 overflow-hidden rounded-tl-2xl bg-surface text-ink ring-1 ring-white/20">
        {/* browser chrome */}
        <div className="bg-[oklch(0.93_0.012_250)] px-3 pt-2.5">
          <div className="flex items-end gap-3">
            <span className="mb-2 flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.18_25)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.82_0.15_85)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.75_0.16_150)]" />
            </span>
            <span className="flex min-w-0 items-center gap-2 rounded-t-lg bg-surface px-3 py-1.5 text-[11px] font-medium">
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] bg-accent text-[8px] font-bold text-bg">
                R
              </span>
              <span className="truncate">{tab}</span>
              <Icon name="close" className="h-3 w-3 shrink-0 text-ink-soft" />
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 border-b border-line bg-surface px-3 py-2 text-ink-soft">
          <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" />
          <Icon name="arrow" className="h-3.5 w-3.5" />
          <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-bg px-3 py-1 text-[11px]">
            <Icon name="lock" className="h-3 w-3 shrink-0" />
            <span className="truncate">{url}</span>
          </span>
        </div>

        {/* app header */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt=""
            width={403}
            height={82}
            className="h-3.5 w-auto"
          />
          <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-bg px-3 py-1 text-[11px] text-ink-soft sm:flex">
            <Icon name="search" className="h-3 w-3" /> Search
          </span>
          <span className="rounded-full bg-tint px-2.5 py-1 text-[10px] font-semibold text-ink-soft">
            Sample data
          </span>
        </div>

        <div className="flex">
          <nav
            aria-hidden="true"
            className="hidden w-12 shrink-0 flex-col items-center gap-1 border-r border-line bg-bg py-3 sm:flex"
          >
            {NAV.map((n) => (
              <span
                key={n.id}
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  n.id === active ? "bg-accent/15 text-ink" : "text-ink-soft"
                }`}
              >
                <Icon name={n.icon} className="h-4 w-4" />
              </span>
            ))}
          </nav>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

function PageTitle({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5">
      <div className="min-w-0">
        <h3 className="font-display text-lg font-extrabold leading-tight tracking-tight">
          {title}
        </h3>
        {sub && <p className="mt-0.5 text-[13px] text-ink-soft">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/* ---------- small parts ---------- */

type Tone = "ok" | "owed" | "neutral" | "solid";

function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  const styles: Record<Tone, string> = {
    ok: "bg-ink/[0.06] text-ink",
    owed: "bg-accent/15 text-ink",
    neutral: "bg-tint text-ink-soft",
    solid: "bg-ink text-bg",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[tone]}`}
    >
      {tone === "ok" && <Icon name="check" className="h-3 w-3" />}
      {tone === "owed" && (
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      )}
      {children}
    </span>
  );
}

function Avatar({
  initials,
  tone = 0,
}: {
  initials: string;
  tone?: 0 | 1 | 2;
}) {
  const t = [
    "bg-accent/15 text-ink",
    "bg-ink/10 text-ink",
    "bg-tint text-ink-soft",
  ][tone];
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${t}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function Progress({ pct }: { pct: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-tint">
      <div
        className="h-full rounded-full bg-accent"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ---------- hero: the property file ---------- */

export function BoardMock() {
  const rows: {
    name: string;
    note: string;
    status: string;
    tone: Tone;
    who: string;
  }[] = [
    {
      name: "Form 6, agency agreement",
      note: "Signed by vendor · 3 Sep",
      status: "Filed",
      tone: "ok",
      who: "ST",
    },
    {
      name: "Vendor disclosure",
      note: "Filed by Priya · 3 Sep",
      status: "Filed",
      tone: "ok",
      who: "PN",
    },
    {
      name: "Material fact notice",
      note: "Filed by Sam · 4 Sep",
      status: "Filed",
      tone: "ok",
      who: "ST",
    },
    {
      name: "Identity verification",
      note: "Owed by Alex · due today",
      status: "Owed",
      tone: "owed",
      who: "AC",
    },
    {
      name: "Licence, J. Alvarez",
      note: "Class 2 · expires 2 Oct",
      status: "Renews in 41 days",
      tone: "neutral",
      who: "JA",
    },
  ];
  const properties: [string, string][] = [
    ["12 Smith Street, Newtown", "Listed"],
    ["41 Norton Street, Leichhardt", "Under offer"],
    ["3 Bay Street, Rozelle", "Managed"],
    ["22 Hill Street, Balmain", "Appraised"],
  ];
  return (
    <AppWindow
      url="app.reahub.com.au/properties/12-smith-st"
      tab="12 Smith St · REAHUB"
      active="properties"
    >
      <div className="flex">
        {/* property list, like the prospect list in a CRM */}
        <aside className="hidden w-44 shrink-0 border-r border-line bg-bg p-3 xl:block">
          <p className="px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
            Every property
          </p>
          <ul className="space-y-1">
            {properties.map(([a, s], i) => (
              <li
                key={a}
                className={`rounded-lg px-2 py-2 ${i === 0 ? "bg-surface shadow-sm ring-1 ring-line" : ""}`}
              >
                <p className="truncate text-xs font-semibold">{a}</p>
                <p className="text-[11px] text-ink-soft">{s}</p>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1">
          <PageTitle
            title="12 Smith Street, Newtown"
            sub="Sales campaign · Listed 29 Aug"
            right={<Pill tone="neutral">3 of 5 filed</Pill>}
          />
          <div className="px-5 pt-4">
            <Progress pct={60} />
            <div className="mt-4 flex gap-5 overflow-hidden whitespace-nowrap border-b border-line text-[13px] font-medium text-ink-soft">
              {[
                "Overview",
                "Checklist",
                "Parties",
                "Documents",
                "Trust",
                "Activity",
              ].map((t) => (
                <span
                  key={t}
                  className={`-mb-px border-b-2 pb-2.5 ${t === "Checklist" ? "border-accent text-ink" : "border-transparent"}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <ul>
            {rows.map((r, i) => (
              <li
                key={r.name}
                style={{ animationDelay: `${0.5 + i * 0.28}s` }}
                className={`board-row flex items-center gap-3 border-b border-line px-5 py-3 last:border-0 ${
                  r.tone === "owed"
                    ? "bg-accent/[0.07] shadow-[inset_3px_0_0_var(--accent)]"
                    : ""
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    r.tone === "ok"
                      ? "bg-ink text-bg"
                      : "border-[1.5px] border-dashed border-ink-soft/60"
                  }`}
                  aria-hidden="true"
                >
                  {r.tone === "ok" && <Icon name="check" className="h-3 w-3" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{r.name}</p>
                  <p className="truncate text-xs text-ink-soft">{r.note}</p>
                </div>
                <span className="hidden sm:block">
                  <Pill tone={r.tone}>{r.status}</Pill>
                </span>
                <Avatar initials={r.who} tone={(i % 3) as 0 | 1 | 2} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppWindow>
  );
}

/* ---------- properties: campaign checklist ---------- */

export function ChecklistMock() {
  const groups: {
    title: string;
    done: number;
    items: {
      t: string;
      file?: string;
      who: string;
      done: boolean;
      due?: string;
    }[];
  }[] = [
    {
      title: "Listing",
      done: 3,
      items: [
        {
          t: "Agency agreement signed",
          file: "Form6.pdf",
          who: "ST",
          done: true,
        },
        {
          t: "Vendor identity verified",
          file: "ID-check.pdf",
          who: "PN",
          done: true,
        },
        {
          t: "Material facts disclosed",
          file: "Notice.pdf",
          who: "ST",
          done: true,
        },
        {
          t: "Estimated selling price recorded",
          who: "AC",
          done: false,
          due: "Due today",
        },
      ],
    },
    {
      title: "Safety",
      done: 1,
      items: [
        {
          t: "Contract for sale on file",
          file: "Contract.pdf",
          who: "PN",
          done: true,
        },
        { t: "Smoke alarms checked", who: "JA", done: false, due: "Due Fri" },
      ],
    },
  ];
  return (
    <AppWindow
      url="app.reahub.com.au/campaigns/12-smith-st"
      tab="Campaign · REAHUB"
      active="properties"
    >
      <PageTitle
        title="Compliance checklist"
        sub="Sales campaign · 12 Smith St"
        right={
          <span className="text-[13px] font-semibold tabular-nums">
            4 of 6 done
          </span>
        }
      />
      <div className="px-5 pb-4 pt-3">
        <Progress pct={66} />
      </div>
      {groups.map((g) => (
        <section key={g.title} className="border-t border-line">
          <div className="flex items-center justify-between bg-bg px-5 py-2 text-xs font-bold uppercase tracking-wider text-ink-soft">
            {g.title}
            <span className="font-medium normal-case tracking-normal">
              {g.done}/{g.items.length}
            </span>
          </div>
          <ul>
            {g.items.map((it) => (
              <li
                key={it.t}
                className="flex items-center gap-3 border-t border-line px-5 py-3 first:border-t-0"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] ${
                    it.done ? "border-ink bg-ink text-bg" : "border-ink-soft/50"
                  }`}
                  aria-hidden="true"
                >
                  {it.done && <Icon name="check" className="h-3 w-3" />}
                </span>
                <span
                  className={`min-w-0 flex-1 truncate text-sm ${it.done ? "text-ink-soft" : "font-semibold"}`}
                >
                  {it.t}
                </span>
                {it.file && (
                  <span className="hidden items-center gap-1 rounded-md bg-tint px-2 py-1 text-[11px] font-medium text-ink-soft md:inline-flex">
                    <Icon name="clip" className="h-3 w-3" />
                    {it.file}
                  </span>
                )}
                {it.due && <Pill tone="owed">{it.due}</Pill>}
                <Avatar initials={it.who} tone={it.done ? 2 : 0} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </AppWindow>
  );
}

/* ---------- trust ---------- */

export function TrustMock() {
  const receipts = [
    {
      ref: "R-0841",
      against: "Deposit, 15 Wharf Rd",
      party: "A. Moretti",
      amt: "+A$175,000",
    },
    {
      ref: "R-0842",
      against: "Deposit, 6 Rose St",
      party: "K. Ohlsson",
      amt: "+A$117,000",
    },
  ];
  const recon = [
    ["Cash book", "A$292,000"],
    ["Bank statement", "A$292,000"],
    ["Trust ledger", "A$292,000"],
  ];
  return (
    <AppWindow
      url="app.reahub.com.au/trust/sales"
      tab="Sales trust · REAHUB"
      active="trust"
    >
      <PageTitle
        title="Sales trust account"
        sub="September"
        right={<Pill tone="ok">Matched</Pill>}
      />
      <div className="mt-4 grid grid-cols-2 border-y border-line">
        <div className="border-r border-line px-5 py-3.5">
          <p className="text-xs font-medium text-ink-soft">Held in trust</p>
          <p className="mt-1 font-display text-xl font-extrabold tabular-nums tracking-tight">
            A$292,000
          </p>
        </div>
        <div className="px-5 py-3.5">
          <p className="text-xs font-medium text-ink-soft">Unreconciled</p>
          <p className="mt-1 font-display text-xl font-extrabold tabular-nums tracking-tight">
            A$0
          </p>
        </div>
      </div>
      <ul>
        {receipts.map((r) => (
          <li
            key={r.ref}
            className="flex items-center gap-3 border-b border-line px-5 py-3 text-sm"
          >
            <span className="hidden w-14 shrink-0 font-mono text-xs text-ink-soft sm:block">
              {r.ref}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">{r.against}</span>
              <span className="block truncate text-xs text-ink-soft">
                Held for {r.party}
              </span>
            </span>
            <span className="font-semibold tabular-nums">{r.amt}</span>
          </li>
        ))}
      </ul>
      <div className="m-4 rounded-2xl border border-line bg-bg p-4">
        <p className="text-sm font-bold">September reconciliation</p>
        <dl className="mt-3 space-y-2 text-sm">
          {recon.map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-ink-soft">{k}</dt>
              <dd className="tabular-nums">{v}</dd>
            </div>
          ))}
          <div className="flex justify-between border-t border-line pt-2 font-bold">
            <dt>Difference</dt>
            <dd className="tabular-nums">A$0</dd>
          </div>
        </dl>
        <div className="mt-4 flex gap-2">
          <span className="flex-1 rounded-full bg-ink px-4 py-2 text-center text-xs font-semibold text-bg">
            Sign reconciliation
          </span>
          <span className="rounded-full border border-line bg-surface px-4 py-2 text-xs font-semibold">
            Audit pack
          </span>
        </div>
      </div>
    </AppWindow>
  );
}

/* ---------- compliance: accreditations ---------- */

export function LicenseMock() {
  const people = [
    {
      n: "Dana Whitfield",
      i: "DW",
      role: "Licensee in charge · Class 1",
      exp: "Mar 2027",
      pct: 88,
      status: "Active",
      tone: "ok" as Tone,
    },
    {
      n: "J. Alvarez",
      i: "JA",
      role: "Class 2 licence",
      exp: "2 Oct",
      pct: 14,
      status: "Renews in 41 days",
      tone: "owed" as Tone,
    },
    {
      n: "Priya Nair",
      i: "PN",
      role: "Certificate of registration",
      exp: "Aug 2027",
      pct: 70,
      status: "Active",
      tone: "ok" as Tone,
    },
    {
      n: "Tom Becker",
      i: "TB",
      role: "Class 2 licence",
      exp: "Jun 2027",
      pct: 45,
      status: "CPD short 6 hrs",
      tone: "neutral" as Tone,
    },
  ];
  return (
    <AppWindow
      url="app.reahub.com.au/compliance/accreditations"
      tab="Accreditations · REAHUB"
      active="compliance"
    >
      <PageTitle title="Accreditations" sub="Inner West office" />
      <div className="mx-4 mb-3 mt-4 flex items-start gap-3 rounded-2xl border border-accent/25 bg-accent/[0.08] p-3.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-bg">
          <Icon name="bell" className="h-4 w-4" />
        </span>
        <p className="text-[13px] leading-snug">
          <span className="font-bold">
            J. Alvarez&apos;s Class 2 licence renews in 41 days.
          </span>{" "}
          <span className="text-ink-soft">
            Alerts go out at 90, 60, 30 and 7 days.
          </span>
        </p>
      </div>
      <ul>
        {people.map((p, i) => (
          <li
            key={p.n}
            className="flex items-center gap-3 border-t border-line px-5 py-3.5"
          >
            <Avatar initials={p.i} tone={(i % 3) as 0 | 1 | 2} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.n}</p>
              <p className="truncate text-xs text-ink-soft">
                {p.role} · exp. {p.exp}
              </p>
              <div className="mt-2 w-full max-w-[11rem]">
                <Progress pct={p.pct} />
              </div>
            </div>
            <span className="hidden sm:block">
              <Pill tone={p.tone}>{p.status}</Pill>
            </span>
          </li>
        ))}
      </ul>
    </AppWindow>
  );
}

/* ---------- audit log ---------- */

export function TrailMock() {
  const events = [
    {
      t: "11:41",
      who: "DW",
      name: "Dana Whitfield",
      act: "locked the September reconciliation",
      from: "Draft",
      to: "Locked",
    },
    {
      t: "11:40",
      who: "DW",
      name: "Dana Whitfield",
      act: "approved the identity check",
      from: "Owed",
      to: "Verified",
    },
    {
      t: "09:15",
      who: "ST",
      name: "Sam Taylor",
      act: "filed the material fact notice",
      from: "Missing",
      to: "Filed",
    },
    {
      t: "09:14",
      who: "AC",
      name: "Alex Chen",
      act: "recorded a gift, bottle of wine",
      from: "No entry",
      to: "Gifts register",
    },
  ];
  return (
    <AppWindow
      url="app.reahub.com.au/compliance/audit-log"
      tab="Audit log · REAHUB"
      active="compliance"
    >
      <PageTitle
        title="Audit log"
        sub="Every write, who made it and what it was before"
        right={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-bg">
            <Icon name="download" className="h-3.5 w-3.5" /> Export pack
          </span>
        }
      />
      <div className="mt-4 flex gap-1.5 border-b border-line px-5 pb-3 text-xs font-semibold">
        {["All", "Trust", "Registers"].map((f, i) => (
          <span
            key={f}
            className={`rounded-full px-3 py-1 ${i === 0 ? "bg-ink text-bg" : "text-ink-soft"}`}
          >
            {f}
          </span>
        ))}
      </div>
      <ol>
        {events.map((e) => (
          <li
            key={e.t + e.act}
            className="flex gap-3 border-b border-line px-5 py-3.5 last:border-0"
          >
            <Avatar initials={e.who} tone={1} />
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug">
                <span className="font-semibold">{e.name}</span>{" "}
                <span className="text-ink-soft">{e.act}</span>
              </p>
              <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
                <span className="rounded-md bg-tint px-1.5 py-0.5 text-ink-soft line-through">
                  {e.from}
                </span>
                <Icon name="arrow" className="h-3 w-3 opacity-50" />
                <span className="rounded-md bg-accent/15 px-1.5 py-0.5">
                  {e.to}
                </span>
              </p>
            </div>
            <span className="shrink-0 pt-0.5 font-mono text-xs text-ink-soft">
              {e.t}
            </span>
          </li>
        ))}
      </ol>
      <div className="flex items-center gap-2 bg-bg px-5 py-3 text-xs text-ink-soft">
        <Icon name="lock" className="h-3.5 w-3.5" /> Entries cannot be edited or
        deleted
      </div>
    </AppWindow>
  );
}
