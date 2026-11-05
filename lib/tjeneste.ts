// Server-to-server: Øyvind's Mac calls the app with a client certificate via
// https://relay.zoney.no/hai/… (husken: workshop/apper/README.md → «Server-til-server»).
// Caddy sets X-Klient ("CN=<name>") only there, after checking the certificate, and strips
// it from every other request, so it cannot be forged from outside. Without it the routes
// answer 404, so they do not exist on the app's ordinary address.

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logg } from "./logg";

/** The client's name, or a finished response (404 without certificate, 403 for other clients). */
export async function krevKlient(lov: string[]): Promise<string | NextResponse> {
  const k = (await headers()).get("x-klient")?.match(/^CN=([a-z0-9-]+)$/)?.[1];
  if (!k) return new NextResponse("Not found", { status: 404 });
  if (!lov.includes(k)) {
    logg.warn("tjeneste_nektet", { klient: k });
    return NextResponse.json({ error: "No access" }, { status: 403 });
  }
  return k;
}
