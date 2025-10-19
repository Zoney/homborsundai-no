import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

let convexClient: ConvexHttpClient | null = null;

export function getConvexClient(): ConvexHttpClient {
  const deploymentUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!deploymentUrl) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_URL is not set. See README.md for Convex configuration instructions."
    );
  }

  if (!convexClient) {
    convexClient = new ConvexHttpClient(deploymentUrl);
  }

  return convexClient;
}

// Define a type for the registration data
export interface RegistrationData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  comment?: string;
  summit: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  [key: string]: any; // Allow other fields
}

export async function getAllRegistrations(): Promise<RegistrationData[]> {
  const convex = getConvexClient();
  const rows = await convex.query(api.registrations.getAll, {});
  return rows as unknown as RegistrationData[];
}

export async function getRegistrationsForSummit(summit: string): Promise<RegistrationData[]> {
  const convex = getConvexClient();
  const rows = await convex.query(api.registrations.getForSummit, { summit });
  return rows as unknown as RegistrationData[];
}

export async function getRegistration(id: string): Promise<RegistrationData | null> {
  const convex = getConvexClient();
  const row = await convex.query(api.registrations.getById, { id });
  return (row as unknown as RegistrationData) ?? null;
}

export async function updateRegistration(id: string, data: Partial<RegistrationData>): Promise<RegistrationData | null | undefined> {
  const convex = getConvexClient();
  const updated = await convex.mutation(api.registrations.update, { id, data });
  return (updated as unknown as RegistrationData) ?? null;
}

export async function deleteRegistration(id: string): Promise<void> {
  const convex = getConvexClient();
  await convex.mutation(api.registrations.remove, { id });
}

export async function createRegistration(data: RegistrationData): Promise<string> {
  const convex = getConvexClient();
  const id = await convex.mutation(api.registrations.create, data);
  return id as string;
}

export async function countRegistrations(): Promise<number> {
  const convex = getConvexClient();
  const count = await convex.query(api.registrations.count, {});
  return count as number;
}
