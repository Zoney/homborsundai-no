import { getRegistration } from '@/lib/registrations';
import QRCode from 'qrcode';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function TicketPage({ params }: { params: { id: string } }) {
  const t = await getTranslations('VerifyTicket');
  const decodedId = decodeURIComponent(params.id);
  const reg = await getRegistration(decodedId);

  if (!reg) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-cool text-white">
        <p>{t('ticketNotFound')}</p>
      </div>
    );
  }

  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(params.id, { width: 200 });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    // Handle error appropriately, maybe show a placeholder or error message
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gradient-cool text-white">
      <h1 className="text-2xl font-bold">{t('yourTicket')}</h1>
      {qrDataUrl ? (
        <Image src={qrDataUrl} alt={t('qrAlt')} className="bg-white p-2 rounded" width={200} height={200} />
      ) : (
        <p>{t('couldNotGenerate')}</p>
      )}
      <p className="text-rosebud-200 text-sm">{t('present')}</p>
    </main>
  );
}
