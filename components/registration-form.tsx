"use client";

// The summit signup form. No third-party bot check (the site has no Cloudflare/Turnstile
// any more): a hidden honeypot field, the time spent on the form and a rate limit on the
// server stop the simple bots. Everyone who signs up gets an e-mail with their ticket.

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

const input =
  "w-full px-3 py-2 bg-ferra-700 border border-ferra-600 rounded-md text-white placeholder-rosebud-400 focus:outline-hidden focus:ring-2 focus:ring-copperrose focus:border-transparent";

export type RegistrationFormProps = {
  year: string;
  summitKey: string;
  title: ReactNode;
  descriptions: ReactNode[];
  commentPlaceholder: string;
  submitLabel: string;
  successTitle: ReactNode;
  successSubtitle: ReactNode;
  successBody: ReactNode;
  footerNotice?: string;
};

export default function RegistrationForm(p: RegistrationFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", comment: "", website: "" });
  const startedAt = useRef<number>(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ ticketUrl?: string; message?: string; existing?: boolean } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required");
    if (!form.email.trim()) return setError("E-mail is required, so we can send you your ticket");
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/summit/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, summit: p.summitKey, startedAt: startedAt.current }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) setDone({ ticketUrl: j.ticketUrl, message: j.message, existing: j.existing });
      else setError(j.error || "Registration failed. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const back = (
    <div className="w-full pt-6 pb-2">
      <div className="container mx-auto px-4 md:px-6">
        <Link href={`/summit/${p.year}`} className="inline-flex items-center gap-2 text-rosebud-200 hover:text-rosebud transition-colors duration-200 group">
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to Summit</span>
        </Link>
      </div>
    </div>
  );

  if (done) {
    return (
      <main className="flex flex-col min-h-screen bg-gradient-cool text-white">
        {back}
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-ferra border-ferra-600 shadow-xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-rosebud-100">{done.existing ? "You're already in!" : p.successTitle}</CardTitle>
              <CardDescription className="text-rosebud-200">{p.successSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center text-rosebud-200">
              {done.existing ? <p>{done.message}</p> : p.successBody}
              <p className="text-sm">
                {done.existing ? "Check your inbox for the ticket." : "We have e-mailed you your ticket with the QR code. Check the spam folder if it does not show up."}
              </p>
              {done.ticketUrl && (
                <Button asChild className="w-full bg-linear-to-r from-copperrose to-ferra hover:from-copperrose-600 hover:to-ferra-600 text-white">
                  <Link href={done.ticketUrl}>Show my ticket</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full bg-transparent text-rosebud-100 border-rosebud-300 hover:bg-white/10 hover:text-white">
                <Link href={`/summit/${p.year}`}>Return to Summit Page</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-cool text-white">
      {back}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-ferra border-ferra-600 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-rosebud-100">{p.title}</CardTitle>
            {p.descriptions.map((d, i) => (
              <CardDescription key={i} className="text-rosebud-200">
                {d}
              </CardDescription>
            ))}
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-rosebud-100 mb-1">
                  Name <span className="text-copperrose">*</span>
                </label>
                <input type="text" id="name" name="name" autoComplete="name" value={form.name} onChange={change} required maxLength={200} className={input} placeholder="Your full name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-rosebud-100 mb-1">
                  Email <span className="text-copperrose">*</span>
                </label>
                <input type="email" id="email" name="email" autoComplete="email" value={form.email} onChange={change} required maxLength={254} className={input} placeholder="you@example.com" />
                <p className="mt-1 text-xs text-rosebud-400">We send your ticket here.</p>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-rosebud-100 mb-1">
                  Phone
                </label>
                <input type="tel" id="phone" name="phone" autoComplete="tel" value={form.phone} onChange={change} maxLength={50} className={input} placeholder="+47 123 45 678" />
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-rosebud-100 mb-1">
                  What should we know?
                </label>
                <textarea id="comment" name="comment" value={form.comment} onChange={change} rows={3} maxLength={2000} className={`${input} resize-none`} placeholder={p.commentPlaceholder} />
              </div>
              {/* Honeypot: hidden from people, bots fill it in */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                <label htmlFor="website">Website</label>
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={change} />
              </div>

              {error && <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-md p-3">{error}</div>}

              <Button
                type="submit"
                disabled={busy || !form.name.trim() || !form.email.trim()}
                className="w-full bg-linear-to-r from-copperrose to-ferra hover:from-copperrose-600 hover:to-ferra-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? "Submitting..." : p.submitLabel}
              </Button>
            </form>
            <p className="text-xs text-rosebud-400 text-center mt-4">
              <span className="text-copperrose">*</span> Required field ·{" "}
              <Link className="underline" href="/personvern">
                Privacy
              </Link>
            </p>
            {p.footerNotice && <p className="mt-6 text-sm text-rosebud-200 text-center">{p.footerNotice}</p>}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
