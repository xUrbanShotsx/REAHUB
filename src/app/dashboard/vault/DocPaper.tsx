import type { ReactNode } from "react";
import { parseDoc } from "@/lib/doc-markdown";

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className="font-bold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

/**
 * The document as a page. Blocks are keyed by position, so while text streams in only newly started
 * blocks mount, and each one fades up once. `caret` puts the glowing pen at the end of the last block.
 */
export function DocPaper({
  text,
  caret = false,
  animate = false,
}: {
  text: string;
  caret?: boolean;
  animate?: boolean;
}) {
  const blocks = parseDoc(text);
  const pen = <span className="vault-caret" aria-hidden="true" />;
  const enter = animate ? "vault-in" : "";
  return (
    <article
      className={`text-[15px] leading-[1.7] text-ink/90 ${animate ? "" : "vault-static"}`}
    >
      {blocks.map((b, i) => {
        const last = caret && i === blocks.length - 1;
        switch (b.kind) {
          case "h1":
            return (
              <h1
                key={i}
                className={`${enter} font-display text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-[1.9rem]`}
              >
                {inline(b.lines[0])}
                {last && pen}
              </h1>
            );
          case "h2":
            return (
              <h2
                key={i}
                className={`${enter} vault-h2 mt-9 font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl`}
              >
                {inline(b.lines[0])}
                {last && pen}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className={`${enter} mt-5 font-display text-base font-bold text-ink`}
              >
                {inline(b.lines[0])}
                {last && pen}
              </h3>
            );
          case "hr":
            return <hr key={i} className={`${enter} my-8 border-line`} />;
          case "ul":
            return (
              <ul
                key={i}
                className={`${enter} mt-3 list-disc space-y-1.5 pl-5 marker:text-accent`}
              >
                {b.lines.map((l, j) => (
                  <li key={j}>
                    {inline(l)}
                    {last && j === b.lines.length - 1 && pen}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol
                key={i}
                className={`${enter} mt-3 list-decimal space-y-1.5 pl-5 marker:font-bold marker:text-accent`}
              >
                {b.lines.map((l, j) => (
                  <li key={j}>
                    {inline(l)}
                    {last && j === b.lines.length - 1 && pen}
                  </li>
                ))}
              </ol>
            );
          default:
            return (
              <p key={i} className={`${enter} mt-3`}>
                {inline(b.lines.join(" "))}
                {last && pen}
              </p>
            );
        }
      })}
      {caret && blocks.length === 0 && <p>{pen}</p>}
    </article>
  );
}
