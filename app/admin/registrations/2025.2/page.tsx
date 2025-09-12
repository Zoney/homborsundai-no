import AdminRegistrations from '@/components/admin-registrations';

export const dynamic = 'force-dynamic';

export default function Registrations2025_2Page() {
  return (
    <main className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">2025.2 Registrations</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold mb-3">Interested (2025.2)</h2>
          <AdminRegistrations summit="2025.2" />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3">Signed Up (2025.2.signedup)</h2>
          <AdminRegistrations summit="2025.2.signedup" />
        </section>
      </div>
    </main>
  );
}

