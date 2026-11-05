// E-mail from Homborsund AI: tickets, login codes and the admins' campaign mails.
// No third party: the app signs the mail itself (DKIM) and hands it to a unix socket
// on the app server, where our own Postfix sends it on. The app has no network, so
// this is the only way out. Without EPOST_SOCKET the mail is written to the log
// instead (local development).

import { readFileSync } from "node:fs";
import net from "node:net";
import nodemailer from "nodemailer";
import { logg } from "./logg";

const SOCKET = process.env.EPOST_SOCKET;
const FRA = {
  name: process.env.EPOST_NAVN ?? "Homborsund AI",
  address: process.env.EPOST_FRA ?? "summit@post.homborsundai.no",
};

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;

function lagTransport() {
  const nokkel = process.env.DKIM_NOKKEL;
  return nodemailer.createTransport({
    host: "localhost",
    port: 25,
    name: "relay.zoney.no",
    // The socket is local on the server, and Postfix encrypts onwards to the recipient.
    ignoreTLS: true,
    dkim:
      nokkel && process.env.DKIM_DOMENE && process.env.DKIM_VELGER
        ? { domainName: process.env.DKIM_DOMENE, keySelector: process.env.DKIM_VELGER, privateKey: readFileSync(nokkel, "utf8") }
        : undefined,
    getSocket: (_opts, ferdig) => {
      const s = net.connect(SOCKET!);
      s.once("connect", () => ferdig(null, { connection: s }));
      s.once("error", (e) => ferdig(e));
    },
  });
}

export type Epost = { til: string; emne: string; tekst: string; html?: string; type: string };

export async function sendEpost({ til, emne, tekst, html, type }: Epost): Promise<void> {
  if (!SOCKET) {
    console.log(`[epost ikke sendt, EPOST_SOCKET mangler] til=${til} emne=${emne}\n${tekst}${html ? `\n--- html ---\n${html}` : ""}`);
    logg.info("epost_logget", { type });
    return;
  }
  transport ??= lagTransport();
  await transport.sendMail({ from: FRA, to: til, subject: emne, text: tekst, html });
  logg.info("epost_sendt", { type });
}
