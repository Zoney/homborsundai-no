// Summit signups in Postgres (before November 2026 they lived in Convex, and before that in
// Firestore and Upstash Redis). The API shape (`RegistrationData`) is the one the admin pages
// and the Slack command already used, so the token is still called `id`.

import { randomBytes } from "node:crypto";
import { SKJEMA, sikreSkjema, sql } from "./db";

export interface RegistrationData {
  id: string; // the ticket token (secret: in the ticket link and the QR code)
  nr: number; // internal number, safe for logs
  name: string;
  email: string;
  phone: string;
  comment: string;
  summit: string;
  timestamp: string;
  cancelledAt: string | null;
  checkedInAt: string | null;
  checkedInBy: string | null;
  source: string;
}

const KOLONNER = `nr, token, summit, navn, epost, telefon, kommentar, opprettet, avbestilt, innsjekket, innsjekket_av, kilde`;

function rad(x: Record<string, any>): RegistrationData {
  const iso = (d: unknown) => (d ? new Date(d as string).toISOString() : null);
  return {
    id: x.token,
    nr: Number(x.nr),
    name: x.navn,
    email: x.epost ?? "",
    phone: x.telefon ?? "",
    comment: x.kommentar ?? "",
    summit: x.summit,
    timestamp: iso(x.opprettet)!,
    cancelledAt: iso(x.avbestilt),
    checkedInAt: iso(x.innsjekket),
    checkedInBy: x.innsjekket_av ?? null,
    source: x.kilde,
  };
}

/** A new ticket token: 192 random bits, URL-safe. */
export function nyToken(): string {
  return randomBytes(24).toString("base64url");
}

/** Accepts both the raw token and the URL-encoded form old QR codes contain. */
export function rensToken(t: string): string {
  let s = t.trim();
  try {
    if (s.includes("%")) s = decodeURIComponent(s);
  } catch {
    // keep as is
  }
  // A scanned QR code may contain the whole ticket link
  const m = s.match(/\/ticket\/([^/?#]+)/);
  if (m) {
    try {
      s = decodeURIComponent(m[1]);
    } catch {
      s = m[1];
    }
  }
  return s.slice(0, 200);
}

export async function getAllRegistrations(): Promise<RegistrationData[]> {
  await sikreSkjema();
  const r = await sql().query(`select ${KOLONNER} from ${SKJEMA}.registrering order by opprettet desc`);
  return r.rows.map(rad);
}

export async function getRegistrationsForSummit(summit: string): Promise<RegistrationData[]> {
  await sikreSkjema();
  const r = await sql().query(`select ${KOLONNER} from ${SKJEMA}.registrering where summit = $1 order by opprettet desc`, [summit]);
  return r.rows.map(rad);
}

export async function getRegistration(token: string): Promise<RegistrationData | null> {
  await sikreSkjema();
  const r = await sql().query(`select ${KOLONNER} from ${SKJEMA}.registrering where token = $1`, [rensToken(token)]);
  return r.rows[0] ? rad(r.rows[0]) : null;
}

export async function getRegistrationsForEmail(epost: string): Promise<RegistrationData[]> {
  await sikreSkjema();
  const r = await sql().query(`select ${KOLONNER} from ${SKJEMA}.registrering where lower(epost) = $1 order by opprettet desc`, [
    epost.trim().toLowerCase(),
  ]);
  return r.rows.map(rad);
}

export async function findActiveForEmail(summit: string, epost: string): Promise<RegistrationData | null> {
  await sikreSkjema();
  const r = await sql().query(
    `select ${KOLONNER} from ${SKJEMA}.registrering where summit = $1 and lower(epost) = $2 order by avbestilt nulls first, opprettet desc limit 1`,
    [summit, epost.trim().toLowerCase()],
  );
  return r.rows[0] ? rad(r.rows[0]) : null;
}

export async function createRegistration(data: { summit: string; name: string; email: string; phone?: string; comment?: string }): Promise<RegistrationData> {
  await sikreSkjema();
  const r = await sql().query(
    `insert into ${SKJEMA}.registrering (token, summit, navn, epost, telefon, kommentar) values ($1, $2, $3, $4, $5, $6) returning ${KOLONNER}`,
    [nyToken(), data.summit, data.name, data.email.trim().toLowerCase(), data.phone || null, data.comment || null],
  );
  return rad(r.rows[0]);
}

export async function updateRegistration(
  token: string,
  data: Partial<Pick<RegistrationData, "name" | "email" | "phone" | "comment" | "summit">>,
): Promise<RegistrationData | null> {
  await sikreSkjema();
  const felt: Record<string, string | undefined> = {
    navn: data.name?.trim(),
    epost: data.email?.trim().toLowerCase(),
    telefon: data.phone?.trim(),
    kommentar: data.comment?.trim(),
    summit: data.summit?.trim(),
  };
  const sett: string[] = [];
  const verdier: unknown[] = [];
  for (const [k, v] of Object.entries(felt)) {
    if (v === undefined) continue;
    if (k === "navn" && !v) continue; // a name is required
    verdier.push(v || null);
    sett.push(`${k} = $${verdier.length}`);
  }
  if (sett.length === 0) return getRegistration(token);
  verdier.push(rensToken(token));
  const r = await sql().query(`update ${SKJEMA}.registrering set ${sett.join(", ")} where token = $${verdier.length} returning ${KOLONNER}`, verdier);
  return r.rows[0] ? rad(r.rows[0]) : null;
}

export async function setStatus(
  token: string,
  status: "cancel" | "restore" | "checkin" | "undo-checkin",
  av?: string,
): Promise<RegistrationData | null> {
  await sikreSkjema();
  const sett = {
    cancel: `avbestilt = coalesce(avbestilt, now())`,
    restore: `avbestilt = null`,
    checkin: `innsjekket = coalesce(innsjekket, now()), innsjekket_av = coalesce(innsjekket_av, $2)`,
    "undo-checkin": `innsjekket = null, innsjekket_av = null`,
  }[status];
  const verdier: unknown[] = [rensToken(token)];
  if (status === "checkin") verdier.push(av ?? null);
  const r = await sql().query(`update ${SKJEMA}.registrering set ${sett} where token = $1 returning ${KOLONNER}`, verdier);
  return r.rows[0] ? rad(r.rows[0]) : null;
}

export async function deleteRegistration(token: string): Promise<RegistrationData | null> {
  await sikreSkjema();
  const r = await sql().query(`delete from ${SKJEMA}.registrering where token = $1 returning ${KOLONNER}`, [rensToken(token)]);
  return r.rows[0] ? rad(r.rows[0]) : null;
}

export async function countRegistrations(): Promise<number> {
  await sikreSkjema();
  const r = await sql().query(`select count(*)::int as n from ${SKJEMA}.registrering where avbestilt is null`);
  return r.rows[0].n;
}

export type SummitSummary = { summit: string; total: number; active: number; cancelled: number; checkedIn: number };

export async function summaryBySummit(): Promise<SummitSummary[]> {
  await sikreSkjema();
  const r = await sql().query(`select summit, count(*)::int as total,
      count(*) filter (where avbestilt is null)::int as active,
      count(*) filter (where avbestilt is not null)::int as cancelled,
      count(*) filter (where innsjekket is not null)::int as checked_in
    from ${SKJEMA}.registrering group by summit order by summit desc`);
  return r.rows.map((x) => ({ summit: x.summit, total: x.total, active: x.active, cancelled: x.cancelled, checkedIn: x.checked_in }));
}
