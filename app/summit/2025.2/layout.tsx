import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const path = "/summit/2025.2";

export const revalidate = 86400; // cache for 1 day

export async function generateMetadata(): Promise<Metadata> {
  const title = "Homborsund AI Festival — 18. oktober 2025";
  const description =
    "Agents with real‑world elbows: robots, drones and tools. Talks, demos, BBQ and bonfire in Homborsund.";
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

export default function Summit2025_2Layout({ children }: { children: React.ReactNode }) {
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Homborsund AI Festival (2025.2)",
    startDate: "2025-10-18",
    endDate: "2025-10-18",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    description:
      "Agents with real‑world elbows: robots, drones and tools. Talks, demos, BBQ and bonfire in Homborsund.",
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
        streetAddress: "Vågsholt skole",
        addressLocality: "Krømpe",
        addressCountry: "NO",
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
      { "@type": "ListItem", position: 3, name: "2025.2", item: `${baseUrl}${path}` },
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

