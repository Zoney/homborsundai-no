// Who may do what.
// - Everyone with an @homborsundai.no address is admin automatically.
// - HAI_SUPERADMIN (comma-separated, oyvind@zoney.no in production) is admin and can make
//   other people admin, and remove them, at /admin/admins. Those are rows in the "admin" table.
// - Everyone who has signed up for a summit can log in with that address to see their tickets.

import { headers } from "next/headers";
import { SKJEMA, dbKonfigurert, sikreSkjema, sql } from "./db";

export const ADMIN_DOMENE = "homborsundai.no";

function liste(v: string | undefined): string[] {
  return (v ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function normEpost(e: string | null | undefined): string {
  return (e ?? "").trim().toLowerCase();
}

export function erSuperadmin(epost: string | null | undefined): boolean {
  const e = normEpost(epost);
  return Boolean(e) && liste(process.env.HAI_SUPERADMIN).includes(e);
}

export function erDomeneAdmin(epost: string | null | undefined): boolean {
  return normEpost(epost).endsWith(`@${ADMIN_DOMENE}`);
}

export async function erAdmin(epost: string | null | undefined): Promise<boolean> {
  const e = normEpost(epost);
  if (!e) return false;
  if (erSuperadmin(e) || erDomeneAdmin(e)) return true;
  const r = await sql().query(`select 1 from ${SKJEMA}.admin where epost = $1`, [e]);
  return r.rowCount! > 0;
}

/** May this address log in? Admins, and everyone who has signed up with it (also locally @example.com). */
export async function kanLoggeInn(epost: string | null | undefined): Promise<boolean> {
  const e = normEpost(epost);
  if (!e) return false;
  if (process.env.HAI_MILJO !== "production" && e.endsWith("@example.com")) return true;
  if (await erAdmin(e)) return true;
  const r = await sql().query(`select 1 from ${SKJEMA}.registrering where lower(epost) = $1 limit 1`, [e]);
  return r.rowCount! > 0;
}

export type Viewer = { userId: string; epost: string; navn: string; admin: boolean; superadmin: boolean };

/** The logged-in user, or null. Never throws for a missing database (the public pages work without one). */
export async function hentViewer(): Promise<Viewer | null> {
  if (!dbKonfigurert()) return null;
  await sikreSkjema();
  const { getAuth } = await import("./auth");
  const s = await getAuth().api.getSession({ headers: await headers() });
  const epost = normEpost(s?.user?.email);
  if (!s || !epost) return null;
  return { userId: s.user.id, epost, navn: s.user.name, admin: await erAdmin(epost), superadmin: erSuperadmin(epost) };
}
