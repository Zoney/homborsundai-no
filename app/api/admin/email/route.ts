import { NextRequest, NextResponse } from 'next/server';
import { krevAdmin } from '@/lib/api';
import { loggHendelse } from '@/lib/hendelser';
import { getAllRegistrations } from '@/lib/registrations';
import { renderCampaignEmail, sendCampaignEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

type Cohort = 'interested_2025_2' | 'signedup_2025_2' | 'previous_events';

function parseEmails(input?: string[] | string): string[] {
  if (!input) return [];
  const text = Array.isArray(input) ? input.join('\n') : input;
  return text
    .split(/[\n,;\s]+/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

function filterRecipients(
  rows: any[],
  cohorts: Cohort[],
  opts?: {
    includeSummits?: string[];
    includeEmails?: string[];
    excludeEmails?: string[];
    overrideRecipients?: string[];
  }
): string[] {
  const includeSummits = (opts?.includeSummits || []).map(s => String(s));
  const includeEmails = new Set((opts?.includeEmails || []).map(e => e.toLowerCase()));
  const excludeEmails = new Set((opts?.excludeEmails || []).map(e => e.toLowerCase()));
  const overrideRecipients = (opts?.overrideRecipients || []).map(e => e.toLowerCase());

  if (overrideRecipients.length > 0) {
    return overrideRecipients.filter(e => !excludeEmails.has(e));
  }

  const emails = new Set<string>();
  for (const r of rows) {
    const email = (r.email || '').trim().toLowerCase();
    if (!email || r.cancelledAt) continue;
    if (excludeEmails.has(email)) continue;

    const isInterested2025_2 = r.summit === '2025.2';
    const isSignedup2025_2 = r.summit === '2025.2.signedup';
    const isPreviousEvent = r.summit === '2024' || r.summit === '2025.1';
    const isIncludedSummit = includeSummits.length > 0 ? includeSummits.includes(r.summit) : false;

    const inCohort =
      (cohorts.includes('interested_2025_2') && isInterested2025_2) ||
      (cohorts.includes('signedup_2025_2') && isSignedup2025_2) ||
      (cohorts.includes('previous_events') && isPreviousEvent);

    if (inCohort || isIncludedSummit || includeEmails.has(email)) {
      emails.add(email);
    }
  }
  return Array.from(emails);
}

export async function POST(req: NextRequest) {
  const admin = await krevAdmin();
  if (admin instanceof NextResponse) return admin;

  try {
    const body = await req.json();
    const cohorts: Cohort[] = body.cohorts || [];
    const includeSummits: string[] = body.includeSummits || [];
    const includeEmails = parseEmails(body.includeEmails);
    const excludeEmails = parseEmails(body.excludeEmails);
    const overrideRecipients = parseEmails(body.overrideRecipients);
    const subject: string = body.subject || '';
    const preheader: string = body.preheader || '';
    const intro: string = body.intro || '';
    const contentHtml: string = body.contentHtml || '';
    const incomingHeaders = req.headers;
    const protocol = incomingHeaders.get('x-forwarded-proto') ?? 'http';
    const host = incomingHeaders.get('host');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BETTER_AUTH_URL || `${protocol}://${host}`;

    let cta = body.cta && body.cta.url && body.cta.label ? body.cta as { label: string; url: string } : undefined;
    if (cta && !/^https?:\/\//i.test(cta.url)) {
      cta = { ...cta, url: new URL(cta.url, baseUrl).toString() };
    }
    const footerNote: string | undefined = body.footerNote || undefined;

    if (!subject || !contentHtml || (cohorts.length === 0 && includeSummits.length === 0 && includeEmails.length === 0 && overrideRecipients.length === 0)) {
      return NextResponse.json({ error: 'Missing subject, contentHtml, or recipients' }, { status: 400 });
    }

    const html = renderCampaignEmail({
      title: subject,
      preheader,
      intro,
      bodyHtml: contentHtml,
      cta,
      footerNote,
    });

    const all = await getAllRegistrations();
    const recipients = filterRecipients(all, cohorts, { includeSummits, includeEmails, excludeEmails, overrideRecipients });

    if (recipients.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, recipients: [] });
    }

    // Basic send loop; consider batching/sleeping in the future
    let sent = 0;
    for (const to of recipients) {
      const res = await sendCampaignEmail({ to, subject, html });
      if (res.ok) sent += 1;
    }

    await loggHendelse('kampanje_sendt', { aktor: admin.epost, detaljer: { emne: subject, mottakere: recipients.length, sendt: sent } });
    return NextResponse.json({ ok: true, sent, recipients });
  } catch (err) {
    console.error(JSON.stringify({ app: 'hai', niva: 'error', hendelse: 'kampanje_feilet' }));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
