import VerifyTicket from '@/components/verify-ticket';
import { getTranslations } from 'next-intl/server';

export default async function VerifyPage() {
  const t = await getTranslations('Admin');
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{t('verifyTitle')}</h1>
      <VerifyTicket />
    </main>
  );
}
