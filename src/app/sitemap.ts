import type { MetadataRoute } from "next";
import { lastUpdated, siteUrl } from "@/app/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: lastUpdated,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
