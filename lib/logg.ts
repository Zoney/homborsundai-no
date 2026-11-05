// Structured one-line logs to stdout. On the server they land in the journal, which
// Utkikk (utkikk.zoney.no/logger) searches. Never log ticket tokens, codes or e-mail
// addresses here: use the registration number ("nr") and the user id instead.

type Felt = Record<string, string | number | boolean | null | undefined>;

function linje(niva: "info" | "warn" | "error", hendelse: string, felt: Felt = {}) {
  const ut: Record<string, unknown> = { app: "hai", niva, hendelse };
  for (const [k, v] of Object.entries(felt)) if (v !== undefined) ut[k] = v;
  const tekst = JSON.stringify(ut);
  if (niva === "error") console.error(tekst);
  else if (niva === "warn") console.warn(tekst);
  else console.log(tekst);
}

export const logg = {
  info: (hendelse: string, felt?: Felt) => linje("info", hendelse, felt),
  warn: (hendelse: string, felt?: Felt) => linje("warn", hendelse, felt),
  error: (hendelse: string, felt?: Felt & { feil?: string }) => linje("error", hendelse, felt),
};

export function feilTekst(e: unknown): string {
  return e instanceof Error ? e.message.slice(0, 300) : String(e).slice(0, 300);
}
