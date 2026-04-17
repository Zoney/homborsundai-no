import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const path = "/summit/2024";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Homborsund AI Conference — August 17, 2024";
  const description =
    "Back to basics: core AI ideas in a friendly setting. Talks, discussions and time to think.";
  const url = `${baseUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url, title, description, siteName: "Homborsund AI" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function Summit2024Layout({ children }: { children: React.ReactNode }) {
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Homborsund AI Conference (2024)",
    startDate: "2024-08-17",
    endDate: "2024-08-17",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    description:
      "Back to basics: core AI ideas in a friendly setting. Talks, discussions and time to think.",
    organizer: { "@type": "Organization", name: "Homborsund AI", url: baseUrl },
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
      { "@type": "ListItem", position: 3, name: "2024", item: `${baseUrl}${path}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}

