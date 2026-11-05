"use client";
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QR_SCANNER_ELEMENT_ID = "qr-code-full-region";

type Reg = {
  id: string;
  nr: number;
  name: string;
  email: string;
  summit: string;
  cancelledAt: string | null;
  checkedInAt: string | null;
  checkedInBy: string | null;
  alreadyCheckedIn?: boolean;
};

const fmt = (d: string) => new Date(d).toLocaleString('en-GB', { timeZone: 'Europe/Oslo' });

// The door: scan the QR code on the ticket (or type the code), see who it is, check them in.
// Both old QR codes (URL-encoded "registration:…" ids) and new tokens work; the server cleans them.
export default function VerifyTicket() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<Reg | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [note, setNote] = useState('');

  const checkTicket = useCallback(async (currentCode?: string) => {
    const codeToVerify = (currentCode || code).trim();
    if (!codeToVerify) return;
    setLoading(true);
    setError('');
    setNote('');
    setResult(null);
    const res = await fetch(`/api/admin/registrations/${encodeURIComponent(codeToVerify)}`).catch(() => null);
    if (res?.ok) setResult(await res.json());
    else setError(res?.status === 404 ? 'Ticket not found' : 'Could not look the ticket up');
    setLoading(false);
  }, [code]);

  const act = async (action: 'checkin' | 'undo-checkin') => {
    if (!result) return;
    setLoading(true);
    const res = await fetch(`/api/admin/registrations/${encodeURIComponent(result.id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    }).catch(() => null);
    setLoading(false);
    if (!res?.ok) {
      setError('Could not save. Try again.');
      return;
    }
    const r: Reg = await res.json();
    setResult(r);
    setNote(action === 'checkin' ? (r.alreadyCheckedIn ? 'Was already checked in.' : 'Checked in.') : 'Check-in undone.');
  };

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (showScanner) {
      scanner = new Html5QrcodeScanner(
        QR_SCANNER_ELEMENT_ID,
        { fps: 10, qrbox: { width: 250, height: 250 }, supportedScanTypes: [0] as any },
        false,
      );
      scanner.render(
        (decodedText: string) => {
          setCode(decodedText);
          checkTicket(decodedText);
          setShowScanner(false);
        },
        () => {},
      );
    }
    return () => {
      scanner?.clear().catch(() => {});
    };
  }, [showScanner, checkTicket]);

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowScanner(!showScanner)} variant="outline">
        {showScanner ? 'Close scanner' : 'Scan QR code'}
      </Button>

      {showScanner && <div id={QR_SCANNER_ELEMENT_ID} className="w-full md:w-1/2 mx-auto"></div>}

      {!showScanner && (
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            checkTicket();
          }}
        >
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Scan or enter ticket code"
            className="w-full p-2 border rounded-sm text-black"
          />
          <Button type="submit" disabled={!code || loading}>
            {loading ? 'Checking…' : 'Look up'}
          </Button>
        </form>
      )}
      {result && (
        <div className={`border p-4 rounded-md space-y-2 ${result.cancelledAt ? 'border-red-700' : result.checkedInAt ? 'border-green-700' : ''}`}>
          <p className="text-xl font-semibold">{result.name}</p>
          {result.email && <p className="text-sm text-gray-400">{result.email}</p>}
          <p className="text-sm text-gray-400">Summit: {result.summit}</p>
          {result.cancelledAt && <p className="text-red-400">Cancelled {fmt(result.cancelledAt)}</p>}
          {result.checkedInAt && (
            <p className="text-green-400">
              Checked in {fmt(result.checkedInAt)}
              {result.checkedInBy ? ` by ${result.checkedInBy}` : ''}
            </p>
          )}
          {!result.cancelledAt &&
            (result.checkedInAt ? (
              <Button variant="outline" onClick={() => act('undo-checkin')} disabled={loading}>
                Undo check-in
              </Button>
            ) : (
              <Button onClick={() => act('checkin')} disabled={loading} className="bg-green-700 hover:bg-green-800 text-white">
                Check in
              </Button>
            ))}
          {note && <p className="text-sm">{note}</p>}
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
