import { Flag } from "./Flag";
import { Icon } from "./Icons";

function Frame({ title, children, dark = false }: { title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-[0_24px_60px_-28px_oklch(0.24_0.05_258/0.45)] ${
        dark ? "border-bg/15 bg-[oklch(0.3_0.05_258)] text-bg" : "border-line bg-surface"
      }`}
    >
      <div className={`flex items-center justify-between border-b px-5 py-3 ${dark ? "border-bg/15" : "border-line"}`}>
        <span className="font-mono text-xs uppercase tracking-widest">{title}</span>
        <span className={`font-mono text-[0.65rem] uppercase tracking-widest ${dark ? "text-bg/55" : "text-ink-soft"}`}>
          Sample data
        </span>
      </div>
      {children}
    </div>
  );
}

export function BoardMock() {
  const rows: [string, string, "ok" | "flag" | "soon"][] = [
    ["Broker supervision file", "Cleared", "ok"],
    ["Agency agreement", "Cleared", "ok"],
    ["Lead paint disclosure", "Cleared", "ok"],
    ["Wire fraud advisory", "Missing", "flag"],
    ["Agent license, J. Alvarez", "Renews in 41 days", "soon"],
  ];
  return (
    <Frame title="Closing board · 142 Maple St">
      <ul>
        {rows.map(([name, status, kind], i) => (
          <li
            key={name}
            style={{ animationDelay: `${0.5 + i * 0.28}s` }}
            className={`board-row flex items-center justify-between gap-4 border-b border-line px-5 py-4 text-sm last:border-0 ${
              kind === "flag" ? "bg-accent/25" : ""
            }`}
          >
            <span className="flex items-center gap-3 font-medium">
              {kind === "flag" ? <Flag className="h-5 w-5" /> : <span className="h-5 w-5" />}
              {name}
            </span>
            <span className="flex items-center gap-1.5 text-ink-soft">
              {kind === "ok" && <Icon name="check" className="h-4 w-4 text-ink" />}
              {status}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between bg-tint px-5 py-3 font-mono text-xs uppercase tracking-widest">
        <span>3 cleared</span>
        <span>1 missing</span>
        <span>1 renewing</span>
      </div>
    </Frame>
  );
}

export function LicenseMock() {
  const rows: [string, string, number, string][] = [
    ["Dana Whitfield", "Broker, exp. Mar 2027", 88, "Active"],
    ["J. Alvarez", "Agent, exp. Dec 12", 14, "Renews in 41 days"],
    ["Priya Nair", "Agent, exp. Aug 2027", 70, "Active"],
    ["Tom Becker", "Agent, CE short 6 hours", 40, "CE due"],
  ];
  return (
    <Frame title="Licenses · Northside office">
      <ul>
        {rows.map(([name, role, pct, status]) => (
          <li key={name} className="border-b border-line px-5 py-4 last:border-0">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-semibold">{name}</span>
              <span className="text-ink-soft">{status}</span>
            </div>
            <p className="text-xs text-ink-soft">{role}</p>
            <div className="mt-2 h-1.5 rounded-full bg-tint">
              <div className={`h-full rounded-full ${pct < 50 ? "bg-accent" : "bg-ink"}`} style={{ width: `${pct}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function ChecklistMock() {
  const items: [string, boolean][] = [
    ["Purchase agreement, signed", true],
    ["Agency disclosure", true],
    ["Seller property disclosure", true],
    ["Earnest money receipt", true],
    ["Wire fraud advisory", false],
    ["Broker review sign-off", false],
  ];
  return (
    <Frame title="Residential sale · State checklist">
      <ul>
        {items.map(([label, done]) => (
          <li key={label} className="flex items-center gap-3 border-b border-line px-5 py-3.5 text-sm last:border-0">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded border ${
                done ? "border-ink bg-ink text-bg" : "border-ink-soft"
              }`}
            >
              {done && <Icon name="check" className="h-3.5 w-3.5" />}
            </span>
            <span className={done ? "text-ink-soft line-through decoration-ink-soft/50" : "font-medium"}>{label}</span>
            {label === "Wire fraud advisory" && <Flag className="ml-auto h-5 w-5" />}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function TrailMock({ dark = false }: { dark?: boolean }) {
  const events: [string, string][] = [
    ["09:02", "Disclosure sent to buyer"],
    ["09:14", "Buyer opened and signed"],
    ["09:15", "Copy filed to transaction"],
    ["11:40", "Broker review approved"],
    ["11:41", "File marked cleared"],
  ];
  return (
    <Frame title="Audit trail · 142 Maple St" dark={dark}>
      <ol className="px-5 py-4">
        {events.map(([t, e]) => (
          <li key={t} className="flex gap-4 py-2 text-sm">
            <span className={`font-mono text-xs leading-6 ${dark ? "text-bg/60" : "text-ink-soft"}`}>{t}</span>
            <span className="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent">
              {e}
            </span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}
