import { NextRequest, NextResponse } from 'next/server';
import { krevAdmin } from '@/lib/api';
import { getAllRegistrations, getRegistrationsForSummit } from '@/lib/registrations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const admin = await krevAdmin();
  if (admin instanceof NextResponse) return admin;
  const summit = new URL(req.url).searchParams.get('summit');
  const registrations = summit ? await getRegistrationsForSummit(summit) : await getAllRegistrations();
  return NextResponse.json({ registrations });
}
