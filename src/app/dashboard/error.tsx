"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const { resetDemo } = useStore();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint text-accent">
        <Icon name="help" className="h-6 w-6" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
        This screen hit a problem
      </h1>
      <p className="mt-2 text-ink-soft">
        Try again first. If it keeps happening, resetting the sample data
        usually clears it.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-bg hover:bg-ink/85"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => {
            resetDemo();
            retry();
          }}
          className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold hover:bg-tint"
        >
          Reset sample data
        </button>
        <Link
          href="/dashboard"
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
