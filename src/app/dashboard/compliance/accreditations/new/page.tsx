import type { Metadata } from "next";
import { NewAccreditation } from "./NewAccreditation";

export const metadata: Metadata = { title: "Add accreditation" };

export default function Page() {
  return <NewAccreditation />;
}
