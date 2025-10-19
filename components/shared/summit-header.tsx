"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DEFAULT_YEAR, SUMMIT_METADATA } from "@/lib/summit-config";

const WHATSAPP_COMMUNITY_LINK = "https://chat.whatsapp.com/FWv18Iz2r59CuQb98LBuUQ";

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

  const primaryCta = summit.cta || (isUpcoming
    ? {
        label: "Join the Community",
        href: WHATSAPP_COMMUNITY_LINK,
        isExternal: true,
        type: "community" as const,
        description: "Hop into the WhatsApp group to catch live updates and invitations.",
      }
    : {
        label: "View Upcoming Summit",
        href: defaultSummitHref,
        type: "register" as const,
      });

  const primaryCtaClasses = `inline-flex h-12 items-center justify-center rounded-lg px-8 text-base font-semibold shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rosebud focus-visible:ring-offset-tarawera ${
    isUpcoming
      ? "bg-gradient-to-r from-copperrose to-ferra hover:from-copperrose-600 hover:to-ferra-600 text-white"
      : "bg-transparent border border-rosebud text-rosebud hover:bg-rosebud/10"
  }`;

  const secondaryLinks = isUpcoming
    ? [
        { label: "View Schedule", href: "#schedule" },
        { label: "View Venue", href: "#venue" },
      ]
    : [];

  return (
    <>
      <section className="w-full py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
            <div className="flex w-full items-center justify-between gap-4">
              <Link
                href="/summit"
                className="inline-flex items-center gap-2 text-sm font-medium text-rosebud-200 transition-colors hover:text-rosebud"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                All summits
              </Link>
              <span className="inline-flex items-center rounded-full border border-rosebud/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rosebud-200">
                {summit.status}
              </span>
            </div>
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
              
              {primaryCta.description && (
                <p className="w-full text-xs text-rosebud-300 text-center sm:text-left">
                  {primaryCta.description}
                </p>
              )}
              {isUpcoming && (
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full">
                  {secondaryLinks.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="inline-flex h-12 flex-1 min-w-[180px] items-center justify-center rounded-lg border border-ferra-500 px-6 text-base font-semibold text-rosebud-200 transition-colors hover:bg-ferra-700/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ferra focus-visible:ring-offset-tarawera"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 
