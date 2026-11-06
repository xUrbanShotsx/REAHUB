import type { Metadata } from "next";
import { properties } from "@/lib/demo-data";
import { ChecklistEditor } from "./ChecklistEditor";

export const metadata: Metadata = { title: "Checklist" };

export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChecklistEditor id={id} />;
}
