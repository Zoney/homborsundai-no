#!/usr/bin/env node
// The move from Convex to our app server at Hetzner (November 2026). Runs on the Mac.
//
// Reads the Convex export (`npx convex export`, unzipped into ~/.husk/flytting/hai/convex/)
// and sends every summit signup to the app: POST /api/tjeneste/import { registrations }.
// The app stores them with their old id as the ticket token, so ticket links and QR codes
// from before the move keep working. Idempotent on that id: running it again adds nothing.
//
//   node scripts/flytt-import.mjs --mal hetzner     to https://relay.zoney.no/hai/…, with the
//                                                   client certificate ~/.husk/klient/macen.{key,crt}
//   node scripts/flytt-import.mjs --mal lokal       to http://localhost:3520 (npm run dev), with
//                                                   X-Klient set by hand (no Caddy locally)
//   … --url <address>                               another local address
//   … --tørt                                        only show what would be sent
//
// Prints counts only, never names or addresses.
import fs from 'node:fs';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (navn) => {
  const i = args.indexOf(navn);
  return i >= 0 ? args[i + 1] : undefined;
};
const mal = opt('--mal');
if (mal !== 'hetzner' && mal !== 'lokal') {
  console.error('bruk: flytt-import.mjs --mal hetzner|lokal [--url <adresse>] [--tørt]');
  process.exit(2);
}
const DIR = process.env.HAI_FLYTT_DIR || path.join(os.homedir(), '.husk', 'flytting', 'hai', 'convex');
const RELAY = process.env.HAI_RELAY || 'relay.zoney.no';
const KLIENT_DIR = path.join(os.homedir(), '.husk', 'klient');
const tort = args.includes('--tørt') || args.includes('--tort');

// ---------- the export ----------
const fil = path.join(DIR, 'summitRegistrations', 'documents.jsonl');
if (!fs.existsSync(fil)) {
  console.error(`fant ikke ${fil}: pakk ut convex-export.zip dit først`);
  process.exit(1);
}
const rader = fs
  .readFileSync(fil, 'utf8')
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l));
const registrations = rader.map((r) => ({
  id: r.id,
  name: r.name,
  email: r.email,
  phone: r.phone,
  comment: r.comment,
  summit: r.summit,
  timestamp: r.timestamp,
  ip: r.ip,
  userAgent: r.userAgent,
  _creationTime: r._creationTime,
}));
const mangler = registrations.filter((r) => !r.id || !r.name || !r.summit).length;
const perSummit = {};
for (const r of registrations) perSummit[r.summit] = (perSummit[r.summit] ?? 0) + 1;
const ider = new Set(registrations.map((r) => r.id));

console.log(`eksporten: ${registrations.length} påmeldinger, ${ider.size} unike id-er, ${mangler} uten id/navn/summit`);
console.log(`per summit: ${Object.entries(perSummit).map(([k, v]) => `${k} ${v}`).join(', ')}`);
// The other Convex table ("migrations") only records the old Firestore move; nothing to bring.
if (mangler) {
  console.error('stopper: noen påmeldinger mangler id, navn eller summit');
  process.exit(1);
}
if (tort) {
  console.log(`tørt: ville sendt ${registrations.length} påmeldinger til ${mal}, ingenting sendt`);
  process.exit(0);
}

// ---------- sending ----------
function sendHetzner(kropp) {
  return new Promise((ok, feil) => {
    const req = https.request(
      {
        host: RELAY,
        path: '/hai/api/tjeneste/import',
        method: 'POST',
        key: fs.readFileSync(path.join(KLIENT_DIR, 'macen.key')),
        cert: fs.readFileSync(path.join(KLIENT_DIR, 'macen.crt')),
        headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(kropp) },
        timeout: 60_000,
      },
      (res) => {
        let tekst = '';
        res.setEncoding('utf8');
        res.on('data', (d) => (tekst += d));
        res.on('end', () => ok({ status: res.statusCode, tekst }));
      },
    );
    req.on('timeout', () => req.destroy(new Error('tidsavbrudd')));
    req.on('error', feil);
    req.end(kropp);
  });
}

async function sendLokal(kropp) {
  const url = (opt('--url') || 'http://localhost:3520').replace(/\/+$/, '');
  const host = new URL(url).hostname;
  if (!['localhost', '127.0.0.1', '::1'].includes(host)) throw new Error('--mal lokal går bare mot localhost');
  // No Caddy locally, so the header is set here. On the server only Caddy sets it.
  const r = await fetch(`${url}/api/tjeneste/import`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-klient': 'CN=macen' },
    body: kropp,
  });
  return { status: r.status, tekst: await r.text() };
}

const kropp = JSON.stringify({ registrations });
const r = mal === 'hetzner' ? await sendHetzner(kropp) : await sendLokal(kropp);
if (r.status !== 200) {
  console.error(`feil: ${r.status} ${r.tekst.slice(0, 200)}`);
  process.exit(1);
}
const svar = JSON.parse(r.tekst);
console.log(`sendt ${svar.received}: ${svar.inserted} nye, ${svar.existed} fantes fra før`);
