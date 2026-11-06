import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { registerById, registerDefs } from "@/lib/registers";
import { RegisterView } from "./RegisterView";

export function generateStaticParams() {
  return registerDefs.map((r) => ({ register: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ register: string }>;
}): Promise<Metadata> {
  const { register } = await params;
  const def = registerById(register);
  return { title: def ? `${def.name} register` : "Register" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ register: string }>;
}) {
  const { register } = await params;
  if (!registerById(register)) notFound();
  return <RegisterView id={register} />;
}
