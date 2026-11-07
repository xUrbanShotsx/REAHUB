import type { Metadata } from "next";
import { VaultView } from "./VaultView";

export const metadata: Metadata = { title: "Document Vault" };

export default function Page() {
  return <VaultView />;
}
