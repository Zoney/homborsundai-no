"use client";

import { useEffect } from "react";
import { SummitHeader, SummitSchedule, SummitSpeakers, SummitVenue, SummitRegistration } from "@/components/shared";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2026.1";

export default function Summit2026_1Page() {
  const summitInfo = SUMMIT_METADATA[YEAR];
  const cta = summitInfo.cta;

  const description = [
    "Spring 2026 is when autonomous agents either become your unfair advantage or your governance headache. We plan to spend a weekend figuring out which side of that line you want to stand on.",
    "We are not going to pretend we know the exact stack, model names or chip allocations by April — the landscape is mutating every few weeks — but we do know we will ship something worthwhile together.",
    "Expect demos that stress-test the latest releases, honest conversations about resilience, and a community who shows up ready to build even when the roadmap keeps changing.",
  ];

  const schedule = [
    { time: "Midday Saturday", event: "Doors open, coffee and coastline calibration" },
    { time: "Afternoon", event: "Rapid-fire briefings: what just shipped, what broke, and why it matters" },
    { time: "Evening", event: "Roundtables & bonfire clinics — prototypes, playbooks, mitigation drills" },
    { time: "Late", event: "Dinner, long-form Q&A, robot beach walks (weather permitting)" },
    { time: "Sunday optional", event: "Open lab for teams that want to keep building" },
  ];

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();
        const id = target.getAttribute("href")?.substring(1);
        const element = document.getElementById(id || "");
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: "smooth",
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-gradient-cool text-white">
      <section className="w-full border-b border-ferra-700/60 bg-tarawera/40 py-6 md:py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
            <span className="text-sm uppercase tracking-[0.2em] text-rosebud-200">Stay in the loop</span>
            <h2 className="text-3xl font-semibold text-rosebud-50 md:text-4xl">Get Summit Updates</h2>
            <p className="max-w-xl text-rosebud-200">
              Leave your details to get early notice when the April 2026 program locks in. We&apos;ll email you first
              when tickets, agenda drops and travel details are ready.
            </p>
            {cta && (
              <Button
                asChild
                size="lg"
                className="bg-copperrose hover:bg-copperrose-600 text-white shadow-lg hover:shadow-rosebud/40"
              >
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      <SummitHeader
        activeYear={YEAR}
        title={summitInfo.title}
        date={summitInfo.date}
        theme={summitInfo.theme}
        description={description}
      />
      <div className="container mx-auto w-full px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <SummitRegistration activeYear={YEAR} summit={summitInfo} />
        </div>
      </div>

      <section className="w-full py-12 md:py-16 bg-ferra/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-12">
            <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm">What&apos;s Brewing</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose">
              Placeholders with Intent
            </h2>
            <p className="max-w-3xl text-rosebud-200 md:text-lg">
              The agenda is in motion. Think of this as our working outline while we scout speakers and line up the
              right hardware, sandboxes and late-night debates.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Agent Autonomy Clinics",
                body: "Hands-on runbooks for shipping agents that negotiate, plan and handle tools without wrecking compliance.",
              },
              {
                title: "Resilience & Ops",
                body: "Stories and frameworks for keeping human-in-the-loop teams sane when suppliers and model APIs shift weekly.",
              },
              {
                title: "Hardware Reality Check",
                body: "From edge boards on boats to datacenter GPU rationing. Bring your own benchmarks, we will compare notes.",
              },
              {
                title: "AI Safety in Practice",
                body: "Not a doom loop — concrete guardrails, red-teaming drills and shared accountability templates.",
              },
              {
                title: "Builders&apos; Showcase",
                body: "Lightning demos of things that already work, even if the paint is still drying. Bring your own HDMI dongle.",
              },
              {
                title: "Seaside After Hours",
                body: "Same Homborsund vibe: bonfire, cold sea air, plans sketched on napkins. The predictable part is the community.",
              },
            ].map((item) => (
              <Card key={item.title} className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-rosebud-50 text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-rosebud-200 text-sm leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <SummitSchedule
        schedule={schedule}
        note="Timing is intentionally fuzzy until we lock the crew and daylight conditions. Expect updates as soon as the schedule firms up."
      />

      <section className="w-full py-12 md:py-16 bg-ferra bg-opacity-30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-12">
            <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm">Why This Matters</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose">
              We&apos;re Honest About the Unknowns
            </h2>
            <p className="max-w-3xl text-rosebud-200 md:text-lg">
              April 2026 is a moving target. Standards, regulations, model access — everything shifts. We treat that as
              an opportunity to co-create the playbook rather than wait for someone else to publish one.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Candid Field Notes",
                body: "We collect what people are actually deploying in production — wins, outages, awkward lessons included.",
              },
              {
                title: "Living Roadmaps",
                body: "We design flexible plans with checkpoints so your team can adapt without burning out.",
              },
              {
                title: "Community Signal",
                body: "You get access to the same quick pings, accountability groups and shared docs we use between summits.",
              },
            ].map((item) => (
              <Card key={item.title} className="bg-ferra border-ferra-600 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-rosebud-50 text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-rosebud-200 text-sm leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <SummitSpeakers activeYear={YEAR} />
      <SummitVenue activeYear={YEAR} />
    </main>
  );
}
