"use client";

import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Event = {
  id: number;
  tid: string;
  type: string;
  aktor: string | null;
  epost: string | null;
  registrering: number | null;
  summit: string | null;
  detaljer: Record<string, unknown> | null;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const fmt = (d: string) => new Date(d).toLocaleString("en-GB", { timeZone: "Europe/Oslo" });

export default function AdminActivity() {
  const [type, setType] = useState("");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [older, setOlder] = useState<Event[]>([]);
  const url = `/api/admin/activity?limit=200${type ? `&type=${type}` : ""}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
  const { data, error } = useSWR<{ events: Event[]; types: Record<string, string> }>(url, fetcher, { refreshInterval: 30_000 });
  const events = [...(data?.events ?? []), ...older];
  const types = data?.types ?? {};

  const loadMore = async () => {
    const last = events[events.length - 1];
    if (!last) return;
    const r = await fetcher(`${url}&before=${last.id}`);
    setOlder((o) => [...o, ...(r.events ?? [])]);
  };

  if (error) return <p className="text-destructive">Could not load the activity log.</p>;

  return (
    <div className="space-y-4">
      <form
        className="flex flex-wrap gap-2 items-end"
        onSubmit={(e) => {
          e.preventDefault();
          setOlder([]);
          setQuery(q.trim());
        }}
      >
        <label className="text-sm">
          Type
          <select
            className="ml-2 rounded-md border px-2 py-1 bg-white text-black"
            value={type}
            onChange={(e) => {
              setOlder([]);
              setType(e.target.value);
            }}
          >
            <option value="">All</option>
            {Object.entries(types).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <input className="rounded-md border px-2 py-1 bg-white text-black" placeholder="E-mail or summit" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>

      {!data ? (
        <p>Loading…</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-3">When</th>
                <th className="py-2 pr-3">What</th>
                <th className="py-2 pr-3">Who did it</th>
                <th className="py-2 pr-3">About</th>
                <th className="py-2 pr-3">Summit</th>
                <th className="py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {events.map((h) => (
                <tr key={h.id} className="border-b align-top">
                  <td className="py-1 pr-3 whitespace-nowrap">{fmt(h.tid)}</td>
                  <td className="py-1 pr-3">{types[h.type] ?? h.type}</td>
                  <td className="py-1 pr-3 break-all">{h.aktor ?? "–"}</td>
                  <td className="py-1 pr-3 break-all">
                    {h.epost ?? ""}
                    {h.registrering ? ` #${h.registrering}` : ""}
                  </td>
                  <td className="py-1 pr-3">{h.summit ?? ""}</td>
                  <td className="py-1 text-xs text-gray-500">
                    {h.detaljer
                      ? Object.entries(h.detaljer)
                          .map(([k, v]) => `${k}: ${String(v)}`)
                          .join(", ")
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(data.events.length === 200 || older.length > 0) && (
            <Button variant="outline" size="sm" className="mt-3" onClick={loadMore}>
              Older
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
