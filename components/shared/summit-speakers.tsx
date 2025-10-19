"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SUMMIT_METADATA } from "@/lib/summit-config";

type SummitSpeakersProps = {
  activeYear: string;
};

type Speaker = {
  name: string;
  description: string;
  activeFrom?: string;
};

const DEFAULT_SPEAKERS: Speaker[] = [
  { name: "Eivind", description: "Random TOGAF nerd" },
  { name: "Øyvind", description: "Random dev nerd" },
  { name: "Rebekka (please come!)", description: "Random AI nerd" },
  { name: "Jan", description: "Random car buyer who keeps poking holes in insecure AI" },
  { name: "Nina", description: "Random UX freak" },
  { name: "Lars", description: "Random ERP nerd" },
  { name: "Michael", description: "Random community catalyst" },
  { name: "Håvard", description: "Random DevOps ghost" },
  { name: "Anders", description: "Random GPU addict", activeFrom: "2026.1" },
  { name: "Cathrine", description: "Random island GOAT", activeFrom: "2026.1" },
  { name: "Ben", description: "Mr 1st draft", activeFrom: "2026.1" },
  { name: "Nina", description: "Random earth traveller", activeFrom: "2026.1" },
  { name: "Erik", description: "Enterprise Architecture & economic wiz" },
  { name: "Øystein", description: "Random systems thinker", activeFrom: "2025.2" },
  { name: "Knut", description: "Random chatty boat maker", activeFrom: "2025.2" },
  { name: "And you!", description: "..." },
  { name: "Ofc, you!", description: "...." },
];

function getInitials(name: string): string {
  const matches = name
    .replace(/\(.*?\)/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return matches || name.slice(0, 2).toUpperCase();
}

export function SummitSpeakers({ activeYear }: SummitSpeakersProps) {
  const yearNumeric = Number.parseFloat(activeYear);

  const speakers = useMemo(() => {
    const metadataSpeakers = SUMMIT_METADATA[activeYear]?.speakers ?? [];
    const base = DEFAULT_SPEAKERS.filter((speaker) => {
      if (!speaker.activeFrom) return true;
      const minYear = Number.parseFloat(speaker.activeFrom);
      return !Number.isNaN(minYear) && yearNumeric >= minYear;
    });
    const merged = [...metadataSpeakers, ...base];

    return merged;
  }, [activeYear, yearNumeric]);

  return (
    <section id="speakers" className="w-full py-12 md:py-16 scroll-mt-16 bg-tarawera bg-opacity-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-12">
          <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm">Speakers</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose mb-3">
            Meet the Speakers
          </h2>
          <p className="max-w-[700px] text-rosebud-200 md:text-lg">
            Learn from industry experts, field builders and the occasional chaos agent.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {speakers.map((speaker) => (
            <Card
              key={`${activeYear}-${speaker.name}`}
              className="flex transform flex-col items-center rounded-xl border-ferra-600 bg-ferra p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-rosebud/30"
            >
              <Avatar className="mb-6 h-32 w-32 border-4 border-ferra-700 shadow-md">
                <AvatarImage src="/placeholder.svg" alt={speaker.name} />
                <AvatarFallback className="bg-ferra-600 text-2xl text-rosebud-200">
                  {getInitials(speaker.name)}
                </AvatarFallback>
              </Avatar>
              <h3 className="mb-1 text-2xl font-semibold text-rosebud-100">{speaker.name}</h3>
              <p className="text-sm text-copperrose">{speaker.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
