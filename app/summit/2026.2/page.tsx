"use client";

import { SummitHeader, SummitRegistration, SummitSpeakers, SummitVenue } from "@/components/shared";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2026.2";

export default function Summit2026_2Page() {
  const summitInfo = SUMMIT_METADATA[YEAR];

  const description = [
    "The date is still floating somewhere in the future. The speaker lineup isn't.",
    "Six talks, seven humans, a few robots and one recurring question: as intelligence gets cheaper, what should people and companies do with it?",
    "We're going to space, into second brains, across generations and through the org chart. It will probably make more sense around the bonfire.",
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
              From old wisdom to tiny robot brains
            </h2>
            <p className="max-w-3xl text-rosebud-200 md:text-lg">
              Six talks. No final answers. That would ruin the evening.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Gamliser: The Original Intelligence",
                speaker: "Hanne",
                body: "AI likes the newest data. Hanne turns the room toward people with the longest context windows. What can younger generations learn from older people, how do we understand ageing and illness better, and where can AI genuinely help? Spoiler: wisdom did not launch with a waitlist.",
              },
              {
                title: "It\u2019s Always Sunny in Space",
                speaker: "Øyvind",
                body: "After context engineering and coding agents, Øyvind looks up: launch costs fall, compute gets cheaper, tools get better, and impossible projects quietly become weekend plans. A talk about space, abundance and why the next chapter may be more exciting than the doomscroll suggests.",
              },
              {
                title: "Build a Brain. Then Build One for Work.",
                speaker: "Knut & Øystein",
                body: "Knut and Øystein ask how to turn the daily avalanche of notes, documents and conversations into knowledge bases that actually help — one for yourself, one for a company, and ideally neither named final-final-v7.",
              },
              {
                title: "Just Add AI Is Not a Strategy",
                speaker: "Cathrine",
                body: "Why do some organisations turn AI into better work while others produce a steering committee and 47 slides? Cathrine looks at what it takes to succeed, how to choose where AI belongs, and how to work strategically before the strategy becomes an archaeological object.",
              },
              {
                title: "Do We Still Need All These Roles?",
                speaker: "Jan Ivar",
                body: "The org chart says twelve specialties. The AI says it can do eleven before lunch. Jan Ivar asks whether the future still needs a role for every task, or whether a few capable people with very capable tools can cover more ground — and what we lose if we simplify too far.",
              },
              {
                title: "Can\u2019t the Robots Just Run Everything?",
                speaker: "Karianne",
                body: "Give the robots wheels, arms and a small AI brain — then what? Karianne follows the question past the demo video: what could machines actually run, where do humans still belong, and who gets called when the tiny brain confidently drives the wrong way?",
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

      <SummitSpeakers activeYear={YEAR} includeCommunitySpeakers={false} />
      <SummitVenue activeYear={YEAR} />
    </main>
  );
}
