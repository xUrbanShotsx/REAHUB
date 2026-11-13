import { addDays } from "@/lib/accreditations";
import { todayISO } from "@/lib/format";
import type { AppStore } from "./agent";
import type { StreamEvent } from "./AssistantView";

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((r) => {
    const t = setTimeout(r, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(t);
      r();
    });
  });

async function* say(
  text: string,
  signal: AbortSignal,
): AsyncGenerator<StreamEvent> {
  for (let i = 0; i < text.length; i += 5) {
    if (signal.aborted) return;
    yield { t: "text", d: text.slice(i, i + 5) };
    await wait(14, signal);
  }
}

/**
 * A scripted run used only while the AI is not connected. It performs a real sweep of the workspace, then
 * proposes real changes, so the whole look and feel can be seen. It does not read the question.
 */
export async function* demoEvents(
  step: number,
  store: AppStore,
  signal: AbortSignal,
): AsyncGenerator<StreamEvent> {
  const today = todayISO();
  await wait(700, signal);

  if (step === 0) {
    const text =
      "I'll sweep the office for anything overdue, starting with tasks and property checklists.\n\n";
    yield* say(text, signal);
    yield {
      t: "final",
      stop: "tool_use",
      content: [
        { type: "text", text },
        {
          type: "tool_use",
          id: "demo-0-a",
          name: "list_tasks",
          input: { status: "Open" },
        },
        {
          type: "tool_use",
          id: "demo-0-b",
          name: "list_properties",
          input: {},
        },
      ],
    };
    return;
  }

  if (step === 1) {
    const items = store.properties.flatMap((p) =>
      p.checklist
        .filter((c) => !c.done && c.due && c.due < today)
        .map((c) => ({ p, c })),
    );
    const overdueTasks = store.tasks.filter(
      (t) => t.status !== "Done" && t.due && t.due < today,
    );
    const picks = items.slice(0, 3);
    const escalate = overdueTasks.slice(0, 2);
    const owners = [...new Set(overdueTasks.map((t) => t.assignee))]
      .filter((n) => store.members.some((m) => m.name === n))
      .slice(0, 4);
    const text = `Here is what I found: ${overdueTasks.length} overdue task${overdueTasks.length === 1 ? "" : "s"} and ${items.length} overdue checklist item${items.length === 1 ? "" : "s"}.${
      picks.length || escalate.length
        ? " I'll put a short review meeting in the diary for the people involved, and set up follow-up tasks with new dates. Approve the ones you want."
        : " Nothing is overdue, so I'll just note the sweep in the diary."
    }\n\n`;
    yield* say(text, signal);
    const uses: {
      type: string;
      id: string;
      name: string;
      input: Record<string, unknown>;
    }[] = [];
    if (owners.length)
      uses.push({
        type: "tool_use",
        id: "demo-1-m",
        name: "schedule_meeting",
        input: {
          title: "Overdue items review",
          date: addDays(today, 1),
          time: "09:00",
          attendees: owners,
          type: "Team meeting",
        },
      });
    picks.forEach(({ p, c }, i) =>
      uses.push({
        type: "tool_use",
        id: `demo-1-c${i}`,
        name: "create_task",
        input: {
          title: `Complete: ${c.t}`,
          assignee:
            store.members.find((m) => m.name === c.who)?.name ??
            store.members[0]?.name ??
            "",
          due: addDays(today, 2),
          property_id: p.id,
        },
      }),
    );
    escalate.forEach((t, i) =>
      uses.push({
        type: "tool_use",
        id: `demo-1-e${i}`,
        name: "create_task",
        input: {
          title: `Follow up, now overdue: ${t.t}`,
          assignee: t.assignee,
          due: addDays(today, 2),
        },
      }),
    );
    if (!uses.length)
      uses.push({
        type: "tool_use",
        id: "demo-1-d",
        name: "add_diary_note",
        input: { text: "Overdue sweep run: nothing overdue.", tag: "Note" },
      });
    yield {
      t: "final",
      stop: "tool_use",
      content: [{ type: "text", text }, ...uses],
    };
    return;
  }

  const text =
    "That is the sweep done. Anything you approved is now in REAHUB, and anything you skipped is left as it was. Ask me to do the same for a single property, a person, or the registers.";
  yield* say(text, signal);
  yield { t: "final", stop: "end_turn", content: [{ type: "text", text }] };
}
