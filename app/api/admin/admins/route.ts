import { NextRequest, NextResponse } from 'next/server';
import { krevAdmin, sammeOpphav } from '@/lib/api';
import { SKJEMA, sql } from '@/lib/db';
import { loggHendelse } from '@/lib/hendelser';
import { ADMIN_DOMENE, erDomeneAdmin, erSuperadmin, normEpost } from '@/lib/tilgang';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EPOST_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** GET: who is admin. Every admin can see it; only the superadmin can change it. */
export async function GET() {
  const admin = await krevAdmin();
  if (admin instanceof NextResponse) return admin;
  const rader = await sql().query(`select epost, lagt_til_av, lagt_til from ${SKJEMA}.admin order by epost`);
  const domene = await sql().query(`select email from "user" where email like $1 order by email`, [`%@${ADMIN_DOMENE}`]);
  return NextResponse.json({
    canManage: admin.superadmin,
    domain: ADMIN_DOMENE,
    superadmins: (process.env.HAI_SUPERADMIN ?? '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
    added: rader.rows.map((r) => ({ email: r.epost, addedBy: r.lagt_til_av, addedAt: new Date(r.lagt_til).toISOString() })),
    domainAccounts: domene.rows.map((r) => r.email as string),
  });
}

/** POST { email }: make someone admin (superadmin only). */
export async function POST(req: NextRequest) {
  if (!sammeOpphav(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const admin = await krevAdmin({ superadmin: true });
  if (admin instanceof NextResponse) return admin;
  const { email } = (await req.json().catch(() => ({}))) as { email?: unknown };
  const e = normEpost(typeof email === 'string' ? email : '');
  if (!EPOST_RE.test(e) || e.length > 254) return NextResponse.json({ error: 'Invalid e-mail address' }, { status: 400 });
  if (erDomeneAdmin(e) || erSuperadmin(e)) return NextResponse.json({ error: 'Already admin automatically' }, { status: 400 });
  const r = await sql().query(`insert into ${SKJEMA}.admin (epost, lagt_til_av) values ($1, $2) on conflict do nothing`, [e, admin.epost]);
  if (r.rowCount) await loggHendelse('admin_gitt', { aktor: admin.epost, epost: e });
  return NextResponse.json({ ok: true });
}

/** DELETE { email }: remove an admin (superadmin only). */
export async function DELETE(req: NextRequest) {
  if (!sammeOpphav(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const admin = await krevAdmin({ superadmin: true });
  if (admin instanceof NextResponse) return admin;
  const { email } = (await req.json().catch(() => ({}))) as { email?: unknown };
  const e = normEpost(typeof email === 'string' ? email : '');
  const r = await sql().query(`delete from ${SKJEMA}.admin where epost = $1`, [e]);
  if (r.rowCount) await loggHendelse('admin_fjernet', { aktor: admin.epost, epost: e });
  return NextResponse.json({ ok: true, removed: r.rowCount ?? 0 });
}
