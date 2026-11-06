import type { Metadata } from "next";
import { properties } from "@/lib/demo-data";
import { PropertyOverview } from "./PropertyOverview";

export const metadata: Metadata = { title: "Property" };

export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PropertyOverview id={id} />;
}
