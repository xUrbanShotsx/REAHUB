import { redirect } from "next/navigation";

/** Opening Tools lands on the first tool, the way Compliance opens on its first tab. */
export default function Page() {
  redirect("/dashboard/tools/calendar");
}
