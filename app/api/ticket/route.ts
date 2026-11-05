import { NextRequest, NextResponse } from 'next/server';
import { brems, klientIp, sammeOpphav } from '@/lib/api';
import { dbKonfigurert } from '@/lib/db';
import { loggHendelse } from '@/lib/hendelser';
import { getRegistration, setStatus } from '@/lib/registrations';
import { SUMMIT_METADATA, findSummitIdByRegistrationKey } from '@/lib/summit-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/ticket { token, action: "cancel" | "restore" }
 *
 * The attendee cancels (or takes back the cancellation) from the ticket page. The long random
 * token in the link is the proof; no account needed. Restore only while the summit is upcoming.
 */
export async function POST(req: NextRequest) {
  if (!sammeOpphav(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!dbKonfigurert()) return NextResponse.json({ error: 'Not available' }, { status: 503 });
  if (!brems(`billett:${klientIp(req)}`, 20, 600)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const body = (await req.json().catch(() => null)) as { token?: unknown; action?: unknown } | null;
  const token = typeof body?.token === 'string' ? body.token : '';
  const action = body?.action === 'restore' ? 'restore' : body?.action === 'cancel' ? 'cancel' : null;
  if (!token || !action) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const reg = await getRegistration(token);
  if (!reg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (action === 'restore') {
    const id = findSummitIdByRegistrationKey(reg.summit) ?? reg.summit;
    if (SUMMIT_METADATA[id]?.status !== 'Upcoming') return NextResponse.json({ error: 'This summit is over.' }, { status: 400 });
  }
  const ny = await setStatus(reg.id, action);
  if (action === 'cancel' && !reg.cancelledAt) await loggHendelse('avbestilt', { aktor: reg.email, epost: reg.email, registrering: reg.nr, summit: reg.summit });
  if (action === 'restore' && reg.cancelledAt) await loggHendelse('gjenopprettet', { aktor: reg.email, epost: reg.email, registrering: reg.nr, summit: reg.summit });
  return NextResponse.json({ ok: true, cancelledAt: ny?.cancelledAt ?? null });
}
