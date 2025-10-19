import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ReactNode } from 'react';
import AdminShell from '@/components/admin-shell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="container mx-auto py-10 text-center">
        <a className="underline" href="/api/auth/signin">Sign in with Google</a>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/registrations', label: 'Registrations' },
    { href: '/admin/verify', label: 'Verify Ticket' },
    { href: '/admin/email', label: 'Email Campaigns' },
  ];

  return (
    <AdminShell navItems={navItems}>
      {children}
    </AdminShell>
  );
}
