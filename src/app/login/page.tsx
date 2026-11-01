import type { Metadata } from "next";
import { ButtonLink, PageHeader } from "@/components/Sections";

export const metadata: Metadata = { title: "Login" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Login" title={<>Welcome <span className="tape">back</span>.</>}>
        Accounts are not open yet. Book a demo and we will set you up with early access.
      </PageHeader>
      <div className="mx-auto mt-6 max-w-6xl px-5 sm:px-8">
        <ButtonLink href="/demo">Book a demo</ButtonLink>
      </div>
    </>
  );
}
