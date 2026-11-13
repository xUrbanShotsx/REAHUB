import type { VaultDef, VaultQuestion } from "./vault";

/** Used only when the AI writer is not connected, so the whole flow can still be seen. */
export function sampleQuestions(def: VaultDef): VaultQuestion[] {
  const q = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return def.askAbout.slice(0, 3).map((a, i) => ({
    id: `q${i + 1}`,
    question: `${q(a)}?`,
    hint: i === 0 ? "Sample question" : undefined,
  }));
}

const addYear = (iso: string) =>
  `${Number(iso.slice(0, 4)) + 1}${iso.slice(4)}`;

export function sampleDoc(
  def: VaultDef,
  a: { agency: string; entity: string; owner: string; today: string },
): string {
  const lines: string[] = [
    `# ${def.name}`,
    "",
    `- **Agency:** ${a.entity}`,
    `- **Document owner:** ${a.owner}, Licensee in charge`,
    "- **Version:** 1.0",
    `- **Effective date:** ${a.today}`,
    `- **Next review date:** ${addYear(a.today)}`,
    "",
  ];
  def.sections.forEach((s, i) => {
    lines.push(
      `## ${i + 1}. ${s}`,
      "",
      `${a.agency} takes this part of the ${def.name.toLowerCase()} seriously. This section explains what we do, who is responsible, and how we keep a record so the work can be shown to a client, an auditor or NSW Fair Trading when asked.`,
      "",
      "1. The responsible person is named in this document and is told when it changes.",
      "2. Each step is carried out the same day it is needed and recorded in REAHUB.",
      "3. Anything unusual is raised with the **licensee in charge** straight away.",
      "",
      "- Written in plain language so every team member can follow it",
      "- Reviewed whenever the law, our systems or our team changes",
      "",
    );
  });
  lines.push(
    `## ${def.sections.length + 1}. Items to confirm before adoption`,
    "",
    "- This is sample text. Every section needs to be replaced with wording written for your agency.",
    "- Confirm each legal point, time limit and form with NSW Fair Trading or your adviser.",
    "",
    "---",
    "",
    "Review this document with your own adviser before adopting it.",
  );
  return lines.join("\n");
}
