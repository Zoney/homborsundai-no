import AdminAdmins from '@/components/admin-admins';

export const dynamic = 'force-dynamic';

export default function AdminsPage() {
  return (
    <main className="container mx-auto py-10 space-y-4">
      <h1 className="text-3xl font-bold">Admins</h1>
      <AdminAdmins />
    </main>
  );
}
