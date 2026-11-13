"use client";

import { useRouter } from "next/navigation";
import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Icon, type IconName } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { typeName } from "@/lib/accreditations";
import { fmtDate } from "@/lib/format";
import { registerById } from "@/lib/registers";
import { ledgers } from "@/lib/trust";
import { VAULT } from "@/lib/vault";

type Hit = {
  id: string;
  group: string;
  icon: IconName;
  title: string;
  sub?: string;
  href: string;
  /** What the query is matched against. */
  text: string;
};

const PAGES: { title: string; href: string; icon: IconName; words: string }[] =
  [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "grid",
      words: "home overview",
    },
    {
      title: "Assistance",
      href: "/dashboard/assistant",
      icon: "sparkle",
      words: "assistant ai chat agent help",
    },
    {
      title: "Properties",
      href: "/dashboard/properties",
      icon: "building",
      words: "listings sales management checklist",
    },
    {
      title: "Add a property",
      href: "/dashboard/properties/new",
      icon: "plus",
      words: "new listing",
    },
    {
      title: "Trust accounts",
      href: "/dashboard/trust",
      icon: "scale",
      words:
        "cash book ledger reconcile reconciliation bank statement receipts payments",
    },
    {
      title: "Compliance",
      href: "/dashboard/compliance",
      icon: "shield",
      words: "registers accreditations audit log policies",
    },
    {
      title: "Operations",
      href: "/dashboard/operations",
      icon: "clock",
      words: "kpis targets performance",
    },
    {
      title: "Tools",
      href: "/dashboard/tools",
      icon: "list",
      words: "calendar meetings diary tasks",
    },
    {
      title: "Calendar",
      href: "/dashboard/tools/calendar",
      icon: "calendar",
      words: "events open home inspection",
    },
    {
      title: "Meetings",
      href: "/dashboard/tools/meetings",
      icon: "users",
      words: "minutes agenda",
    },
    {
      title: "Diary",
      href: "/dashboard/tools/diary",
      icon: "book",
      words: "notes",
    },
    {
      title: "Task list",
      href: "/dashboard/tools/tasks",
      icon: "check",
      words: "to do todo tasks",
    },
    {
      title: "Document Vault",
      href: "/dashboard/vault",
      icon: "file",
      words: "policies procedures documents",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
      words: "team usage billing agency notifications account plan",
    },
  ];

const ORDER = [
  "Pages",
  "Properties",
  "Tasks",
  "Documents",
  "Registers",
  "Licences and CPD",
  "Calendar",
  "Checklists",
  "Trust",
  "KPIs",
  "People",
];

const norm = (s: string) => s.toLowerCase();

/** Wraps the parts of `text` that match the query in <mark>. */
function highlight(text: string, tokens: string[]): ReactNode {
  if (!tokens.length) return text;
  const re = new RegExp(
    `(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "ig",
  );
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-accent/20 px-0.5 text-ink">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/**
 * Search across the whole workspace. Results drop down as you type, grouped by kind, and can be
 * chosen with the mouse or the keyboard (arrows, Enter, Escape). Press / anywhere to jump to it.
 */
export function GlobalSearch({
  className = "",
  placeholder = "Search properties, tasks, documents, people",
  onNavigate,
  tone = "bg",
}: {
  className?: string;
  placeholder?: string;
  onNavigate?: () => void;
  tone?: "bg" | "tint";
}) {
  const store = useStore();
  const router = useRouter();
  const uid = useId();
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const index = useMemo<Hit[]>(() => {
    const addr = (id: string) => {
      const p = store.properties.find((x) => x.id === id);
      return p ? `${p.address}, ${p.suburb}` : "";
    };
    const hits: Hit[] = [];

    for (const p of store.properties)
      hits.push({
        id: `p-${p.id}`,
        group: "Properties",
        icon: "building",
        title: `${p.address}, ${p.suburb}`,
        sub: `${[p.type === "sale" ? "For sale" : "Managed", p.status].filter((v, i, a) => a.indexOf(v) === i).join(" · ")} · ${p.agent}`,
        href: `/dashboard/properties/${p.id}`,
        text: `${p.address} ${p.suburb} ${p.owner} ${p.agent} ${p.status} ${p.type === "sale" ? "sale" : "management managed rental"} ${p.price}`,
      });

    for (const p of store.properties)
      for (const c of p.checklist)
        hits.push({
          id: `c-${p.id}-${c.id}`,
          group: "Checklists",
          icon: "check",
          title: c.t,
          sub: `${p.address} · ${c.done ? "Done" : c.due ? `Due ${fmtDate(c.due)}` : "Open"}`,
          href: `/dashboard/properties/${p.id}`,
          text: `${c.t} ${p.address} ${p.suburb} ${c.who}`,
        });

    for (const t of store.tasks)
      hits.push({
        id: `t-${t.id}`,
        group: "Tasks",
        icon: "check",
        title: t.t,
        sub: `${t.status} · ${t.assignee}${t.due ? ` · due ${fmtDate(t.due)}` : ""}`,
        href: "/dashboard/tools/tasks",
        text: `${t.t} ${t.assignee} ${t.where} ${t.status}`,
      });

    for (const d of VAULT) {
      const doc = store.documents.find((x) => x.id === d.id);
      hits.push({
        id: `v-${d.id}`,
        group: "Documents",
        icon: d.icon,
        title: d.name,
        sub: `${d.category} · ${doc ? (doc.approval ? "Approved" : "Draft") : "Not written yet"}`,
        href: `/dashboard/vault/${d.id}`,
        text: `${d.name} ${d.category} ${d.blurb} policy procedure`,
      });
    }

    for (const e of store.entries) {
      const def = registerById(e.registerId);
      if (!def) continue;
      const first = e.values[def.columns[0]];
      const label =
        typeof first === "string" && first ? addr(first) || first : def.name;
      const values = Object.values(e.values)
        .map((v) =>
          typeof v === "string" ? (addr(v) ? `${v} ${addr(v)}` : v) : "",
        )
        .join(" ");
      hits.push({
        id: `e-${e.id}`,
        group: "Registers",
        icon: "book",
        title: label,
        sub: `${def.name} register · ${e.status}`,
        href: `/dashboard/compliance/registers/${def.id}`,
        text: `${label} ${def.name} ${e.status} ${values} ${e.createdBy}`,
      });
    }

    for (const a of store.accreditations)
      hits.push({
        id: `a-${a.id}`,
        group: "Licences and CPD",
        icon: "id",
        title: `${a.person}, ${typeName(a)}`,
        sub: `Expires ${fmtDate(a.expiresOn)}`,
        href: `/dashboard/compliance/accreditations/${a.id}`,
        text: `${a.person} ${typeName(a)} ${a.number ?? ""} licence accreditation cpd`,
      });

    for (const e of store.events)
      hits.push({
        id: `ev-${e.id}`,
        group: "Calendar",
        icon: "calendar",
        title: e.title,
        sub: `${e.kind} · ${fmtDate(e.date)}${e.time ? ` at ${e.time}` : ""}`,
        href: "/dashboard/tools/calendar",
        text: `${e.title} ${e.kind} ${e.notes ?? ""} ${e.property ? addr(e.property) : ""}`,
      });
    for (const m of store.meetings)
      hits.push({
        id: `m-${m.id}`,
        group: "Calendar",
        icon: "users",
        title: m.title,
        sub: `Meeting · ${fmtDate(m.date)}`,
        href: "/dashboard/tools/meetings",
        text: `${m.title} ${m.type} ${m.attendees.join(" ")} ${m.notes}`,
      });
    for (const d of store.diary)
      hits.push({
        id: `d-${d.id}`,
        group: "Calendar",
        icon: "book",
        title: d.text.length > 70 ? `${d.text.slice(0, 70)}…` : d.text,
        sub: `Diary · ${d.tag} · ${fmtDate(d.date)}`,
        href: "/dashboard/tools/diary",
        text: `${d.text} ${d.tag}`,
      });

    for (const acc of store.trust.accounts)
      for (const l of ledgers(store.trust, acc.id))
        hits.push({
          id: `l-${acc.id}-${l.propertyId}-${l.party}`,
          group: "Trust",
          icon: "scale",
          title: `${l.party}, ${addr(l.propertyId) || l.propertyId}`,
          sub: `${acc.name} ledger`,
          href: "/dashboard/trust",
          text: `${l.party} ${addr(l.propertyId)} ${acc.name} ledger trust`,
        });

    for (const k of store.kpis)
      hits.push({
        id: `k-${k.id}`,
        group: "KPIs",
        icon: "grid",
        title: k.name,
        sub: `${k.owner} · ${k.actual} of ${k.target}`,
        href: "/dashboard/operations",
        text: `${k.name} ${k.owner} ${k.period} kpi target`,
      });

    for (const m of store.members)
      hits.push({
        id: `u-${m.id}`,
        group: "People",
        icon: "user",
        title: m.name,
        sub: `${m.access} · ${m.team}`,
        href: "/dashboard/settings",
        text: `${m.name} ${m.email} ${m.team} ${m.access}`,
      });

    return hits;
  }, [store]);

  const tokens = useMemo(() => norm(q).split(/\s+/).filter(Boolean), [q]);

  const results = useMemo<Hit[]>(() => {
    if (!tokens.length)
      return PAGES.slice(0, 8).map((p) => ({
        id: `pg-${p.href}`,
        group: "Jump to",
        icon: p.icon,
        title: p.title,
        href: p.href,
        text: p.title,
      }));
    const score = (h: Hit) => {
      const title = norm(h.title);
      const first = tokens[0];
      return title.startsWith(first) ? 0 : title.includes(first) ? 1 : 2;
    };
    const pageHits: Hit[] = PAGES.map((p) => ({
      id: `pg-${p.href}`,
      group: "Pages",
      icon: p.icon,
      title: p.title,
      href: p.href,
      text: `${p.title} ${p.words}`,
    }));
    const matched = [...pageHits, ...index]
      .filter((h) => {
        const t = norm(h.text);
        return tokens.every((tok) => t.includes(tok));
      })
      .sort((a, b) => score(a) - score(b));
    const out: Hit[] = [];
    for (const g of ORDER)
      out.push(
        ...matched.filter((h) => h.group === g).slice(0, g === "Pages" ? 3 : 4),
      );
    return out.slice(0, 14);
  }, [tokens, index]);

  // keep the highlighted row in range as results change
  const shown = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName) &&
        !(e.target as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        input.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const go = (h: Hit) => {
    setOpen(false);
    setQ("");
    input.current?.blur();
    onNavigate?.();
    router.push(h.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open && results[shown]) {
        e.preventDefault();
        go(results[shown]);
      }
    } else if (e.key === "Escape") {
      if (q) setQ("");
      else {
        setOpen(false);
        input.current?.blur();
      }
    }
  };

  const listId = `${uid}-list`;
  let lastGroup = "";

  return (
    <div ref={box} className={`relative ${className}`}>
      <label
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm text-ink-soft focus-within:ring-2 focus-within:ring-accent ${
          tone === "tint" ? "bg-tint" : "bg-bg"
        }`}
      >
        <Icon name="search" className="h-4 w-4 shrink-0" />
        <input
          ref={input}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={
            open && results[shown] ? `${uid}-${shown}` : undefined
          }
          aria-autocomplete="list"
          aria-label="Search"
          autoComplete="off"
          spellCheck={false}
          value={q}
          placeholder={placeholder}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full min-w-0 bg-transparent text-ink outline-none placeholder:text-ink-soft"
        />
        {q ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQ("");
              input.current?.focus();
            }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-line hover:text-ink"
          >
            <Icon name="close" className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd className="hidden shrink-0 rounded border border-line px-1.5 text-[10px] font-semibold text-ink-soft lg:inline">
            /
          </kbd>
        )}
      </label>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label="Search results"
          data-lenis-prevent
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(26rem,70dvh)] min-w-[18rem] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface p-1.5 shadow-[0_20px_50px_-12px_rgba(20,30,60,0.28)] sm:min-w-[24rem]"
        >
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-ink-soft">
              Nothing found for “{q.trim()}”. Try a street, a name, or a
              document.
            </p>
          ) : (
            results.map((h, i) => {
              const header = h.group !== lastGroup ? h.group : null;
              lastGroup = h.group;
              return (
                <Fragment key={h.id}>
                  {header && (
                    <p className="px-3 pb-1 pt-2.5 text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                      {header}
                    </p>
                  )}
                  <button
                    type="button"
                    role="option"
                    id={`${uid}-${i}`}
                    aria-selected={i === shown}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(h)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                      i === shown ? "bg-accent/12" : ""
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tint text-ink-soft">
                      <Icon name={h.icon} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">
                        {highlight(h.title, tokens)}
                      </span>
                      {h.sub && (
                        <span className="block truncate text-xs text-ink-soft">
                          {h.sub}
                        </span>
                      )}
                    </span>
                    {i === shown && (
                      <Icon
                        name="arrow"
                        className="h-4 w-4 shrink-0 text-ink-soft"
                      />
                    )}
                  </button>
                </Fragment>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
