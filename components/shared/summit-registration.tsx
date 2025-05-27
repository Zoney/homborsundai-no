import Link from "next/link";
import { DEFAULT_YEAR } from "@/lib/summit-config";

type SummitRegistrationProps = {
  activeYear: string;
  status: 'Upcoming' | 'Completed';
}

export function SummitRegistration({ activeYear, status }: SummitRegistrationProps) {
  return (
    <section id="register" className="w-full py-12 md:py-24 lg:py-32 border-t border-ferra-600 scroll-mt-16 bg-tarawera bg-opacity-30">
      <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            {activeYear === DEFAULT_YEAR ? (
              <span className="bg-gradient-to-r from-rosebud to-copperrose bg-clip-text text-transparent">Join us at the Homborsund AI Summit {activeYear}</span>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rosebud to-copperrose">Join us at the Homborsund AI Summit {activeYear}</span>
            )}
          </h2>
          <p className="mx-auto max-w-[600px] text-rosebud-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {status === "Upcoming" 
              ? "Register now to secure your spot and be a part of this exciting event where cutting-edge AI concepts meet authentic human connection."
              : "This event has concluded. Check out our upcoming summit!"}
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-2">
          {status === "Upcoming" ? (
            <>
              <Link
                className={`inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 ${
                  activeYear === DEFAULT_YEAR
                    ? "bg-gradient-to-r from-copperrose to-ferra hover:from-copperrose-600 hover:to-ferra-600 text-white focus-visible:ring-rosebud shadow-lg hover:shadow-rosebud/50"
                    : "bg-gradient-to-r from-copperrose to-ferra hover:from-copperrose-600 hover:to-ferra-600 text-white focus-visible:ring-rosebud shadow-lg hover:shadow-rosebud/50"
                }`}
                href="https://chat.whatsapp.com/FWv18Iz2r59CuQb98LBuUQ"
              >
                Register Now
              </Link>
              <p className="text-xs text-rosebud-300">Early bird tickets available until March 1st, 2025. Limited to 30 participants for an intimate experience. Join our WhatsApp community.</p>
            </>
          ) : (
            <Link
              href={`/summit/${DEFAULT_YEAR}`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-copperrose to-ferra hover:from-copperrose-600 hover:to-ferra-600 px-8 text-sm font-medium text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rosebud disabled:pointer-events-none disabled:opacity-50 shadow-lg hover:shadow-rosebud/50"
            >
              View Upcoming Summit
            </Link>
          )}
        </div>
      </div>
    </section>
  );
} 