import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const path = "/summit/2026.2";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Homborsund AI Summit 2026.2 — No Hype. Just Fire.";
  const description =
    "Seven talks: the state of AI in Agder, building something now, why industry is hard, real AI for leaders, LLM wikis for the enterprise, elders and politics, and one analogy to rule them all. Saturday 3 October 2026 at Vågsholt skole, Krømpe — doors 15:00, first talk 17:00, grill provided.";
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

export default function Summit2026_2Layout({ children }: { children: React.ReactNode }) {
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Homborsund AI Summit 2026.2 — No Hype. Just Fire.",
    startDate: "2026-10-03T15:00:00+02:00",
    doorTime: "2026-10-03T15:00:00+02:00",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Vågsholt skole",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Krømpe 16",
        postalCode: "4887",
        addressLocality: "Grimstad",
        addressCountry: "NO",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Homborsund AI",
      url: baseUrl,
    },
    url: `${baseUrl}${path}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Summit", item: `${baseUrl}/summit` },
      { "@type": "ListItem", position: 3, name: "2026.2", item: `${baseUrl}${path}` },
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
