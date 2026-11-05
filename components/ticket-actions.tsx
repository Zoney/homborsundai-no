"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TicketActions({
  token,
  cancelled,
  canRestore,
  checkedIn,
}: {
  token: string;
  cancelled: boolean;
  canRestore: boolean;
  checkedIn: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (checkedIn && !cancelled) return null;
  if (cancelled && !canRestore) return null;

  const run = async (action: "cancel" | "restore") => {
    if (action === "cancel" && !window.confirm("Cancel your signup? You can sign up again later.")) return;
    setBusy(true);
    setError("");
    const r = await fetch("/api/ticket", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, action }),
    }).catch(() => null);
    setBusy(false);
    if (!r?.ok) {
      setError("That did not work. Try again in a moment.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-2">
      {cancelled ? (
        <Button onClick={() => run("restore")} disabled={busy} className="bg-copperrose hover:bg-copperrose-600 text-white">
          {busy ? "One moment…" : "Sign me up again"}
        </Button>
      ) : (
        <Button onClick={() => run("cancel")} disabled={busy} variant="outline" className="bg-transparent text-rosebud-100 border-rosebud-300 hover:bg-white/10 hover:text-white">
          {busy ? "One moment…" : "I can't come after all"}
        </Button>
      )}
      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
}
