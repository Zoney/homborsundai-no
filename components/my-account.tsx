"use client";

// Passkeys, log out and «Delete my account» on /my-tickets.

import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authKlient } from "@/lib/auth-klient";

type Passkey = { id: string; name?: string | null; createdAt: string | Date };

export default function MyAccount() {
  const router = useRouter();
  const { data: passkeys, mutate } = useSWR("passkeys", async () => ((await authKlient.passkey.listUserPasskeys()).data as Passkey[] | null) ?? []);
  const [msg, setMsg] = useState("");
  const [alsoRegs, setAlsoRegs] = useState(false);
  const load = () => mutate();

  const add = async () => {
    setMsg("");
    const r = await authKlient.passkey.addPasskey({ name: "Homborsund AI" });
    if (r?.error) setMsg("No passkey was made.");
    else {
      setMsg("Passkey added. Next time you can log in without a code.");
      void load();
    }
  };

  const remove = async (id: string) => {
    await authKlient.passkey.deletePasskey({ id });
    void load();
  };

  const logout = async () => {
    await authKlient.signOut();
    router.replace("/");
    router.refresh();
  };

  const deleteAccount = async () => {
    const text = alsoRegs
      ? "Delete your account AND all your signups? Your ticket links stop working. This cannot be undone."
      : "Delete your account? Your signups and ticket links stay as they are.";
    if (!window.confirm(text)) return;
    const r = await fetch("/api/me", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ registrations: alsoRegs }),
    }).catch(() => null);
    if (!r?.ok) {
      setMsg("Could not delete the account. Try again, or write to oyvind@zoney.no.");
      return;
    }
    await authKlient.signOut().catch(() => {});
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-ferra-600 bg-ferra/40 p-4 space-y-3">
        <h2 className="text-lg font-semibold">Passkeys</h2>
        <p className="text-sm text-rosebud-200">Log in with Face ID, Touch ID or Windows Hello instead of a code. The secret part never leaves your device.</p>
        {passkeys && passkeys.length > 0 && (
          <ul className="space-y-2 text-sm">
            {passkeys.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2">
                <span>
                  {p.name || "Passkey"} · {new Date(p.createdAt).toLocaleDateString("en-GB")}
                </span>
                <button className="underline text-rosebud-300" onClick={() => remove(p.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <Button onClick={add} className="bg-copperrose hover:bg-copperrose-600 text-white">
          Add a passkey
        </Button>
      </section>

      <section className="flex flex-wrap gap-3">
        <Button variant="outline" className="bg-transparent text-rosebud-100 border-rosebud-300 hover:bg-white/10 hover:text-white" onClick={logout}>
          Log out
        </Button>
      </section>

      <section className="rounded-lg border border-red-900 bg-red-950/30 p-4 space-y-3">
        <h2 className="text-lg font-semibold">Delete my account</h2>
        <p className="text-sm text-rosebud-200">Deletes your account, your passkeys and your logins.</p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={alsoRegs} onChange={(e) => setAlsoRegs(e.target.checked)} />
          Also delete all my summit signups (the tickets stop working)
        </label>
        <Button variant="destructive" onClick={deleteAccount}>
          Delete my account
        </Button>
      </section>
      {msg && <p className="text-sm text-rosebud-100">{msg}</p>}
    </div>
  );
}
