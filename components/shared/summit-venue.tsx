import { DEFAULT_YEAR } from "@/lib/summit-config";

type SummitVenueProps = {
  activeYear: string;
}

export function SummitVenue({ activeYear }: SummitVenueProps) {
  return (
    <section id="venue" className="w-full py-12 md:py-24 lg:py-32 scroll-mt-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-block rounded-lg bg-rosebud px-3 py-1 text-sm text-tarawera">Venue</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {activeYear === DEFAULT_YEAR ? (
              <span className="bg-gradient-to-r from-tarawera to-copperrose bg-clip-text text-transparent">Homborsund Community Center</span>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose">Homborsund Community Center</span>
            )}
          </h2>
          <p className="max-w-[700px] text-rosebud-200 md:text-xl">
            The summit will be held at the Vågsholt skole, a historic building located in the heart
            of Krømpe.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-rosebud-100">Location Details</h3>
            <div className="space-y-2">
              <p className="text-rosebud-300">
                <span className="font-semibold text-rosebud-100">Address:</span> Vågsholt skole, Krømpe, Norway
              </p>
              <p className="text-rosebud-300">
                <span className="font-semibold text-rosebud-100">Parking:</span> Free parking available on-site
              </p>
              <p className="text-rosebud-300">
                <span className="font-semibold text-rosebud-100">Accessibility:</span> Wheelchair accessible venue
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-rosebud-100">Getting There</h3>
            <div className="space-y-2">
              <p className="text-rosebud-300">
                The venue is easily accessible by car and public transport. Detailed directions will be provided upon registration.
              </p>
              <p className="text-rosebud-300">
                <span className="font-semibold text-rosebud-100">By Car:</span> 45 minutes from Kristiansand
              </p>
              <p className="text-rosebud-300">
                <span className="font-semibold text-rosebud-100">By Public Transport:</span> Bus connections available from major cities
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 