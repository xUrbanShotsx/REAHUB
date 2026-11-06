import type { Metadata } from "next";
import { ComplianceView } from "./ComplianceView";

export const metadata: Metadata = { title: "Compliance" };

export default function Page() {
  return <ComplianceView />;
}
