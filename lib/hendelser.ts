// The activity log: who signed up, cancelled, checked in, logged in, got or lost admin,
// and when. Admins see it at /admin/activity. No IP addresses. Every entry is also
// written as one structured line to stdout (without e-mail addresses), for Utkikk.

import { SKJEMA, sql } from "./db";
import { feilTekst, logg } from "./logg";

export const HENDELSE_TYPER = {
  pameldt: "Signed up",
  pameldt_igjen: "Signed up again",
  avbestilt: "Cancelled",
  gjenopprettet: "Signup restored",
  innsjekket: "Checked in",
  innsjekk_angret: "Check-in undone",
  endret: "Signup edited",
  slettet: "Signup deleted",
  billett_sendt: "Ticket e-mail sent",
  konto_opprettet: "Account created",
  innlogget: "Logged in",
  konto_slettet: "Account deleted",
  admin_gitt: "Made admin",
  admin_fjernet: "Admin removed",
  kampanje_sendt: "Campaign e-mail sent",
  importert: "Imported from Convex",
} as const;

export type HendelseType = keyof typeof HENDELSE_TYPER;

export async function loggHendelse(
  type: HendelseType,
  opts: {
    aktor?: string | null;
    epost?: string | null;
    registrering?: number | null;
    summit?: string | null;
    detaljer?: Record<string, unknown>;
    logg?: Record<string, string | number | boolean | null | undefined>;
  } = {},
): Promise<void> {
  logg.info(type, { reg: opts.registrering ?? undefined, summit: opts.summit ?? undefined, ...opts.logg });
  try {
    await sql().query(
      `insert into ${SKJEMA}.hendelse (type, aktor, epost, registrering, summit, detaljer) values ($1, $2, $3, $4, $5, $6)`,
      [
        type,
        opts.aktor?.toLowerCase() ?? null,
        opts.epost?.toLowerCase() ?? null,
        opts.registrering ?? null,
        opts.summit ?? null,
        opts.detaljer ? JSON.stringify(opts.detaljer) : null,
      ],
    );
  } catch (e) {
    // The log must never stop the action itself.
    logg.error("hendelse_feilet", { type, feil: feilTekst(e) });
  }
}

export type Hendelse = {
  id: number;
  tid: string;
  type: HendelseType;
  aktor: string | null;
  epost: string | null;
  registrering: number | null;
  summit: string | null;
  detaljer: Record<string, unknown> | null;
};

export async function hentHendelser(opts: { type?: string; sok?: string; grense?: number; for?: number } = {}): Promise<Hendelse[]> {
  const vilkar: string[] = [];
  const verdier: unknown[] = [];
  if (opts.type) {
    verdier.push(opts.type);
    vilkar.push(`type = $${verdier.length}`);
  }
  if (opts.sok) {
    verdier.push(`%${opts.sok.toLowerCase()}%`);
    vilkar.push(`(aktor like $${verdier.length} or epost like $${verdier.length} or summit like $${verdier.length})`);
  }
  if (opts.for) {
    verdier.push(opts.for);
    vilkar.push(`id < $${verdier.length}`);
  }
  verdier.push(Math.min(Math.max(opts.grense ?? 200, 1), 1000));
  const r = await sql().query(
    `select id, tid, type, aktor, epost, registrering, summit, detaljer from ${SKJEMA}.hendelse
     ${vilkar.length ? "where " + vilkar.join(" and ") : ""} order by id desc limit $${verdier.length}`,
    verdier,
  );
  return r.rows.map((x) => ({
    ...x,
    id: Number(x.id),
    registrering: x.registrering === null ? null : Number(x.registrering),
    tid: new Date(x.tid).toISOString(),
  }));
}
