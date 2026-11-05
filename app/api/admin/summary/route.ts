import { NextResponse } from 'next/server';
import { krevAdmin } from '@/lib/api';
import { summaryBySummit } from '@/lib/registrations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Counts per summit, for admins only (never public: no seat counts on the site). */
export async function GET() {
  const admin = await krevAdmin();
  if (admin instanceof NextResponse) return admin;
  const summits = await summaryBySummit();
  const summitCounts = Object.fromEntries(summits.map((s) => [s.summit, s.active]));
  return NextResponse.json({ summits, summitCounts, totalCount: summits.reduce((n, s) => n + s.active, 0) });
}
