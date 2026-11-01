export type Guide = {
  slug: string;
  title: string; // <title> and og:title, brand added by the layout template
  h1: string;
  description: string;
  category: string;
  intro: string;
  sections: { h: string; p: string[]; bullets?: string[] }[];
  faqs: { q: string; a: string }[];
  related: string[];
};

const NOT_ADVICE =
  "This guide is general information, not legal advice. Confirm current requirements with NSW Fair Trading or your own adviser.";
export { NOT_ADVICE };

export const guides: Guide[] = [
  {
    slug: "nsw-real-estate-compliance-software",
    title: "NSW Real Estate Compliance Software",
    h1: "Real estate compliance software built for NSW agencies",
    description:
      "What NSW real estate compliance software should do: one file per property, trust accounting, registers, licence alerts and an audit log. See how REAHUB works.",
    category: "Compliance",
    intro:
      "A NSW agency answers to state law, and the licensee in charge answers for every team, every file and every trust dollar. Compliance software should make that visible every day, not once a year.",
    sections: [
      {
        h: "What NSW agencies actually need to keep",
        p: [
          "Agencies under the Property and Stock Agents Act 2002 keep a lot of records: agency agreements, disclosures, identity checks, trust receipts, registers, policies and licence details. Most offices hold them in five different places.",
          "Software earns its place when it puts those records against the property they belong to, so a gap shows up on the file instead of in an inspection.",
        ],
        bullets: [
          "Listing, marketing, safety and trust checklists on every campaign",
          "Sales and rentals trust accounts with separate ledgers and reconciliations",
          "Registers for keys, gifts, material facts, complaints and risks",
          "Licence classes, expiry dates and continuing professional development (CPD) hours",
          "A policy library with sign-off tracked by person and version",
        ],
      },
      {
        h: "Why inspections make this urgent",
        p: [
          "NSW Fair Trading reported more than 2,200 unannounced inspections in 2024 to 25, with $1.58 million in fines and 55 licences suspended. Inspectors ask to see records on the spot.",
          "An agency that keeps its file current as the work happens can answer in minutes. An agency that rebuilds the file afterwards cannot.",
        ],
      },
      {
        h: "How REAHUB approaches it",
        p: [
          "REAHUB treats the property as the file. Campaigns and management periods attach to it, trust movements name the property and engagement, and the registers fill from the work. Every write leaves an audit entry with the previous value, and compliance records are never hard-deleted.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is real estate compliance software?",
        a: "It is software that tracks the records, checklists, trust accounts, licences and policies an agency must keep, and flags what is missing before an inspection or audit does.",
      },
      {
        q: "Is REAHUB only for New South Wales?",
        a: "Yes, today. REAHUB is built to NSW rules first. Other states open only once their content has been written and reviewed.",
      },
      {
        q: "Does it replace my CRM?",
        a: "REAHUB runs the property file, trust, registers and daily tasks in one system. Ask us how your current CRM data carries across.",
      },
    ],
    related: [
      "real-estate-trust-accounting-software-nsw",
      "real-estate-agency-audit-checklist-nsw",
      "real-estate-compliance-registers-nsw",
    ],
  },
  {
    slug: "real-estate-trust-accounting-software-nsw",
    title: "Real Estate Trust Accounting Software NSW",
    h1: "Trust accounting software for NSW real estate agencies",
    description:
      "Sales and rentals trust accounting with receipts against the property, authority-first disbursements and a reconciliation that prepares itself as the month goes.",
    category: "Trust",
    intro:
      "Trust accounting is the part of an agency where a small error becomes a serious one. Good software makes every movement traceable and the month end a signature, not a scramble.",
    sections: [
      {
        h: "Two accounts, two ledgers",
        p: [
          "Sales and rentals money are held apart, each with its own ledger, reconciliation and sign-off. REAHUB keeps them separate while both sit over the same list of properties.",
        ],
      },
      {
        h: "Receipts that name four things",
        p: [
          "Every receipt records the amount, the party the money is held for, the property it is against and the engagement it belongs to. None is optional, so the file's Trust tab and the ledger are the same entries.",
        ],
        bullets: [
          "Amount and date",
          "Party the money is held for",
          "Property",
          "Sales campaign or management period",
        ],
      },
      {
        h: "Disbursements behind an authority",
        p: [
          "REAHUB asks what the authority is before it asks for the amount, which is the order an auditor reads it in. Trust authorisations can be limited to people holding the right accreditation.",
        ],
      },
      {
        h: "A reconciliation held every day",
        p: [
          "The cash book, bank statement and trust ledger sit side by side with the difference itemised. When the month ends, the reconciliation is signed by a person, dated and locked. A later correction is a later entry.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can a trust receipt be edited after it is saved?",
        a: "No. Every write leaves an audit entry with the previous value, and a correction is recorded as a new entry rather than an overwrite.",
      },
      {
        q: "Can our auditor review the trust account before we commit?",
        a: "Yes. An auditor can be invited with free, read-only, time-boxed access that sees everything and changes nothing.",
      },
      {
        q: "What does the audit pack contain?",
        a: "Reconciliations, ledgers, exceptions and the audit trail for the period the auditor names, exported in one go.",
      },
    ],
    related: [
      "trust-account-reconciliation-checklist-nsw",
      "real-estate-agency-audit-checklist-nsw",
      "nsw-real-estate-compliance-software",
    ],
  },
  {
    slug: "trust-account-reconciliation-checklist-nsw",
    title: "Trust Account Reconciliation Checklist NSW",
    h1: "A monthly trust account reconciliation checklist for NSW agencies",
    description:
      "A practical monthly reconciliation checklist for agency trust accounts: cash book, bank statement, ledger, exceptions and sign-off. Plus how to make it automatic.",
    category: "Trust",
    intro:
      "A reconciliation should be a check, not a project. Use this checklist to find out where your month end loses time, and what to automate first.",
    sections: [
      {
        h: "The checklist",
        p: [
          "Work through these in order for each trust account. Keep sales and rentals separate.",
        ],
        bullets: [
          "Cash book total agrees with the trust ledger total",
          "Bank statement closing balance agrees, after outstanding items",
          "Every receipt names a party, a property and an engagement",
          "Every disbursement has a recorded authority",
          "Unclaimed money is listed and tracked to its return",
          "Differences are itemised, explained and cleared, not carried forward",
          "The reconciliation is signed and dated by the responsible person",
        ],
      },
      {
        h: "Where the time goes",
        p: [
          "Most of the effort sits in chasing a missing party name or an unmatched deposit weeks after it happened. The fix is to refuse incomplete receipts at the time they are entered.",
        ],
      },
      {
        h: "Doing it as you go",
        p: [
          "REAHUB holds the three-way match continuously, so month end is the moment you sign, not the moment you start. An overdue reconciliation also appears on the dashboard and as a task for whoever signs it.",
        ],
      },
    ],
    faqs: [
      {
        q: "How often should an agency reconcile its trust account?",
        a: "Agencies reconcile on a monthly cycle. Confirm the current requirement for your account type with NSW Fair Trading.",
      },
      {
        q: "What if the difference is not zero?",
        a: "Itemise it, work out whether it is a timing item or an error, and clear it. REAHUB shows the itemised difference before you sign.",
      },
    ],
    related: [
      "real-estate-trust-accounting-software-nsw",
      "real-estate-agency-audit-checklist-nsw",
      "real-estate-compliance-registers-nsw",
    ],
  },
  {
    slug: "real-estate-agency-audit-checklist-nsw",
    title: "Real Estate Agency Audit Checklist NSW",
    h1: "A real estate agency audit checklist for NSW licensees",
    description:
      "What a NSW agency should be able to produce in an audit or inspection: trust records, registers, licences, policies and a clean audit trail. Use this checklist.",
    category: "Audit",
    intro:
      "An audit should be an export, not an archaeology dig. This checklist lists what to be able to show, and how to keep it ready all year.",
    sections: [
      {
        h: "Be able to produce",
        p: [
          "If an auditor or inspector arrives, these are the records they tend to ask for.",
        ],
        bullets: [
          "Trust account reconciliations, ledgers and receipts for the period",
          "Disbursement authorities",
          "Agency agreements and disclosures against each property",
          "Identity verification records",
          "Registers: keys, gifts, material facts, complaints, risks",
          "Licence classes, expiry dates and CPD records for each person",
          "Policies, with who signed which version and when",
        ],
      },
      {
        h: "What makes a record credible",
        p: [
          "Auditors read the log as well as the document. A record that shows who made each change, when, and what it said before is far easier to trust than a tidy folder.",
        ],
      },
      {
        h: "Keep it audit-ready all year",
        p: [
          "REAHUB writes an audit entry on every save, never hard-deletes a compliance record and exports an audit pack for the period an auditor names. Auditors can also be given read-only access instead.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does it take to assemble an audit pack?",
        a: "With records filed as the work happens, it is an export. Without that it can take days of searching across systems.",
      },
      {
        q: "Does the auditor need a paid seat?",
        a: "No. An auditor invited by an agency gets a free read-only account.",
      },
    ],
    related: [
      "nsw-fair-trading-inspection-checklist",
      "real-estate-trust-accounting-software-nsw",
      "real-estate-compliance-registers-nsw",
    ],
  },
  {
    slug: "nsw-fair-trading-inspection-checklist",
    title: "NSW Fair Trading Inspection Checklist",
    h1: "Get ready for a NSW Fair Trading inspection",
    description:
      "NSW Fair Trading carried out 2,200+ unannounced agency inspections in 2024 to 25. Use this checklist to be ready on the day, and see how REAHUB keeps you there.",
    category: "Audit",
    intro:
      "Inspections are unannounced, so readiness has to be a habit. NSW Fair Trading's 2024 to 25 year included more than 2,200 unannounced visits, $1.58 million in fines and 55 licences suspended.",
    sections: [
      {
        h: "A short readiness check",
        p: [
          "Ask these questions today. If any answer is a maybe, that is where to start.",
        ],
        bullets: [
          "Can the licensee in charge open the trust records for any property in minutes?",
          "Are all registers current, with no gaps for the last quarter?",
          "Is every licence and certificate in date, and are renewals tracked?",
          "Is there a signed-off policy for each required topic, with the current version?",
          "Is supervision of every team documented?",
          "Is every listing's paperwork complete before it goes live?",
        ],
      },
      {
        h: "Why supervision matters",
        p: [
          "The licensee in charge answers for the whole agency. Seeing every team's open items on one dashboard is the practical way to supervise at scale.",
        ],
      },
      {
        h: "Be ready without the scramble",
        p: [
          "REAHUB shows what is overdue, expiring and unsigned across every team, and keeps the registers current from the work. Figures above are from NSW Fair Trading's published 2024 to 25 results.",
        ],
      },
    ],
    faqs: [
      {
        q: "Are Fair Trading inspections announced?",
        a: "Many are unannounced. Fair Trading reported more than 2,200 unannounced inspections in 2024 to 25.",
      },
      {
        q: "What do inspectors look at first?",
        a: "Commonly the trust account records, registers, licences and supervision. Confirm current priorities with NSW Fair Trading.",
      },
    ],
    related: [
      "real-estate-agency-audit-checklist-nsw",
      "supervision-guidelines-real-estate-nsw",
      "real-estate-compliance-registers-nsw",
    ],
  },
  {
    slug: "real-estate-licence-cpd-tracking",
    title: "Real Estate Licence and CPD Tracking",
    h1: "Track real estate licences and CPD without a spreadsheet",
    description:
      "Track every licence class, expiry and CPD hour across your agency, with alerts at 90, 60, 30 and 7 days and accreditations that gate who may sign.",
    category: "Licences",
    intro:
      "A lapsed licence is one of the easiest compliance failures to prevent, and one of the most expensive to discover late.",
    sections: [
      {
        h: "What to track for each person",
        p: [
          "Keep one record per person so nothing depends on someone remembering.",
        ],
        bullets: [
          "Licence or certificate class",
          "Expiry date and renewal status",
          "CPD hours completed against the requirement",
          "What they are permitted to sign",
        ],
      },
      {
        h: "Accreditations that gate signing",
        p: [
          "A licence class decides what someone may sign. REAHUB checks the answer before the pen comes out, and an expired accreditation stops the signature.",
        ],
      },
      {
        h: "Alerts before it lapses",
        p: [
          "Alerts go out at 90, 60, 30 and 7 days, and expiring accreditations create tasks that reach the dashboard. The principal can see every expiry without opening a spreadsheet.",
        ],
      },
    ],
    faqs: [
      {
        q: "Who sees the expiry alerts?",
        a: "The person, and the owners and admins who oversee them, depending on access level.",
      },
      {
        q: "Does it track CPD hours?",
        a: "Yes. CPD sits alongside licence details so shortfalls show before renewal.",
      },
    ],
    related: [
      "nsw-real-estate-compliance-software",
      "real-estate-policy-library-sign-off",
      "nsw-fair-trading-inspection-checklist",
    ],
  },
  {
    slug: "real-estate-compliance-registers-nsw",
    title: "Real Estate Compliance Registers NSW",
    h1: "The registers a NSW real estate agency keeps, and how to keep them",
    description:
      "Keys, gifts, material facts, complaints and risks: how NSW agencies keep compliance registers that fill from the work instead of being updated by hand.",
    category: "Compliance",
    intro:
      "Registers fail when someone has to remember to update them. They work when entries are made while the work is happening.",
    sections: [
      {
        h: "The registers",
        p: [
          "REAHUB keeps seven registers, each entry against its property and engagement.",
        ],
        bullets: [
          "Keys, signed out and back in",
          "Material facts, as disclosed",
          "Complaints, from receipt to close",
          "Gifts and benefits",
          "Risks and incidents",
          "Open homes and identity checks",
        ],
      },
      {
        h: "Why registers should be views, not lists",
        p: [
          "When a register is a list someone maintains, it drifts. When it is a view over entries made during the work, it stays true and the auditor and the agent read the same record.",
        ],
      },
      {
        h: "Read-only for auditors",
        p: [
          "Auditors can read the registers as the list they want, without asking anyone for a folder. Every entry carries who, when and the previous value.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can entries be deleted?",
        a: "No. Compliance records are never hard-deleted, and every change is logged with the previous value.",
      },
      {
        q: "Who can add entries?",
        a: "Anyone with the right access level, against the property and engagement they are working on.",
      },
    ],
    related: [
      "real-estate-agency-audit-checklist-nsw",
      "nsw-real-estate-compliance-software",
      "real-estate-policy-library-sign-off",
    ],
  },
  {
    slug: "property-management-compliance-software-nsw",
    title: "Property Management Compliance Software NSW",
    h1: "Compliance software for NSW property management and rent rolls",
    description:
      "Manage tenancies, inspections, maintenance and rentals trust on the same property file as sales, with compliance evidence recorded against each one.",
    category: "Property management",
    intro:
      "Property management sits across tenancies, inspections, repairs and the rentals trust account. The records are scattered unless they hang off the property.",
    sections: [
      {
        h: "One property, many periods",
        p: [
          "A management period is an engagement with a start, an agreement and an end. A tenanted property being sold carries both a management period and a sales campaign, and the file names both.",
        ],
      },
      {
        h: "Inspections, arrears and repairs where you would look",
        p: [
          "Routine inspections, entry notices, arrears and maintenance sit on the property, so the next person finds them without searching an inbox.",
        ],
        bullets: [
          "Tenancies in sequence, with gaps visible",
          "Inspection reports kept on the file",
          "Maintenance from reported to invoiced",
          "Rent receipted into the rentals trust account",
        ],
      },
      {
        h: "Bring the rent roll across",
        p: [
          "Larger portfolios can bulk import the rent roll so the file starts populated rather than retyped.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can sales and property management share a property list?",
        a: "Yes. Both work over one list of properties, so an address is never two records.",
      },
      {
        q: "Is the rentals trust account separate?",
        a: "Yes. Sales and rentals trust have separate ledgers and reconciliations.",
      },
    ],
    related: [
      "real-estate-trust-accounting-software-nsw",
      "switching-real-estate-software-data-migration",
      "nsw-real-estate-compliance-software",
    ],
  },
  {
    slug: "underquoting-compliance-nsw",
    title: "Underquoting Compliance for NSW Agents",
    h1: "Stop underquoting problems before a listing goes live",
    description:
      "How to document estimated selling prices, price guides and advertising approval so underquoting risk is caught before a NSW listing is published.",
    category: "Listings",
    intro:
      "A property that goes live short of paperwork is a fine waiting to happen. The price paperwork is the part most worth checking early.",
    sections: [
      {
        h: "What to record before advertising",
        p: [
          "Capture the evidence against the listing, not in a separate folder.",
        ],
        bullets: [
          "Estimated selling price and how it was reached",
          "Price guide check",
          "Advertising approval",
          "Material fact notice",
        ],
      },
      {
        h: "A guard on every listing",
        p: [
          "REAHUB's underquoting guard checks the recorded price information on each listing, and the marketing checklist keeps evidence against each item. Boutique and Large plans include it.",
        ],
      },
      {
        h: "Know before you sign",
        p: [
          "The system tells you what you cannot sign before you try, which saves a difficult conversation later.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does REAHUB set the price guide?",
        a: "No. It records and checks the information your team supplies, and flags gaps.",
      },
      {
        q: "Is the underquoting guard on every plan?",
        a: "It is included on Boutique and Large plans.",
      },
    ],
    related: [
      "nsw-real-estate-compliance-software",
      "real-estate-compliance-registers-nsw",
      "nsw-fair-trading-inspection-checklist",
    ],
  },
  {
    slug: "real-estate-identity-verification-aml-nsw",
    title: "Identity Verification and AML for Agents",
    h1: "Record identity checks where you can prove them",
    description:
      "Keep identity verification and anti-money laundering records against the party and the engagement, so they are provable rather than remembered.",
    category: "AML",
    intro:
      "Identity checks only help if you can show what was checked, by whom and when. That means recording them against the party and the engagement.",
    sections: [
      {
        h: "What to record",
        p: [
          "For each check, keep the evidence with the transaction it supports.",
        ],
        bullets: [
          "Who was verified, and in what role",
          "What was checked",
          "Who checked it, and when",
          "The engagement and property it relates to",
        ],
      },
      {
        h: "Why placement matters",
        p: [
          "A check filed in a general folder cannot be tied to a deal. Recorded on the engagement, it travels with the property and is carried forward when the next engagement opens.",
        ],
      },
      {
        h: "Anti-money laundering policy",
        p: [
          "REAHUB's policy library includes anti-money laundering alongside trust accounting, privacy and complaints handling, with sign-off tracked by person and version.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is identity checking built in?",
        a: "Yes. Checks are recorded against the party and the engagement, with who and when.",
      },
      {
        q: "Does REAHUB give legal advice on AML obligations?",
        a: "No. Confirm obligations with your adviser or the relevant regulator.",
      },
    ],
    related: [
      "real-estate-policy-library-sign-off",
      "real-estate-compliance-registers-nsw",
      "nsw-real-estate-compliance-software",
    ],
  },
  {
    slug: "real-estate-policy-library-sign-off",
    title: "Real Estate Policy Library and Sign-Off",
    h1: "A policy library where everyone has signed the current version",
    description:
      "Keep one current version of each agency policy and track who has signed it, by person and version, with review schedules that become tasks.",
    category: "Policies",
    intro:
      "An inspector asking for your policies wants the current version and proof that people read it. One policy, one version, everyone signed.",
    sections: [
      {
        h: "Policies most agencies keep",
        p: [
          "A typical library covers these topics, each with one current version.",
        ],
        bullets: [
          "Work health and safety",
          "Trust accounting procedures",
          "Anti-money laundering",
          "Open homes procedure",
          "Suppliers and contractors",
          "Complaints handling",
          "CPD and training",
          "Marketing and advertising",
          "Repairs and maintenance",
          "Risk and incident",
          "Supervision guidelines",
          "Privacy and data retention",
        ],
      },
      {
        h: "Sign-off by person and version",
        p: [
          "REAHUB records who signed which version and when, and shows who still owes a signature. Publishing a new version resets sign-off for it.",
        ],
      },
      {
        h: "Reviews that become tasks",
        p: [
          "Review schedules create tasks, and overdue reviews reach the dashboard, so the library does not go stale.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can we upload our own policies?",
        a: "Yes. The library holds your policies with versions and sign-off, and review schedules.",
      },
      {
        q: "Who can see sign-off status?",
        a: "Owners, admins and team leads can see it for the people they oversee.",
      },
    ],
    related: [
      "real-estate-licence-cpd-tracking",
      "supervision-guidelines-real-estate-nsw",
      "real-estate-compliance-registers-nsw",
    ],
  },
  {
    slug: "supervision-guidelines-real-estate-nsw",
    title: "2024 Supervision Guidelines Explained",
    h1: "The 2024 Supervision Guidelines, explained for licensees in charge",
    description:
      "A plain-language look at supervision for NSW licensees in charge: what to document, how to evidence oversight of every team, and how REAHUB supports it.",
    category: "Supervision",
    intro:
      "The licensee in charge answers for every team in the agency. Supervision is only defensible if it is documented.",
    sections: [
      {
        h: "What supervision looks like in practice",
        p: [
          "Think of supervision as three things you can show: who oversees whom, what was reviewed, and what was done about it.",
        ],
        bullets: [
          "A clear structure of teams and who leads each",
          "A record of what the licensee reviewed and when",
          "Sign-offs on the policies that govern supervision",
          "Evidence that overdue items were chased",
        ],
      },
      {
        h: "Access that follows responsibility",
        p: [
          "REAHUB has five access levels: Owner, Admin, Team Lead, Team Member and Auditor. Admins and owners see the agency, a Team Lead sees their team, and every action is logged.",
        ],
      },
      {
        h: "Oversight on one dashboard",
        p: [
          "The dashboard shows overdue items, what is due soon, live engagements and the trust position, filtered to what each person is responsible for.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is this legal advice on the Supervision Guidelines?",
        a: "No. It is a general summary. Read the guidelines and confirm requirements with NSW Fair Trading.",
      },
      {
        q: "Can a team lead see other teams' work?",
        a: "A Team Lead sees the agency's records and their own team's work. Owners and admins see the whole agency.",
      },
    ],
    related: [
      "nsw-fair-trading-inspection-checklist",
      "real-estate-policy-library-sign-off",
      "real-estate-agency-audit-checklist-nsw",
    ],
  },
  {
    slug: "switching-real-estate-software-data-migration",
    title: "Switching Real Estate Software and Data",
    h1: "Switching agency software without losing your history",
    description:
      "What carries across when you move agency software, what does not, and the order to do it in. A practical guide to migrating properties, parties and documents.",
    category: "Getting started",
    intro:
      "A property's history is the whole point, so migration is the part to take most seriously. Here is a sensible order of work.",
    sections: [
      {
        h: "A sensible order",
        p: ["Move in layers so each one can be checked before the next."],
        bullets: [
          "Agency set-up: name, jurisdiction, teams and access levels",
          "People, licences and accreditations",
          "Properties and their parties",
          "Open campaigns and management periods",
          "Documents against the property",
          "Trust balances, switched at a month end",
        ],
      },
      {
        h: "Be honest about what carries",
        p: [
          "Structured records such as properties and parties carry cleanly. Free-text notes and documents without an address can need tidying. Ask for a straight answer before committing.",
        ],
      },
      {
        h: "No second migration",
        p: [
          "Changing plan or moving a team under an agency does not need another migration. A plan is a limit, not a different system.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does migration take?",
        a: "It depends on your current system and volume. Tell us what you use now and we will give you a straight answer.",
      },
      {
        q: "When should we switch the trust account?",
        a: "At a month end, so the opening balance is a reconciled one.",
      },
    ],
    related: [
      "property-management-compliance-software-nsw",
      "nsw-real-estate-compliance-software",
      "real-estate-trust-accounting-software-nsw",
    ],
  },
];

export const guideBySlug = (slug: string) =>
  guides.find((g) => g.slug === slug);
