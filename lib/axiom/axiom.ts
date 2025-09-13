import { Axiom } from "@axiomhq/js";

// Prefer server-side env vars; fall back to NEXT_PUBLIC for flexibility in non-proxy setups.
export const getAxiomClient = (): Axiom | null => {
  const token =
    process.env.AXIOM_API_TOKEN ||
    process.env.API_TOKEN ||
    process.env.NEXT_PUBLIC_AXIOM_TOKEN;

  if (!token) return null;

  const domain = process.env.AXIOM_DOMAIN;
  const url = domain
    ? domain.startsWith("http")
      ? domain
      : `https://${domain}`
    : undefined;

  return new Axiom({ token, url });
};

const axiomClient = getAxiomClient();
export default axiomClient;
