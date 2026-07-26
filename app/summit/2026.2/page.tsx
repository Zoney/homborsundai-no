"use client";

import { SummitHeader, SummitRegistration, SummitSpeakers, SummitVenue } from "@/components/shared";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2026.2";

export default function Summit2026_2Page() {
  const summitInfo = SUMMIT_METADATA[YEAR];

  const description = [
    "We don't have a date or a full agenda yet. But we do have our first speaker.",
    "We're heading to space — because it's always sunny in space — and back through the generations with Hanne and the gamliser.",
    "Leave your name, email, phone, and anything you want us to know below. We'll reach out the moment a date holds.",
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
            <div className="bg-rosebud text-tarawera font-semibold px-4 py-1 rounded-full text-sm">What we know so far</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-rosebud to-copperrose">
              Two directions, one summit
            </h2>
            <p className="max-w-3xl text-rosebud-200 md:text-lg">
              Space is in. So is Hanne.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Space",
                body: "Because it\u2019s always sunny in space.",
              },
              {
                title: "Gamliser",
                body: "Hanne will explore how AI might help us learn from older people, understand ageing and illness, and bring generations closer.",
              },
              {
                title: "The date",
                body: "Pending. Probably later in 2026. When we know, you\u2019ll know — provided you drop your details above.",
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

      <SummitSpeakers activeYear={YEAR} includeCommunitySpeakers={false} />
      <SummitVenue activeYear={YEAR} />
    </main>
  );
}
