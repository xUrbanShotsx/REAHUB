"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icons";
import { useStore } from "@/components/app/DemoStore";
import { RegisterForm } from "@/components/app/RegisterForm";
import { Card, PageHeading } from "@/components/app/ui";
import { accreditationFields } from "@/lib/accreditations";

export function NewAccreditation() {
  const router = useRouter();
  const { addAccreditation } = useStore();
  return (
    <>
      <Link
        href="/dashboard/compliance"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <Icon name="arrow" className="h-4 w-4 rotate-180" /> Compliance
      </Link>
      <PageHeading
        title="Add an accreditation"
        sub="Record when it was acquired and when it expires. REAHUB then reminds you to renew and to keep CPD up."
      />
      <Card className="p-5">
        <RegisterForm
          fields={accreditationFields}
          submitLabel="Save accreditation"
          onCancel={() => router.push("/dashboard/compliance")}
          onSubmit={async (values, files) => {
            const id = await addAccreditation(values, files);
            router.push(`/dashboard/compliance/accreditations/${id}`);
          }}
        />
      </Card>
    </>
  );
}
