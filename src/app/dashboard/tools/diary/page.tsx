import type { Metadata } from "next";
import { DiaryView } from "./DiaryView";

export const metadata: Metadata = { title: "Diary" };

export default function Page() {
  return <DiaryView />;
}
