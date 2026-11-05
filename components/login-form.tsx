"use client";

// Log in: a passkey if you have made one, otherwise a code by e-mail.
// Only addresses that have signed up for a summit (and admins) get a code.

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authKlient } from "@/lib/auth-klient";

const input =
  "w-full px-3 py-2 bg-ferra-700 border border-ferra-600 rounded-md text-white placeholder-rosebud-400 focus:outline-hidden focus:ring-2 focus:ring-copperrose focus:border-transparent";

export default function LoginForm({ next = "/my-tickets" }: { next?: string }) {
  const { data } = authKlient.useSession();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const target = next.startsWith("/") && !next.startsWith("//") ? next : "/my-tickets";
  const done = () => location.replace(target);
  useEffect(() => {
    if (data) done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const withPasskey = async () => {
    setError(null);
    const r = await authKlient.signIn.passkey();
    if (r?.error) setError("No Homborsund AI passkey found on this device. Use the e-mail code instead.");
    else done();
  };

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const r = await authKlient.emailOtp.sendVerificationOtp({ email: email.trim().toLowerCase(), type: "sign-in" });
    setBusy(false);
    if (r.error) setError(r.error.status === 429 ? "Too many attempts. Wait a minute and try again." : "Could not send the code. Try again.");
    else setStep("code");
  };

  const checkCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const r = await authKlient.signIn.emailOtp({ email: email.trim().toLowerCase(), otp: code.trim() });
    setBusy(false);
    if (r.error) setError("The code is wrong or has expired. Check the e-mail, or ask for a new code.");
    else done();
  };

  return (
    <div className="space-y-4">
      {step === "email" ? (
        <>
          <form onSubmit={sendCode} className="space-y-3">
            <label htmlFor="email" className="block text-sm font-medium text-rosebud-100">
              The e-mail address you signed up with
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email webauthn"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
              placeholder="you@example.com"
            />
            <Button type="submit" disabled={busy} className="w-full bg-copperrose hover:bg-copperrose-600 text-white">
              {busy ? "Sending…" : "E-mail me a code"}
            </Button>
          </form>
          <p className="text-center text-sm text-rosebud-300">or</p>
          <Button type="button" variant="outline" onClick={withPasskey} className="w-full bg-transparent text-rosebud-100 border-rosebud-300 hover:bg-white/10 hover:text-white">
            Log in with a passkey
          </Button>
        </>
      ) : (
        <form onSubmit={checkCode} className="space-y-3">
          <p className="text-sm text-rosebud-200">
            If <strong>{email}</strong> has signed up for a summit, we have sent a code there. It is valid for ten minutes.
          </p>
          <label htmlFor="code" className="block text-sm font-medium text-rosebud-100">
            The code from the e-mail
          </label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className={input}
          />
          <Button type="submit" disabled={busy} className="w-full bg-copperrose hover:bg-copperrose-600 text-white">
            {busy ? "Logging in…" : "Log in"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setStep("email")} className="w-full text-rosebud-200 hover:bg-white/10 hover:text-white">
            Use another address
          </Button>
          <p className="text-xs text-rosebud-400">No code? Check the spam folder, and that it is the address you signed up with.</p>
        </form>
      )}
      {error && (
        <p role="alert" className="text-red-300 text-sm bg-red-900/20 border border-red-800 rounded-md p-3">
          {error}
        </p>
      )}
      <p className="text-xs text-rosebud-400 text-center">
        <Link className="underline" href="/personvern">
          Privacy
        </Link>
      </p>
    </div>
  );
}
