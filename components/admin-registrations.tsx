"use client";
import useSWR from "swr";
import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_YEAR,
  SUMMIT_METADATA,
  findSummitIdByRegistrationKey,
  getSummitRegistrationKey,
  normalizeSummitRegistrationKey,
} from "@/lib/summit-config";

type AdminRegistrationsProps = {
  summit?: string; // optional override; if not provided, uses ?summit= from URL
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

const SUMMIT_OPTIONS = Object.entries(SUMMIT_METADATA)
  .map(([id, metadata]) => ({
    id,
    registrationKey: getSummitRegistrationKey(id),
    title: metadata.title,
  }))
  .sort((a, b) => {
    if (a.id === DEFAULT_YEAR) return -1;
    if (b.id === DEFAULT_YEAR) return 1;
    return b.id.localeCompare(a.id, undefined, { numeric: true, sensitivity: "base" });
  });

export default function AdminRegistrations({ summit: summitProp }: AdminRegistrationsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isRouting, startTransition] = useTransition();

  const searchParamSummit = summitProp ?? searchParams.get("summit") ?? null;
  const resolvedSummit = useMemo(() => {
    return normalizeSummitRegistrationKey(searchParamSummit);
  }, [searchParamSummit]);

  const [activeSummit, setActiveSummit] = useState<string>(resolvedSummit);

  if (activeSummit !== resolvedSummit) {
    setActiveSummit(resolvedSummit);
  }

  const activeSummitId = useMemo(() => findSummitIdByRegistrationKey(activeSummit), [activeSummit]);
  const activeSummitMetadata = activeSummitId ? SUMMIT_METADATA[activeSummitId] : undefined;

  const summitOptions = useMemo(() => {
    if (SUMMIT_OPTIONS.some(option => option.registrationKey === activeSummit)) {
      return SUMMIT_OPTIONS;
    }
    return [
      {
        id: activeSummit,
        registrationKey: activeSummit,
        title: `Summit ${activeSummit}`,
      },
      ...SUMMIT_OPTIONS,
    ];
  }, [activeSummit]);

  const requestUrl = useMemo(() => {
    return `/api/admin/registrations?summit=${encodeURIComponent(activeSummit)}`;
  }, [activeSummit]);

  const { data, mutate, error } = useSWR(requestUrl, fetcher, {
    keepPreviousData: true,
  });

  const handleSummitChange = (value: string) => {
    const normalized = normalizeSummitRegistrationKey(value);
    setActiveSummit(normalized);
    const nextParams = new URLSearchParams(searchParams?.toString() ?? "");
    const shareableValue = findSummitIdByRegistrationKey(normalized) ?? normalized;
    nextParams.set("summit", shareableValue);
    const queryString = nextParams.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    });
  };

  if (error) {
    return <p className="text-destructive">Failed to load registrations. Please refresh.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Showing registrations for</p>
          <h2 className="text-2xl font-semibold">
            {activeSummitMetadata?.title ??
              (activeSummitId ? `Summit ${activeSummitId}` : `Summit ${activeSummit}`)}
          </h2>
          <p className="text-sm text-muted-foreground">
            Summit ID: {activeSummitId ?? "Unknown"}
          </p>
          {(!activeSummitId || activeSummitId !== activeSummit) && (
            <p className="text-sm text-muted-foreground">
              Registration key: {activeSummit}
            </p>
          )}
        </div>
        <label className="flex flex-col text-sm font-medium text-muted-foreground md:text-right">
          Select summit
          <select
            className="mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-normal text-foreground shadow-xs focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            value={activeSummit}
            onChange={e => handleSummitChange(e.target.value)}
            disabled={isRouting}
          >
            {summitOptions.map(option => (
              <option key={option.registrationKey} value={option.registrationKey}>
                {option.title} ({option.id}
                {option.registrationKey !== option.id ? ` • ${option.registrationKey}` : ""})
              </option>
            ))}
          </select>
        </label>
      </div>

      {!data && !error ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {data?.registrations?.length ? (
            <p className="text-sm text-muted-foreground">
              {data.registrations.filter((r: any) => !r.cancelledAt).length} signed up,{' '}
              {data.registrations.filter((r: any) => r.checkedInAt && !r.cancelledAt).length} checked in,{' '}
              {data.registrations.filter((r: any) => r.cancelledAt).length} cancelled
            </p>
          ) : null}
          {data?.registrations?.length ? (
            data.registrations.map((reg: any) => (
        <RegistrationItem key={reg.nr} reg={reg} onUpdated={mutate} />
            ))
          ) : (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              No registrations found for {activeSummit}.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RegistrationItem({ reg, onUpdated }: { reg: any; onUpdated: () => void | Promise<unknown> }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(reg);
  const path = `/api/admin/registrations/${encodeURIComponent(reg.id)}`;

  const save = async () => {
    await fetch(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, comment: form.comment }),
    });
    setEdit(false);
    await onUpdated();
  };

  const act = async (action: 'checkin' | 'undo-checkin' | 'cancel' | 'restore') => {
    await fetch(path, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    await onUpdated();
  };

  const deleteRegistration = async () => {
    if (window.confirm("Delete this registration for good? Cancelling keeps it in the list; deleting removes it.")) {
      await fetch(path, { method: 'DELETE' });
      await onUpdated();
    }
  };

  const fmt = (d: string) => new Date(d).toLocaleString('en-GB', { timeZone: 'Europe/Oslo' });

  return (
    <div className={`border p-4 rounded-md ${reg.cancelledAt ? 'opacity-60' : ''}`}>
      {edit ? (
        <div className="space-y-2">
          <input className="w-full border p-1 text-black" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
          <input className="w-full border p-1 text-black" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="E-mail" />
          <input className="w-full border p-1 text-black" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
          <textarea className="w-full border p-1 text-black" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} placeholder="Comment" />
          <div className="flex space-x-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => { setEdit(false); setForm(reg); }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            {reg.summit && <p className="text-xs mb-1 text-gray-400">Summit: {reg.summit} · #{reg.nr}</p>}
            <p className="font-semibold">
              {reg.name}
              {reg.cancelledAt && <span className="ml-2 rounded bg-red-900/40 px-2 py-0.5 text-xs">cancelled {fmt(reg.cancelledAt)}</span>}
              {reg.checkedInAt && <span className="ml-2 rounded bg-green-900/40 px-2 py-0.5 text-xs">checked in {fmt(reg.checkedInAt)}</span>}
            </p>
            <p className="text-sm text-gray-400">{reg.email}</p>
            {reg.phone && <p className="text-sm text-gray-400">{reg.phone}</p>}
            {reg.comment && <p className="text-sm text-gray-500 mt-1">Comment: {reg.comment}</p>}
            {reg.timestamp && <p className="text-sm text-gray-400">Signed up: {fmt(reg.timestamp)}</p>}
            <p className="text-sm"><a className="underline text-gray-400" href={`/ticket/${encodeURIComponent(reg.id)}`} target="_blank" rel="noreferrer">Ticket page</a></p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!reg.cancelledAt && (reg.checkedInAt
              ? <Button variant="outline" onClick={() => act('undo-checkin')}>Undo check-in</Button>
              : <Button onClick={() => act('checkin')}>Check in</Button>)}
            {reg.cancelledAt
              ? <Button variant="outline" onClick={() => act('restore')}>Restore</Button>
              : <Button variant="outline" onClick={() => act('cancel')}>Cancel signup</Button>}
            <Button variant="secondary" onClick={() => setEdit(true)}>Edit</Button>
            <Button variant="destructive" onClick={deleteRegistration}>Delete</Button>
          </div>
        </div>
      )}
    </div>
  );
}
