import { NextRequest, NextResponse } from 'next/server';
import { krevAdmin } from '@/lib/api';
import { HENDELSE_TYPER, hentHendelser } from '@/lib/hendelser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/admin/activity?type=&q=&before=&limit= → the activity log, newest first. */
export async function GET(req: NextRequest) {
  const admin = await krevAdmin();
  if (admin instanceof NextResponse) return admin;
  const p = new URL(req.url).searchParams;
  const type = p.get('type') ?? undefined;
  const events = await hentHendelser({
    type: type && type in HENDELSE_TYPER ? type : undefined,
    sok: p.get('q')?.slice(0, 100) || undefined,
    for: Number(p.get('before')) || undefined,
    grense: Number(p.get('limit')) || 200,
  });
  return NextResponse.json({ events, types: HENDELSE_TYPER });
}
