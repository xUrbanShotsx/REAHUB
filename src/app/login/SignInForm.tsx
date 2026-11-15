"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/Icons";

const field =
  "block w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink shadow-sm outline-none transition-colors placeholder:text-ink-soft/70 focus:border-accent focus:ring-4 focus:ring-accent/15";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [keep, setKeep] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    setNote("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setError("");
    setBusy(true);
    // Demo workspace: there is no account check yet, so any details open the dashboard.
    router.push("/dashboard");
  }

  function forgot() {
    setError("");
    setNote(
      email.trim()
        ? `If ${email.trim()} has an account, a reset link is on its way.`
        : "Enter your email above, then press Forgot password again.",
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@agency.com.au"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error.includes("email") || undefined}
          className={field}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error.includes("password") || undefined}
            className={`${field} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-ink-soft transition-colors hover:text-ink"
          >
            <Icon
              name={show ? "eye" : "eye-off"}
              className="h-[18px] w-[18px]"
            />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={keep}
            onChange={(e) => setKeep(e.target.checked)}
            className="h-4 w-4 rounded border-line accent-accent"
          />
          Keep me logged in
        </label>
        <button
          type="button"
          onClick={forgot}
          className="text-sm font-semibold text-accent hover:underline"
        >
          Forgot password?
        </button>
      </div>

      {(error || note) && (
        <p
          role={error ? "alert" : "status"}
          className={`rounded-lg px-3.5 py-2.5 text-sm ${error ? "bg-red-50 text-red-700" : "bg-tint text-ink"}`}
        >
          {error || note}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-accent py-3 font-semibold text-white shadow-sm transition-colors hover:bg-accent/90 disabled:opacity-70"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Don&apos;t have an account?{" "}
        <Link
          href="https://auth.briesa.com/signup"
          className="font-semibold text-accent hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
