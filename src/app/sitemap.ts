import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/env";
import { routing } from "@/i18n/routing";

const publicPaths = ["", "/login", "/register"];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getAppUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of publicPaths) {
      const localizedPath = path ? `/${locale}${path}` : `/${locale}`;

      entries.push({
        url: `${baseUrl}${localizedPath}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.6,
      });
    }
  }

  return entries;
}
