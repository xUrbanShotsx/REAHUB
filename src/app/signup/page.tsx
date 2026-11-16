import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/AuthShell";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create your REAHUB agency workspace and start a 7-day free trial.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/signup" },
};

export default function SignUpPage() {
  return (
    <AuthShell fixed>
      <Suspense fallback={<SignUpForm />}>
        <SignUpForm withPlanFromUrl />
      </Suspense>
    </AuthShell>
  );
}
