import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";
import { sikreSkjema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await sikreSkjema();
  return toNextJsHandler(getAuth()).GET(req);
}

export async function POST(req: Request) {
  await sikreSkjema();
  return toNextJsHandler(getAuth()).POST(req);
}
