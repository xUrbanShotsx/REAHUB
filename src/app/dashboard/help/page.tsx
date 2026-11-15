import type { Metadata } from "next";
import { HelpView } from "./HelpView";

export const metadata: Metadata = { title: "Help" };

export default function Page() {
  return <HelpView />;
}
