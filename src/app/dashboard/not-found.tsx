import Link from "next/link";
import { Icon } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint text-accent">
        <Icon name="search" className="h-6 w-6" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
        We couldn&apos;t find that
      </h1>
      <p className="mt-2 text-ink-soft">
        It may have been removed, or the link is out of date.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link
          href="/dashboard"
          className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-bg hover:bg-ink/85"
        >
          Back to dashboard
        </Link>
        <Link
          href="/dashboard/help"
          className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold hover:bg-tint"
        >
          Help centre
        </Link>
      </div>
    </div>
  );
}
