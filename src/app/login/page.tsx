import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icons";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your REAHUB agency workspace.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" },
};

/** Squares on the brand panel that glow faintly, as [column, row, strength] from the centre. */
const LIT: [number, number, number][] = [
  [-2, -2, 0.07],
  [-3, -1, 0.05],
  [2, 0, 0.06],
  [3, 1, 0.08],
  [-1, 2, 0.04],
  [1, -3, 0.05],
];

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh bg-bg lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-16">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Back to website
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="REAHUB"
            width={403}
            height={82}
            className="mb-10 h-8 w-auto self-start lg:hidden"
          />
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Sign in
          </h1>
          <p className="mt-2 text-ink-soft">
            Enter your email and password to sign in.
          </p>
          <SignInForm />
        </div>

        <p className="text-center text-xs text-ink-soft">
          © 2026 REAHUB. Powered by Briesa.
        </p>
      </div>

      <aside
        aria-hidden="true"
        className="relative hidden overflow-hidden bg-ink lg:flex lg:items-center lg:justify-center"
      >
        {/* Grid lines, faded towards the edges */}
        <div
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_50%,black,transparent)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(255 255 255 / 0.09) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.09) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {LIT.map(([c, r, a]) => (
              <span
                key={`${c}-${r}`}
                className="absolute h-[71px] w-[71px] bg-white"
                style={{
                  left: c * 72 - 35,
                  top: r * 72 - 35,
                  opacity: a,
                }}
              />
            ))}
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-3xl" />

        <div className="relative px-10 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt=""
            width={403}
            height={82}
            className="mx-auto h-16 w-auto brightness-0 invert"
          />
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/65">
            Real estate compliance software for NSW. Every property file,
            cleared before the audit.
          </p>
        </div>
      </aside>
    </div>
  );
}
