"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icons";

const field =
  "mt-1 w-full rounded-lg border border-line bg-bg px-3 py-3 text-ink focus:border-ink";

const plans = ["Agent Pro", "Boutique", "Large"];

export function DemoForm() {
  const plan = useSearchParams().get("plan") ?? "";
  const defaultPlan = plans.includes(plan) ? plan : "Not sure yet";
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div role="status" className="rounded-3xl border border-line bg-surface p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-ink">
          <Icon name="check" className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-xl font-semibold text-ink">Request received</h2>
        <p className="mt-2 text-sm text-ink-soft">Thanks! We&apos;ll reach out to schedule your demo.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: send the request to a backend or CRM; nothing is submitted yet.
        setSent(true);
      }}
      className="rounded-3xl border border-line bg-surface p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-ink">
          Full name
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="text-sm font-medium text-ink">
          Work email
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="text-sm font-medium text-ink">
          Company or brokerage
          <input name="company" required autoComplete="organization" className={field} />
        </label>
        <label className="text-sm font-medium text-ink">
          Number of agents
          <select name="agents" defaultValue="" required className={field}>
            <option value="" disabled>Select a range</option>
            <option>1</option>
            <option>2-9</option>
            <option>10-49</option>
            <option>50-199</option>
            <option>200+</option>
          </select>
        </label>
        <label className="text-sm font-medium text-ink sm:col-span-2">
          Plan of interest
          <select name="plan" defaultValue={defaultPlan} className={field}>
            <option>Agent Pro</option>
            <option>Boutique</option>
            <option>Large</option>
            <option>Not sure yet</option>
          </select>
        </label>
        <label className="text-sm font-medium text-ink sm:col-span-2">
          Anything we should know? <span className="font-normal text-ink-soft">(optional)</span>
          <textarea name="notes" rows={4} className={field} />
        </label>
      </div>
      <button
        type="submit"
        className="mt-6 w-full cursor-pointer rounded-full bg-ink px-6 py-3.5 font-semibold text-bg transition-colors duration-200 hover:bg-ink/85"
      >
        Request a demo
      </button>
    </form>
  );
}
