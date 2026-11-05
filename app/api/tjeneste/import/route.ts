import { NextRequest, NextResponse } from 'next/server';
import { SKJEMA, dbKonfigurert, sikreSkjema, sql } from '@/lib/db';
import { loggHendelse } from '@/lib/hendelser';
import { logg } from '@/lib/logg';
import { krevKlient } from '@/lib/tjeneste';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Inn = {
  id?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  comment?: unknown;
  summit?: unknown;
  timestamp?: unknown;
  ip?: unknown;
  userAgent?: unknown;
  _creationTime?: unknown;
};

const s = (v: unknown, maks: number) => (typeof v === 'string' ? v.trim().slice(0, maks) : '');

/**
 * POST /api/tjeneste/import { registrations: [...] } → { ok, received, inserted, existed }
 *
 * The move from Convex (scripts/flytt-import.mjs on the Mac, with the client certificate
 * "macen" via https://relay.zoney.no/hai/api/tjeneste/import). Idempotent on the ticket id
 * (the token), so it can run several times, and old ticket links and QR codes keep working.
 */
export async function POST(req: NextRequest) {
  const k = await krevKlient(['macen']);
  if (k instanceof NextResponse) return k;
  if (!dbKonfigurert()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });

  const body = (await req.json().catch(() => null)) as { registrations?: unknown } | null;
  const inn = Array.isArray(body?.registrations) ? (body!.registrations as Inn[]) : null;
  if (!inn) return NextResponse.json({ error: 'registrations missing' }, { status: 400 });
  if (inn.length > 20000) return NextResponse.json({ error: 'Too many' }, { status: 413 });

  const rader = [];
  for (const r of inn) {
    const token = s(r.id, 200);
    const navn = s(r.name, 200);
    const summit = s(r.summit, 50);
    if (!token || !navn || !summit) return NextResponse.json({ error: 'Invalid registration (id, name and summit are required)' }, { status: 400 });
    let opprettet = new Date(s(r.timestamp, 40));
    if (Number.isNaN(opprettet.getTime()) && typeof r._creationTime === 'number') opprettet = new Date(r._creationTime);
    if (Number.isNaN(opprettet.getTime())) opprettet = new Date();
    rader.push([
      token,
      summit,
      navn,
      s(r.email, 254).toLowerCase() || null,
      s(r.phone, 50) || null,
      s(r.comment, 2000) || null,
      opprettet.toISOString(),
      s(r.ip, 64) || null,
      s(r.userAgent, 500) || null,
    ]);
  }

  await sikreSkjema();
  const db = await sql().connect();
  let inserted = 0;
  try {
    await db.query('begin');
    for (const v of rader) {
      const r = await db.query(
        `insert into ${SKJEMA}.registrering (token, summit, navn, epost, telefon, kommentar, opprettet, ip, user_agent, kilde)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'convex') on conflict (token) do nothing`,
        v,
      );
      inserted += r.rowCount ?? 0;
    }
    await db.query('commit');
  } catch (e) {
    await db.query('rollback').catch(() => {});
    throw e;
  } finally {
    db.release();
  }
  if (inserted) await loggHendelse('importert', { aktor: `klient:${k}`, detaljer: { mottatt: rader.length, lagt_inn: inserted } });
  logg.info('import', { klient: k, mottatt: rader.length, lagt_inn: inserted });
  return NextResponse.json({ ok: true, received: rader.length, inserted, existed: rader.length - inserted });
}
