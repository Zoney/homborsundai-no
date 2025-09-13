import type { MetadataRoute } from "next";
import { SUMMIT_METADATA } from "@/lib/summit-config";
import { NOTES } from "@/lib/notes";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const summitEntries = Object.keys(SUMMIT_METADATA).map((year) => ({
    url: `${baseUrl}/summit/${year}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const noteEntries = [
    {
      url: `${baseUrl}/notes`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...NOTES.map((n) => ({
      url: `${baseUrl}/notes/${n.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${baseUrl}/summit`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...summitEntries,
    ...noteEntries,
  ];
}

