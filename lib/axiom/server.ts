import axiomClient from "@/lib/axiom/axiom";
import { Logger, AxiomJSTransport, ConsoleTransport } from "@axiomhq/logging";
import type { Transport } from "@axiomhq/logging";
import { createAxiomRouteHandler, nextJsFormatters } from "@axiomhq/nextjs";

const getEnvironment = (): "localhost" | "preview" | "production" => {
  const vercel = process.env.VERCEL;
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercel) {
    if (vercelEnv === "production") return "production";
    if (vercelEnv === "preview") return "preview";
    return "localhost"; // vercel dev
  }
  if (process.env.NODE_ENV === "development") return "localhost";
  return "production";
};

const dataset =
  process.env.AXIOM_DATASET ||
  process.env.DATASET_NAME ||
  process.env.NEXT_PUBLIC_AXIOM_DATASET ||
  null;

const transports: [Transport, ...Transport[]] =
  axiomClient && dataset
    ? [new AxiomJSTransport({ axiom: axiomClient, dataset })]
    : [new ConsoleTransport({ prettyPrint: true })];

export const logger = new Logger({
  transports,
  formatters: nextJsFormatters,
  args: {
    environment: getEnvironment(),
    vercel: {
      env: process.env.VERCEL_ENV,
      url: process.env.VERCEL_URL,
      region: process.env.VERCEL_REGION,
    },
  },
});

export const withAxiom = createAxiomRouteHandler(logger);
