import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import AuthProvider from "@/components/auth-provider"
import "./globals.css";
import { ensureFirebaseToConvexMigration } from "@/lib/migrate";

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
  // Run the Firebase -> Convex migration once; subsequent calls are no-ops.
  await ensureFirebaseToConvexMigration();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
