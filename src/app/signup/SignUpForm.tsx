"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/Icons";
import { PLANS, type PlanName } from "@/lib/demo-data";

const field =
  "block w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink shadow-sm outline-none transition-colors placeholder:text-ink-soft/70 focus:border-accent focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-red-400";
const label = "mb-1.5 block text-sm font-semibold text-ink";

const PLAN_NAMES = Object.keys(PLANS) as PlanName[];

type Field = "name" | "agency" | "email" | "password" | "terms";

/** Password strength from 0 to 4: length, a letter, a number, and length 12+ or a symbol. */
function strength(pw: string) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/i.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (pw.length >= 12 || /[^a-z0-9]/i.test(pw)) s++;
  return pw.length < 8 ? Math.min(s, 1) : s;
}
const STRENGTH = ["", "Too weak", "Fair", "Good", "Strong"];
const BAR = ["", "bg-red-500", "bg-amber-500", "bg-accent", "bg-emerald-500"];

/** Reads ?plan= from the pricing page. Kept apart so the form can render without it. */
function usePlanFromUrl(enabled: boolean): PlanName | null {
  const params = useSearchParams();
  if (!enabled) return null;
  const p = params.get("plan");
  return p && (PLAN_NAMES as string[]).includes(p) ? (p as PlanName) : null;
}

export function SignUpForm({ withPlanFromUrl = false }) {
  return withPlanFromUrl ? <WithUrl /> : <Form initialPlan={null} />;
}

function WithUrl() {
  return <Form initialPlan={usePlanFromUrl(true)} />;
}

function Form({ initialPlan }: { initialPlan: PlanName | null }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [plan, setPlan] = useState<PlanName>(initialPlan ?? "Boutique");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [busy, setBusy] = useState(false);

  const score = strength(password);

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (agency.trim().length < 2) next.agency = "Enter your agency's name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    else if (score < 3) next.password = "Add a mix of letters and numbers.";
    if (!terms) next.terms = "Please accept the terms to continue.";
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`su-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    // Demo workspace: no account is created yet, so this opens the sample dashboard.
    router.push("/dashboard");
  }

  const err = (f: Field) =>
    errors[f] ? (
      <p id={`su-${f}-err`} className="mt-1.5 text-sm text-red-600">
        {errors[f]}
      </p>
    ) : null;
  const aria = (f: Field) => ({
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `su-${f}-err` : undefined,
  });

  return (
    <form onSubmit={submit} noValidate className="mt-8 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="su-name" className={label}>
            Your name
          </label>
          <input
            id="su-name"
            autoComplete="name"
            placeholder="Dana Nguyen"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
            {...aria("name")}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor="su-agency" className={label}>
            Agency name
          </label>
          <input
            id="su-agency"
            autoComplete="organization"
            placeholder="Harbour Realty"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            className={field}
            {...aria("agency")}
          />
          {err("agency")}
        </div>
      </div>

      <div>
        <label htmlFor="su-email" className={label}>
          Work email
        </label>
        <input
          id="su-email"
          type="email"
          autoComplete="email"
          placeholder="you@agency.com.au"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
          {...aria("email")}
        />
        {err("email")}
      </div>

      <div>
        <label htmlFor="su-password" className={label}>
          Password
        </label>
        <div className="relative">
          <input
            id="su-password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${field} pr-11`}
            {...aria("password")}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-ink-soft transition-colors hover:text-ink"
          >
            <Icon
              name={show ? "eye" : "eye-off"}
              className="h-[18px] w-[18px]"
            />
          </button>
        </div>
        {password && (
          <div className="mt-2 flex items-center gap-3" aria-live="polite">
            <div className="flex flex-1 gap-1">
              {[1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${i <= score ? BAR[score] : "bg-line"}`}
                />
              ))}
            </div>
            <span className="w-16 text-right text-xs text-ink-soft">
              {STRENGTH[score]}
            </span>
          </div>
        )}
        {err("password")}
      </div>

      <fieldset>
        <legend className={label}>Plan</legend>
        <div className="grid grid-cols-3 gap-2">
          {PLAN_NAMES.map((p) => {
            const on = plan === p;
            return (
              <label
                key={p}
                className={`cursor-pointer rounded-lg border px-3 py-2.5 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/15 ${
                  on
                    ? "border-accent bg-accent/5"
                    : "border-line hover:border-ink-soft/50"
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={p}
                  checked={on}
                  onChange={() => setPlan(p)}
                  className="sr-only"
                />
                <span className="block truncate text-sm font-semibold text-ink">
                  {p}
                </span>
                <span className="block text-xs text-ink-soft">
                  ${PLANS[p].price}/mo
                </span>
              </label>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Up to {PLANS[plan].people} staff. Free for 7 days, then billed monthly
          plus GST. Change or cancel anytime.
        </p>
      </fieldset>

      <div>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink">
          <input
            id="su-terms"
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-accent"
            {...aria("terms")}
          />
          I agree to the REAHUB terms of use and privacy policy.
        </label>
        {err("terms")}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-accent py-3 font-semibold text-white shadow-sm transition-colors hover:bg-accent/90 disabled:opacity-70"
      >
        {busy ? "Setting up your workspace…" : "Start free trial"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-accent hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
