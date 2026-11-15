import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icons";
import { HELP, helpById } from "@/lib/help";
import { Markdown } from "../../assistant/Markdown";

export function generateStaticParams() {
  return HELP.map((a) => ({ article: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ article: string }>;
}): Promise<Metadata> {
  const { article } = await params;
  return { title: helpById(article)?.title ?? "Help" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ article: string }>;
}) {
  const { article } = await params;
  const a = helpById(article);
  if (!a) notFound();
  const related = HELP.filter(
    (x) => x.category === a.category && x.id !== a.id,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <article className="min-w-0 max-w-2xl">
        <Link
          href="/dashboard/help"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" /> Help
        </Link>
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          {a.category}
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          {a.title}
        </h1>
        <p className="mt-2 text-ink-soft">{a.summary}</p>

        <div className="help-body mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-7">
          <Markdown text={a.body} />
        </div>

        {a.open && (
          <Link
            href={a.open.href}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg hover:bg-ink/85"
          >
            {a.open.label} <Icon name="arrow" className="h-4 w-4" />
          </Link>
        )}
      </article>

      <aside className="space-y-4 lg:pt-10">
        {related.length > 0 && (
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              More in {a.category}
            </p>
            <ul className="mt-2 space-y-1">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/dashboard/help/${r.id}`}
                    className="block rounded-lg px-2 py-1.5 text-sm font-semibold hover:bg-tint"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-sm font-bold">Still stuck?</p>
          <p className="mt-1 text-[13px] text-ink-soft">
            Ask Assistance in plain words.
          </p>
          <Link
            href="/dashboard/assistant"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent underline-offset-2 hover:underline"
          >
            <Icon name="sparkle" className="h-4 w-4" /> Ask Assistance
          </Link>
        </div>
      </aside>
    </div>
  );
}
