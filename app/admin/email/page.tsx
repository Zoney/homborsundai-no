import AdminEmail from '@/components/admin-email';

export const dynamic = 'force-dynamic';

export default function AdminEmailPage() {

  return (
    <main className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Email Campaigns</h1>
      <AdminEmail />
    </main>
  );
}
