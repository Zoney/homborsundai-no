"use client";

import Link from "next/link";
import { DEFAULT_YEAR, SUMMIT_METADATA } from "@/lib/summit-config";

type SummitHeaderProps = {
  activeYear: string;
  title: string;
  date: string;
  theme: string;
  description: string[];
}

export function SummitHeader({ activeYear, title, date, theme, description }: SummitHeaderProps) {
  const summit = SUMMIT_METADATA[activeYear];
  const isUpcoming = summit.status === "Upcoming";
  const defaultSummitHref = `/summit/${DEFAULT_YEAR}`;
  const registrationHref = isUpcoming
    ? activeYear === "2025.2"
      ? `/summit/${activeYear}/register`
      : "https://chat.whatsapp.com/FWv18Iz2r59CuQb98LBuUQ"
    : defaultSummitHref;
  const primaryCtaLabel = isUpcoming ? "Register Now" : "View Upcoming Summit";

  return (
    <>
      <section className="w-full py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-row justify-center gap-3 md:gap-4 mb-10 md:mb-12">
            {Object.keys(SUMMIT_METADATA).map((summitYear) => (
              <Link
                key={summitYear}
                href={`/summit/${summitYear}`}
                className={`px-5 py-3 md:px-6 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeYear === summitYear
                    ? "bg-copperrose text-white shadow-lg"
                    : "bg-ferra-700 hover:bg-ferra-600 text-rosebud-200 border border-ferra-600"
                }`}
              >
                Summit {summitYear}
                {SUMMIT_METADATA[summitYear].status === "Upcoming" && summitYear === DEFAULT_YEAR && (
                  <span className="ml-2 text-xs bg-rosebud text-tarawera px-2 py-0.5 rounded-full">
                    Next
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose">
              {title}
            </h1>
            <p className="text-3xl md:text-4xl text-rosebud mb-2">{date}</p>
            <p className="text-xl md:text-2xl text-rosebud-200 max-w-3xl mb-6">{theme}</p>
            <div className="space-y-3">
              {description.map((paragraph, index) => (
                <p key={index} className="text-lg text-rosebud-300 max-w-2xl mx-auto">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full max-w-2xl mx-auto">
              <Link
                href={registrationHref}
                className={`inline-flex h-12 items-center justify-center rounded-lg px-8 text-base font-semibold shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rosebud focus-visible:ring-offset-tarawera ${
                  isUpcoming
                    ? "bg-gradient-to-r from-copperrose to-ferra hover:from-copperrose-600 hover:to-ferra-600 text-white"
                    : "bg-transparent border border-rosebud text-rosebud hover:bg-rosebud/10"
                }`}
              >
                {primaryCtaLabel}
              </Link>
              {isUpcoming && (
                <>
                  <Link
                    href="#schedule"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-ferra-500 px-8 text-base font-semibold text-rosebud-200 transition-colors hover:bg-ferra-700/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ferra focus-visible:ring-offset-tarawera"
                  >
                    View Schedule
                  </Link>
                  <Link
                    href="#venue"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-ferra-500 px-8 text-base font-semibold text-rosebud-200 transition-colors hover:bg-ferra-700/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ferra focus-visible:ring-offset-tarawera"
                  >
                    View Venue
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 
