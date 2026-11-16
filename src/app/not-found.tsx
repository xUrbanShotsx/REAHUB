import type { Metadata } from "next";
import { ButtonLink } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-mono text-sm font-medium text-accent">404</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        This page isn&apos;t here
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        The link may be old or mistyped. Everything else is where you left it.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Go to the home page</ButtonLink>
        <ButtonLink href="/guides" variant="ghost">
          Browse the guides
        </ButtonLink>
      </div>
    </section>
  );
}
