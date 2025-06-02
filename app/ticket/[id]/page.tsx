import { getRegistration } from '@/lib/registrations';
import QRCode from 'qrcode';

export default async function TicketPage({ params }: { params: { id: string } }) {
  const decodedId = decodeURIComponent(params.id);
  const reg = await getRegistration(decodedId);

  if (!reg) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-cool text-white">
        <p>Ticket not found.</p>
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
      <h1 className="text-2xl font-bold">Your Ticket</h1>
      {qrDataUrl ? (
        <img src={qrDataUrl} alt="Ticket QR" className="bg-white p-2 rounded" />
      ) : (
        <p>Could not generate QR code.</p>
      )}
      <p className="text-rosebud-200 text-sm">Present this code at the entrance.</p>
    </main>
  );
}
