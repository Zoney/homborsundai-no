"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type VenueLocationProps = {
  className?: string;
};

const MAP_EMBED_URL = "https://www.openstreetmap.org/export/embed.html?bbox=8.50263841132553%2C58.2886152351454%2C8.51463841132553%2C58.29661523514541&layer=mapnik&marker=58.292615235145405%2C8.50863841132553";
const MAP_LINK_URL = "https://www.openstreetmap.org/?mlat=58.292615235145405&mlon=8.50863841132553#map=16/58.2926/8.5086";

export function VenueLocation({ className }: VenueLocationProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="overflow-hidden rounded-3xl border border-ferra-600 shadow-2xl shadow-rosebud/30">
        <iframe
          title="Map showing Vågsholt skole in Krømpe"
          src={MAP_EMBED_URL}
          className="h-[320px] w-full border-0 md:h-[420px]"
          loading="lazy"
          allowFullScreen
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4 text-left">
          <h3 className="text-2xl font-bold text-rosebud-50">Vågsholt skole, Krømpe</h3>
          <p className="text-rosebud-200 text-base leading-relaxed">
            Homborsund AI brings everyone together at the old village school in Krømpe, a short hop from Grimstad.
            It is a stripped-back, warm space that keeps the focus on people, prototypes and whatever
            refreshments you were clever enough to stash in your bag.
          </p>
          <div className="rounded-2xl bg-ferra-900/40 p-6 border border-ferra-600/60">
            <p className="text-sm uppercase tracking-wide text-rosebud-300 mb-3">What you should know</p>
            <ul className="grid gap-3 text-rosebud-200 text-sm md:text-base">
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-rosebud" />
                <span>No running water on-site — pack bottles or top up before you arrive.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-rosebud" />
                <span>There is no mains electricity, so charge devices in advance and bring power banks.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-rosebud" />
                <span>The heated main room keeps everyone toasty even late into the evening.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-rosebud" />
                <span>A classic utedo (outdoor toilet) handles the practicalities — rustic, but clean.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-rosebud" />
                <span>Food and drink are emphatically BYO — craft beer or a conversational bottle of wine has a curious sympathy with AI.</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-ferra-600/60 bg-ferra-900/40 p-6 text-rosebud-100">
          <h4 className="text-lg font-semibold">Essentials</h4>
          <dl className="space-y-2 text-sm md:text-base">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-medium text-rosebud-200">Address</dt>
              <dd className="text-right text-rosebud-100">Krømpe 16, 4885 Grimstad</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-medium text-rosebud-200">Coordinates</dt>
              <dd className="text-right text-rosebud-100">58.2926° N, 8.5086° E</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-medium text-rosebud-200">Parking</dt>
              <dd className="text-right text-rosebud-100">Gravel lot next to the schoolyard</dd>
            </div>
          </dl>
          <p className="text-sm text-rosebud-300">
            We stock extra blankets and firewood; you bring the provisions. Consider how well a contemplative lager or mischievous wine supports late-night model talk, and pack accordingly.
          </p>
          <Link
            href={MAP_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-rosebud px-4 py-2 text-sm font-semibold text-rosebud transition-colors hover:bg-rosebud/10"
          >
            View on OpenStreetMap
          </Link>
        </div>
      </div>
    </div>
  );
}
