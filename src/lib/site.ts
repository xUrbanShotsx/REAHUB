import type { Metadata } from "next";

/** Set NEXT_PUBLIC_SITE_URL in the host environment to the live domain. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reahub.com.au"
).replace(/\/$/, "");
export const SITE_NAME = "REAHUB";
export const SITE_TAGLINE = "Real estate compliance software for NSW agencies";
export const SITE_DESCRIPTION =
  "REAHUB keeps NSW real estate agencies audit-ready: one file per property, sales and rentals trust accounting, seven compliance registers, licence and CPD alerts, and an audit log that cannot be edited.";
/** Last content update, used by the sitemap and structured data. */
export const LAST_UPDATED = "2026-11-01";

export const abs = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

/** Per-page metadata with canonical URL, Open Graph and Twitter cards. */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: abs(path),
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_AU",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
