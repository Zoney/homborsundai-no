import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllRegistrations } from '@/lib/registrations';

type Cohort = 'interested_2025_2' | 'signedup_2025_2' | 'previous_events';

function parseEmails(input?: string[] | string): string[] {
  if (!input) return [];
  const text = Array.isArray(input) ? input.join('\n') : input;
  return text
    .split(/[\n,;\s]+/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const cohorts: Cohort[] = body.cohorts || [];
    const includeSummits: string[] = body.includeSummits || [];
    const includeEmails = parseEmails(body.includeEmails);
    const excludeEmails = new Set(parseEmails(body.excludeEmails));

    const all = await getAllRegistrations();

    // Build a map email -> info
    const map = new Map<string, { email: string; name?: string; summits: Set<string> }>();

    for (const r of all) {
      const email = (r.email || '').trim().toLowerCase();
      if (!email) continue;
      if (excludeEmails.has(email)) continue;

      const isInterested2025_2 = r.summit === '2025.2';
      const isSignedup2025_2 = r.summit === '2025.2.signedup';
      const isPreviousEvent = r.summit === '2024' || r.summit === '2025.1';
      const isIncludedSummit = includeSummits.length > 0 ? includeSummits.includes(r.summit) : false;

      const inCohort =
        (cohorts.includes('interested_2025_2') && isInterested2025_2) ||
        (cohorts.includes('signedup_2025_2') && isSignedup2025_2) ||
        (cohorts.includes('previous_events') && isPreviousEvent);

      const shouldAdd = inCohort || isIncludedSummit || includeEmails.includes(email);
      if (!shouldAdd) continue;

      if (!map.has(email)) {
        map.set(email, { email, name: r.name, summits: new Set() });
      }
      map.get(email)!.summits.add(r.summit);
    }

    const recipients = Array.from(map.values()).map((v) => ({
      email: v.email,
      name: v.name,
      summits: Array.from(v.summits),
    }));

    return NextResponse.json({ ok: true, recipients, count: recipients.length });
  } catch (err) {
    console.error('Preview recipients error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

