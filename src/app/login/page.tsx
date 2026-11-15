import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your REAHUB agency workspace.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      subtitle="Enter your email and password to sign in."
    >
      <SignInForm />
    </AuthShell>
  );
}
