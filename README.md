# homborsundai.no

The Homborsund AI site: summit pages, notes, signups with ticket e-mails and QR codes,
optional accounts for attendees, and an admin area for the organisers.

Since November 2026 it runs on **our own app server at Hetzner** (Caddy, Postgres, our own
Postfix), set up and deployed from the husken repo (`workshop/apper/`, slug `hai`). Before
that it ran on Vercel with Convex, next-auth/Google, Resend, Axiom and Turnstile; all of
those are gone. `vercel.json` stops Vercel from building.

## Stack

- Next.js (`output: 'standalone'`), Node 20, **npm** (`npm ci && npm run build`).
- **Postgres** via `DATABASE_URL` (schema `app` when `HAI_MILJO=production`, else `dev`).
  Tables are created by the app (`lib/db.ts`): `registrering` (signups), `admin`,
  `hendelse` (activity log), plus Better Auth's tables.
- **Better Auth** (`lib/auth.ts`, lazy init): e-mail code + passkey. Who may log in:
  everyone who has signed up (with that address) and admins. No Google, no passwords.
- **Admins:** everyone `@homborsundai.no` automatically; `HAI_SUPERADMIN` (comma list) can
  add and remove other admins at `/admin/admins`.
- **Mail** (`lib/epost.ts`): nodemailer over the unix socket `EPOST_SOCKET` to our Postfix,
  DKIM-signed by the app (`DKIM_DOMENE`, `DKIM_VELGER`, `DKIM_NOKKEL`), from
  `summit@post.homborsundai.no` (`EPOST_FRA`). Without `EPOST_SOCKET` mails are logged.
- **No outbound network at runtime.** No Turnstile: the signup form uses a honeypot, a
  minimum time on the form, a same-origin check and an in-memory rate limit per IP.
  The OpenStreetMap venue map loads only after a click.
- **Logs:** one JSON line per event on stdout (`lib/logg.ts`), searched in Utkikk. Never
  tokens, codes or e-mail addresses there; the activity log table (admins only) has the
  details, without IP addresses, and is pruned after 24 months.

## Flows

- **Signup** `POST /api/summit/register` (only summits with `status: 'Upcoming'` in
  `lib/summit-config.ts`). E-mail is required: everyone gets the ticket e-mail with the
  link `/ticket/<token>`. The token is 192 random bits; old Convex ids
  (`registration:<time>:<random>`) are kept as tokens, so old links and QR codes work.
  Same address twice for the same summit = the ticket is sent again, nothing is shown.
- **Ticket page** `/ticket/<token>`: QR code (the token), cancel / sign up again. No account.
- **My tickets** `/my-tickets` (login at `/login`): all signups for the address, passkeys,
  log out, «Delete my account» (optionally with all signups).
- **Admin** `/admin`: counts, registrations (edit, cancel, check in, delete), check-in with
  the camera scanner (`/admin/verify`), activity log, campaign e-mails, admins.
- **Slack** `/api/slack/commands` exists only when `SLACK_SIGNING_SECRET` is set (Slack calls
  us; no outbound call). Off by default: it would send signups to Slack (USA), so the
  privacy page must be updated before turning it on. The old signup webhook is replaced by
  optional e-mails to `HAI_VARSLE`.
- **Server-to-server** `/api/tjeneste/*`: only via `https://relay.zoney.no/hai/…` with a
  client certificate (`X-Klient`, set by Caddy); 404 elsewhere.

## Local development

```bash
npm ci
npm run db:dev        # PGlite on 127.0.0.1:5437 (keeps data in .pglite/)
cp .env.example .env.local   # fill BETTER_AUTH_SECRET with any random string
npm run dev           # http://localhost:3520
```

Login codes and ticket e-mails are printed in the dev server log. `@example.com` addresses
may always log in locally.

## The move from Convex (November 2026)

All data in Convex prod (50 signups; the Firestore and Upstash generations are already in
there or gone) is moved with `scripts/flytt-import.mjs`, idempotent on the ticket id:

```bash
node scripts/flytt-import.mjs --mal hetzner --tørt   # counts only, nothing sent
node scripts/flytt-import.mjs --mal hetzner          # via relay with ~/.husk/klient/macen.*
```

It reads the unzipped `npx convex export` in `~/.husk/flytting/hai/convex/` and prints counts only.

## Deploy

Push to `main`, then on Workshop: `workshop/apper/apper.sh deploy hai` (husken repo). Never
`vercel --prod`.

## Content

See `AGENTS.md` (summit pages, notes, SEO) and `SUMMIT_ARCHITECTURE.md`. Public copy rules:
never seat counts or «fullt hver gang», never children as examples, no audience activity
on computers (only the blackboard).
