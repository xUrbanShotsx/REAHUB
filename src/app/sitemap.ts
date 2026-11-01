import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { abs, LAST_UPDATED } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(LAST_UPDATED);
  const core: [
    string,
    number,
    MetadataRoute.Sitemap[number]["changeFrequency"],
  ][] = [
    ["/", 1, "weekly"],
    ["/pricing", 0.9, "weekly"],
    ["/solutions", 0.8, "monthly"],
    ["/demo", 0.8, "monthly"],
    ["/about", 0.6, "monthly"],
    ["/resources", 0.6, "monthly"],
    ["/guides", 0.8, "weekly"],
  ];
  return [
    ...core.map(([path, priority, changeFrequency]) => ({
      url: abs(path),
      lastModified,
      changeFrequency,
      priority,
    })),
    ...guides.map((g) => ({
      url: abs(`/guides/${g.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
