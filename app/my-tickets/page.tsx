import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import MyAccount from "@/components/my-account";
import { dbKonfigurert } from "@/lib/db";
import { summitLabel } from "@/lib/email";
import { getRegistrationsForEmail } from "@/lib/registrations";
import { hentViewer } from "@/lib/tilgang";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My tickets",
  robots: { index: false, follow: false },
};

export default async function MyTicketsPage() {
  const viewer = dbKonfigurert() ? await hentViewer() : null;
  if (!viewer) redirect("/login?next=/my-tickets");
  const regs = await getRegistrationsForEmail(viewer.epost);

  return (
    <main className="min-h-[80vh] bg-gradient-cool text-white px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">My tickets</h1>
          <p className="text-rosebud-200 text-sm mt-1">Logged in as {viewer.epost}</p>
          {viewer.admin && (
            <p className="mt-2 text-sm">
              <Link className="underline" href="/admin">
                Go to admin
              </Link>
            </p>
          )}
        </div>

        {regs.length === 0 ? (
          <p className="text-rosebud-200">No signups with this address.</p>
        ) : (
          <ul className="space-y-3">
            {regs.map((r) => {
              const s = summitLabel(r.summit);
              return (
                <li key={r.nr} className="rounded-lg border border-ferra-600 bg-ferra/60 p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-sm text-rosebud-200">
                      {s.date}
                      {r.cancelledAt ? " · cancelled" : r.checkedInAt ? " · checked in" : ""}
                    </p>
                  </div>
                  <Link className="shrink-0 rounded-md bg-copperrose px-3 py-2 text-sm hover:bg-copperrose-600" href={`/ticket/${encodeURIComponent(r.id)}`}>
                    {r.cancelledAt ? "Open" : "Show QR code"}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <MyAccount />
      </div>
    </main>
  );
}
