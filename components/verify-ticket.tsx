"use client";
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const QR_SCANNER_ELEMENT_ID = "qr-code-full-region";

export default function VerifyTicket() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const checkTicket = useCallback(async (currentCode?: string) => {
    const codeToVerify = currentCode || code;
    if (!codeToVerify) return;

    setLoading(true);
    setError('');
    setResult(null);
    const res = await fetch(`/api/admin/registrations/${encodeURIComponent(codeToVerify)}`);
    if (res.ok) {
      const data = await res.json();
      setResult(data);
    } else {
      setError('Ticket not found');
    }
    setLoading(false);
  }, [code]);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (showScanner) {
      scanner = new Html5QrcodeScanner(
        QR_SCANNER_ELEMENT_ID,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [0] as any, // 0 corresponds to Html5QrcodeScanType.SCAN_TYPE_CAMERA
        },
        /* verbose= */ false
      );

      const onScanSuccess = (decodedText: string) => {
        let codeToVerify = decodedText;
        try {
          const unescapedText = decodeURIComponent(decodedText);
          codeToVerify = unescapedText;
        } catch (e) {
          console.error("Failed to decode URI component, using raw value:", e);
          setError("Failed to decode QR code, attempting to use raw value.");
          // codeToVerify remains decodedText
        }
        setCode(codeToVerify);
        checkTicket(codeToVerify); 
        setShowScanner(false); // Hide scanner after successful scan
      };

      const onScanFailure = (errorMessage: string) => {
        // handle scan failure, usually better to ignore and keep scanning.
        // console.warn(`Code scan error = ${errorMessage}`);
      };

      scanner.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner.", error);
        });
      }
    };
  }, [showScanner, checkTicket]); // Re-run effect when showScanner changes

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowScanner(!showScanner)} variant="outline">
        {showScanner ? 'Close Scanner' : 'Scan QR Code'}
      </Button>

      {showScanner && <div id={QR_SCANNER_ELEMENT_ID} className="w-full md:w-1/2 mx-auto"></div>}

      {!showScanner && (
        <>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Scan or enter ticket code"
            className="w-full p-2 border rounded text-black"
          />
          <Button onClick={() => checkTicket()} disabled={!code || loading}>
            {loading ? 'Checking...' : 'Verify Manually'}
          </Button>
        </>
      )}
      {result && (
        <div className="border p-4 rounded-md">
          <p className="font-semibold">{result.name}</p>
          {result.email && <p className="text-sm text-gray-400">{result.email}</p>}
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
