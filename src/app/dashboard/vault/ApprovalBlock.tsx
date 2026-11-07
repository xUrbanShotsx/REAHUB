/* eslint-disable @next/next/no-img-element */
import { fmtDate } from "@/lib/format";
import type { Approval } from "@/lib/vault";

/** The sign-off at the foot of a document: signed and dated once approved, an empty box until then. */
export function ApprovalBlock({
  approval,
  version,
}: {
  approval?: Approval;
  version: number;
}) {
  return (
    <section className="mt-10 break-inside-avoid rounded-xl border border-line p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
        Approval
      </p>
      {approval ? (
        <div className="mt-3 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <img
              src={approval.signature}
              alt={`Signature of ${approval.name}`}
              className="h-20 w-auto max-w-full object-contain"
            />
            <div className="border-t border-ink/60 pt-1.5">
              <p className="text-sm font-bold">{approval.name}</p>
              <p className="text-xs text-ink-soft">{approval.role}</p>
            </div>
          </div>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-soft">Approved</dt>
              <dd className="font-semibold">{fmtDate(approval.date)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-soft">Version</dt>
              <dd className="font-semibold">{version}.0</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-soft">Next review</dt>
              <dd className="font-semibold">{fmtDate(approval.nextReview)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-soft">Fingerprint</dt>
              <dd className="font-mono text-xs font-semibold">
                {approval.fingerprint}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="mt-3 grid gap-5 sm:grid-cols-2">
          {["Signature", "Name and position", "Date approved"].map((l) => (
            <div key={l} className="pt-8">
              <div className="border-t border-dashed border-ink/40 pt-1 text-xs text-ink-soft">
                {l}
              </div>
            </div>
          ))}
          <p className="self-end text-xs text-ink-soft">
            Awaiting approval. Not yet in force.
          </p>
        </div>
      )}
    </section>
  );
}
