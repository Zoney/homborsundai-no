import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const path = "/summit/2026.1";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Homborsund AI Summit — 18. april 2026 — Proof of Human";
  const description =
    "AI is coming in every form — agents, humanoids, and things we haven't named yet. Five speakers. One question: what's left for us to do? Homborsund, April 18th.";
  const url = `${baseUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Homborsund AI",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Summit2026_1Layout({ children }: { children: React.ReactNode }) {
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Homborsund AI Summit (2026.1)",
    startDate: "2026-04-18",
    endDate: "2026-04-18",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    description:
      "Proof of Human — AI is arriving in every form. Five speakers ask what's left for us to do.",
    organizer: {
      "@type": "Organization",
      name: "Homborsund AI",
      url: baseUrl,
    },
    location: {
      "@type": "Place",
      name: "Homborsund Community Center (Vågsholt skole)",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Krømpe 16",
        postalCode: "4887",
        addressLocality: "Grimstad",
        addressRegion: "Agder",
        addressCountry: "NO",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 58.2926,
        longitude: 8.5086,
      },
    },
    url: `${baseUrl}${path}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Summit", item: `${baseUrl}/summit` },
      { "@type": "ListItem", position: 3, name: "2026.1", item: `${baseUrl}${path}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}

