import type { IconName } from "@/components/Icons";

export type VaultDef = {
  id: string;
  name: string;
  icon: IconName;
  /** One line on the card. */
  blurb: string;
  /** Who it protects, shown on the intro screen. */
  why: string;
  /** The sections the document will have, in order. Also drives the progress rail. */
  sections: string[];
  /** Things this agency-specific document usually depends on, so the AI knows what to ask about. */
  askAbout: string[];
  /** Legal footing to draw on, in general terms only. */
  basis: string;
};

export const VAULT: VaultDef[] = [
  {
    id: "complaints-policy",
    name: "Complaints handling policy",
    icon: "bell",
    blurb: "How complaints are received, investigated, answered and recorded.",
    why: "Fair Trading and the courts expect a written, followed process. It also shows clients you take problems seriously.",
    sections: [
      "Purpose and scope",
      "Our commitment",
      "What counts as a complaint",
      "How to make a complaint",
      "Acknowledging and investigating",
      "Timeframes and outcomes",
      "Escalation and external options",
      "Records and the complaints register",
      "Learning and improvement",
      "Roles and responsibilities",
      "Review of this policy",
    ],
    askAbout: [
      "who receives and who decides complaints",
      "the agency's own response timeframes",
      "whether complaints can be made by phone, email or form",
    ],
    basis:
      "The Property and Stock Agents Act 2002 (NSW) and its regulation, NSW Fair Trading's role, and good practice consistent with AS/NZS 10002 complaint management guidelines.",
  },
  {
    id: "privacy-policy",
    name: "Privacy policy",
    icon: "lock",
    blurb:
      "What personal information is collected, why, how it is kept and who sees it.",
    why: "Agents collect identity documents, finances and contact details every day. Clients are entitled to know how that is handled.",
    sections: [
      "About this policy",
      "What personal information we collect",
      "Why we collect and how we use it",
      "Who we share it with",
      "Storing and securing information",
      "Direct marketing",
      "Access and correction",
      "Data breaches",
      "Overseas disclosure",
      "Privacy complaints",
      "Contact and review",
    ],
    askAbout: [
      "the systems used to store client data and where they are hosted",
      "whether information goes to overseas providers",
      "whether marketing emails or SMS are sent",
    ],
    basis:
      "The Privacy Act 1988 (Cth) and the Australian Privacy Principles, including the notifiable data breaches scheme. Do not state whether the agency is legally bound by the Act; write it so the agency follows the principles either way.",
  },
  {
    id: "trust-account-procedures",
    name: "Trust account procedures",
    icon: "scale",
    blurb:
      "Receipts, payments, cash book, ledgers, reconciliation and audit, step by step.",
    why: "Trust money is the highest-risk area of an agency. Written steps keep every staff member doing it the same, correct way.",
    sections: [
      "Purpose and scope",
      "Who is responsible",
      "Trust accounts we hold",
      "Receiving money",
      "Paying money out",
      "Cash book and client ledgers",
      "Monthly reconciliation",
      "Signing and locking reconciliations",
      "Annual audit",
      "Errors, shortfalls and dishonoured payments",
      "Records and retention",
      "Review of these procedures",
    ],
    askAbout: [
      "who the authorised signatories are",
      "whether the agency handles sales deposits, rent, or both",
      "how and how often money is banked",
    ],
    basis:
      "The trust account requirements of the Property and Stock Agents Act 2002 (NSW) and its regulation, including the cash book, ledger, reconciliation and annual audit duties. Do not quote section numbers, time limits or amounts. Where a rule has a time limit, say 'within the time required by the regulation'.",
  },
  {
    id: "conflicts-gifts",
    name: "Conflicts of interest and gifts policy",
    icon: "shield",
    blurb:
      "Declaring interests, handling gifts and benefits, and keeping the register.",
    why: "Agents must act in the client's interest. This policy makes that visible and gives staff a clear line on gifts and dealings.",
    sections: [
      "Purpose and scope",
      "What a conflict of interest is",
      "Declaring a conflict",
      "Dealing with a conflict",
      "Gifts, benefits and hospitality",
      "Buying or leasing property we list",
      "Referral fees and commissions",
      "The gifts and conflicts register",
      "Breaches",
      "Review of this policy",
    ],
    askAbout: [
      "a dollar value above which gifts must be declared",
      "whether staff may buy properties the agency lists",
      "whether referral fees are ever paid or received",
    ],
    basis:
      "The agent's duty to act in the client's interests under the Property and Stock Agents Act 2002 (NSW) and its code of conduct. Do not cite section numbers.",
  },
  {
    id: "aml-identity",
    name: "AML/CTF and identity verification procedure",
    icon: "id",
    blurb:
      "Knowing your customer, verifying identity, and reporting suspicious matters.",
    why: "Real estate is now inside Australia's anti-money laundering regime. You need a documented program and consistent identity checks.",
    sections: [
      "Purpose and scope",
      "Who is responsible",
      "Risk assessment",
      "Identifying and verifying customers",
      "Beneficial owners and complex structures",
      "Enhanced due diligence",
      "Ongoing monitoring",
      "Reporting suspicious matters",
      "Record keeping",
      "Staff training and screening",
      "Independent review",
    ],
    askAbout: [
      "who the AML/CTF compliance officer is",
      "what identity documents are accepted and who may sight them",
      "whether the agency acts for companies, trusts or overseas buyers",
    ],
    basis:
      "The Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (Cth) as it applies to real estate professionals, AUSTRAC guidance and the agency's own identity-check register. Do not state thresholds, deadlines or penalties. Tell the reader in one line to confirm current requirements against AUSTRAC guidance.",
  },
  {
    id: "open-home-safety",
    name: "Open home and inspection safety procedure",
    icon: "home",
    blurb: "Setting up, running and closing open homes and inspections safely.",
    why: "Agents meet strangers in empty properties. A procedure protects staff, visitors and the agency's WHS duties.",
    sections: [
      "Purpose and scope",
      "Before the open home",
      "Hazard check of the property",
      "Working alone and check-in",
      "Registering visitors",
      "Running the open home",
      "Emergencies and incidents",
      "Closing up and security",
      "Tenant and vendor notice",
      "Records",
      "Review",
    ],
    askAbout: [
      "how staff check in and out when working alone",
      "whether visitors sign in on paper or a device",
      "the first aid and emergency contacts the agency uses",
    ],
    basis:
      "The Work Health and Safety Act 2011 (NSW) duties of a business to workers and others, and the Property and Stock Agents Act 2002 (NSW) open home record requirements. Do not cite section numbers.",
  },
  {
    id: "key-management",
    name: "Key management procedure",
    icon: "clip",
    blurb:
      "Signing keys out and in, secure storage, copies, lost keys and audits.",
    why: "Keys are access to client homes. A tracked process protects clients and stops disputes about who held what.",
    sections: [
      "Purpose and scope",
      "Key storage and security",
      "Receiving keys",
      "Signing keys out and in",
      "Copies and codes",
      "Lost or unreturned keys",
      "Returning keys at the end of a listing or tenancy",
      "Regular key audits",
      "The keys register",
      "Roles and responsibilities",
      "Review",
    ],
    askAbout: [
      "where keys are physically stored",
      "how long a key may be out before it is chased",
      "who may authorise a key copy",
    ],
    basis:
      "The agency's duty of care to clients and the key register practices expected under the Property and Stock Agents Act 2002 (NSW). Do not cite section numbers.",
  },
  {
    id: "records-retention",
    name: "Records retention and security policy",
    icon: "book",
    blurb:
      "What records are kept, for how long, where, and how they are destroyed.",
    why: "Inspectors ask for records. Knowing what you keep, where, and for how long saves days of scrambling.",
    sections: [
      "Purpose and scope",
      "Records we keep",
      "How long we keep them",
      "Where and how records are stored",
      "Access and security",
      "Backups and recovery",
      "Inspection and audit access",
      "Secure disposal",
      "Roles and responsibilities",
      "Review",
    ],
    askAbout: [
      "whether records are held on paper, in a cloud system, or both",
      "who has access to trust and identity records",
      "how old records are destroyed today",
    ],
    basis:
      "The record keeping duties of the Property and Stock Agents Act 2002 (NSW) and its regulation, the Privacy Act 1988 (Cth) for security and destruction, and AML/CTF record keeping where it applies. Do not state retention periods as fact; use the phrase 'at least the period required by the relevant law' and leave a clearly marked line for the agency to confirm each period.",
  },
  {
    id: "code-of-conduct",
    name: "Code of conduct and ethics",
    icon: "users",
    blurb:
      "The standard every agent and staff member is held to, and what happens if it slips.",
    why: "A clear code gives staff a standard, helps supervision, and shows you take the licensee's duty to supervise seriously.",
    sections: [
      "Purpose and who it applies to",
      "Our values",
      "Acting honestly and in the client's interest",
      "Fair dealing and no misleading conduct",
      "Confidentiality",
      "Working with colleagues and the public",
      "Gifts and conflicts",
      "Supervision and training",
      "Raising concerns",
      "Breaches and consequences",
      "Acknowledgement",
    ],
    askAbout: [
      "the agency's values in a few words",
      "who staff raise concerns with",
      "how consequences for breaches are decided",
    ],
    basis:
      "The code of conduct for agents under the Property and Stock Agents Regulation (NSW) and the licensee's duty to supervise. Do not cite section numbers.",
  },
  {
    id: "material-facts-advertising",
    name: "Material facts, advertising and underquoting procedure",
    icon: "file",
    blurb:
      "Disclosing what a buyer or tenant needs to know, and pricing honestly.",
    why: "Underquoting and missed disclosures are among the most common breaches. This procedure is the check before anything goes live.",
    sections: [
      "Purpose and scope",
      "Material facts and disclosure",
      "Recording material facts",
      "Price guidance and underquoting",
      "Appraisals and evidence",
      "Reviewing the price during a campaign",
      "Checking advertising before it goes live",
      "Statements about the property",
      "Auctions and offers",
      "Records",
      "Roles and review",
    ],
    askAbout: [
      "who signs off advertising before it goes live",
      "how often prices are reviewed during a campaign",
      "whether the agency runs auctions",
    ],
    basis:
      "The Property and Stock Agents Act 2002 (NSW), its regulation and Fair Trading guidance on underquoting and disclosure, and the Australian Consumer Law on misleading conduct. Do not cite section numbers or penalties.",
  },
  {
    id: "incident-data-breach",
    name: "Incident and data breach response plan",
    icon: "alert",
    blurb:
      "What to do in the first hour, the first day and the first week of an incident.",
    why: "When something goes wrong, people freeze. A plan tells everyone who does what, and what must be reported.",
    sections: [
      "Purpose and scope",
      "What counts as an incident",
      "The response team",
      "First hour: contain and report",
      "Assessing the incident",
      "Notifying people and regulators",
      "Trust account and financial incidents",
      "Communications",
      "Recovery and review",
      "Records and the incident register",
      "Testing this plan",
    ],
    askAbout: [
      "who leads the response and who is the backup",
      "the IT or cloud providers that hold agency data",
      "who handles communications with clients and media",
    ],
    basis:
      "The notifiable data breaches scheme of the Privacy Act 1988 (Cth), the trust account duty to report irregularities under the Property and Stock Agents Act 2002 (NSW), and WHS incident duties. Do not state notification deadlines as fact beyond saying the agency must assess and notify as soon as practicable and within the legal time limits.",
  },
];

export const vaultById = (id: string) => VAULT.find((d) => d.id === id);

export type VaultDoc = {
  /** Same as the definition id: one current document per type. */
  id: string;
  title: string;
  content: string;
  createdAt: string;
  answers: { q: string; a: string }[];
  version: number;
};

export type VaultQuestion = {
  id: string;
  question: string;
  hint?: string;
  options?: string[];
};
