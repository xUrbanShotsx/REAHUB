"use client";

import { useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { RegisterForm } from "@/components/app/RegisterForm";
import {
  Avatar,
  btnDark,
  btnLight,
  Card,
  CardHead,
  PageHeading,
  Pill,
} from "@/components/app/ui";
import { initialsOf, MEETING_TYPES, team, type Meeting } from "@/lib/demo-data";
import { fmtDate } from "@/lib/format";
import type { Field } from "@/lib/registers";

const meetingFields: Field[] = [
  {
    name: "title",
    label: "Meeting title",
    type: "text",
    required: true,
    wide: true,
  },
  {
    name: "type",
    label: "Type",
    type: "select",
    required: true,
    options: MEETING_TYPES,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: ["Scheduled", "Held"],
  },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "time", label: "Time", type: "time" },
  {
    name: "attendees",
    label: "Attendees",
    type: "checks",
    required: true,
    options: team.map((t) => t.name),
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    wide: true,
    requiredWhen: { field: "status", in: ["Held"] },
    minLength: 10,
    help: "Required once the meeting has been held.",
  },
];

const actionFields: Field[] = [
  {
    name: "t",
    label: "Action",
    type: "text",
    required: true,
    wide: true,
    placeholder: "What needs to happen",
  },
  { name: "assignee", label: "Owner", type: "person", required: true },
  { name: "due", label: "Due date", type: "date", required: true },
];

export function MeetingsView() {
  const { meetings, tasks, ready, addMeeting, addTask, setTaskStatus } =
    useStore();
  const [adding, setAdding] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [actionFor, setActionFor] = useState<string | null>(null);

  const sorted = [...meetings].sort((a, b) =>
    `${b.date}${b.time ?? ""}`.localeCompare(`${a.date}${a.time ?? ""}`),
  );
  const openActions = tasks.filter((t) => t.meetingId && t.status !== "Done");
  const titleOf = (id?: string) =>
    meetings.find((m) => m.id === id)?.title ?? "Meeting";

  return (
    <>
      <PageHeading
        title="Meetings"
        sub="Notes by meeting type, with actions that become tasks. Last meeting's open items stay at the top."
        actions={
          <button
            type="button"
            onClick={() => setAdding((a) => !a)}
            className={btnDark}
          >
            <Icon name="plus" className="h-4 w-4" /> New meeting
          </button>
        }
      />

      {adding && (
        <Card className="mb-6 p-5">
          <h2 className="mb-4 font-display text-lg font-extrabold">
            New meeting
          </h2>
          <RegisterForm
            fields={meetingFields}
            defaults={{ status: "Scheduled" }}
            submitLabel="Save meeting"
            onCancel={() => setAdding(false)}
            onSubmit={async (v) => {
              const id = addMeeting({
                title: String(v.title),
                type: String(v.type),
                status: v.status === "Held" ? "Held" : "Scheduled",
                date: String(v.date),
                time: v.time ? String(v.time) : undefined,
                attendees: Array.isArray(v.attendees) ? v.attendees : [],
                notes: String(v.notes ?? "").trim(),
              } as Omit<Meeting, "id">);
              setAdding(false);
              setOpenId(id);
            }}
          />
        </Card>
      )}

      {openActions.length > 0 && (
        <Card className="mb-6">
          <CardHead
            title="Open actions"
            sub="From recent meetings, still to do"
            right={<Pill tone="owed">{openActions.length} open</Pill>}
          />
          <ul>
            {openActions.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 border-b border-line px-5 py-3.5 last:border-0"
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={false}
                  aria-label={`${t.t}, mark done`}
                  onClick={() => setTaskStatus(t.id, "Done")}
                  className="flex h-5 w-5 shrink-0 rounded-md border-[1.5px] border-ink-soft/50 hover:border-ink"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {t.t}
                  </span>
                  <span className="block truncate text-xs text-ink-soft">
                    {titleOf(t.meetingId)} ·{" "}
                    {t.due ? `due ${fmtDate(t.due)}` : "no due date"}
                  </span>
                </span>
                <Avatar initials={initialsOf(t.assignee)} tone={0} />
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <CardHead title="All meetings" sub={`${meetings.length} on record`} />
        {!ready ? (
          <p className="px-5 py-10 text-center text-sm text-ink-soft">
            Loading meetings
          </p>
        ) : (
          <ul>
            {sorted.map((m) => {
              const isOpen = openId === m.id;
              const acts = tasks.filter((t) => t.meetingId === m.id);
              return (
                <li key={m.id} className="border-b border-line last:border-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => {
                      setOpenId(isOpen ? null : m.id);
                      setActionFor(null);
                    }}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-tint/60"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {m.title}
                      </span>
                      <span className="block truncate text-xs text-ink-soft">
                        {fmtDate(m.date)}
                        {m.time ? `, ${m.time}` : ""} · {m.attendees.length}{" "}
                        attending
                      </span>
                    </span>
                    <Pill tone={m.status === "Held" ? "ok" : "owed"}>
                      {m.status}
                    </Pill>
                    <Icon
                      name="arrow"
                      className={`h-4 w-4 shrink-0 text-ink-soft transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-line bg-bg px-5 py-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                        {m.type}
                      </p>
                      <p className="mt-2 text-sm text-ink-soft">
                        Attendees: {m.attendees.join(", ") || "None recorded"}
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">
                        {m.notes || "No notes yet."}
                      </p>

                      <div className="mt-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                          Actions
                        </p>
                        {acts.length === 0 ? (
                          <p className="mt-2 text-sm text-ink-soft">
                            No actions from this meeting.
                          </p>
                        ) : (
                          <ul className="mt-2 space-y-1.5">
                            {acts.map((t) => (
                              <li
                                key={t.id}
                                className="flex items-center gap-2.5 text-sm"
                              >
                                <button
                                  type="button"
                                  role="checkbox"
                                  aria-checked={t.status === "Done"}
                                  aria-label={`${t.t}, mark ${t.status === "Done" ? "open" : "done"}`}
                                  onClick={() =>
                                    setTaskStatus(
                                      t.id,
                                      t.status === "Done" ? "Open" : "Done",
                                    )
                                  }
                                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border-[1.5px] ${
                                    t.status === "Done"
                                      ? "border-ink bg-ink text-bg"
                                      : "border-ink-soft/50"
                                  }`}
                                >
                                  {t.status === "Done" && (
                                    <Icon name="check" className="h-3 w-3" />
                                  )}
                                </button>
                                <span
                                  className={
                                    t.status === "Done"
                                      ? "text-ink-soft line-through"
                                      : "font-medium"
                                  }
                                >
                                  {t.t}
                                </span>
                                <span className="text-xs text-ink-soft">
                                  {t.assignee}
                                  {t.due ? `, due ${fmtDate(t.due)}` : ""}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {actionFor === m.id ? (
                        <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
                          <h3 className="mb-3 font-display text-base font-extrabold">
                            Add an action
                          </h3>
                          <RegisterForm
                            fields={actionFields}
                            submitLabel="Add action"
                            onCancel={() => setActionFor(null)}
                            onSubmit={async (v) => {
                              addTask({
                                t: String(v.t),
                                assignee: String(v.assignee),
                                due: String(v.due),
                                from: "Meeting",
                                meetingId: m.id,
                                where: m.title,
                              });
                              setActionFor(null);
                            }}
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActionFor(m.id)}
                          className={`${btnLight} mt-4`}
                        >
                          <Icon name="plus" className="h-4 w-4" /> Add action
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
