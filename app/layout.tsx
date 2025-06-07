import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import AuthProvider from "@/components/auth-provider";
import { NextIntlClientProvider } from "next-intl";
import staticMessages from "../messages/en.json";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: staticMessages.Layout.title,
  description: staticMessages.Layout.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = (await import("../messages/en.json")).default as any;
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale="en">
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
