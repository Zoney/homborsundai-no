import { NextRequest, NextResponse } from 'next/server';
import { brems, klientIp, sammeOpphav } from '@/lib/api';
import { dbKonfigurert } from '@/lib/db';
import { sendEpost } from '@/lib/epost';
import { sendTicketEmail, summitLabel, baseUrl } from '@/lib/email';
import { loggHendelse } from '@/lib/hendelser';
import { feilTekst, logg } from '@/lib/logg';
import { createRegistration, findActiveForEmail, setStatus } from '@/lib/registrations';
import { SUMMIT_METADATA, getSummitRegistrationKey, normalizeSummitRegistrationKey } from '@/lib/summit-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EPOST_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;

/** Registration keys that take signups now: summits marked Upcoming. */
function openKeys(): Set<string> {
  return new Set(
    Object.entries(SUMMIT_METADATA)
      .filter(([, m]) => m.status === 'Upcoming')
      .map(([id]) => getSummitRegistrationKey(id)),
  );
}

const str = (v: unknown, maks: number) => (typeof v === 'string' ? v.trim().slice(0, maks) : '');

/**
 * POST /api/summit/register { name, email, phone?, comment?, summit, startedAt, website }
 *
 * Bot protection without a third party (Turnstile is gone, the app has no network):
 * same-origin check, a honeypot field ("website"), a minimum time on the form, and a
 * rate limit per IP address in memory (plus Caddy's own limit per IP).
 * Everyone who signs up gets the ticket e-mail with the link to their QR code page.
 */
export async function POST(request: NextRequest) {
  if (!sammeOpphav(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!dbKonfigurert()) return NextResponse.json({ error: 'Signups are not open right now.' }, { status: 503 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  // Honeypot and too-fast submits: pretend it worked, store nothing.
  const startedAt = Number(body.startedAt);
  if (str(body.website, 200) || (Number.isFinite(startedAt) && Date.now() - startedAt < 1500)) {
    logg.warn('robot_avvist', { grunn: str(body.website, 1) ? 'honningfelle' : 'for_rask' });
    return NextResponse.json({ success: true, message: 'Registration successful' });
  }

  if (!brems(`reg:${klientIp(request)}`, 6, 600)) {
    logg.warn('brems', { rute: 'register' });
    return NextResponse.json({ error: 'Too many signups from here. Wait a few minutes and try again.' }, { status: 429 });
  }

  const name = str(body.name, 200);
  const email = str(body.email, 254).toLowerCase();
  const phone = str(body.phone, 50);
  const comment = str(body.comment, 2000);
  const summit = normalizeSummitRegistrationKey(typeof body.summit === 'string' ? body.summit : null);

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  if (!email || !EPOST_RE.test(email)) return NextResponse.json({ error: 'A valid e-mail address is required, so we can send you your ticket.' }, { status: 400 });
  if (!openKeys().has(summit)) return NextResponse.json({ error: 'Signups for this summit are closed.' }, { status: 400 });

  try {
    const eksisterende = await findActiveForEmail(summit, email);
    if (eksisterende && !eksisterende.cancelledAt) {
      // Already signed up: send the ticket again, but never show it here (anyone can type an address).
      await sendTicketEmail(eksisterende).catch((e) => logg.error('billett_feilet', { reg: eksisterende.nr, feil: feilTekst(e) }));
      await loggHendelse('billett_sendt', { epost: email, registrering: eksisterende.nr, summit, detaljer: { grunn: 'allerede påmeldt' } });
      return NextResponse.json({ success: true, existing: true, message: 'You were already signed up. We have sent your ticket again.' });
    }
    if (eksisterende?.cancelledAt) {
      const igjen = await setStatus(eksisterende.id, 'restore');
      await loggHendelse('pameldt_igjen', { aktor: email, epost: email, registrering: eksisterende.nr, summit });
      if (igjen) await sendTicketEmail(igjen).catch((e) => logg.error('billett_feilet', { reg: igjen.nr, feil: feilTekst(e) }));
      return NextResponse.json({ success: true, existing: true, message: 'Welcome back. We have sent your ticket again.' });
    }

    const reg = await createRegistration({ summit, name, email, phone, comment });
    await loggHendelse('pameldt', { aktor: email, epost: email, registrering: reg.nr, summit, detaljer: { navn: name } });
    try {
      await sendTicketEmail(reg);
      await loggHendelse('billett_sendt', { epost: email, registrering: reg.nr, summit });
    } catch (e) {
      logg.error('billett_feilet', { reg: reg.nr, feil: feilTekst(e) });
    }
    varsleAdmins(name, summit);
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      ticketUrl: `/ticket/${encodeURIComponent(reg.id)}`,
    });
  } catch (error) {
    logg.error('pamelding_feilet', { feil: feilTekst(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** Optional heads-up to the organisers (replaces the Slack webhook): HAI_VARSLE=a@x,b@y. */
function varsleAdmins(navn: string, summit: string) {
  const til = (process.env.HAI_VARSLE ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (til.length === 0) return;
  const s = summitLabel(summit);
  void sendEpost({
    type: 'varsel',
    til: til.join(', '),
    emne: `New signup: ${s.title}`,
    tekst: `${navn} signed up for ${s.title}.\n\nAll signups: ${baseUrl()}/admin/registrations`,
  }).catch((e) => logg.error('varsel_feilet', { feil: feilTekst(e) }));
}
