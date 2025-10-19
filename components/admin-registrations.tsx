"use client";
import useSWR from "swr";
import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DEFAULT_YEAR, SUMMIT_METADATA } from "@/lib/summit-config";

type AdminRegistrationsProps = {
  summit?: string; // optional override; if not provided, uses ?summit= from URL
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

const SUMMIT_OPTIONS = Object.entries(SUMMIT_METADATA)
  .map(([id, metadata]) => ({
    id,
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

  const searchParamSummit = summitProp ?? searchParams.get("summit") ?? undefined;
  const resolvedSummit = useMemo(() => {
    if (searchParamSummit && SUMMIT_METADATA[searchParamSummit]) {
      return searchParamSummit;
    }
    return DEFAULT_YEAR;
  }, [searchParamSummit]);

  const [activeSummit, setActiveSummit] = useState<string>(resolvedSummit);

  useEffect(() => {
    setActiveSummit(prev => (prev === resolvedSummit ? prev : resolvedSummit));
  }, [resolvedSummit]);

  const requestUrl = useMemo(() => {
    return `/api/admin/registrations?summit=${encodeURIComponent(activeSummit)}`;
  }, [activeSummit]);

  const { data, mutate, error } = useSWR(requestUrl, fetcher, {
    keepPreviousData: true,
  });

  const handleSummitChange = (value: string) => {
    setActiveSummit(value);
    const nextParams = new URLSearchParams(searchParams?.toString() ?? "");
    nextParams.set("summit", value);
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
            {SUMMIT_METADATA[activeSummit]?.title ?? `Summit ${activeSummit}`}
          </h2>
          <p className="text-sm text-muted-foreground">
            Summit ID: {activeSummit}
          </p>
        </div>
        <label className="flex flex-col text-sm font-medium text-muted-foreground md:text-right">
          Select summit
          <select
            className="mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-normal text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={activeSummit}
            onChange={e => handleSummitChange(e.target.value)}
            disabled={isRouting}
          >
            {SUMMIT_OPTIONS.map(option => (
              <option key={option.id} value={option.id}>
                {option.title} ({option.id})
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
            data.registrations.map((reg: any) => (
        <RegistrationItem key={reg.id} reg={reg} onUpdated={mutate} />
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

  const save = async () => {
    await fetch(`/api/admin/registrations/${reg.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setEdit(false);
    await onUpdated();
  };

  const deleteRegistration = async () => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      await fetch(`/api/admin/registrations/${reg.id}`, {
        method: 'DELETE',
      });
      await onUpdated();
    }
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
            {reg.summit && (
              <p className="text-xs mb-1 text-gray-400">Summit: {reg.summit}</p>
            )}
            <p className="font-semibold">{reg.name}</p>
            <p className="text-sm text-gray-400">{reg.email}</p>
            {reg.phone && <p className="text-sm text-gray-400">{reg.phone}</p>}
            {reg.comment && <p className="text-sm text-gray-500 mt-1">Comment: {reg.comment}</p>}
            <p className="text-sm text-gray-400">ID: {reg.id}</p>
            {reg.timestamp && <p className="text-sm text-gray-400">Timestamp: {new Date(reg.timestamp).toUTCString()}</p>}
          </div>
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={() => setEdit(true)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={deleteRegistration}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
