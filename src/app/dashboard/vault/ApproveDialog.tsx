"use client";

import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/Icons";
import { btnDark, btnLight } from "@/components/app/ui";
import { me } from "@/lib/demo-data";
import { todayISO } from "@/lib/format";
import type { Approval } from "@/lib/vault";
import { SignaturePad } from "./SignaturePad";

/** SHA-256 of the exact words approved, shortened so people can quote it. Falls back where crypto is unavailable. */
export async function fingerprint(text: string) {
  let hex = "";
  try {
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(text),
    );
    hex = [...new Uint8Array(buf)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++)
      h = Math.imul(h ^ text.charCodeAt(i), 16777619);
    hex = (h >>> 0).toString(16).padStart(8, "0").repeat(2);
  }
  return hex
    .slice(0, 16)
    .toUpperCase()
    .replace(/(.{4})(?=.)/g, "$1-");
}

const addYear = (iso: string) =>
  `${Number(iso.slice(0, 4)) + 1}${iso.slice(4)}`;

export function ApproveDialog({
  docTitle,
  content,
  agency,
  onClose,
  onApprove,
}: {
  docTitle: string;
  content: string;
  agency: string;
  onClose: () => void;
  onApprove: (a: Approval) => void;
}) {
  const uid = useId();
  const today = todayISO();
  const [name, setName] = useState(me.name);
  const [role, setRole] = useState(me.role);
  const [date, setDate] = useState(today);
  const [review, setReview] = useState(addYear(today));
  const [agree, setAgree] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const errors = {
    name: !name.trim() ? "Enter the approver's name." : "",
    role: !role.trim() ? "Enter their position." : "",
    date: !date
      ? "Choose the date."
      : date > today
        ? "The approval date cannot be in the future."
        : "",
    review: !review
      ? "Choose a review date."
      : review <= date
        ? "The review date must be after the approval date."
        : "",
    agree: !agree ? "Tick to confirm you have read it." : "",
    signature: !signature ? "Sign in the box." : "",
  };
  const bad = Object.values(errors).some(Boolean);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (bad || !signature) return;
    setBusy(true);
    onApprove({
      name: name.trim(),
      role: role.trim(),
      date,
      nextReview: review,
      signature,
      fingerprint: await fingerprint(content),
    });
  };

  const err = (k: keyof typeof errors) =>
    tried && errors[k] ? (
      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
        {errors[k]}
      </p>
    ) : null;
  const field =
    "mt-1 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px]";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-ink/50"
        onClick={onClose}
      />
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-t`}
        onSubmit={submit}
        noValidate
        data-lenis-prevent
        className="relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-bg p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id={`${uid}-t`}
              className="font-display text-xl font-extrabold tracking-tight"
            >
              Approve and sign
            </h2>
            <p className="mt-1 text-sm text-ink-soft">{docTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-tint"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-n`} className="text-sm font-semibold">
              Approved by
            </label>
            <input
              id={`${uid}-n`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={field}
              autoComplete="name"
            />
            {err("name")}
          </div>
          <div>
            <label htmlFor={`${uid}-r`} className="text-sm font-semibold">
              Position
            </label>
            <input
              id={`${uid}-r`}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={field}
            />
            {err("role")}
          </div>
          <div>
            <label htmlFor={`${uid}-d`} className="text-sm font-semibold">
              Date approved
            </label>
            <input
              id={`${uid}-d`}
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className={field}
            />
            {err("date")}
          </div>
          <div>
            <label htmlFor={`${uid}-v`} className="text-sm font-semibold">
              Review by
            </label>
            <input
              id={`${uid}-v`}
              type="date"
              value={review}
              min={date}
              onChange={(e) => setReview(e.target.value)}
              className={field}
            />
            {err("review")}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-1.5 text-sm font-semibold">Signature</p>
          <SignaturePad onChange={setSignature} />
          {err("signature")}
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0"
          />
          <span>
            I have read this document and approve it for use at{" "}
            <strong>{agency}</strong>.
          </span>
        </label>
        {err("agree")}

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" disabled={busy} className={btnDark}>
            <Icon name="check" className="h-4 w-4" /> Approve and sign
          </button>
          <button type="button" onClick={onClose} className={btnLight}>
            Cancel
          </button>
        </div>
        <p className="mt-4 text-xs text-ink-soft">
          Approving locks this version. The signature, date and a fingerprint of
          the exact text are saved, and the approval is added to the audit log.
        </p>
      </form>
    </div>
  );
}
