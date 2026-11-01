import {
  abs,
  LAST_UPDATED,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "./site";

export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: abs("/logo.svg"),
  description: SITE_DESCRIPTION,
  areaServed: {
    "@type": "AdministrativeArea",
    name: "New South Wales, Australia",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "Briesa",
    url: "https://briesa.com",
  },
};

export const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "en-AU",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const plans = [
  ["Agent Pro", 99, "One sales team inside an agency, up to 5 people."],
  ["Boutique", 249, "A single-office agency, up to 40 people and four teams."],
  [
    "Large",
    369,
    "A large or multi-branch agency, up to 80 people and eight teams.",
  ],
] as const;

export const software = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: SITE_NAME,
  applicationCategory: "BusinessApplication",
  applicationSubCategory:
    "Real estate compliance and trust accounting software",
  operatingSystem: "Web",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  inLanguage: "en-AU",
  areaServed: "AU-NSW",
  featureList: [
    "One file per property",
    "Sales and rentals trust accounting with monthly reconciliation",
    "Seven compliance registers",
    "Licence and CPD alerts at 90, 60, 30 and 7 days",
    "Policy library with sign-off by person and version",
    "Immutable audit log and one-click audit pack export",
  ],
  offers: plans.map(([name, price, description]) => ({
    "@type": "Offer",
    name,
    description,
    price: String(price),
    priceCurrency: "AUD",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: String(price),
      priceCurrency: "AUD",
      unitText: "MONTH",
      valueAddedTaxIncluded: false,
    },
    url: abs("/pricing"),
    availability: "https://schema.org/InStock",
  })),
};

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function faqPage(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function article({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: abs(path),
    inLanguage: "en-AU",
    datePublished: LAST_UPDATED,
    dateModified: LAST_UPDATED,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
