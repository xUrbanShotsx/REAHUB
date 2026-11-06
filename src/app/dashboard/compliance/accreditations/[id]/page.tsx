import type { Metadata } from "next";
import { seedAccreditations } from "@/lib/accreditations";
import { AccreditationDetail } from "./AccreditationDetail";

export const metadata: Metadata = { title: "Accreditation" };

export function generateStaticParams() {
  return seedAccreditations.map((a) => ({ id: a.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AccreditationDetail id={id} />;
}
