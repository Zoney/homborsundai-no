import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Only import firebase admin helper on the server when needed
let firebaseDb: any | null = null;
async function getFirebaseDb() {
  if (firebaseDb) return firebaseDb;
  try {
    const mod = await import("@/lib/firebaseAdmin");
    firebaseDb = mod.db;
    return firebaseDb;
  } catch (err) {
    console.warn("Firebase not configured or failed to load; skipping migration.", err);
    return null;
  }
}

const MIGRATION_KEY = "firebase_to_convex_v1";
let started = false;

export async function ensureFirebaseToConvexMigration() {
  if (started) return;
  started = true;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.warn("NEXT_PUBLIC_CONVEX_URL not set; skipping migration.");
    return;
  }
  const client = new ConvexHttpClient(convexUrl);

  try {
    const already = (await client.query(api.migrations.hasMigrated, { key: MIGRATION_KEY })) as boolean;
    if (already) return;

    const db = await getFirebaseDb();
    if (!db) return;

    const snapshot = await db.collection("summitRegistrations").get();
    let migrated = 0;
    if (!snapshot.empty) {
      for (const doc of snapshot.docs) {
        const data = doc.data();
        // Ensure required fields exist
        const registration = {
          id: data.id ?? doc.id,
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          comment: data.comment ?? "",
          summit: data.summit ?? "unknown",
          timestamp: data.timestamp ?? new Date().toISOString(),
          ip: data.ip ?? "unknown",
          userAgent: data.userAgent ?? "unknown",
        } as const;
        await client.mutation(api.registrations.create, registration as any);
        migrated += 1;
      }
    }

    await client.mutation(api.migrations.markDone, { key: MIGRATION_KEY, count: migrated });
    console.log(`Migration '${MIGRATION_KEY}' completed. Migrated ${migrated} registrations.`);
  } catch (err) {
    console.error("Migration error:", err);
    // Do not throw — avoid blocking app start.
  }
}

