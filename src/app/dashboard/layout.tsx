import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";
import { DemoStoreProvider } from "@/components/app/DemoStore";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | REAHUB" },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoStoreProvider>
      <AppShell>{children}</AppShell>
    </DemoStoreProvider>
  );
}
