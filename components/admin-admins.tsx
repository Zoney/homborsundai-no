"use client";

import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Data = {
  canManage: boolean;
  domain: string;
  superadmins: string[];
  added: { email: string; addedBy: string | null; addedAt: string }[];
  domainAccounts: string[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminAdmins() {
  const { data, mutate } = useSWR<Data>("/api/admin/admins", fetcher);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  if (!data) return <p>Loading…</p>;

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const r = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) setMsg(j.error ?? "Did not work");
    else {
      setEmail("");
      setMsg("Added. They log in with a code sent to that address.");
      void mutate();
    }
  };

  const remove = async (e: string) => {
    if (!window.confirm(`Remove ${e} as admin?`)) return;
    await fetch("/api/admin/admins", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: e }) });
    void mutate();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <section className="space-y-1 text-sm">
        <p>
          Everyone with an <strong>@{data.domain}</strong> address is admin automatically.
          {data.domainAccounts.length > 0 && ` Logged in so far: ${data.domainAccounts.join(", ")}.`}
        </p>
        <p>Superadmin (can add and remove admins): {data.superadmins.join(", ") || "none set"}.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Added admins</h2>
        {data.added.length === 0 ? (
          <p className="text-sm text-muted-foreground">None yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.added.map((a) => (
              <li key={a.email} className="flex items-center justify-between gap-2 border rounded-md p-2 text-sm">
                <span>
                  <strong>{a.email}</strong>
                  <span className="text-gray-500">
                    {" "}
                    · added {new Date(a.addedAt).toLocaleDateString("en-GB")}
                    {a.addedBy ? ` by ${a.addedBy}` : ""}
                  </span>
                </span>
                {data.canManage && (
                  <Button size="sm" variant="destructive" onClick={() => remove(a.email)}>
                    Remove
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {data.canManage ? (
        <form onSubmit={add} className="flex flex-wrap gap-2 items-center">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="rounded-md border px-2 py-1 bg-white text-black"
          />
          <Button type="submit" size="sm">
            Make admin
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">Only the superadmin can add or remove admins.</p>
      )}
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
