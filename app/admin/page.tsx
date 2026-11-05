import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { summitLabel } from '@/lib/email';
import { summaryBySummit } from '@/lib/registrations';
import { hentHendelser, HENDELSE_TYPER } from '@/lib/hendelser';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [summits, recent] = await Promise.all([summaryBySummit(), hentHendelser({ grense: 8 })]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {summits.map((s) => (
          <Card key={s.summit}>
            <CardHeader>
              <CardTitle>{summitLabel(s.summit).title}</CardTitle>
              <p className="text-xs text-gray-500">{s.summit}</p>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>
                <strong>{s.active}</strong> signed up{s.cancelled ? `, ${s.cancelled} cancelled` : ''}
              </p>
              <p>{s.checkedIn} checked in</p>
              <p className="pt-2 space-x-3">
                <Link className="underline" href={`/admin/registrations?summit=${encodeURIComponent(s.summit)}`}>
                  Open
                </Link>
                <a className="underline" href={`/api/admin/registrations?summit=${encodeURIComponent(s.summit)}`}>
                  Download JSON
                </a>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Latest activity</h2>
        <ul className="text-sm space-y-1">
          {recent.map((h) => (
            <li key={h.id}>
              <span className="text-gray-500">{new Date(h.tid).toLocaleString('en-GB', { timeZone: 'Europe/Oslo' })}</span> ·{' '}
              {HENDELSE_TYPER[h.type] ?? h.type}
              {h.epost ? ` · ${h.epost}` : ''}
              {h.summit ? ` · ${h.summit}` : ''}
            </li>
          ))}
        </ul>
        <Link className="underline text-sm" href="/admin/activity">
          The whole activity log
        </Link>
      </section>
    </div>
  );
}
