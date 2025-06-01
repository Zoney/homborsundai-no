"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function VerifyTicket() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const checkTicket = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    const res = await fetch(`/api/admin/registrations/${encodeURIComponent(code)}`);
    if (res.ok) {
      const data = await res.json();
      setResult(data);
    } else {
      setError('Ticket not found');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Scan or enter ticket code"
        className="w-full p-2 border rounded text-black"
      />
      <Button onClick={checkTicket} disabled={!code || loading}>
        {loading ? 'Checking...' : 'Verify'}
      </Button>
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
