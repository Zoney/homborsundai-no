"use client";

import { useEffect } from "react";
import { SummitHeader, SummitSchedule, SummitSpeakers, SummitVenue, SummitRegistration } from "@/components/shared";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2025.2";

export default function Summit2025_2Page() {
  const summitInfo = SUMMIT_METADATA[YEAR];
  
  // Inline summit content
  const description = [
    "Agents are still the stars — now with more real-world elbows: robots, drones and tools.",
    "Three fresh talks to kick things off: ‘Do we have time to wait?’ (Michael), ‘Why start something in 2025?’ (Knut), ‘What I talk about when I talk about Context Engineering’ (Øyvind).",
    "Come for the ideas, stay for the demos, BBQ and that friendly ‘let’s build it together’ vibe."
  ];

  const schedule = [
    { time: "16:30 - 17:15", event: "Arrival, snacks and hello-there high‑fives" },
    { time: "17:15 - 17:25", event: "Kickoff & tiny Agents update" },
    { time: "17:30 - 18:00", event: "Talk: 'Do we have time to wait?' — Michael" },
    { time: "18:05 - 18:35", event: "Talk: 'Why start something in 2025?' — Knut" },
    { time: "18:40 - 19:10", event: "Talk: 'What I talk about when I talk about Context Engineering' — Øyvind" },
    { time: "19:10 - 19:45", event: "Dinner break, demos and good conversations" },
    { time: "19:45 - 20:45", event: "Demo Jam & Breakouts (agents, robots, tools)" },
    { time: "20:45 - 21:30", event: "Lightning talks & open Q&A" },
    { time: "21:30 - 22:00", event: "Bonfire, plans and see‑you‑soon goodbyes" }
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
      <SummitSchedule 
        schedule={schedule}
        note={"Times are tentative — topics are done when they’re done. We’re not in a hurry."}
      />
      <SummitSpeakers activeYear={YEAR} />
      <SummitVenue activeYear={YEAR} />
      <SummitRegistration activeYear={YEAR} status={summitInfo.status} />
    </main>
  );
} 
