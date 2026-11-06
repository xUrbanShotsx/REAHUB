import type { Metadata } from "next";
import { OperationsView } from "./OperationsView";

export const metadata: Metadata = { title: "Operations" };

export default function Page() {
  return <OperationsView />;
}
