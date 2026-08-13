"use client";

import { SummitHeader, SummitRegistration, SummitSchedule, SummitSpeakers, SummitVenue } from "@/components/shared";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2026.2";

const SCHEDULE = [
  { time: "15:00", event: "Doors open. The grill is already lit — we bring it, you bring whatever deserves to meet it, plus a drink that flatters AI (beer and wine have an enviable track record)." },
  { time: "17:00", event: "Lars — The State of AI in Agder" },
  { time: "17:30", event: "Michael — Build Something. Now!" },
  { time: "18:00", event: "Knut — Why Industry Doesn't Fall for Demos" },
  { time: "18:30", event: "Grill, round two. The arguments from round one continue." },
  { time: "19:00", event: "Cathrine — Real AI for Leaders — the Hype Stays Outside" },
  { time: "19:30", event: "Eivind — The Company That Remembers: An LLM Wiki for the Enterprise" },
  { time: "20:00", event: "Hanne — The Longest Context Windows in the Room" },
  { time: "20:30", event: "Øyvind — One Analogy to Rule Them All" },
  { time: "21:00", event: "Bonfire and open floor. It ends when it ends." },
];

export default function Summit2026_2Page() {
  const summitInfo = SUMMIT_METADATA[YEAR];

  const description = [
    "Saturday 3 October 2026. Doors at 15:00 with the grill already lit, first talk at 17:00. A real date, on a real calendar, for a real gathering in a schoolhouse without running water. We checked twice.",
    "Seven talks, one recurring question: as intelligence gets cheaper, what should people, companies — and the rest of us — actually do with it?",
    "From the state of AI in Agder to enterprise memory, from heavy industry to eldercare politics, ending with one analogy to rule them all. It will make more sense around the bonfire. The room takes about twenty people, and it has filled every single time.",
  ];

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
              From the state of Agder to one analogy to rule them all
            </h2>
            <p className="max-w-3xl text-rosebud-200 md:text-lg">
              Seven talks. No final answers. That would ruin the evening.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "The State of AI in Agder",
                speaker: "Lars",
                body: "Lars opens the evening with the briefing consultants would happily invoice five figures for: who is actually doing what with AI between Mandal and Tvedestrand, what is real, what is theatre, and where the smart money quietly went. Regional strategy documents will be rewritten to agree with him. This room hears it first.",
              },
              {
                title: "Build Something. Now!",
                speaker: "Michael",
                body: "Michael has seen enough roadmaps. While other organisations schedule a preliminary study of a pilot of a proof of concept, he shows what happens when you just make the thing — this week, with the tools already in your pocket. Known side effects include leaving the schoolhouse with a working prototype and no memory of deciding to build it.",
              },
              {
                title: "Why Industry Doesn’t Fall for Demos",
                speaker: "Knut",
                body: "Knut took AI somewhere it genuinely did not want to go: industry. Concrete floors, real machines, processes with consequences. Why the demo that wowed the boardroom dies at the factory gate, and what actually survives out there — some of the region’s most expensive lessons, served free with your sausage. Ask him about the mealworms.",
              },
              {
                title: "Real AI for Leaders — the Hype Stays Outside",
                speaker: "Cathrine",
                body: "Cathrine has done the thing every keynote claims is possible: taken a leadership group from AI-curious to AI-competent without a single buzzword surviving the journey. Budgets, decisions, org charts — and a CEO dispatched to prompt school along the way. If you bring one colleague to Krømpe, bring the one who owns a strategy document.",
              },
              {
                title: "The Company That Remembers: An LLM Wiki for the Enterprise",
                speaker: "Eivind",
                body: "What if your organisation actually remembered things? Eivind — who got impatient and built his own ambient recorder from scratch — walks through the LLM wiki: raw captures in, compounding knowledge out, a collective memory that outlives every reorg. After this talk, “where is that document?” sounds like a disease from a previous civilisation.",
              },
              {
                title: "The Longest Context Windows in the Room",
                speaker: "Hanne",
                body: "New to the summit, and arriving with the two audiences AI forgot: the elderly, and the politicians who decide on their behalf. Hanne spends her days where policy meets people with eighty years of context — and asks what happens when we point our shiniest technology at those who need it most and were consulted least. You will quote this one for months.",
              },
              {
                title: "One Analogy to Rule Them All",
                speaker: "Øyvind",
                body: "Is an AI system a colleague? An intern with infinite stamina? A power grid? A very eager golden retriever? After a full evening of evidence, your host attempts the summit’s most dangerous stunt: landing the one analogy that makes AI in organisations make sense. Settled around the bonfire, where all serious architecture decisions belong.",
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
        schedule={SCHEDULE}
        note="Times before 17:00 are precise. Times after 17:00 are a mood — the bonfire has the final word."
      />
      <SummitSpeakers activeYear={YEAR} includeCommunitySpeakers={false} />
      <SummitVenue activeYear={YEAR} />
    </main>
  );
}
