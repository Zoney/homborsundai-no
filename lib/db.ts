// Postgres on our app server at Hetzner (the app's own database, reachable only over a
// unix socket, see husken/workshop/apper/). Production uses the schema "app",
// everything else (local dev, tests) "dev", so tests never touch real data.
// Better Auth's tables live in the same schema.

import { Pool } from "pg";

export const SKJEMA = process.env.HAI_MILJO === "production" ? "app" : "dev";

let pool: Pool | null = null;
export function sql(): Pool {
  // No error here without DATABASE_URL: the module is also loaded during the build.
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 5, options: `-c search_path=${SKJEMA}` });
  return pool;
}

export function dbKonfigurert(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

let klar: Promise<void> | null = null;

/** Creates the tables (idempotent) and runs the daily clean-up. Called before every DB use. */
export function sikreSkjema(): Promise<void> {
  klar ??= (async () => {
    const s = SKJEMA;
    const db = sql();
    await db.query(`create schema if not exists ${s}`);
    // One row per signup. "token" is the long random secret in the ticket link and the QR code
    // (registrations from before the move keep their old "registration:<time>:<random>" id).
    // "nr" is the internal number used in logs and the activity log, so the token never lands there.
    await db.query(`create table if not exists ${s}.registrering (
      nr bigserial primary key,
      token text not null unique,
      summit text not null,
      navn text not null,
      epost text,
      telefon text,
      kommentar text,
      opprettet timestamptz not null default now(),
      avbestilt timestamptz,
      innsjekket timestamptz,
      innsjekket_av text,
      ip text,
      user_agent text,
      kilde text not null default 'app')`);
    await db.query(`create index if not exists registrering_epost on ${s}.registrering (lower(epost))`);
    await db.query(`create index if not exists registrering_summit on ${s}.registrering (summit)`);
    // Admins added by the superadmin (everyone @homborsundai.no is admin without a row here).
    await db.query(`create table if not exists ${s}.admin (
      epost text primary key,
      lagt_til_av text,
      lagt_til timestamptz not null default now())`);
    // The activity log admins see. No IP addresses here.
    await db.query(`create table if not exists ${s}.hendelse (
      id bigserial primary key,
      tid timestamptz not null default now(),
      type text not null,
      aktor text,
      epost text,
      registrering bigint,
      summit text,
      detaljer jsonb)`);
    await db.query(`create index if not exists hendelse_tid on ${s}.hendelse (tid desc)`);
    const { migrer } = await import("./auth");
    await migrer();
    // Expired sessions (with IP address), codes and rate-limit counters, and activity older than
    // 24 months, are deleted at start-up, as the privacy page promises. The app sleeps when
    // nobody uses it, so this runs often.
    await db.query(`delete from session where "expiresAt" < now()`);
    await db.query(`delete from verification where "expiresAt" < now()`);
    await db.query(`delete from "rateLimit" where "lastRequest" < $1`, [Date.now() - 24 * 3600 * 1000]);
    await db.query(`delete from ${s}.hendelse where tid < now() - interval '24 months'`);
  })().catch((e) => {
    klar = null;
    throw e;
  });
  return klar;
}
