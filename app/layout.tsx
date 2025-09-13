import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { WebVitals } from "@/lib/axiom/client";
import AuthProvider from "@/components/auth-provider";
import SiteHeader from "@/components/site-header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Homborsund AI",
    template: "%s | Homborsund AI",
  },
  description: "Thoughtful, friendly gatherings about AI agents, tools, and ideas — in nature.",
  applicationName: "Homborsund AI",
  authors: [{ name: "Homborsund AI" }],
  keywords: [
    "Homborsund AI",
    "AI Summit",
    "AI Conference",
    "AI Agents",
    "Robotics",
    "Multimodal AI",
    "Norway AI",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: baseUrl,
    siteName: "Homborsund AI",
    title: "Homborsund AI",
    description:
      "Thoughtful, friendly gatherings about AI agents, tools, and ideas — in nature.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@homborsund_ai",
    title: "Homborsund AI",
    description:
      "Thoughtful, friendly gatherings about AI agents, tools, and ideas — in nature.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebVitals />
        <AuthProvider>
          <SiteHeader />
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
