"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./Icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/solutions", label: "Solutions" },
  { href: "/resources", label: "Resources" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-lg">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
            <Icon name="shield" className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-wide text-ink">REAHUB</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/demo"
            className="hidden cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors duration-200 hover:bg-primary-dark sm:inline-block"
          >
            Book a demo
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-border/70 bg-background md:hidden">
          <ul className="mx-auto max-w-6xl space-y-1 px-4 py-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block cursor-pointer rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-primary/10"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/demo"
                onClick={() => setOpen(false)}
                className="mt-2 block cursor-pointer rounded-lg bg-primary px-3 py-3 text-center font-semibold text-on-primary"
              >
                Book a demo
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
