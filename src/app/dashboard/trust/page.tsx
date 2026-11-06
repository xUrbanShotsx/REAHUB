import type { Metadata } from "next";
import { TrustView } from "./TrustView";

export const metadata: Metadata = { title: "Trust" };

export default function Page() {
  return <TrustView />;
}
