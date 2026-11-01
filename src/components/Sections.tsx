import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icons";

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 pt-16 sm:px-6 sm:pt-24">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{children}</p>
    </section>
  );
}

export function FeatureCard({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/10">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
      <div className="rounded-3xl bg-gradient-to-br from-primary to-accent px-6 py-14 text-center text-on-primary sm:px-12">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Be audit-ready every day, not just audit week.</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/90">
          See how REAHUB brings licensing, transactions and disclosures into one compliance workspace.
        </p>
        <Link
          href="/demo"
          className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary-dark transition-transform duration-200 hover:scale-[1.03]"
        >
          Book a demo <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
