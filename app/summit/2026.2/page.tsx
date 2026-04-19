"use client";

import { SummitHeader, SummitRegistration, SummitVenue } from "@/components/shared";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2026.2";

export default function Summit2026_2Page() {
  const summitInfo = SUMMIT_METADATA[YEAR];

  const description = [
    "We don't have a date. We don't have a speaker list. We don't even have an agenda yet.",
    "What we do have is a title and a growing suspicion that whatever comes next is going to need more room than one schoolhouse can offer — which is exactly why we're still using one.",
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
              Mostly nothing, honestly
            </h2>
            <p className="max-w-3xl text-rosebud-200 md:text-lg">
              The last summit only just wrapped. We&apos;re letting the dust settle before we commit to anything.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "The title",
                body: "\u201CTo space! We\u2019ll need it!\u201D Read it as literal, figurative, or both. Either way, the direction is out — away from the small boxes we\u2019ve been arguing in.",
              },
              {
                title: "The shape",
                body: "Same idea as last time: a handful of speakers, a long evening, bonfire at the end. If it ain\u2019t broke, we\u2019re not going to pretend it is.",
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

      <SummitVenue activeYear={YEAR} />
    </main>
  );
}
