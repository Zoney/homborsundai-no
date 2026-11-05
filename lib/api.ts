// Small helpers for the API routes.

import { NextResponse } from "next/server";
import { dbKonfigurert } from "./db";
import { hentViewer, type Viewer } from "./tilgang";

/** The logged-in admin, or a finished 401/403/503 response. */
export async function krevAdmin(opts: { superadmin?: boolean } = {}): Promise<Viewer | NextResponse> {
  if (!dbKonfigurert()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const v = await hentViewer();
  if (!v) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!v.admin || (opts.superadmin && !v.superadmin)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return v;
}

/** Same-origin check for state-changing requests from the browser. */
export function sammeOpphav(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // curl, server-side; the cookies are SameSite=Lax anyway
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** The client's IP address, as Caddy passes it on. Only used in memory (rate limits), never stored. */
export function klientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "ukjent";
}

const vinduer = new Map<string, number[]>();

/** A simple in-memory rate limit (the app is one process). True = allowed. */
export function brems(nokkel: string, maks: number, sekunder: number): boolean {
  const na = Date.now();
  const liste = (vinduer.get(nokkel) ?? []).filter((t) => na - t < sekunder * 1000);
  if (liste.length >= maks) {
    vinduer.set(nokkel, liste);
    return false;
  }
  liste.push(na);
  vinduer.set(nokkel, liste);
  if (vinduer.size > 5000) for (const [k, v] of vinduer) if (v.every((t) => na - t > 3600_000)) vinduer.delete(k);
  return true;
}
