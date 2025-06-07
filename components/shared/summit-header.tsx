"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { DEFAULT_YEAR, SUMMIT_METADATA, type SummitMetadata } from "@/lib/summit-config";

type SummitHeaderProps = {
  activeYear: string;
  title: string;
  date: string;
  theme: string;
  description: string[];
}

export function SummitHeader({ activeYear, title, date, theme, description }: SummitHeaderProps) {
  const t = useTranslations('Shared');
  return (
    <>
      {/* Back to Home Link */}
      <div className="w-full pt-6 pb-2">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-rosebud-200 hover:text-rosebud transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="text-sm font-medium">{t('backToHome')}</span>
          </Link>
        </div>
      </div>

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
                {t('summitLabel', { year: summitYear })}
                {SUMMIT_METADATA[summitYear].status === "Upcoming" && summitYear === DEFAULT_YEAR && (
                  <span className="ml-2 text-xs bg-rosebud text-tarawera px-2 py-0.5 rounded-full">
                    {t('nextBadge')}
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
          </div>
        </div>
      </section>
    </>
  );
} 