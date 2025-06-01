import { getRegistration } from '@/lib/registrations';

export default async function TicketPage({ params }: { params: { id: string } }) {
  const reg = await getRegistration(params.id);

  if (!reg) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-cool text-white">
        <p>Ticket not found.</p>
      </div>
    );
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(params.id)}&size=200x200`;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gradient-cool text-white">
      <h1 className="text-2xl font-bold">Your Ticket</h1>
      <img src={qrUrl} alt="Ticket QR" className="bg-white p-2 rounded" />
      <p className="text-rosebud-200 text-sm">Present this code at the entrance.</p>
    </main>
  );
}
