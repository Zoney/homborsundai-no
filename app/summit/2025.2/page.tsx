"use client";

import { useEffect } from "react";
import { SummitHeader, SummitSchedule, SummitSpeakers, SummitVenue, SummitRegistration } from "@/components/shared";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2025.2";

export default function Summit2025_2Page() {
  const summitInfo = SUMMIT_METADATA[YEAR];
  
  // Inline summit content
  const description = [
    "Our third gathering pushes AI into the physical world with robots, drones and more.",
    "Expect shiny demos and hands-on sessions powered by the latest agentic models.",
    "Full program will drop after the summer—keep your calendars open!"
  ];

  const schedule = [
    { time: "16:00 - 17:00", event: "Arrival, snacks and mingling" },
    { time: "17:00 - 18:00", event: "Keynote: 'Agents Everywhere'" },
    { time: "18:00 - 19:30", event: "Demo Jam & Breakouts" },
    { time: "19:30 - Late", event: "BBQ, bonfire and lightning talks" }
  ];

  // Add smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);


  return (
    <main className="flex flex-col min-h-screen bg-gradient-cool text-white">
      <SummitHeader 
        activeYear={YEAR} 
        title={summitInfo.title}
        date={summitInfo.date}
        theme={summitInfo.theme}
        description={description}
      />
      <SummitSchedule schedule={schedule} />
      <SummitSpeakers activeYear={YEAR} />
      <SummitVenue activeYear={YEAR} />
      <SummitRegistration activeYear={YEAR} status={summitInfo.status} />
    </main>
  );
} 