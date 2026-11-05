import type { MetadataRoute } from "next";
import { SITE_URL, VENUES, areasWithVenues } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/tao-keo`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/quan`, lastModified: now, priority: 0.9 },
    ...areasWithVenues().map((a) => ({ url: `${SITE_URL}/quan/${a.slug}`, lastModified: now, priority: 0.8 })),
    ...VENUES.map((v) => ({ url: `${SITE_URL}/q/${v.slug}`, lastModified: now, priority: 0.7 })),
  ];
}
