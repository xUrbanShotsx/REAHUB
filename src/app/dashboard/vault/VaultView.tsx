"use client";

import Link from "next/link";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { PageHeading, Pill, Progress } from "@/components/app/ui";
import { fmtDate } from "@/lib/format";
import { VAULT } from "@/lib/vault";

export function VaultView() {
  const { documents, settings } = useStore();
  const done = VAULT.filter((d) => documents.some((x) => x.id === d.id)).length;

  return (
    <div>
      <PageHeading
        title="Document Vault"
        sub={`Eleven policies and procedures every NSW agency should have. Pick one and the writer drafts it for ${settings.agency.name}.`}
      />

      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {done} of {VAULT.length} documents written
          </p>
          <div className="mt-2">
            <Progress pct={Math.round((done / VAULT.length) * 100)} />
          </div>
        </div>
        <span className="hidden text-xs text-ink-soft sm:block">
          Drafts for review. Not legal advice.
        </span>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {VAULT.map((d) => {
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
                  {doc ? (
                    <Pill tone="ok">Written</Pill>
                  ) : (
                    <Pill tone="neutral">Not yet</Pill>
                  )}
                </div>
                <h2 className="mt-4 font-display text-base font-extrabold leading-snug">
                  {d.name}
                </h2>
                <p className="mt-1.5 flex-1 text-sm text-ink-soft">{d.blurb}</p>
                <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold">
                  {doc ? (
                    <>
                      Open
                      <span className="font-normal text-ink-soft">
                        · v{doc.version}, {fmtDate(doc.createdAt.slice(0, 10))}
                      </span>
                    </>
                  ) : (
                    <>
                      <Icon name="sparkle" className="h-4 w-4 text-accent" />
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
    </div>
  );
}
