"use client";

import { useEffect } from "react";
import { SummitHeader, SummitSchedule, SummitSpeakers, SummitVenue, SummitRegistration } from "@/components/shared";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2026.1";

export default function Summit2026_1Page() {
  const summitInfo = SUMMIT_METADATA[YEAR];

  const description = [
    "AI is no longer arriving. It arrived. Agents run your deploys. Models draft your contracts. Something roughly your height is learning to open doors. The question is no longer what AI can do — it's what humans are still for.",
    "Proof of Human is five talks and one long evening dedicated to the parts of us that don't fit in a context window. We're not here to panic, and we're not here to optimize. We're here to figure out what deserves to stay human — and what we might as well hand over.",
    "Expect uncomfortable questions disguised as polite talks, demos that refuse to stay on script, and at least one speaker who will make you reconsider your entire career over a bonfire.",
  ];

  const schedule = [
    { time: "15:00-ish", event: "Doors open — coffee, coastline calibration and small talk that might be generated" },
    { time: "15:30-ish", event: "Opening words & the state of being human in 2026" },
    { time: "15:45-ish", event: "Talk: 'Growing Up in the Age of AI — Now What?' — Michael" },
    { time: "16:20-ish", event: "Talk: 'Who Killed the AI Project?' — Robin" },
    { time: "16:55-ish", event: "Break — stretch your biological legs" },
    { time: "17:15-ish", event: "Speakers Corner: 'Prompting — what's working, what's next' — Open floor" },
    { time: "17:50-ish", event: "Talk: 'What Are Humans For?' — Lars" },
    { time: "18:25-ish", event: "Talk: 'Why Would We Need Coding Agents in 2026?' — Øyvind" },
    { time: "19:00-ish", event: "Dinner, demos and arguments about consciousness" },
    { time: "20:00-ish", event: "Open floor — lightning talks, rebuttals and unfinished thoughts" },
    { time: "21:00-ish", event: "Bonfire, cold sea air and proof that you were here" },
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
      <SummitHeader
        activeYear={YEAR}
        title={summitInfo.title}
        date={summitInfo.date}
        theme={summitInfo.theme}
        description={description}
      />
      <SummitRegistration activeYear={YEAR} summit={summitInfo} />

      <section className="w-full py-12 md:py-16 bg-ferra/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-12">
            <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm">The Talks</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-rosebud to-copperrose">
              Five Perspectives on Being Human
            </h2>
            <p className="max-w-3xl text-rosebud-200 md:text-lg">
              Each speaker brings a different lens to the same question. None of them have the answer. That&apos;s the point.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Growing Up in the Age of AI — Now What?",
                speaker: "Michael",
                body: "Michael recently became a father. His child will never remember a world without AI in it — will never not know the feeling of talking to something that answers back. What does that childhood look like? What do we teach, what do we protect, and what becomes of curiosity when every question has an instant, confident answer? A quieter talk from someone who has suddenly started thinking about the long term.",
              },
              {
                title: "Who Killed the AI Project?",
                speaker: "Robin",
                body: "Everyone was excited at the kickoff. The pilot worked. The demo got applause from people who don't usually applaud. And then — nothing. The budget moved, the sponsor changed roles, and the Slack channel went quiet. Robin investigates the scene of the crime, talks to the usual suspects, and asks why organisations keep murdering projects that were technically alive.",
              },
              {
                title: "Speakers Corner: Prompting",
                speaker: "Open floor",
                body: "Everyone has a prompt that works a little too well and one that fails for reasons no one can explain. Bring yours. We trade tricks, superstitions and half-working incantations — and then ask the harder question: when the models get better at reading us than we are at writing to them, what is a prompt, really? And what comes after?",
              },
              {
                title: "What Are Humans For?",
                speaker: "Lars",
                body: "If AI can write, diagnose, plan and execute — what exactly should a person spend their Tuesday doing? Lars takes on the largest question of the decade with the calm demeanor of someone who has already made peace with several possible answers.",
              },
              {
                title: "Why Would We Need Coding Agents in 2026?",
                speaker: "Øyvind",
                body: "Short answer: we probably don't. Long answer: when models can reason, remember and spin up exactly what you need based on who you are, the whole concept of an 'agent' starts to feel quaint. Øyvind makes the case for retiring a buzzword before it even peaks.",
              },
              {
                title: "The Evening Itself",
                speaker: "Everyone",
                body: "The real talk happens after the talks. Dinner, demos, bonfire debates and the kind of half-formed ideas that only surface when the projector is off and the sea air hits. This is the part no AI can replicate. Yet.",
              },
            ].map((item) => (
              <Card key={item.title} className="bg-ferra border-ferra-600 shadow-lg hover:shadow-rosebud/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-rosebud-50 text-xl">{item.title}</CardTitle>
                  <p className="text-copperrose text-sm font-medium">{item.speaker}</p>
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
        note={"All times end in -ish because we respect the audience more than the clock. If a talk turns into a conversation, we let it. If dinner runs late because someone's demo actually works, we celebrate."}
      />

      <section className="w-full py-12 md:py-16 bg-ferra bg-opacity-30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-10 md:mb-12">
            <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm">The Real Question</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-rosebud to-copperrose">
              Proof of Human
            </h2>
            <p className="max-w-3xl text-rosebud-200 md:text-lg">
              We used to prove we weren&apos;t robots by clicking on traffic lights. Now the robots click better than we do.
              So what&apos;s left?
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Presence Over Productivity",
                body: "The models are productive. Relentlessly, tirelessly productive. What they cannot do is show up, look someone in the eye, and mean it. This summit is built around presence — yours.",
              },
              {
                title: "Questions Over Answers",
                body: "AI is very good at answers. It turns out the hard part was always knowing what to ask. We're gathering people who are still genuinely confused, and we think that's a strength.",
              },
              {
                title: "Community Over Content",
                body: "You can watch talks online. You cannot sit around a bonfire on the Norwegian coast and argue about consciousness with strangers who will become collaborators. That part requires showing up.",
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
