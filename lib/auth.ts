// Login lives in the app: Better Auth with its tables in the app's own Postgres.
// Two ways to log in: a code by e-mail, and a passkey (Face ID, Touch ID, Windows Hello)
// once you have made one. Accounts are optional: the ticket link in the e-mail works
// without one. Who may log in: everyone who has signed up for a summit (with that
// e-mail address) and the admins (see lib/tilgang.ts). No Google, no passwords.
//
// Initialised lazily, so `next build` works without BETTER_AUTH_SECRET or a database.

import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { passkey } from "@better-auth/passkey";
import { sendEpost } from "./epost";
import { sql } from "./db";
import { kanLoggeInn } from "./tilgang";
import { loggHendelse } from "./hendelser";
import { feilTekst, logg } from "./logg";

export const URL_APP = (process.env.BETTER_AUTH_URL ?? "http://localhost:3520").replace(/\/+$/, "");

function lag() {
  const vert = new URL(URL_APP).hostname;
  return betterAuth({
    appName: "Homborsund AI",
    baseURL: URL_APP,
    secret: process.env.BETTER_AUTH_SECRET,
    database: sql(),
    trustedOrigins: [URL_APP],
    session: { expiresIn: 60 * 60 * 24 * 60, updateAge: 60 * 60 * 24 },
    rateLimit: { enabled: true, storage: "database", window: 60, max: 30, customRules: { "/get-session": false } },
    advanced: {
      // Own cookie name: on localhost cookies are shared across ports, and other apps use Better Auth too.
      cookiePrefix: "hai",
      ipAddress: { ipAddressHeaders: ["x-forwarded-for"] },
      useSecureCookies: URL_APP.startsWith("https://"),
    },
    databaseHooks: {
      user: {
        create: {
          before: async (u) => {
            if (!(await kanLoggeInn(u.email))) return false;
            return { data: { ...u, email: u.email.toLowerCase(), name: u.name || u.email.split("@")[0] } };
          },
          after: async (u) => {
            await loggHendelse("konto_opprettet", { aktor: u.email, epost: u.email, logg: { bruker: u.id } });
          },
        },
      },
      session: {
        create: {
          after: async (s) => {
            const r = await sql().query(`select email from "user" where id = $1`, [s.userId]);
            const epost = r.rows[0]?.email as string | undefined;
            await loggHendelse("innlogget", { aktor: epost, epost, logg: { bruker: s.userId } });
          },
        },
      },
    },
    plugins: [
      emailOTP({
        otpLength: 6,
        expiresIn: 10 * 60,
        allowedAttempts: 5,
        async sendVerificationOTP({ email, otp, type }) {
          if (type !== "sign-in") return;
          // No code to addresses that have not signed up (and no message saying so,
          // so nobody can use the form to find out who has signed up).
          if (!(await kanLoggeInn(email))) {
            logg.info("kode_ikke_sendt", { grunn: "ukjent_adresse" });
            return;
          }
          void sendEpost({
            type: "kode",
            til: email,
            emne: `Your Homborsund AI login code: ${otp}`,
            tekst: `Your code is ${otp}\n\nType it on homborsundai.no to log in. It is valid for ten minutes.\n\nIf you did not ask for a code, you can ignore this e-mail.\n\n${URL_APP}/my-tickets\n\n(This e-mail was sent automatically. Replies do not reach anyone.)`,
          }).catch((e) => logg.error("kode_feilet", { feil: feilTekst(e) }));
        },
      }),
      passkey({ rpID: vert, rpName: "Homborsund AI", origin: URL_APP }),
      nextCookies(),
    ],
  });
}

let instans: ReturnType<typeof lag> | null = null;
export function getAuth() {
  instans ??= lag();
  return instans;
}

/** Creates or updates the login tables in the app's schema. */
export async function migrer() {
  const { runMigrations } = await getMigrations(getAuth().options);
  await runMigrations();
}
