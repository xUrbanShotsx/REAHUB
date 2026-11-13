"use client";

import Link from "next/link";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { PageHeading, Pill, Progress } from "@/components/app/ui";
import { fmtDate, todayISO } from "@/lib/format";
import { CATEGORIES, VAULT, vaultStatus } from "@/lib/vault";

export function VaultView() {
  const { documents, settings, ready } = useStore();
  const today = ready ? todayISO() : "";
  const written = documents.filter((d) => VAULT.some((v) => v.id === d.id));
  const approved = written.filter((d) => d.approval).length;

  return (
    <div>
      <PageHeading
        title="Document Vault"
        sub={`${VAULT.length} policies and procedures a NSW agency should have, each tied to the obligations it must meet. Pick one and the writer drafts it for ${settings.agency.name}.`}
      />

      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {written.length} of {VAULT.length} written, {approved} approved and
            signed
          </p>
          <div className="mt-2">
            <Progress pct={Math.round((approved / VAULT.length) * 100)} />
          </div>
        </div>
        <span className="hidden text-xs text-ink-soft sm:block">
          Drafts for review. Not legal advice.
        </span>
      </div>

      <div className="space-y-9">
        {CATEGORIES.map((cat) => {
          const inCat = VAULT.filter((d) => d.category === cat);
          const done = inCat.filter((d) =>
            documents.some((x) => x.id === d.id && x.approval),
          ).length;
          return (
            <section key={cat} aria-labelledby={`cat-${cat}`}>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2
                  id={`cat-${cat}`}
                  className="font-display text-lg font-extrabold tracking-tight"
                >
                  {cat}
                </h2>
                <p className="text-xs text-ink-soft">
                  {done} of {inCat.length} approved
                </p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {VAULT.filter((d) => d.category === cat).map((d) => {
                  const doc = documents.find((x) => x.id === d.id);
                  return (
                    <li key={d.id}>
                      <Link
                        href={`/dashboard/vault/${d.id}`}
                        className="lift group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-ink"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
                            <Icon name={d.icon} className="h-5 w-5" />
                          </span>
                          {(() => {
                            const st = vaultStatus(doc, today);
                            return st === "none" ? (
                              <Pill tone="neutral">Not yet</Pill>
                            ) : st === "draft" ? (
                              <Pill tone="neutral">Draft</Pill>
                            ) : st === "approved" ? (
                              <Pill tone="ok">Approved</Pill>
                            ) : (
                              <Pill tone="owed">
                                {st === "review-due"
                                  ? "Review overdue"
                                  : "Review soon"}
                              </Pill>
                            );
                          })()}
                        </div>
                        <h2 className="mt-4 font-display text-base font-extrabold leading-snug">
                          {d.name}
                        </h2>
                        <p className="mt-1.5 flex-1 text-sm text-ink-soft">
                          {d.blurb}
                        </p>
                        <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold">
                          {doc ? (
                            <>
                              Open
                              <span className="font-normal text-ink-soft">
                                ·{" "}
                                {doc.approval
                                  ? `signed ${fmtDate(doc.approval.date)}`
                                  : `draft v${doc.version}`}
                              </span>
                            </>
                          ) : (
                            <>
                              <Icon
                                name="sparkle"
                                className="h-4 w-4 text-accent"
                              />
                              Write it
                            </>
                          )}
                          <Icon
                            name="arrow"
                            className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-0.5"
                          />
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
