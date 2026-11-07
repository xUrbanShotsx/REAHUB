import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VAULT, vaultById } from "@/lib/vault";
import { DocFlow } from "./DocFlow";

export function generateStaticParams() {
  return VAULT.map((d) => ({ doc: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  return { title: vaultById(doc)?.name ?? "Document Vault" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  if (!vaultById(doc)) notFound();
  return <DocFlow id={doc} />;
}
