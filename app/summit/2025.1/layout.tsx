import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const path = "/summit/2025.1";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Homborsund AI Summit — 3. Mai 2025";
  const description =
    "Agentic & multimodal AI beyond GenAI, o4‑mini, Claude, Grok — with panels, workshops and campfire talks.";
  const url = `${baseUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url, title, description, siteName: "Homborsund AI" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function Summit2025_1Layout({ children }: { children: React.ReactNode }) {
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Homborsund AI Summit (2025.1)",
    startDate: "2025-05-03",
    endDate: "2025-05-03",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    description:
      "Agentic & multimodal AI beyond GenAI, o4‑mini, Claude, Grok — with panels, workshops and campfire talks.",
    organizer: { "@type": "Organization", name: "Homborsund AI", url: baseUrl },
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
      { "@type": "ListItem", position: 3, name: "2025.1", item: `${baseUrl}${path}` },
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

