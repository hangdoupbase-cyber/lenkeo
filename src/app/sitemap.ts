import type { MetadataRoute } from "next";
import { getGuides } from "@/lib/sanity";
import { SITE_URL, VENUES, areasWithVenues } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const guides = await getGuides();
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/tao-keo`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/quan`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/goc-chill`, lastModified: now, priority: 0.8 },
    ...guides.map((g) => ({ url: `${SITE_URL}/goc-chill/${g.slug}`, lastModified: g.publishedAt ? new Date(g.publishedAt) : now, priority: 0.7 })),
    ...areasWithVenues().map((a) => ({ url: `${SITE_URL}/quan/${a.slug}`, lastModified: now, priority: 0.8 })),
    ...VENUES.map((v) => ({ url: `${SITE_URL}/q/${v.slug}`, lastModified: now, priority: 0.7 })),
  ];
}
