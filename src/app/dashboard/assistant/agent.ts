import type { useStore } from "@/components/app/DemoStore";
import { cpdDone, daysUntil, typeName } from "@/lib/accreditations";
import { toolByName } from "@/lib/agent-tools";
import {
  EVENT_KINDS,
  MEETING_TYPES,
  type CalEvent,
  type TaskStatus,
} from "@/lib/demo-data";
import { fmtDate, todayISO } from "@/lib/format";
import {
  OPEN_STATUSES,
  isVisible,
  registerById,
  registerDefs,
  validate,
  type Values,
} from "@/lib/registers";
import { cashBook, ledgers, lockedUntil, money, summarise } from "@/lib/trust";
import { VAULT, vaultStatus } from "@/lib/vault";

export type AppStore = ReturnType<typeof useStore>;
export type Input = Record<string, unknown>;
export type Outcome = {
  ok: boolean;
  /** What goes back to the model. */
  text: string;
  /** Short plain sentence for the person. */
  outcome?: string;
  link?: { path: string; label: string };
};

const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const json = (v: unknown) => JSON.stringify(v).slice(0, 12_000);
const fail = (text: string): Outcome => ({ ok: false, text, outcome: text });
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);
const isTime = (v: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
const norm = (v: string) => v.trim().toLowerCase();

const teamName = (store: AppStore, name: string) =>
  store.members.find((m) => norm(m.name) === norm(name))?.name;

const addressOf = (store: AppStore, id: string) => {
  const p = store.properties.find((x) => x.id === id);
  return p ? `${p.address}, ${p.suburb}` : id;
};

/** Plain words for a step, used on approval cards and in the activity trail. */
export function describeTool(
  name: string,
  input: Input,
  store: AppStore,
): { title: string; detail?: string } {
  const who = (v: unknown) => teamName(store, s(v)) ?? s(v);
  switch (name) {
    case "list_properties":
      return { title: "Looking up properties" };
    case "get_property":
      return {
        title: "Opening a property checklist",
        detail: addressOf(store, s(input.property_id)),
      };
    case "list_tasks":
      return { title: "Checking tasks" };
    case "list_team":
      return { title: "Checking the team" };
    case "list_accreditations":
      return { title: "Checking licences and CPD" };
    case "list_registers":
      return { title: "Checking the registers" };
    case "list_register_entries":
      return {
        title: "Reading a register",
        detail: registerById(s(input.register))?.name ?? s(input.register),
      };
    case "list_calendar":
      return { title: "Checking the calendar" };
    case "list_kpis":
      return { title: "Checking KPIs" };
    case "list_documents":
      return { title: "Checking the Document Vault" };
    case "list_checklist_templates":
      return { title: "Checking checklist templates" };
    case "trust_summary":
      return { title: "Reading the trust accounts" };
    case "open_page":
      return { title: "Linking a page", detail: s(input.label) };

    case "create_task":
      return {
        title: "Create a task",
        detail: [
          s(input.title),
          `For ${who(input.assignee)}`,
          s(input.due) && `Due ${fmtDate(s(input.due))}`,
          s(input.property_id) && addressOf(store, s(input.property_id)),
        ]
          .filter(Boolean)
          .join(" · "),
      };
    case "set_task_status": {
      const t = store.tasks.find((x) => x.id === s(input.task_id));
      return {
        title: "Change a task's status",
        detail: `${t?.t ?? s(input.task_id)} → ${s(input.status)}`,
      };
    }
    case "add_property":
      return {
        title: `Add a property ${s(input.type) === "sale" ? "for sale" : "to manage"}`,
        detail: [
          `${s(input.address)}, ${s(input.suburb)}`,
          s(input.owner) &&
            `${s(input.type) === "sale" ? "Vendor" : "Landlord"} ${s(input.owner)}`,
          s(input.price),
        ]
          .filter(Boolean)
          .join(" · "),
      };
    case "add_checklist_item":
      return {
        title: "Add a checklist item",
        detail: `${s(input.text)} · ${addressOf(store, s(input.property_id))}`,
      };
    case "add_calendar_event":
      return {
        title: `Add to the calendar`,
        detail: [
          s(input.title),
          `${fmtDate(s(input.date))}${s(input.time) ? ` at ${s(input.time)}` : ""}`,
          s(input.kind),
        ].join(" · "),
      };
    case "schedule_meeting":
      return {
        title: "Schedule a meeting",
        detail: [
          s(input.title),
          `${fmtDate(s(input.date))}${s(input.time) ? ` at ${s(input.time)}` : ""}`,
          Array.isArray(input.attendees)
            ? input.attendees.map((a) => who(a)).join(", ")
            : "",
        ]
          .filter(Boolean)
          .join(" · "),
      };
    case "add_diary_note":
      return { title: "Add a diary note", detail: s(input.text) };
    case "log_register_entry": {
      const def = registerById(s(input.register));
      const v = (input.values ?? {}) as Record<string, unknown>;
      return {
        title: `Log in the ${def?.name ?? s(input.register)} register`,
        detail: Object.entries(v)
          .filter(
            ([, val]) => typeof val === "string" || typeof val === "boolean",
          )
          .slice(0, 6)
          .map(([k, val]) => {
            const f = def?.fields.find((x) => x.name === k);
            const shown =
              f?.type === "property" && typeof val === "string"
                ? addressOf(store, val)
                : String(val);
            return `${f?.label ?? k}: ${shown}`;
          })
          .join(" · "),
      };
    }
    case "set_kpi_actual": {
      const k = store.kpis.find((x) => x.id === s(input.kpi_id));
      return {
        title: "Update a KPI",
        detail: `${k?.name ?? s(input.kpi_id)}: ${k?.actual ?? "?"} → ${String(input.actual)}`,
      };
    }
    default:
      return { title: name };
  }
}

/** Runs one tool against the workspace in this browser. Never throws: problems come back as errors the model can read. */
export async function executeTool(
  name: string,
  input: Input,
  store: AppStore,
): Promise<Outcome> {
  if (!toolByName(name)) return fail(`Unknown tool ${name}.`);
  const today = todayISO();

  try {
    switch (name) {
      /* ---------- look things up ---------- */
      case "list_properties": {
        const q = norm(s(input.search));
        const rows = store.properties
          .filter((p) => !input.type || p.type === input.type)
          .filter((p) => !q || norm(`${p.address} ${p.suburb}`).includes(q))
          .slice(0, 60)
          .map((p) => ({
            id: p.id,
            address: `${p.address}, ${p.suburb}`,
            type: p.type,
            status: p.status,
            agent: p.agent,
            owner: p.owner,
            price: p.price,
            checklist: `${p.checklist.filter((c) => c.done).length}/${p.checklist.length} done`,
          }));
        return { ok: true, text: json(rows) };
      }
      case "get_property": {
        const p = store.properties.find((x) => x.id === s(input.property_id));
        if (!p) return fail("No property with that id. Call list_properties.");
        return {
          ok: true,
          text: json({
            id: p.id,
            address: `${p.address}, ${p.suburb}`,
            type: p.type,
            status: p.status,
            checklist: p.checklist.map((c) => ({
              id: c.id,
              item: c.t,
              who: c.who,
              due: c.due ?? null,
              done: c.done,
              proof: c.file ?? null,
            })),
          }),
        };
      }
      case "list_tasks": {
        const rows = store.tasks
          .filter((t) => !input.status || t.status === input.status)
          .filter(
            (t) =>
              !input.assignee || norm(t.assignee) === norm(s(input.assignee)),
          )
          .map((t) => ({
            id: t.id,
            task: t.t,
            status: t.status,
            assignee: t.assignee,
            where: t.where,
            due: t.due ?? null,
            overdue: !!t.due && t.status !== "Done" && t.due < today,
            from: t.from,
          }));
        return { ok: true, text: json(rows) };
      }
      case "list_team":
        return {
          ok: true,
          text: json(
            store.members.map((m) => ({
              name: m.name,
              access: m.access,
              team: m.team,
              status: m.status,
            })),
          ),
        };
      case "list_accreditations":
        return {
          ok: true,
          text: json(
            store.accreditations.map((a) => ({
              id: a.id,
              person: a.person,
              type: typeName(a),
              expires: a.expiresOn,
              daysLeft: daysUntil(a.expiresOn, new Date(today)),
              cpd:
                a.cpdRequired > 0
                  ? `${cpdDone(a)} of ${a.cpdRequired} hours, year ends ${a.cpdYearEnd}`
                  : "not tracked",
            })),
          ),
        };
      case "list_registers": {
        const defs = input.register
          ? registerDefs.filter((r) => r.id === s(input.register))
          : registerDefs;
        if (!defs.length) return fail("No register with that id.");
        return {
          ok: true,
          text: json(
            defs.map((r) => ({
              id: r.id,
              name: r.name,
              about: r.blurb,
              fields: input.register
                ? r.fields.map((f) => ({
                    name: f.name,
                    label: f.label,
                    type: f.type,
                    required: !!f.required,
                    options: f.options,
                    showWhen: f.showWhen,
                    help: f.help,
                    minLength: f.minLength,
                  }))
                : undefined,
              needsFile: r.fields.some((f) => f.type === "file" && f.required),
            })),
          ),
        };
      }
      case "list_register_entries": {
        const def = registerById(s(input.register));
        if (!def) return fail("No register with that id. Call list_registers.");
        const rows = store.entries
          .filter((e) => e.registerId === def.id)
          .filter((e) => !input.open_only || OPEN_STATUSES.includes(e.status))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, 40)
          .map((e) => ({
            id: e.id,
            status: e.status,
            logged: e.createdAt.slice(0, 10),
            by: e.createdBy,
            ...Object.fromEntries(
              def.columns.map((c) => {
                const v = e.values[c];
                const f = def.fields.find((x) => x.name === c);
                return [
                  f?.label ?? c,
                  f?.type === "property" && typeof v === "string"
                    ? addressOf(store, v)
                    : v,
                ];
              }),
            ),
          }));
        return { ok: true, text: json(rows) };
      }
      case "list_calendar": {
        const ev = store.events
          .filter((e) => e.date >= today)
          .map((e) => ({
            id: e.id,
            kind: e.kind,
            title: e.title,
            date: e.date,
            time: e.time ?? null,
          }));
        const mt = store.meetings
          .filter((m) => m.date >= today)
          .map((m) => ({
            id: m.id,
            kind: "Meeting",
            title: m.title,
            date: m.date,
            time: m.time ?? null,
            attendees: m.attendees,
          }));
        return {
          ok: true,
          text: json(
            [...ev, ...mt]
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 40),
          ),
        };
      }
      case "list_kpis":
        return {
          ok: true,
          text: json(
            store.kpis.map((k) => ({
              id: k.id,
              name: k.name,
              owner: k.owner,
              period: k.period,
              unit: k.unit,
              target: k.target,
              actual: k.actual,
              percent: Math.round((k.actual / k.target) * 100),
            })),
          ),
        };
      case "list_documents":
        return {
          ok: true,
          text: json(
            VAULT.map((d) => {
              const doc = store.documents.find((x) => x.id === d.id);
              return {
                id: d.id,
                name: d.name,
                status: vaultStatus(doc, today),
                approvedBy: doc?.approval?.name ?? null,
                reviewBy: doc?.approval?.nextReview ?? null,
                path: `/dashboard/vault/${d.id}`,
              };
            }),
          ),
        };
      case "list_checklist_templates":
        return {
          ok: true,
          text: json(
            store.templates.map((t) => ({
              id: t.id,
              name: t.name,
              for: t.type,
              items: t.items.length,
            })),
          ),
        };
      case "trust_summary":
        return {
          ok: true,
          text: json(
            store.trust.accounts.map((a) => {
              const sum = summarise(store.trust, a.id, "9999-12-31", null);
              const lock = lockedUntil(store.trust, a.id);
              return {
                account: a.name,
                cashBook: money(cashBook(store.trust, a.id)),
                reconciledAndSignedTo: lock || "not yet",
                bankLinesUnmatched: store.trust.lines.filter(
                  (l) => l.account === a.id && !l.entryId,
                ).length,
                cashBookItemsNotOnStatement:
                  sum.unmatchedDeposits.length + sum.unmatchedPayments.length,
                ledgers: ledgers(store.trust, a.id)
                  .filter((l) => l.balance !== 0)
                  .map((l) => ({
                    property: addressOf(store, l.propertyId),
                    party: l.party,
                    balance: money(l.balance),
                  })),
              };
            }),
          ),
        };
      case "open_page": {
        const path = s(input.path);
        if (!/^\/dashboard(\/[a-z0-9._~-]+)*\/?$/i.test(path))
          return fail(
            "The path must be a REAHUB page starting with /dashboard/.",
          );
        return {
          ok: true,
          text: `Link shown to the user: ${path}`,
          outcome: s(input.label),
          link: { path, label: s(input.label) || "Open" },
        };
      }

      /* ---------- changes ---------- */
      case "create_task": {
        const title = s(input.title);
        if (!title) return fail("A task needs a title.");
        const assignee = teamName(store, s(input.assignee));
        if (!assignee)
          return fail(
            `"${s(input.assignee)}" is not on the team. Call list_team for names.`,
          );
        const due = s(input.due);
        if (due && !isDate(due)) return fail("Due must be yyyy-mm-dd.");
        const pid = s(input.property_id);
        if (pid && !store.properties.some((p) => p.id === pid))
          return fail("No property with that id.");
        store.addTask({
          t: title,
          assignee,
          due: due || undefined,
          where: pid ? addressOf(store, pid) : "Office",
          from: "By hand",
        });
        return {
          ok: true,
          text: `Task created for ${assignee}: ${title}`,
          outcome: `Task created for ${assignee}`,
          link: { path: "/dashboard/tools/tasks", label: "Open tasks" },
        };
      }
      case "set_task_status": {
        const t = store.tasks.find((x) => x.id === s(input.task_id));
        if (!t) return fail("No task with that id. Call list_tasks.");
        const status = s(input.status) as TaskStatus;
        if (!["Open", "In progress", "Done"].includes(status))
          return fail("Status must be Open, In progress or Done.");
        store.setTaskStatus(t.id, status);
        return {
          ok: true,
          text: `Task "${t.t}" is now ${status}.`,
          outcome: `Marked ${status}`,
        };
      }
      case "add_property": {
        const type = s(input.type);
        if (type !== "sale" && type !== "management")
          return fail("Type must be sale or management.");
        const address = s(input.address);
        const suburb = s(input.suburb);
        const owner = s(input.owner);
        if (!address || !suburb || !owner)
          return fail("Address, suburb and owner are all needed.");
        const tpl = store.templates.find((t) => t.id === s(input.template_id));
        if (!tpl)
          return fail(
            "No template with that id. Call list_checklist_templates.",
          );
        if (tpl.type !== "any" && tpl.type !== type)
          return fail(
            `That template is for ${tpl.type} properties. Pick one for ${type}.`,
          );
        const agent =
          teamName(store, s(input.agent)) ?? store.members[0]?.name ?? "";
        const id = store.addProperty({
          type,
          address,
          suburb,
          owner,
          price: s(input.price),
          agent,
          templateId: tpl.id,
        });
        return {
          ok: true,
          text: `Property added with id ${id} using the "${tpl.name}" checklist.`,
          outcome: `Added ${address}`,
          link: { path: `/dashboard/properties/${id}`, label: "Open property" },
        };
      }
      case "add_checklist_item": {
        const p = store.properties.find((x) => x.id === s(input.property_id));
        if (!p) return fail("No property with that id. Call list_properties.");
        const text = s(input.text);
        if (!text) return fail("The item needs text.");
        store.addItem(p.id, text);
        return {
          ok: true,
          text: `Checklist item added to ${p.address}: ${text}`,
          outcome: "Item added",
          link: {
            path: `/dashboard/properties/${p.id}`,
            label: "Open property",
          },
        };
      }
      case "add_calendar_event": {
        const title = s(input.title);
        const date = s(input.date);
        const kind = s(input.kind) as CalEvent["kind"];
        const time = s(input.time);
        if (!title || !isDate(date))
          return fail("A title and a yyyy-mm-dd date are needed.");
        if (!EVENT_KINDS.includes(kind))
          return fail(`Kind must be one of ${EVENT_KINDS.join(", ")}.`);
        if (time && !isTime(time))
          return fail("Time must be 24 hour, like 10:30.");
        const pid = s(input.property_id);
        if (pid && !store.properties.some((p) => p.id === pid))
          return fail("No property with that id.");
        store.addEvent({
          title,
          date,
          kind,
          time: time || undefined,
          property: pid || undefined,
          notes: s(input.notes) || undefined,
        });
        return {
          ok: true,
          text: `Event added: ${title} on ${date}.`,
          outcome: "Added to the calendar",
          link: { path: "/dashboard/tools/calendar", label: "Open calendar" },
        };
      }
      case "schedule_meeting": {
        const title = s(input.title);
        const date = s(input.date);
        const time = s(input.time);
        if (!title || !isDate(date))
          return fail("A title and a yyyy-mm-dd date are needed.");
        if (time && !isTime(time))
          return fail("Time must be 24 hour, like 10:30.");
        const names = (
          Array.isArray(input.attendees) ? input.attendees : []
        ).map((a) => teamName(store, s(a)));
        if (!names.length || names.some((n) => !n))
          return fail("Every attendee must be a team member. Call list_team.");
        const type = MEETING_TYPES.includes(s(input.type))
          ? s(input.type)
          : "Team meeting";
        const id = store.addMeeting({
          title,
          type,
          date,
          time: time || undefined,
          attendees: names as string[],
          notes: "",
          status: "Scheduled",
        });
        return {
          ok: true,
          text: `Meeting scheduled (${id}): ${title} on ${date}.`,
          outcome: "Meeting scheduled",
          link: { path: "/dashboard/tools/meetings", label: "Open meetings" },
        };
      }
      case "add_diary_note": {
        const text = s(input.text);
        if (!text) return fail("The note needs text.");
        const date = s(input.date) || today;
        if (!isDate(date)) return fail("Date must be yyyy-mm-dd.");
        store.addDiary({ text, tag: s(input.tag) || "Note", date });
        return {
          ok: true,
          text: "Diary note added.",
          outcome: "Note added",
          link: { path: "/dashboard/tools/diary", label: "Open diary" },
        };
      }
      case "log_register_entry": {
        const def = registerById(s(input.register));
        if (!def) return fail("No register with that id. Call list_registers.");
        if (def.fields.some((f) => f.type === "file" && f.required))
          return fail(
            `The ${def.name} register needs a file attached, which only the user can do. Use open_page to send them to /dashboard/compliance/registers/${def.id}.`,
          );
        const raw = (input.values ?? {}) as Record<string, unknown>;
        const values: Values = {};
        for (const f of def.fields) {
          const v = raw[f.name];
          if (f.type === "file") continue;
          if (f.type === "check") values[f.name] = v === true || v === "true";
          else if (f.type === "checks")
            values[f.name] = Array.isArray(v)
              ? v.filter((x): x is string => typeof x === "string")
              : [];
          else if (typeof v === "string" || typeof v === "number")
            values[f.name] = String(v);
        }
        for (const f of def.fields) {
          if (
            f.options &&
            f.type === "select" &&
            values[f.name] &&
            isVisible(f, values)
          ) {
            const hit = f.options.find(
              (o) => norm(o) === norm(String(values[f.name])),
            );
            if (!hit)
              return fail(
                `${f.label} must be one of: ${f.options.join(", ")}.`,
              );
            values[f.name] = hit;
          }
          if (
            f.type === "property" &&
            values[f.name] &&
            !store.properties.some((p) => p.id === values[f.name])
          )
            return fail(
              `${f.label} must be a property id from list_properties.`,
            );
        }
        const errors = validate(def.fields, values, {});
        const first = Object.entries(errors);
        if (first.length)
          return fail(
            `Not saved. ${first
              .slice(0, 5)
              .map(
                ([k, m]) =>
                  `${def.fields.find((f) => f.name === k)?.label ?? k}: ${m}`,
              )
              .join(" ")}`,
          );
        const id = await store.addEntry(def.id, values, {});
        return {
          ok: true,
          text: `Logged in the ${def.name} register (${id}).`,
          outcome: `Logged in ${def.name}`,
          link: {
            path: `/dashboard/compliance/registers/${def.id}`,
            label: `Open ${def.name}`,
          },
        };
      }
      case "set_kpi_actual": {
        const k = store.kpis.find((x) => x.id === s(input.kpi_id));
        if (!k) return fail("No KPI with that id. Call list_kpis.");
        const actual = Number(input.actual);
        if (!Number.isFinite(actual) || actual < 0)
          return fail("Actual must be a number, zero or more.");
        store.updateKpi(k.id, { actual });
        return {
          ok: true,
          text: `${k.name} is now ${actual} of ${k.target}.`,
          outcome: `${k.name}: ${actual} of ${k.target}`,
          link: { path: "/dashboard/operations", label: "Open Operations" },
        };
      }
    }
  } catch (e) {
    return fail(
      `That failed: ${e instanceof Error ? e.message : "unknown error"}.`,
    );
  }
  return fail(`Unknown tool ${name}.`);
}
