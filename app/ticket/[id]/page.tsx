import type { Metadata } from 'next';
import Link from 'next/link';
import QRCode from 'qrcode';
import TicketActions from '@/components/ticket-actions';
import { dbKonfigurert } from '@/lib/db';
import { summitLabel } from '@/lib/email';
import { getRegistration } from '@/lib/registrations';
import { SUMMIT_METADATA } from '@/lib/summit-config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your ticket',
  robots: { index: false, follow: false },
};

// The ticket page from the e-mail. The long random token in the link is the ticket:
// no account needed. The QR code holds the same token, and the door scanner looks it up.
export default async function TicketPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  let token = id;
  try {
    token = decodeURIComponent(id);
  } catch {
    // keep as is
  }
  const reg = dbKonfigurert() ? await getRegistration(token) : null;

  if (!reg) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[80vh] gap-4 bg-gradient-cool text-white px-4 text-center">
        <h1 className="text-2xl font-bold">Ticket not found</h1>
        <p className="text-rosebud-200 max-w-md">
          Check that you opened the whole link from the e-mail. You can also <Link className="underline" href="/my-tickets">log in</Link> with the
          address you signed up with to see your tickets.
        </p>
      </main>
    );
  }

  const s = summitLabel(reg.summit);
  const upcoming = SUMMIT_METADATA[s.id]?.status === 'Upcoming';
  const qr = await QRCode.toDataURL(reg.id, { width: 320, margin: 2, errorCorrectionLevel: 'M' });

  return (
    <main className="flex flex-col items-center min-h-[80vh] gap-5 bg-gradient-cool text-white px-4 py-10 text-center">
      <p className="text-sm uppercase tracking-wide text-rosebud-300">Your ticket</p>
      <h1 className="text-2xl md:text-3xl font-bold">{s.title}</h1>
      {s.date && <p className="text-rosebud-200">{s.date}</p>}
      <p className="text-lg">{reg.name}</p>

      {reg.cancelledAt ? (
        <p className="rounded-md border border-red-800 bg-red-900/30 px-4 py-3 text-rosebud-100">
          This signup was cancelled on {new Date(reg.cancelledAt).toLocaleDateString('en-GB', { timeZone: 'Europe/Oslo' })}.
        </p>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="Ticket QR code" width={260} height={260} className="bg-white p-2 rounded-md" />
          <p className="text-rosebud-200 text-sm">Show this code at the door. Saving the page or a screenshot works too.</p>
          {reg.checkedInAt && (
            <p className="text-sm text-rosebud-100">
              Checked in {new Date(reg.checkedInAt).toLocaleString('en-GB', { timeZone: 'Europe/Oslo' })}. Welcome!
            </p>
          )}
        </>
      )}

      <TicketActions token={reg.id} cancelled={Boolean(reg.cancelledAt)} canRestore={upcoming} checkedIn={Boolean(reg.checkedInAt)} />

      <p className="text-sm text-rosebud-300 max-w-md">
        Want all your tickets in one place? <Link className="underline" href="/my-tickets">Log in</Link> with the e-mail address you signed up with.
        An account is optional.
      </p>
      <p className="text-xs text-rosebud-400">
        <Link className="underline" href="/personvern">Privacy</Link>
      </p>
    </main>
  );
}
