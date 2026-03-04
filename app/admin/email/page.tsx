import { auth } from '@/lib/auth';
import Link from 'next/link';
import AdminEmail from '@/components/admin-email';

export default async function AdminEmailPage() {
  const session = await auth();
  if (!session) {
    return (
      <div className="container mx-auto py-10 text-center">
        <Link className="underline" href="/api/auth/signin">Sign in with Google</Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Email Campaigns</h1>
      <AdminEmail />
    </main>
  );
}
