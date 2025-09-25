import { DEFAULT_YEAR } from "@/lib/summit-config";
import { VenueLocation } from "./venue-location";

type SummitVenueProps = {
  activeYear: string;
}

export function SummitVenue({ activeYear }: SummitVenueProps) {
  const isDefaultYear = activeYear === DEFAULT_YEAR;

  return (
    <section id="venue" className="w-full py-12 md:py-24 lg:py-32 scroll-mt-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-block rounded-lg bg-rosebud px-3 py-1 text-sm text-tarawera">Venue</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            <span
              className={
                isDefaultYear
                  ? "bg-gradient-to-r from-tarawera to-copperrose bg-clip-text text-transparent"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose"
              }
            >
              Vågsholt skole, Krømpe
            </span>
          </h2>
          <p className="max-w-[760px] text-rosebud-200 md:text-lg">
            This little white schoolhouse in Krømpe is where Homborsund AI builds momentum. It is closer to a
            workshop than a conference centre — no running water, no mains electricity, but plenty of
            heating, candlelight and an honest-to-goodness utedo a short walk away. Bring curiosity,
            something thoughtful to eat and a beverage you would trust around robots (beer or wine seem to
            flatter AI discussions); catering remains firmly in your capable hands while we handle the
            warmth, atmosphere and agenda that politely ignores boardroom formalities.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <VenueLocation />
        </div>
      </div>
    </section>
  );
} 
