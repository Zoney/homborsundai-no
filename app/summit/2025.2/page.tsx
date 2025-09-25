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
    "Five fresh talks to kick things off: ‘Do we have time to wait?’ (Michael), ‘Why start something in 2025?’ (Knut), ‘What Would Jakob Nielsen Tell Nina (If She Let Him)?’ (Nina), ‘HAIway to Hell: A Dystopian Look at AI Run Amok’ (Lars), ‘What I talk about when I talk about Context Engineering’ (Øyvind).",
    "We shuffle the running order as inspiration hits, so expect the timetable to flex and talks to swap around.",
    "Come for the ideas, stay for the demos, BBQ and that friendly ‘let’s build it together’ vibe."
  ];

  const schedule = [
    { time: "16:30 - 17:15", event: "Arrival, snacks and hello-there high‑fives" },
    { time: "17:15 - 17:25", event: "Kickoff & tiny Agents update" },
    { time: "17:30 - 18:00", event: "Talk: 'Do we have time to wait?' — Michael" },
    { time: "18:05 - 18:35", event: "Talk: 'Why start something in 2025?' — Knut" },
    { time: "18:40 - 19:10", event: "Talk: 'What Would Jakob Nielsen Tell Nina (If She Let Him)?' — Nina" },
    { time: "19:15 - 19:45", event: "Talk: 'What I talk about when I talk about Context Engineering' — Øyvind" },
    { time: "19:50 - 20:20", event: "Talk: 'HAIway to Hell: A Dystopian Look at AI Run Amok' — Lars" },
    { time: "20:20 - 21:00", event: "Dinner break, demos and good conversations" },
    { time: "21:00 - 21:45", event: "Demo Jam & Breakouts (agents, robots, tools)" },
    { time: "21:45 - 22:15", event: "Lightning talks & open Q&A" },
    { time: "22:15 - 22:45", event: "Bonfire, plans and see‑you‑soon goodbyes" }
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
      <SummitRegistration activeYear={YEAR} status={summitInfo.status} />
      <SummitSchedule 
        schedule={schedule}
        note={"Times and order are tentative — we shuffle sessions as the vibe demands. Topics are done when they’re done."}
      />
      <SummitSpeakers activeYear={YEAR} />
      <SummitVenue activeYear={YEAR} />
    </main>
  );
} 
