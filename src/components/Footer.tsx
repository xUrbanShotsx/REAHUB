import Link from "next/link";
import { guides } from "@/lib/guides";

const items = [
  ["Solutions", "/solutions"],
  ["Pricing", "/pricing"],
  ["About", "/about"],
  ["Resources", "/resources"],
  ["Guides", "/guides"],
  ["Contact", "https://briesa.com/contact"],
];

export function Footer() {
  return (
    <footer className="mt-28 overflow-hidden bg-ink text-bg">
      <div className="mx-auto max-w-6xl px-5 pt-16 sm:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <p className="max-w-sm font-display text-2xl font-semibold leading-snug">
            Find the gap while there is still time to fix it.
          </p>
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
            {items.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-bg/75 transition-colors hover:text-accent"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <nav
          aria-label="Compliance guides"
          className="mt-12 border-t border-bg/15 pt-8"
        >
          <h2 className="font-mono text-xs uppercase tracking-widest text-bg/60">
            Compliance guides
          </h2>
          <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="text-bg/75 transition-colors hover:text-accent"
                >
                  {g.h1}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p
          aria-hidden="true"
          className="mt-14 select-none font-display text-[clamp(4rem,19vw,16rem)] font-bold leading-[0.8] tracking-tighter text-bg/10"
        >
          REAHUB
        </p>
      </div>
      <div className="border-t border-bg/15 py-5 text-center font-mono text-xs uppercase tracking-widest text-bg/60">
        © 2026 REAHUB. Powered by Briesa.
      </div>
    </footer>
  );
}
