import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const t = await getTranslations('Admin');
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="container mx-auto py-10 text-center">
        <a className="underline" href="/api/auth/signin">{t('signIn')}</a>
      </div>
    );
  }

  const incomingHeaders = headers();
  const protocol = incomingHeaders.get('x-forwarded-proto') ?? 'http';
  const host = incomingHeaders.get('host');
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/summit/registrations`, {
    cache: 'no-store',
  });
  const { summitCounts } = (await res.json()) as {
    summitCounts: Record<string, number>;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(summitCounts).map(([summit, count]) => (
        <Card key={summit}>
          <CardHeader>
            <CardTitle>{t('summitLabel', { year: summit })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{t('registrationsCount', { count })}</p>
            <Link className="underline" href={`/api/admin/registrations?summit=${summit}`}>{t('downloadJson')}</Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
