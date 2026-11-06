"use client";

import { useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import {
  Avatar,
  btnDark,
  btnLight,
  Card,
  CardHead,
  Pill,
  Progress,
} from "@/components/app/ui";
import {
  ACCESS_LEVELS,
  ACCESS_NOTE,
  initialsOf,
  PLANS,
  TEAMS,
  type AccessLevel,
} from "@/lib/demo-data";
import { fmtDate, todayISO } from "@/lib/format";
import { billablePeople } from "@/lib/usage";

const field =
  "mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-ink focus:border-ink";
const INVITABLE = ACCESS_LEVELS.filter((a) => a !== "Owner");

export function TeamSection() {
  const { members, settings, inviteMember, updateMember, dropMember } =
    useStore();
  const limit = PLANS[settings.plan].people;
  const people = billablePeople(members).length;
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState<AccessLevel>("Team Member");
  const [team, setTeam] = useState(TEAMS[0]);
  const [until, setUntil] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const invite = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("");
    if (!name.trim()) return setError("Enter the person's name.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      return setError("Enter a valid email address.");
    if (
      members.some((m) => m.email.toLowerCase() === email.trim().toLowerCase())
    )
      return setError("Someone with that email is already on the team.");
    if (access === "Auditor") {
      if (!until) return setError("Choose the date the auditor's access ends.");
      if (until <= todayISO())
        return setError("The end date must be in the future.");
    } else if (people >= limit) {
      return setError(
        `Your ${settings.plan} plan allows ${limit} people. Change plan in Billing to add more.`,
      );
    }
    inviteMember({
      name: name.trim(),
      email: email.trim(),
      access,
      team: access === "Auditor" ? "Office" : team,
      ...(access === "Auditor" ? { until } : {}),
    });
    setNotice(
      `Invitation recorded for ${name.trim()}. In this demo no email is sent.`,
    );
    setName("");
    setEmail("");
    setUntil("");
    setError("");
    setAdding(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHead
          title="Your team"
          sub={`${people} of ${limit} people on the ${settings.plan} plan. Never charged per seat.`}
          right={
            <button
              type="button"
              onClick={() => {
                setAdding((a) => !a);
                setError("");
              }}
              className={btnDark}
            >
              <Icon name="plus" className="h-4 w-4" /> Invite
            </button>
          }
        />
        <div className="px-5 pt-4">
          <Progress pct={Math.min(100, Math.round((people / limit) * 100))} />
        </div>

        {notice && (
          <p
            role="status"
            className="mx-5 mt-4 flex items-center gap-2 rounded-xl bg-tint px-4 py-3 text-sm font-semibold"
          >
            <Icon name="check" className="h-4 w-4" /> {notice}
          </p>
        )}

        {adding && (
          <form
            onSubmit={invite}
            noValidate
            className="m-5 rounded-2xl border border-line bg-bg p-5"
          >
            <h3 className="font-display text-base font-extrabold">
              Invite someone
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={field}
                  autoFocus
                />
              </label>
              <label className="text-sm font-medium">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={field}
                />
              </label>
              <label className="text-sm font-medium">
                Access level
                <select
                  value={access}
                  onChange={(e) => setAccess(e.target.value as AccessLevel)}
                  className={field}
                >
                  {INVITABLE.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
              {access === "Auditor" ? (
                <label className="text-sm font-medium">
                  Access ends
                  <input
                    type="date"
                    value={until}
                    min={todayISO()}
                    onChange={(e) => setUntil(e.target.value)}
                    className={field}
                  />
                </label>
              ) : (
                <label className="text-sm font-medium">
                  Team
                  <select
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className={field}
                  >
                    {TEAMS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
            <p className="mt-3 text-xs text-ink-soft">{ACCESS_NOTE[access]}</p>
            {error && (
              <p role="alert" className="mt-3 text-sm font-semibold">
                {error}
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <button type="submit" className={btnDark}>
                Send invitation
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className={btnLight}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <ul className="mt-2 border-t border-line">
          {members.map((m, i) => {
            const owner = m.access === "Owner";
            return (
              <li
                key={m.id}
                className="grid items-center gap-3 border-b border-line px-5 py-4 last:border-0 md:grid-cols-[1.5fr_1fr_1fr_auto]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar
                    initials={initialsOf(m.name)}
                    tone={(i % 3) as 0 | 1 | 2}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {m.name}
                    </span>
                    <span className="block truncate text-xs text-ink-soft">
                      {m.email}
                    </span>
                  </span>
                </span>

                <label className="text-xs text-ink-soft">
                  <span className="sr-only">Access level for {m.name}</span>
                  <select
                    value={m.access}
                    disabled={owner}
                    onChange={(e) =>
                      updateMember(m.id, {
                        access: e.target.value as AccessLevel,
                      })
                    }
                    className="w-full rounded-lg border border-line bg-surface px-2.5 py-2 text-sm font-medium text-ink disabled:bg-tint disabled:opacity-80"
                  >
                    {(owner ? ACCESS_LEVELS : INVITABLE).map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </label>

                <span className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                  <span>{m.access === "Auditor" ? "Read-only" : m.team}</span>
                  {m.status === "Invited" ? (
                    <Pill tone="owed">Invited</Pill>
                  ) : (
                    <span>Active {m.lastActive.toLowerCase()}</span>
                  )}
                  {m.until && <span>Until {fmtDate(m.until)}</span>}
                </span>

                <button
                  type="button"
                  disabled={owner}
                  aria-label={`Remove ${m.name}`}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Remove ${m.name} from the agency? They lose access straight away.`,
                      )
                    )
                      dropMember(m.id);
                  }}
                  className="flex h-9 w-9 items-center justify-center justify-self-end rounded-full text-ink-soft hover:bg-tint hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <CardHead
          title="Access levels"
          sub="Job roles filter what someone sees. Accreditations decide what they may sign."
        />
        <dl className="divide-y divide-line">
          {ACCESS_LEVELS.map((a) => (
            <div
              key={a}
              className="grid gap-1 px-5 py-3.5 sm:grid-cols-[9rem_1fr]"
            >
              <dt className="text-sm font-bold">{a}</dt>
              <dd className="text-sm text-ink-soft">{ACCESS_NOTE[a]}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
