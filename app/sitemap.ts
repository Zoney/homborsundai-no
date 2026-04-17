import type { MetadataRoute } from "next";
import { SUMMIT_METADATA } from "@/lib/summit-config";
import { NOTES } from "@/lib/notes";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestSummitDate = Object.values(SUMMIT_METADATA)
    .map((s) => new Date(s.lastModified))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const summitEntries = Object.entries(SUMMIT_METADATA).map(([year, summit]) => ({
    url: `${baseUrl}/summit/${year}`,
    lastModified: new Date(summit.lastModified),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const latestNoteDate = NOTES.length
    ? new Date(NOTES.sort((a, b) => b.date.localeCompare(a.date))[0].date)
    : latestSummitDate;

  const noteEntries = [
    {
      url: `${baseUrl}/notes`,
      lastModified: latestNoteDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...NOTES.map((n) => ({
      url: `${baseUrl}/notes/${n.slug}`,
      lastModified: new Date(n.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  return [
    {
      url: baseUrl,
      lastModified: latestSummitDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${baseUrl}/summit`, lastModified: latestSummitDate, changeFrequency: "weekly", priority: 0.9 },
    ...summitEntries,
    ...noteEntries,
  ];
}

