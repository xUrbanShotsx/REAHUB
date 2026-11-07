import { fmtDate } from "./format";
import type { Approval } from "./vault";

/** A small markdown subset used for generated policy documents. Everything else stays plain text. */

export type DocBlock = {
  kind: "h1" | "h2" | "h3" | "p" | "ul" | "ol" | "hr";
  lines: string[];
};

export function parseDoc(src: string): DocBlock[] {
  const blocks: DocBlock[] = [];
  let cur: DocBlock | null = null;
  const push = (kind: DocBlock["kind"], line: string) => {
    if (cur && cur.kind === kind) cur.lines.push(line);
    else {
      cur = { kind, lines: [line] };
      blocks.push(cur);
    }
  };
  for (const raw of src.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      cur = null;
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^(#{1,3})\s+(.*)$/))) {
      cur = null;
      blocks.push({
        kind: m[1].length === 1 ? "h1" : m[1].length === 2 ? "h2" : "h3",
        lines: [m[2]],
      });
    } else if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
      cur = null;
      blocks.push({ kind: "hr", lines: [] });
    } else if (/^\s*[-*]\s+/.test(line))
      push("ul", line.replace(/^\s*[-*]\s+/, ""));
    else if (/^\s*\d+[.)]\s+/.test(line))
      push("ol", line.replace(/^\s*\d+[.)]\s+/, ""));
    else push("p", line);
  }
  return blocks;
}

/** Heading text of every level 2 heading, in order. Used for the progress rail. */
export const sectionTitles = (src: string) =>
  parseDoc(src)
    .filter((b) => b.kind === "h2")
    .map((b) => b.lines[0].replace(/\*\*/g, ""));

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const inlineHtml = (s: string) =>
  esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

/** Plain HTML that Word opens as a document. */
export function docToHtml(
  title: string,
  src: string,
  approval?: Approval & { version: number },
): string {
  const body = parseDoc(src)
    .map((b) => {
      const li = (l: string) => `<li>${inlineHtml(l)}</li>`;
      switch (b.kind) {
        case "h1":
          return `<h1>${inlineHtml(b.lines[0])}</h1>`;
        case "h2":
          return `<h2>${inlineHtml(b.lines[0])}</h2>`;
        case "h3":
          return `<h3>${inlineHtml(b.lines[0])}</h3>`;
        case "ul":
          return `<ul>${b.lines.map(li).join("")}</ul>`;
        case "ol":
          return `<ol>${b.lines.map(li).join("")}</ol>`;
        case "hr":
          return "<hr/>";
        default:
          return `<p>${inlineHtml(b.lines.join(" "))}</p>`;
      }
    })
    .join("\n");
  const sign = approval
    ? `<hr/><h2>Approval</h2><img src="${approval.signature}" alt="Signature" height="70"/><p><strong>${esc(approval.name)}</strong>, ${esc(approval.role)}<br/>Approved ${fmtDate(approval.date)} &middot; Version ${approval.version}.0 &middot; Next review ${fmtDate(approval.nextReview)}<br/>Fingerprint ${esc(approval.fingerprint)}</p>`
    : `<hr/><h2>Approval</h2><p>Signature: ______________________ &nbsp; Name and position: ______________________ &nbsp; Date: ____________</p><p><em>Awaiting approval. Not yet in force.</em></p>`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.5;color:#1a2238}h1{font-size:22pt;margin:0 0 12pt}h2{font-size:14pt;margin:18pt 0 6pt;color:#2a47d6}h3{font-size:12pt;margin:12pt 0 4pt}</style></head><body>${body}\n${sign}</body></html>`;
}
