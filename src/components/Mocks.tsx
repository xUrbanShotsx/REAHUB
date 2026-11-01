import { Flag } from "./Flag";
import { Icon } from "./Icons";

function Frame({
  title,
  children,
  dark = false,
}: {
  title: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`lift overflow-hidden rounded-2xl border shadow-[0_24px_60px_-28px_oklch(0.24_0.05_258/0.45)] ${
        dark
          ? "border-bg/15 bg-[oklch(0.3_0.05_258)] text-bg"
          : "border-line bg-surface"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b px-5 py-3 ${dark ? "border-bg/15" : "border-line"}`}
      >
        <span className="font-mono text-xs uppercase tracking-widest">
          {title}
        </span>
        <span
          className={`font-mono text-[0.65rem] uppercase tracking-widest ${dark ? "text-bg/55" : "text-ink-soft"}`}
        >
          Sample data
        </span>
      </div>
      {children}
    </div>
  );
}

export function BoardMock() {
  const rows: [string, string, "ok" | "flag" | "soon"][] = [
    ["Form 6, agency agreement", "Filed", "ok"],
    ["Vendor disclosure", "Filed", "ok"],
    ["Material fact notice", "Filed", "ok"],
    ["Identity verification", "Owed", "flag"],
    ["Licence, J. Alvarez", "Renews in 41 days", "soon"],
  ];
  return (
    <Frame title="Listing checklist · 12 Smith St">
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
              {kind === "flag" ? (
                <Flag className="h-5 w-5" />
              ) : (
                <span className="h-5 w-5" />
              )}
              {name}
            </span>
            <span className="flex items-center gap-1.5 text-ink-soft">
              {kind === "ok" && (
                <Icon name="check" className="h-4 w-4 text-ink" />
              )}
              {status}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between bg-tint px-5 py-3 font-mono text-xs uppercase tracking-widest">
        <span>3 filed</span>
        <span>1 owed</span>
        <span>1 renewing</span>
      </div>
    </Frame>
  );
}

export function LicenseMock() {
  const rows: [string, string, number, string][] = [
    ["Dana Whitfield", "Licensee in charge, Class 1", 88, "Active"],
    ["J. Alvarez", "Class 2 licence, renews 2 Oct", 14, "Renews in 41 days"],
    ["Priya Nair", "Certificate of registration", 70, "Active"],
    ["Tom Becker", "CPD short by 6 hours", 40, "CPD due"],
  ];
  return (
    <Frame title="Accreditations · Inner West office">
      <ul>
        {rows.map(([name, role, pct, status]) => (
          <li
            key={name}
            className="border-b border-line px-5 py-4 last:border-0"
          >
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-semibold">{name}</span>
              <span className="text-ink-soft">{status}</span>
            </div>
            <p className="text-xs text-ink-soft">{role}</p>
            <div className="mt-2 h-1.5 rounded-full bg-tint">
              <div
                className={`h-full rounded-full ${pct < 50 ? "bg-accent" : "bg-ink"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function ChecklistMock() {
  const items: [string, boolean][] = [
    ["Agency agreement signed", true],
    ["Vendor identity verified", true],
    ["Material facts disclosed", true],
    ["Estimated selling price recorded", true],
    ["Contract for sale on file", false],
    ["Smoke alarms checked", false],
  ];
  return (
    <Frame title="Sales campaign · 4 of 6 done">
      <ul>
        {items.map(([label, done]) => (
          <li
            key={label}
            className="flex items-center gap-3 border-b border-line px-5 py-3.5 text-sm last:border-0"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded border ${
                done ? "border-ink bg-ink text-bg" : "border-ink-soft"
              }`}
            >
              {done && <Icon name="check" className="h-3.5 w-3.5" />}
            </span>
            <span
              className={
                done
                  ? "text-ink-soft line-through decoration-ink-soft/50"
                  : "font-medium"
              }
            >
              {label}
            </span>
            {label === "Contract for sale on file" && (
              <Flag className="ml-auto h-5 w-5" />
            )}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function TrustMock() {
  const receipts: [string, string, string][] = [
    ["R-0841", "Deposit, 15 Wharf Rd", "+A$175,000"],
    ["R-0842", "Deposit, 6 Rose St", "+A$117,000"],
  ];
  const recon: [string, string][] = [
    ["Cash book", "A$292,000"],
    ["Bank statement", "A$292,000"],
    ["Trust ledger", "A$292,000"],
  ];
  return (
    <Frame title="Trust · Sales account">
      <ul>
        {receipts.map(([ref, against, amt]) => (
          <li
            key={ref}
            className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5 text-sm"
          >
            <span className="font-mono text-xs text-ink-soft">{ref}</span>
            <span className="flex-1 font-medium">{against}</span>
            <span className="font-semibold">{amt}</span>
          </li>
        ))}
      </ul>
      <div className="px-5 py-4">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
          September reconciliation
        </p>
        <dl className="mt-3 space-y-1.5 text-sm">
          {recon.map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-ink-soft">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div className="flex justify-between border-t border-line pt-2 font-semibold">
            <dt>Difference</dt>
            <dd>A$0</dd>
          </div>
        </dl>
      </div>
      <div className="flex items-center gap-2 bg-tint px-5 py-3 font-mono text-xs uppercase tracking-widest">
        <Icon name="check" className="h-4 w-4" /> Balanced, ready to sign
      </div>
    </Frame>
  );
}

export function TrailMock({ dark = false }: { dark?: boolean }) {
  const events: [string, string][] = [
    ["09:02", "Material fact notice sent to vendor"],
    ["09:14", "Vendor signed"],
    ["09:15", "Copy filed to the property"],
    ["11:40", "Licensee in charge approved"],
    ["11:41", "Identity check recorded, with previous value"],
  ];
  return (
    <Frame title="Audit log · 12 Smith St" dark={dark}>
      <ol className="px-5 py-4">
        {events.map(([t, e]) => (
          <li key={t} className="flex gap-4 py-2 text-sm">
            <span
              className={`font-mono text-xs leading-6 ${dark ? "text-bg/60" : "text-ink-soft"}`}
            >
              {t}
            </span>
            <span className="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent">
              {e}
            </span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}
