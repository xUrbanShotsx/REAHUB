"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-mono text-sm font-medium text-accent">Error</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        This page didn&apos;t load properly. Trying again usually fixes it.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full bg-ink px-6 py-3 font-semibold text-bg transition-colors hover:bg-ink/85"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-ink/30 px-6 py-3 font-semibold transition-colors hover:border-ink hover:bg-tint"
        >
          Home page
        </Link>
      </div>
    </section>
  );
}
