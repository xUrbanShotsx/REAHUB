import type { Metadata } from "next";
import { NewPropertyForm } from "./NewPropertyForm";

export const metadata: Metadata = { title: "Add property" };

export default function Page() {
  return <NewPropertyForm />;
}
