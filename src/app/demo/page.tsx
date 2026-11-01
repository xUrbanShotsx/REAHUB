import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/schema";
import { pageMeta } from "@/lib/site";

import { PageHeader } from "@/components/Sections";
import { Icon } from "@/components/Icons";
import { Suspense } from "react";
import { DemoForm } from "./DemoForm";

export const metadata: Metadata = pageMeta({
  title: "Book a Demo",
  description:
    "Book a 30-minute REAHUB demo. See property files, trust accounting, registers and audit packs on your own workflow.",
  path: "/demo",
});

export default function Demo() {
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Book a demo", path: "/demo" },
        ])}
      />
      <PageHeader
        eyebrow="Book a demo"
        title={
          <>
            See REAHUB on <span className="tape">your</span> files.
          </>
        }
      >
        Tell us about your team and we&apos;ll walk you through licences,
        transaction files and disclosures.
      </PageHeader>
      <section className="mx-auto mt-10 grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <ul data-reveal className="space-y-4 self-start">
          {[
            "A 30-minute walkthrough tailored to your market",
            "Your checklists and licence rules, not a generic tour",
            "Answers on migration, roles and audit exports",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3 text-ink">
              <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-ink" />{" "}
              {t}
            </li>
          ))}
        </ul>
        <Suspense>
          <DemoForm />
        </Suspense>
      </section>
    </>
  );
}
