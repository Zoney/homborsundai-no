import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import AuthProvider from "@/components/auth-provider"
import SiteHeader from "@/components/site-header"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Homborsund AI Conference",
  description: "No tech allowed, just you and your curiosity.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SiteHeader />
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
