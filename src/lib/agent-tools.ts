/**
 * The actions the Assistance agent can take. The model only ever sees these definitions; the work itself
 * runs in the browser against the user's workspace. Tools marked `write` change data, so the user approves
 * each one before it runs (unless they have switched approval off for the chat).
 *
 * Deliberately absent: anything that moves trust money, signs or approves, deletes records, or changes
 * billing, access or settings. The agent says so and points to the right page instead.
 */
export type AgentTool = {
  name: string;
  description: string;
  write: boolean;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
};

const str = (description: string) => ({ type: "string", description });
const iso = (description: string) => ({
  type: "string",
  description: `${description} Format yyyy-mm-dd.`,
});

export const AGENT_TOOLS: AgentTool[] = [
  /* ---------- look things up ---------- */
  {
    name: "list_properties",
    write: false,
    description:
      "List the agency's properties with ids, address, type (sale or management), status, agent, owner and checklist progress. Use to find a property id.",
    input_schema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["sale", "management"] },
        search: str("Part of an address or suburb."),
      },
    },
  },
  {
    name: "get_property",
    write: false,
    description:
      "Get one property with every checklist item: id, text, who is responsible, due date and whether it is done.",
    input_schema: {
      type: "object",
      properties: { property_id: str("Id from list_properties.") },
      required: ["property_id"],
    },
  },
  {
    name: "list_tasks",
    write: false,
    description:
      "List tasks with ids, status, assignee, due date and where they came from.",
    input_schema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["Open", "In progress", "Done"] },
        assignee: str("A team member's name."),
      },
    },
  },
  {
    name: "list_team",
    write: false,
    description:
      "List team members with their access level and team. Use for assignee names.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_accreditations",
    write: false,
    description:
      "List licences and accreditations with the holder, expiry date and continuing professional development (CPD) progress.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_registers",
    write: false,
    description:
      "List the compliance registers with their ids and the fields needed to log an entry (name, label, type, required, options). Call this before log_register_entry.",
    input_schema: {
      type: "object",
      properties: {
        register: str("Optional register id to describe just one."),
      },
    },
  },
  {
    name: "list_register_entries",
    write: false,
    description: "List entries in a compliance register, newest first.",
    input_schema: {
      type: "object",
      properties: {
        register: str("Register id, for example keys or complaints."),
        open_only: {
          type: "boolean",
          description: "Only entries that still need action.",
        },
      },
      required: ["register"],
    },
  },
  {
    name: "list_calendar",
    write: false,
    description:
      "List calendar events and meetings from today on, soonest first.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_kpis",
    write: false,
    description: "List KPIs with ids, owner, period, target and actual.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_documents",
    write: false,
    description:
      "List the Document Vault policies and procedures: which are written, approved and signed, or due for review.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_checklist_templates",
    write: false,
    description:
      "List the checklist templates, with ids, that a new property can start from.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "trust_summary",
    write: false,
    description:
      "Read-only summary of the trust accounts: cash book balance, reconciliation state and client ledger balances. You cannot change trust records.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "open_page",
    write: false,
    description:
      "Show the user a link to a page in REAHUB, for example the right register, a property, or a Document Vault document (/dashboard/vault/privacy-policy). Use this to send them somewhere to finish what you cannot do yourself, such as writing or signing a document.",
    input_schema: {
      type: "object",
      properties: {
        path: str("Path starting with /dashboard/."),
        label: str("Short link text, for example 'Open the privacy policy'."),
      },
      required: ["path", "label"],
    },
  },

  /* ---------- make changes (the user approves each one) ---------- */
  {
    name: "create_task",
    write: true,
    description: "Create a task for someone on the team.",
    input_schema: {
      type: "object",
      properties: {
        title: str("What needs doing, in plain words."),
        assignee: str("Team member name from list_team."),
        due: iso("Due date."),
        property_id: str("Optional property id the task relates to."),
      },
      required: ["title", "assignee"],
    },
  },
  {
    name: "set_task_status",
    write: true,
    description: "Change a task's status.",
    input_schema: {
      type: "object",
      properties: {
        task_id: str("Id from list_tasks."),
        status: { type: "string", enum: ["Open", "In progress", "Done"] },
      },
      required: ["task_id", "status"],
    },
  },
  {
    name: "add_property",
    write: true,
    description:
      "Add a new property, either for sale or under management, starting from a checklist template.",
    input_schema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["sale", "management"] },
        address: str("Street address."),
        suburb: str("Suburb."),
        owner: str("Vendor for a sale, landlord for a management."),
        price: str("Price guide for a sale, weekly rent for a management."),
        agent: str("Responsible team member."),
        template_id: str(
          "Id from list_checklist_templates. Pick the one matching the type.",
        ),
      },
      required: ["type", "address", "suburb", "owner", "template_id"],
    },
  },
  {
    name: "add_checklist_item",
    write: true,
    description:
      "Add an item to a property's compliance checklist. You cannot tick items off: ticking needs a proof file the user attaches.",
    input_schema: {
      type: "object",
      properties: {
        property_id: str("Id from list_properties."),
        text: str("The checklist item."),
      },
      required: ["property_id", "text"],
    },
  },
  {
    name: "add_calendar_event",
    write: true,
    description:
      "Add an event to the calendar, such as an inspection or open home.",
    input_schema: {
      type: "object",
      properties: {
        title: str("Event title."),
        date: iso("Date."),
        time: str("Optional time, 24 hour, for example 10:30."),
        kind: {
          type: "string",
          enum: [
            "Inspection",
            "Open home",
            "Settlement",
            "Statutory",
            "Appointment",
            "Other",
          ],
        },
        property_id: str("Optional property id."),
        notes: str("Optional notes."),
      },
      required: ["title", "date", "kind"],
    },
  },
  {
    name: "schedule_meeting",
    write: true,
    description: "Schedule a meeting with team members.",
    input_schema: {
      type: "object",
      properties: {
        title: str("Meeting title."),
        date: iso("Date."),
        time: str("Optional time, 24 hour."),
        attendees: {
          type: "array",
          items: { type: "string" },
          description: "Team member names.",
        },
        type: {
          type: "string",
          enum: [
            "Weekly sales meeting",
            "Property management review",
            "Team meeting",
            "Licensee review",
            "Vendor or landlord meeting",
            "Other",
          ],
        },
      },
      required: ["title", "date", "attendees"],
    },
  },
  {
    name: "add_diary_note",
    write: true,
    description: "Add a note to the office diary.",
    input_schema: {
      type: "object",
      properties: {
        text: str("The note."),
        tag: {
          type: "string",
          enum: ["Note", "Call", "Viewing", "Follow-up", "Reminder", "Other"],
        },
        date: iso("Date, defaults to today."),
      },
      required: ["text"],
    },
  },
  {
    name: "log_register_entry",
    write: true,
    description:
      "Log a new entry in a compliance register. Call list_registers first and supply a value for every required field, using the exact field names. Entries needing a file attachment cannot be logged by you: send the user to the register with open_page.",
    input_schema: {
      type: "object",
      properties: {
        register: str("Register id."),
        values: {
          type: "object",
          description:
            "Field name to value. Dates as yyyy-mm-dd, checks as true or false.",
          additionalProperties: true,
        },
      },
      required: ["register", "values"],
    },
  },
  {
    name: "set_kpi_actual",
    write: true,
    description: "Update the actual result recorded against a KPI.",
    input_schema: {
      type: "object",
      properties: {
        kpi_id: str("Id from list_kpis."),
        actual: { type: "number", description: "The new actual value." },
      },
      required: ["kpi_id", "actual"],
    },
  },
];

export const toolByName = (n: string) => AGENT_TOOLS.find((t) => t.name === n);
