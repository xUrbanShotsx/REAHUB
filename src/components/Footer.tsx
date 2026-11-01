import Link from "next/link";
import { Icon } from "./Icons";

const cols = [
  { title: "Product", items: [["Solutions", "/solutions"], ["Pricing", "/pricing"]] },
  { title: "Company", items: [["About", "/about"], ["Resources", "/resources"]] },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
              <Icon name="shield" />
            </span>
            <span className="font-display text-xl font-bold tracking-wide text-ink">REAHUB</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Real estate compliance software that keeps licenses, transactions and disclosures audit-ready.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="text-sm font-semibold text-ink">{c.title}</h2>
            <ul className="mt-3 space-y-2">
              {c.items.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © 2026 REAHUB. All rights reserved.
      </div>
    </footer>
  );
}
