import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const REGISTRATIONS_COLLECTION = 'summitRegistrations';

// Define a type for the registration data
export interface RegistrationData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  comment?: string;
  summit: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  [key: string]: any; // Allow other fields
}

export async function getAllRegistrations(): Promise<RegistrationData[]> {
  const rows = await convex.query(api.registrations.getAll, {});
  return rows as unknown as RegistrationData[];
}

export async function getRegistrationsForSummit(summit: string): Promise<RegistrationData[]> {
  const rows = await convex.query(api.registrations.getForSummit, { summit });
  return rows as unknown as RegistrationData[];
}

export async function getRegistration(id: string): Promise<RegistrationData | null> {
  const row = await convex.query(api.registrations.getById, { id });
  return (row as unknown as RegistrationData) ?? null;
}

export async function updateRegistration(id: string, data: Partial<RegistrationData>): Promise<RegistrationData | null | undefined> {
  const updated = await convex.mutation(api.registrations.update, { id, data });
  return (updated as unknown as RegistrationData) ?? null;
}

export async function deleteRegistration(id: string): Promise<void> {
  await convex.mutation(api.registrations.remove, { id });
}

export async function createRegistration(data: RegistrationData): Promise<string> {
  const id = await convex.mutation(api.registrations.create, data);
  return id as string;
}

export async function countRegistrations(): Promise<number> {
  const count = await convex.query(api.registrations.count, {});
  return count as number;
}
