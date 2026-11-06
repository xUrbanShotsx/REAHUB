import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icons";
import { PageHeading } from "@/components/app/ui";
import { RegistersTable } from "@/components/app/RegistersTable";

export const metadata: Metadata = { title: "Registers" };

export default function Page() {
  return (
    <>
      <Link
        href="/dashboard/compliance"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <Icon name="arrow" className="h-4 w-4 rotate-180" /> Compliance
      </Link>
      <PageHeading
        title="Registers"
        sub="Seven registers, each entry against its property. Open one to view and add entries."
      />
      <RegistersTable />
    </>
  );
}
