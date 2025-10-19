import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Homborsund AI Summits",
  description:
    "Explore upcoming and previous Homborsund AI summits. Find the next gathering and revisit the stories that shaped earlier editions.",
  alternates: { canonical: "/summit" },
  openGraph: {
    title: "Homborsund AI Summits",
    description:
      "Explore upcoming and previous Homborsund AI summits. Find the next gathering and revisit the stories that shaped earlier editions.",
    url: `${baseUrl}/summit`,
  },
};

type SummitEntry = {
  year: string;
  title: string;
  date: string;
  theme: string;
  status: "Upcoming" | "Completed";
};

function sortSummits() {
  const entries: SummitEntry[] = Object.entries(SUMMIT_METADATA).map(([year, meta]) => ({
    year,
    title: meta.title,
    date: meta.date,
    theme: meta.theme,
    status: meta.status,
  }));

  const upcoming = entries
    .filter((entry) => entry.status === "Upcoming")
    .sort((a, b) => parseFloat(a.year) - parseFloat(b.year));

  const completed = entries
    .filter((entry) => entry.status === "Completed")
    .sort((a, b) => parseFloat(b.year) - parseFloat(a.year));

  return { upcoming, completed };
}

export default function SummitIndexPage() {
  const { upcoming, completed } = sortSummits();

  return (
    <main className="flex min-h-screen flex-col bg-gradient-cool text-white">
      <section className="w-full py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose">
              Homborsund AI Summits
            </h1>
            <p className="text-lg md:text-xl text-rosebud-200">
              The coastline gatherings where we test agentic ideas, share field notes, build together and stay honest
              about what actually ships. Browse the next summit or dive into the archives to catch up.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          {upcoming.length > 0 && (
            <div className="mb-12 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-rosebud-200">
                    Upcoming
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-rosebud-50 mt-2">Next gatherings</h2>
                </div>
                <span className="text-sm text-rosebud-200">{upcoming.length} event{upcoming.length > 1 ? "s" : ""}</span>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {upcoming.map((summit) => {
                  const summitMeta = SUMMIT_METADATA[summit.year];
                  const ctaHref = summitMeta?.cta?.href ?? `/summit/${summit.year}`;
                  const ctaLabel = summitMeta?.cta?.label ?? "View details";

                  return (
                    <Card key={summit.year} className="bg-ferra border-ferra-600 shadow-lg">
                      <CardHeader className="flex flex-col gap-2">
                        <div className="inline-flex items-center gap-2 text-sm text-rosebud-300">
                          <CalendarDays className="h-4 w-4" aria-hidden />
                          <span>{summit.date}</span>
                        </div>
                        <CardTitle className="text-2xl text-rosebud-50">Summit {summit.year}</CardTitle>
                        <CardDescription className="text-rosebud-200">{summit.title}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-rosebud-200 text-sm leading-relaxed">{summit.theme}</p>
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/summit/${summit.year}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-rosebud-100 hover:text-rosebud"
                          >
                            Learn more
                            <ArrowRight className="h-4 w-4" aria-hidden />
                          </Link>
                          <Button asChild size="sm" className="bg-copperrose hover:bg-copperrose-600 text-white">
                            <Link href={ctaHref}>{ctaLabel}</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-rosebud-200">
                Previous summits
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-rosebud-50 mt-2">Archive</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completed.map((summit) => (
                <Card key={summit.year} className="bg-ferra border-ferra-600 shadow-md">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-xl text-rosebud-50">Summit {summit.year}</CardTitle>
                    <CardDescription className="text-rosebud-200">{summit.title}</CardDescription>
                    <span className="text-sm text-rosebud-300">{summit.date}</span>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-rosebud-200 text-sm leading-relaxed">{summit.theme}</p>
                    <Link
                      href={`/summit/${summit.year}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-rosebud-100 hover:text-rosebud"
                    >
                      View recap
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
