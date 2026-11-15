import type { IconName } from "@/components/Icons";

export type HelpArticle = {
  id: string;
  title: string;
  category: HelpCategory;
  icon: IconName;
  summary: string;
  /** Markdown subset: ## headings, - lists, 1. steps, **bold**. */
  body: string;
  /** Where in REAHUB to go to do this. */
  open?: { href: string; label: string };
};

export const HELP_CATEGORIES = [
  "Getting started",
  "Properties",
  "Trust accounts",
  "Compliance",
  "Operations and tools",
  "Document Vault",
  "Assistance",
  "Settings and team",
] as const;
export type HelpCategory = (typeof HELP_CATEGORIES)[number];

export const HELP: HelpArticle[] = [
  /* ---------- getting started ---------- */
  {
    id: "getting-around",
    title: "Getting around REAHUB",
    category: "Getting started",
    icon: "grid",
    summary: "The sidebar, the top bar and where everything lives.",
    open: { href: "/dashboard", label: "Open the dashboard" },
    body: `## The sidebar
The menu on the left holds every module:
- **Dashboard**: what needs attention today, your trust position and recent activity.
- **Assistance**: ask questions or have the assistant do work for you.
- **Properties**: every listing and managed property, each with its compliance checklist.
- **Trust**: cash book, client ledgers, reconciliation and history.
- **Compliance**: accreditations, the registers, policies and the audit log.
- **Operations**: KPIs and how the office is tracking.
- **Tools**: calendar, meetings, diary and task list.
- **Document Vault**: your policies and procedures, written, checked and signed.

On a phone, tap the menu button at the top left to open the sidebar.

## The top bar
- **Search** finds properties, tasks, documents, people and more. See "Searching REAHUB".
- **The bell** shows reminders, such as licences and CPD falling due.
- **The question mark** opens this help centre.
- **The gear** opens Settings for your team, plan and agency details.

## The demo banner
This is a demo workspace with sample data. Changes are saved in your browser only. Choose **Reset demo** in the banner to go back to the starting data.`,
  },
  {
    id: "search",
    title: "Searching REAHUB",
    category: "Getting started",
    icon: "search",
    summary:
      "Find anything from the search bar, using the mouse or the keyboard.",
    body: `## Search as you type
Click the search bar at the top of any page, or press **/** on your keyboard, and start typing. A list drops down straight away, grouped by kind: pages, properties, tasks, documents, registers, licences, calendar, checklists, trust, KPIs and people.

Every word you type must match, so "smith keys" narrows to key register entries for Smith Street.

## Choosing a result
- Click a result to open it.
- Or use the **up** and **down** arrow keys and press **Enter**.
- Press **Escape** to clear the box, and again to close it.

When the box is empty, the list shows the main pages so you can jump straight to one.`,
  },
  {
    id: "notifications",
    title: "Reminders and notifications",
    category: "Getting started",
    icon: "bell",
    summary: "How REAHUB reminds you about renewals, CPD and what is overdue.",
    open: { href: "/dashboard/settings", label: "Notification settings" },
    body: `## The bell
The bell at the top of every page shows a count of reminders. Open it to see each one and go straight to the record.

## Licence and CPD reminders
Each accreditation has an expiry date and, where tracked, a CPD year. REAHUB reminds you **90, 60, 30 and 7 days** before a licence expires or a CPD year ends, and keeps reminding once it has passed.

## Turning reminders on or off
Go to **Settings**, then **Notifications**, to choose which reminders you receive.`,
  },

  /* ---------- properties ---------- */
  {
    id: "add-property",
    title: "Adding a property",
    category: "Properties",
    icon: "building",
    summary: "Add a listing or a managed property and start its checklist.",
    open: { href: "/dashboard/properties/new", label: "Add a property" },
    body: `## Steps
1. Go to **Properties** and choose **Add property**.
2. Choose whether it is **for sale** or **under management**. This decides the statuses and the checklist it starts with.
3. Enter the address, suburb, vendor or landlord, price guide or weekly rent, and the responsible agent.
4. Pick a **checklist template**. Built-in templates cover a standard sale and a standard management; you can also pick one you have saved.
5. Save. The property opens on its overview, with its checklist ready.

## Sale and management are kept apart
The Properties page has separate views for properties for sale and properties under management, so each team sees its own work.`,
  },
  {
    id: "checklists",
    title: "Working through a property checklist",
    category: "Properties",
    icon: "check",
    summary:
      "Tick items off with proof, add or remove items, and save templates.",
    open: { href: "/dashboard/properties", label: "Open properties" },
    body: `## Ticking an item off needs proof
An item is only done when the file that proves it is attached, for example a signed agency agreement or a smoke alarm certificate.
1. Open the property, then its checklist.
2. Choose the box next to the item, or **Attach proof**.
3. Pick the file. The item is ticked and the file is kept against it.

To undo, choose the ticked box. REAHUB asks before removing the proof.

## Changing the list
- Type in **Add an item** at the bottom to add something this property needs, such as a pool certificate.
- Use the cross next to an item to remove it.

## Saving a template
Choose **Save as template** to reuse this checklist on future properties. It then appears as a choice when you add a property.`,
  },

  /* ---------- trust ---------- */
  {
    id: "trust-cash-book",
    title: "Receipting and paying trust money",
    category: "Trust accounts",
    icon: "scale",
    summary: "Record money in and out against the right client ledger.",
    open: { href: "/dashboard/trust", label: "Open trust accounts" },
    body: `## Two accounts
REAHUB keeps your **sales** and **rentals** trust accounts separate. Switch between them at the top of the Trust page.

## Recording money in
1. On the **Cash book** tab choose **Receipt money**.
2. Choose the property, the client the money is held for, the amount, the date and how it was paid.
3. Save. A receipt number is issued and the client's ledger goes up.

## Paying money out
1. Choose **Pay out**.
2. Choose the ledger to pay from, who is paid, the amount, and the written authority for the payment.
3. Save. REAHUB will not let a ledger go below zero, and will not let you record anything in a period that has already been signed and locked.

## Client ledgers
The **Ledgers** tab shows how much is held for each client at each property. The total of the ledgers must always equal the cash book.`,
  },
  {
    id: "trust-reconcile",
    title: "Reconciling a trust account",
    category: "Trust accounts",
    icon: "lock",
    summary:
      "Import the bank statement, match it, then sign and lock the month.",
    open: { href: "/dashboard/trust", label: "Open trust accounts" },
    body: `## Steps
1. Go to **Trust** and the **Reconcile** tab.
2. **Import the bank statement** as a CSV file exported from your bank. It needs a Date column, and either an Amount column or Debit and Credit columns. Dates in day/month/year order are fine. To practise, choose **Try a sample statement**.
3. Choose **Auto-match**. REAHUB pairs bank lines with cash book entries of the same amount and close dates.
4. Work through anything left: match a line to an entry by hand, or record a missing receipt or payment straight from the bank line.
5. When the bank balance, the cash book and the ledgers agree, choose **Sign and lock**. The reconciliation is signed by you and the period is locked, so it cannot be changed afterwards.

## History
Every signed reconciliation is kept on the **History** tab for your auditor and for Fair Trading.`,
  },

  /* ---------- compliance ---------- */
  {
    id: "registers",
    title: "Logging register entries",
    category: "Compliance",
    icon: "book",
    summary:
      "Keys, material facts, complaints, gifts, risks, identity checks and open homes.",
    open: {
      href: "/dashboard/compliance/registers",
      label: "Open the registers",
    },
    body: `## The seven registers
REAHUB keeps a register for **keys**, **material facts**, **complaints**, **gifts**, **risks and incidents**, **identity checks** and **open homes**.

## Adding an entry
1. Go to **Compliance**, then **Registers**, and open the register.
2. Choose **Add entry**.
3. Fill in the form. Each register asks for the detail that matters for it, for example who signed a key out and when it is due back, or the outcome of an identity check. Some entries need a file attached.
4. Save. The entry is dated and recorded against your name.

## Updating an entry
Open an entry to move it on, such as signing a key back in or closing a complaint. Every change is kept in the entry's history and in the audit log.`,
  },
  {
    id: "accreditations",
    title: "Licences, accreditations and CPD",
    category: "Compliance",
    icon: "id",
    summary: "Record licences, track renewals and log CPD hours.",
    open: {
      href: "/dashboard/compliance/accreditations/new",
      label: "Add an accreditation",
    },
    body: `## Adding a licence or accreditation
1. Go to **Compliance** and the **Accreditations** tab, then add one.
2. Choose the person and the type, and enter the date it was **acquired** and when it **expires**.
3. If CPD applies, enter the hours needed and when the CPD year ends.
4. Attach the certificate if you have it.

## Keeping it current
Open the accreditation to:
- **Log CPD** as each activity is completed, with evidence.
- **Record renewal** when the licence is renewed. The new expiry date replaces the old one.

Reminders appear under the bell before anything expires.`,
  },
  {
    id: "audit-log",
    title: "The audit log",
    category: "Compliance",
    icon: "clock",
    summary: "A permanent record of who did what, and when.",
    open: { href: "/dashboard/compliance", label: "Open compliance" },
    body: `## What is recorded
Important actions are written to the audit log automatically: trust receipts and payments, signed reconciliations, register entries, property changes, settings changes, and documents written, approved or withdrawn.

## Finding something
Go to **Compliance** and the **Audit log** tab. Filter by area (Trust, Registers, Properties, Documents or Settings) to narrow the list. Each line shows who did it, what changed, and when.`,
  },

  /* ---------- operations and tools ---------- */
  {
    id: "kpis",
    title: "Setting and tracking KPIs",
    category: "Operations and tools",
    icon: "grid",
    summary: "Set targets for people, teams or the agency, and update results.",
    open: { href: "/dashboard/operations", label: "Open operations" },
    body: `## Setting a KPI
1. Go to **Operations** and choose **Set a KPI**.
2. Name it, choose who owns it (a person, a team or the whole agency), the period, whether it is a count or a dollar amount, and the target.
3. Save.

## Updating results
Use **+1** and **−1** for quick counts, or edit the KPI to enter the actual figure. Each KPI shows whether it is **On track**, **Watch** or **Behind** against its target.`,
  },
  {
    id: "tools",
    title: "Calendar, meetings, diary and tasks",
    category: "Operations and tools",
    icon: "calendar",
    summary: "The office tools in one place.",
    open: { href: "/dashboard/tools", label: "Open tools" },
    body: `Go to **Tools** and switch between the tabs along the top.

## Calendar
Choose **Add event** for inspections, open homes, settlements and statutory dates. Task deadlines and licence renewals show alongside your events.

## Meetings
Choose **New meeting** to schedule one with attendees. After it is held, add notes and turn action items into tasks.

## Diary
Choose **New entry** to note calls, viewings, follow-ups and reminders, dated and tagged.

## Task list
Choose **Add task** to give someone a job with a due date. Move tasks from Open to In progress to Done as work happens.`,
  },

  /* ---------- document vault ---------- */
  {
    id: "vault-write",
    title: "Writing a policy or procedure",
    category: "Document Vault",
    icon: "file",
    summary: "Have the writer draft a document for your agency.",
    open: { href: "/dashboard/vault", label: "Open the Document Vault" },
    body: `## Steps
1. Go to **Document Vault** and choose a document. They are grouped by area, such as Trust and money or Property management.
2. Read what it will contain, then choose **Start writing**.
3. The writer may ask a few short questions, only where the answer changes the document. Answer them, or choose **Skip the questions** and it will leave clearly marked placeholders.
4. Watch it write. You can choose **Skip animation** to jump to the end.
5. The draft is saved to your vault.

## What to do with the draft
Read it through. The last section, **Items to confirm before adoption**, lists every placeholder and every legal point to check with NSW Fair Trading or your adviser. You can **Copy** it, download it for **Word**, or **Print or PDF**.`,
  },
  {
    id: "vault-approve",
    title: "Checking, approving and signing a document",
    category: "Document Vault",
    icon: "check",
    summary: "Run the compliance check, fix gaps, then sign the document.",
    open: { href: "/dashboard/vault", label: "Open the Document Vault" },
    body: `## The compliance check
Every document has a list of things it must cover. Under the document, choose **Run check**. Each requirement is marked covered, partly covered or missing, with a short reason. Choose **Fix gaps** to have the document rewritten to close them as a new version.

The check tests the wording against the list. It cannot guarantee compliance, because laws change, so still confirm the items it lists.

## Approving and signing
1. Choose **Approve and sign**.
2. Confirm the approver's name and position, the date approved, and the date it must be reviewed by.
3. Sign in the box with your mouse, finger or pen, and tick that you have read it.
4. Choose **Approve and sign**.

The signature, date and a fingerprint of the exact wording appear at the foot of the document, in Word and PDF copies, and in the audit log. As the review date approaches the document is marked **Review due soon**. Use **Withdraw approval** to send it back to draft.`,
  },

  /* ---------- assistance ---------- */
  {
    id: "assistance",
    title: "Using Assistance",
    category: "Assistance",
    icon: "sparkle",
    summary: "Ask questions, or have the assistant do work across REAHUB.",
    open: { href: "/dashboard/assistant", label: "Open Assistance" },
    body: `## Ask, or tell it what to do
Type in the bar at the bottom, or use the microphone to dictate. You can ask a compliance question, ask about your office, or give it a job, such as "set up tasks for everything overdue".

## How it works
The assistant looks things up across your properties, tasks, registers, licences, trust accounts and calendar, then proposes changes. Each change appears as a card saying exactly what it will do. Choose **Approve** or **Skip**, or **Approve all** when there are several.

## Ask before making changes
The switch under the bar is on by default, so nothing changes without your approval. Turn it off to let the assistant act straight away.

## What it will not do
It cannot move or record trust money, reconcile or sign anything, approve or delete documents or records, tick checklist items, or change settings, billing or access. It tells you where to do those yourself.

Answers are general information, not legal advice. Check anything important.`,
  },

  /* ---------- settings ---------- */
  {
    id: "team",
    title: "Managing your team and team leaders",
    category: "Settings and team",
    icon: "users",
    summary: "Invite people, set access, move teams and appoint team leaders.",
    open: { href: "/dashboard/settings", label: "Open settings" },
    body: `## Inviting someone
1. Open **Settings** with the gear at the top, then **Team**.
2. Choose **Invite**, enter their name and email, and pick their access level and team.
3. For an external auditor, choose **Auditor** and the date their access ends. Auditors are free and read-only.

## Changing access or team
In the team list, use the dropdowns next to each person to change their access level or move them to another team.

## Team leaders
Under **Teams and team leaders**, choose **Make team leader** next to anyone. A team can have as many leaders as you like.

## Access levels
- **Owner**: one per agency, controls billing.
- **Admin**: runs the agency day to day, including trust.
- **Team Lead**: sees the agency's records and their team's work.
- **Team Member**: sees the agency's records and their own team's work, no trust accounting.
- **Auditor**: read-only for a set time.`,
  },
  {
    id: "plan-billing",
    title: "Plans, usage and billing",
    category: "Settings and team",
    icon: "file",
    summary: "What your plan includes and how to change it.",
    open: { href: "/dashboard/settings", label: "Open settings" },
    body: `## Usage
**Settings**, then **Usage**, shows what your plan includes and what you have used: people who sign in, Document Vault storage, and assistant queries this month. Auditors do not count. Teams and team leaders are unlimited.

## Changing plan
**Settings**, then **Billing**, lists the plans. Choose one to switch. If you have more people than a plan allows, REAHUB tells you before you switch.

## Your agency details
**Settings**, then **Agency**, holds your agency name, legal entity, licence number, ABN, address and phone. These details are used in your documents.`,
  },
];

export const helpById = (id: string) => HELP.find((a) => a.id === id);
