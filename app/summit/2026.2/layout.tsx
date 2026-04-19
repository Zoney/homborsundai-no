import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const path = "/summit/2026.2";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Homborsund AI Summit 2026.2 — To space! We'll need it!";
  const description =
    "The next Homborsund AI Summit is being sketched. No date yet, no agenda yet — leave your details and we'll reach out once it takes shape.";
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
