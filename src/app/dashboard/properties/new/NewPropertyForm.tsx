"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { btnDark, btnLight, Card, PageHeading } from "@/components/app/ui";
import { team, TYPE_LABEL, type PropertyType } from "@/lib/demo-data";

const field =
  "mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-ink focus:border-ink";

export function NewPropertyForm() {
  const router = useRouter();
  const { templates, addProperty } = useStore();
  const [type, setType] = useState<PropertyType>("sale");
  const [address, setAddress] = useState("");
  const [suburb, setSuburb] = useState("");
  const [owner, setOwner] = useState("");
  const [price, setPrice] = useState("");
  const [agent, setAgent] = useState(team[0].name);
  const [picked, setPicked] = useState("");
  const [error, setError] = useState("");

  const options = templates.filter((t) => t.type === type || t.type === "any");

  // the picked template only counts while it still fits the chosen type
  const templateId = options.some((t) => t.id === picked)
    ? picked
    : (options[0]?.id ?? "");

  const chosen = options.find((t) => t.id === templateId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError("Enter the street address.");
      return;
    }
    const id = addProperty({
      type,
      address,
      suburb,
      owner,
      price,
      agent,
      templateId,
    });
    router.push(`/dashboard/properties/${id}`);
  };

  return (
    <>
      <Link
        href="/dashboard/properties"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <Icon name="arrow" className="h-4 w-4 rotate-180" /> Properties
      </Link>
      <PageHeading
        title="Add a property"
        sub="Choose what it is, add the basics and pick the checklist to start from."
      />

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-display text-base font-extrabold">
              1. What is it?
            </h2>
            <div
              className="mt-3 grid grid-cols-2 gap-3"
              role="radiogroup"
              aria-label="Property type"
            >
              {(["sale", "management"] as PropertyType[]).map((t) => (
                <label
                  key={t}
                  className={`cursor-pointer rounded-xl border p-4 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                    type === t
                      ? "border-ink bg-accent/[0.08]"
                      : "border-line hover:bg-tint/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={type === t}
                    onChange={() => setType(t)}
                    className="sr-only"
                  />
                  <span className="block font-bold">{TYPE_LABEL[t]}</span>
                  <span className="mt-1 block text-xs text-ink-soft">
                    {t === "sale"
                      ? "A sales campaign on the property"
                      : "A management period and tenancy"}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-base font-extrabold">
              2. The basics
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium sm:col-span-2">
                Street address
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={field}
                  placeholder="12 Smith Street"
                  autoFocus
                />
              </label>
              <label className="text-sm font-medium">
                Suburb
                <input
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  className={field}
                  placeholder="Newtown"
                />
              </label>
              <label className="text-sm font-medium">
                {type === "sale" ? "Vendor" : "Landlord"}
                <input
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className={field}
                />
              </label>
              <label className="text-sm font-medium">
                {type === "sale" ? "Price guide" : "Weekly rent"}
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={field}
                  placeholder={
                    type === "sale" ? "A$1.2m to A$1.3m" : "A$750 a week"
                  }
                />
              </label>
              <label className="text-sm font-medium">
                Agent
                <select
                  value={agent}
                  onChange={(e) => setAgent(e.target.value)}
                  className={field}
                >
                  {team.map((m) => (
                    <option key={m.name}>{m.name}</option>
                  ))}
                </select>
              </label>
            </div>
          </Card>
        </div>

        <Card className="self-start p-5">
          <h2 className="font-display text-base font-extrabold">
            3. Checklist template
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            The checklist is copied onto the property. You can add or remove
            items afterwards, and save your own template.
          </p>
          <div
            className="mt-4 space-y-2"
            role="radiogroup"
            aria-label="Checklist template"
          >
            {options.map((t) => (
              <label
                key={t.id}
                className={`block cursor-pointer rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                  templateId === t.id
                    ? "border-ink bg-accent/[0.08]"
                    : "border-line hover:bg-tint/60"
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  value={t.id}
                  checked={templateId === t.id}
                  onChange={() => setPicked(t.id)}
                  className="sr-only"
                />
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold">{t.name}</span>
                  <span className="text-xs text-ink-soft">
                    {t.items.length} item{t.items.length === 1 ? "" : "s"}
                    {!t.builtIn && " · yours"}
                  </span>
                </span>
              </label>
            ))}
          </div>

          {chosen && chosen.items.length > 0 && (
            <div className="mt-4 rounded-xl bg-bg p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Preview
              </p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {chosen.items.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-soft" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
          <button type="submit" className={btnDark}>
            Create property
          </button>
          <Link href="/dashboard/properties" className={btnLight}>
            Cancel
          </Link>
          {error && (
            <p role="alert" className="text-sm font-semibold text-ink">
              {error}
            </p>
          )}
        </div>
      </form>
    </>
  );
}
