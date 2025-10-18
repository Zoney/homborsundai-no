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
    "Five fresh talks to kick things off: ‘Do we have time to wait?’ (Michael), ‘Why start something in 2025?’ (Knut), ‘Boardroom Security Playbooks for AI Agents with Corporate Skeleton Keys’ (Jan), ‘HAIway to Hell: A Dystopian Look at AI Run Amok’ (Lars), ‘What I talk about when I talk about Context Engineering’ (Øyvind).",
    "We shuffle the running order as inspiration hits, so expect the timetable to flex and talks to swap around.",
    "We spell it out because it works: the crowd decides when you wrap. Read the room, be honest about your time, and keep rolling if the audience is still leaning in — even if that means a long-form Q&A before the polite bow.",
    "Come for the ideas, stay for the demos, BBQ and that friendly ‘let’s build it together’ vibe."
  ];

  const schedule = [
    { time: "15:00-ish → 16:30-ish", event: "Frostbite prevention mixer: inside-out house warm-up at the old school" },
    { time: "16:30-ish → 17:15-ish", event: "Arrival, snacks and hello-there high‑fives" },
    { time: "17:15-ish → 17:25-ish", event: "Kickoff & tiny Agents update" },
    { time: "17:30-ish → 18:00-ish", event: "Talk: 'Do we have time to wait?' — Michael" },
    { time: "18:05-ish → 18:35-ish", event: "Talk: 'Why start something in 2025?' — Knut" },
    { time: "18:40-ish → 19:10-ish", event: "Talk: 'Boardroom Security Playbooks for AI Agents with Corporate Skeleton Keys' — Jan" },
    { time: "19:15-ish → 19:45-ish", event: "Talk: 'What I talk about when I talk about Context Engineering' — Øyvind" },
    { time: "19:50-ish → 20:20-ish", event: "Talk: 'HAIway to Hell: A Dystopian Look at AI Run Amok' — Lars" },
    { time: "20:20-ish → 21:00-ish", event: "Dinner break, demos and good conversations" },
    { time: "21:00-ish → 21:45-ish", event: "Demo Jam & Breakouts (agents, robots, tools)" },
    { time: "21:45-ish → 22:15-ish", event: "Lightning talks & open Q&A" },
    { time: "22:15-ish → 22:45-ish", event: "Bonfire, plans and see‑you‑soon goodbyes" }
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
        note={"Time ranges are pencilled in — think of them as vibe guardrails. If a talk's mid-flight or morphs into a sprawling Q&A, we ride it out so long as the room explicitly begs for more (no fishing for the encore, comedians)."}
      />
      <SummitSpeakers activeYear={YEAR} />
      <SummitVenue activeYear={YEAR} />
    </main>
  );
} 
