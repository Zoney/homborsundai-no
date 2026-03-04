import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllRegistrations, getRegistrationsForSummit } from '@/lib/registrations';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = new URL(req.url);
  const summit = url.searchParams.get('summit');
  const registrations = summit
    ? await getRegistrationsForSummit(summit)
    : await getAllRegistrations();
  return NextResponse.json({ registrations });
}
