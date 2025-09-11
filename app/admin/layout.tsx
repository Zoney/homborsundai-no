import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import SignOutButton from '@/components/signout-button';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="container mx-auto py-10 text-center">
        <a className="underline" href="/api/auth/signin">Sign in with Google</a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r p-4 space-y-2 bg-gray-100 dark:bg-gray-900">
        <nav className="flex flex-col space-y-2">
          <Button asChild variant="link" className="justify-start">
            <Link href="/admin">Dashboard</Link>
          </Button>
          <Button asChild variant="link" className="justify-start">
            <Link href="/admin/registrations">Registrations</Link>
          </Button>
          <Button asChild variant="link" className="justify-start">
            <Link href="/admin/verify">Verify Ticket</Link>
          </Button>
          <div className="pt-2 border-t mt-2">
            <SignOutButton />
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
