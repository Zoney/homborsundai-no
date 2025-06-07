import AdminRegistrations from '@/components/admin-registrations';
import { getTranslations } from 'next-intl/server';

export default async function RegistrationsPage() {
  const t = await getTranslations('Admin');
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t('registrationsTitle')}</h1>
      <AdminRegistrations />
    </main>
  );
}
