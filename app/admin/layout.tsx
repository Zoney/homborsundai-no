import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin-shell';
import { dbKonfigurert } from '@/lib/db';
import { hentViewer } from '@/lib/tilgang';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!dbKonfigurert()) {
    return <div className="container mx-auto py-10 text-center">The database is not configured.</div>;
  }
  const viewer = await hentViewer();
  if (!viewer) redirect('/login?next=/admin');
  if (!viewer.admin) {
    return (
      <div className="container mx-auto py-10 text-center space-y-2">
        <p>You are logged in as {viewer.epost}, which is not an admin.</p>
        <p>
          <Link className="underline" href="/my-tickets">
            Go to my tickets
          </Link>
        </p>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/registrations', label: 'Registrations' },
    { href: '/admin/verify', label: 'Check-in' },
    { href: '/admin/activity', label: 'Activity log' },
    { href: '/admin/email', label: 'Email Campaigns' },
    { href: '/admin/admins', label: 'Admins' },
  ];

  return (
    <AdminShell navItems={navItems} who={viewer.epost}>
      {children}
    </AdminShell>
  );
}
