"use client";
import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminRegistrations() {
  const { data, mutate } = useSWR('/api/admin/registrations', fetcher);
  if (!data) return <p>Loading...</p>;
  return (
    <div className="space-y-4">
      {data.registrations.map((reg: any) => (
        <RegistrationItem key={reg.id} reg={reg} onUpdated={mutate} />
      ))}
    </div>
  );
}

function RegistrationItem({ reg, onUpdated }: { reg: any; onUpdated: () => void }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(reg);

  const save = async () => {
    await fetch(`/api/admin/registrations/${reg.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setEdit(false);
    onUpdated();
  };

  return (
    <div className="border p-4 rounded-md">
      {edit ? (
        <div className="space-y-2">
          <input
            className="w-full border p-1 text-black"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full border p-1 text-black"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full border p-1 text-black"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
          <textarea
            className="w-full border p-1 text-black"
            value={form.comment}
            onChange={e => setForm({ ...form, comment: e.target.value })}
            placeholder="Comment"
          />
          <div className="flex space-x-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => {
              setEdit(false);
              setForm(reg); // Reset form to original data
            }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{reg.name}</p>
            <p className="text-sm text-gray-400">{reg.email}</p>
            {reg.phone && <p className="text-sm text-gray-400">{reg.phone}</p>}
            {reg.comment && <p className="text-sm text-gray-500 mt-1">Comment: {reg.comment}</p>}
          </div>
          <Button variant="secondary" onClick={() => setEdit(true)}>
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
