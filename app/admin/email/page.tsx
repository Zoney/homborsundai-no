import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminEmail from '@/components/admin-email';

export default async function AdminEmailPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="container mx-auto py-10 text-center">
        <a className="underline" href="/api/auth/signin">Sign in with Google</a>
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

