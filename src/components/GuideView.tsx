import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/Icons";
import { CtaBand, Eyebrow, PageHeader } from "@/components/Sections";
import { guideBySlug, NOT_ADVICE } from "@/lib/guides";
import { article, breadcrumbs, faqPage } from "@/lib/schema";
import { abs, pageMeta } from "@/lib/site";

export function guideMetadata(slug: string): Metadata {
  const g = guideBySlug(slug);
  if (!g) return {};
  const base = pageMeta({
    title: g.title,
    description: g.description,
    path: `/guides/${g.slug}`,
    type: "article",
  });
  const image = {
    url: abs(`/og/${g.slug}`),
    width: 1200,
    height: 630,
    alt: g.h1,
  };
  return {
    ...base,
    openGraph: { ...base.openGraph, images: [image] },
    twitter: { ...base.twitter, images: [image.url] },
  };
}

export function GuideView({ slug }: { slug: string }) {
  const g = guideBySlug(slug);
  if (!g) notFound();
  const path = `/guides/${g.slug}`;
  const related = g.related
    .map((s) => guideBySlug(s))
    .filter((x): x is NonNullable<typeof x> => !!x);

  return (
    <>
      <JsonLd
        data={[
          article({ title: g.h1, description: g.description, path }),
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: g.h1, path },
          ]),
          faqPage(g.faqs),
        ]}
      />

      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-6xl px-5 pt-8 text-sm text-ink-soft sm:px-8"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/guides" className="hover:text-ink">
              Guides
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="truncate text-ink">
            {g.category}
          </li>
        </ol>
      </nav>

      <PageHeader eyebrow={g.category} title={g.h1}>
        {g.intro}
      </PageHeader>

      <article className="mx-auto mt-14 max-w-3xl px-5 sm:px-8">
        {g.sections.map((s) => (
          <section key={s.h} data-reveal className="mt-12 first:mt-0">
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight">
              {s.h}
            </h2>
            {s.p.map((t) => (
              <p key={t} className="mt-4 text-lg text-ink-soft">
                {t}
              </p>
            ))}
            {s.bullets && (
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 py-3 font-medium"
                  >
                    <Icon name="check" className="mt-1 h-4 w-4 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section data-reveal className="mt-16">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="mt-6 border-t border-ink">
            {g.faqs.map((f) => (
              <details key={f.q} className="group border-b border-line py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold">
                  {f.q}
                  <span className="font-mono text-lg transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-10 text-sm text-ink-soft">{NOT_ADVICE}</p>
      </article>

      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <h2 className="font-display text-2xl font-bold">Keep reading</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {related.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/guides/${r.slug}`}
                className="row-hover block border-t border-ink py-4"
              >
                <span className="eyebrow">{r.category}</span>
                <span className="mt-2 block font-display text-xl font-bold leading-snug">
                  {r.h1}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink-soft">
          See how it works in{" "}
          <Link href="/solutions" className="underline">
            solutions
          </Link>
          , compare{" "}
          <Link href="/pricing" className="underline">
            pricing
          </Link>
          , or{" "}
          <Link href="/demo" className="underline">
            book a demo
          </Link>
          .
        </p>
      </section>

      <CtaBand />
    </>
  );
}
