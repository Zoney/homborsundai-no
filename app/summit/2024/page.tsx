"use client";

import { useEffect } from "react";
import { SummitHeader, SummitSchedule, SummitSpeakers, SummitVenue, SummitRegistration } from "@/components/shared";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2024";

export default function Summit2024Page() {
  const summitInfo = SUMMIT_METADATA[YEAR];
  
  // Inline summit content
  const description = [
    "Join us for a deep dive into the fundamentals of AI, where we'll explore the core concepts and techniques that power the latest advancements.",
    "No tech allowed, just you and your curiosity."
  ];

  const schedule = [
    { time: "16:00 - 18:00", event: "Drinks and food, networking" },
    { time: "18:00 - 19:30", event: "Various introductions" },
    { time: "19:30 - 21:00", event: "AI: Are we there yet?" },
    { time: "21:00 - 22:00", event: "And what next?" },
    { time: "22:00 - Late", event: "Let's talk about it" }
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
      <SummitRegistration activeYear={YEAR} summit={summitInfo} />
      
      {/* Past Summits Section - Only shown for completed summits */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-ferra bg-opacity-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-block rounded-lg bg-rosebud px-3 py-1 text-sm text-tarawera">Archive</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose">Past Summits</h2>
            <p className="max-w-[700px] text-rosebud-200 md:text-xl">
              Take a look at our previous AI summits and the amazing discussions we had.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Photo gallery from past summit */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-rosebud-100">Photo Highlights</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="aspect-square bg-ferra-700 border border-ferra-600 rounded-md flex items-center justify-center">
                      <span className="text-rosebud-300">Photo {num}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Testimonials from past summit */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-rosebud-100">Attendee Feedback</h3>
                <div className="space-y-4">
                  <blockquote className="border-l-4 border-copperrose pl-4 italic text-rosebud-200">
                    &quot;The discussions were eye-opening. Can&apos;t wait for next year&apos;s summit!&quot;
                    <footer className="text-sm mt-2 text-rosebud-300">— Previous Attendee</footer>
                  </blockquote>
                  <blockquote className="border-l-4 border-copperrose pl-4 italic text-rosebud-200">
                    &quot;A perfect blend of technical insights and practical applications.&quot;
                    <footer className="text-sm mt-2 text-rosebud-300">— AI Enthusiast</footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 
