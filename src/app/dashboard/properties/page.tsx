import type { Metadata } from "next";
import { PropertiesView } from "./PropertiesView";

export const metadata: Metadata = { title: "Properties" };

export default function Page() {
  return <PropertiesView />;
}
