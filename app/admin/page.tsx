import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminRegistrations from '@/components/admin-registrations';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="container mx-auto py-10 text-center">
        <a className="underline" href="/api/auth/signin">Sign in with Google</a>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Registrations</h1>
      <AdminRegistrations />
    </main>
  );
}
