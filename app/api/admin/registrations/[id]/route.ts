import { NextRequest, NextResponse } from 'next/server';
import { krevAdmin, sammeOpphav } from '@/lib/api';
import { loggHendelse } from '@/lib/hendelser';
import { deleteRegistration, getRegistration, setStatus, updateRegistration } from '@/lib/registrations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

/** GET: look a ticket up (the door scanner). `id` is the ticket token. */
export async function GET(_req: NextRequest, { params }: Ctx) {
  const admin = await krevAdmin();
  if (admin instanceof NextResponse) return admin;
  const reg = await getRegistration((await params).id);
  if (!reg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(reg);
}

/** PUT: edit name, e-mail, phone, comment. */
export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!sammeOpphav(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const admin = await krevAdmin();
  if (admin instanceof NextResponse) return admin;
  const data = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const s = (k: string) => (typeof data[k] === 'string' ? (data[k] as string).slice(0, k === 'comment' ? 2000 : 254) : undefined);
  const updated = await updateRegistration((await params).id, { name: s('name'), email: s('email'), phone: s('phone'), comment: s('comment') });
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await loggHendelse('endret', { aktor: admin.epost, epost: updated.email, registrering: updated.nr, summit: updated.summit });
  return NextResponse.json(updated);
}

/** PATCH { action: "checkin" | "undo-checkin" | "cancel" | "restore" } */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!sammeOpphav(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const admin = await krevAdmin();
  if (admin instanceof NextResponse) return admin;
  const { action } = (await req.json().catch(() => ({}))) as { action?: string };
  if (action !== 'checkin' && action !== 'undo-checkin' && action !== 'cancel' && action !== 'restore') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
  const before = await getRegistration((await params).id);
  if (!before) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const reg = await setStatus(before.id, action, admin.epost);
  if (!reg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const type = (
    { checkin: 'innsjekket', 'undo-checkin': 'innsjekk_angret', cancel: 'avbestilt', restore: 'gjenopprettet' } as const
  )[action];
  const endret =
    (action === 'checkin' && !before.checkedInAt) ||
    (action === 'undo-checkin' && before.checkedInAt) ||
    (action === 'cancel' && !before.cancelledAt) ||
    (action === 'restore' && before.cancelledAt);
  if (endret) await loggHendelse(type, { aktor: admin.epost, epost: reg.email, registrering: reg.nr, summit: reg.summit });
  return NextResponse.json({ ...reg, alreadyCheckedIn: action === 'checkin' && Boolean(before.checkedInAt) });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!sammeOpphav(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const admin = await krevAdmin();
  if (admin instanceof NextResponse) return admin;
  const reg = await deleteRegistration((await params).id);
  if (!reg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await loggHendelse('slettet', { aktor: admin.epost, epost: reg.email, registrering: reg.nr, summit: reg.summit, detaljer: { navn: reg.name } });
  return NextResponse.json({ message: 'Deleted' });
}
