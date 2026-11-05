import { NextRequest, NextResponse } from 'next/server';
import { sammeOpphav } from '@/lib/api';
import { SKJEMA, dbKonfigurert, sikreSkjema, sql } from '@/lib/db';
import { loggHendelse } from '@/lib/hendelser';
import { getRegistrationsForEmail } from '@/lib/registrations';
import { hentViewer } from '@/lib/tilgang';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/me → the logged-in user and their signups (for "My tickets"). */
export async function GET() {
  if (!dbKonfigurert()) return NextResponse.json({ error: 'Not available' }, { status: 503 });
  const v = await hentViewer();
  if (!v) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const regs = await getRegistrationsForEmail(v.epost);
  return NextResponse.json({ email: v.epost, admin: v.admin, superadmin: v.superadmin, registrations: regs });
}

/**
 * DELETE /api/me { registrations?: boolean }
 *
 * «Delete my account» (right to erasure, GDPR art. 17): passkeys, sessions and the account.
 * With `registrations: true` also every signup with this address (the tickets stop working),
 * and the address is removed from the activity log. Without it, the signups and their tickets
 * stay, exactly as if the account had never been made.
 */
export async function DELETE(req: NextRequest) {
  if (!sammeOpphav(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!dbKonfigurert()) return NextResponse.json({ error: 'Not available' }, { status: 503 });
  const v = await hentViewer();
  if (!v) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { registrations?: unknown };
  const medPameldinger = body.registrations === true;

  await sikreSkjema();
  const db = await sql().connect();
  let slettet = 0;
  try {
    await db.query('begin');
    // Better Auth's tables without schema name, the way it looks them up itself (search_path)
    await db.query(`delete from passkey where "userId" = $1`, [v.userId]);
    await db.query(`delete from session where "userId" = $1`, [v.userId]);
    await db.query(`delete from account where "userId" = $1`, [v.userId]);
    await db.query(`delete from verification where identifier like '%' || $1`, [v.epost]);
    await db.query(`delete from "user" where id = $1`, [v.userId]);
    if (medPameldinger) {
      const r = await db.query(`delete from ${SKJEMA}.registrering where lower(epost) = $1`, [v.epost]);
      slettet = r.rowCount ?? 0;
      await db.query(`update ${SKJEMA}.hendelse set epost = null where epost = $1`, [v.epost]);
      await db.query(`update ${SKJEMA}.hendelse set aktor = null where aktor = $1`, [v.epost]);
      await db.query(`delete from ${SKJEMA}.admin where epost = $1`, [v.epost]);
    }
    await db.query('commit');
  } catch (e) {
    await db.query('rollback').catch(() => {});
    throw e;
  } finally {
    db.release();
  }
  await loggHendelse('konto_slettet', {
    aktor: medPameldinger ? null : v.epost,
    epost: medPameldinger ? null : v.epost,
    detaljer: { pameldinger_slettet: slettet },
    logg: { bruker: v.userId },
  });
  return NextResponse.json({ ok: true, registrationsDeleted: slettet });
}
