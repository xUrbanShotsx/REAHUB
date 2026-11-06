import type { Metadata } from "next";
import { TasksView } from "./TasksView";

export const metadata: Metadata = { title: "Task list" };

export default function Page() {
  return <TasksView />;
}
