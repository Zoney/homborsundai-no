import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_HAI_KV_REST_API_URL!,
  token: process.env.UPSTASH_HAI_KV_REST_API_TOKEN!,
});

export async function getAllRegistrations() {
  const ids = await redis.lrange('summit:registrations', 0, -1);
  if (!ids) return [];
  const regs = await Promise.all(ids.map(id => redis.get(id)));
  return regs.filter(Boolean) as any[];
}

export async function getRegistration(id: string) {
  return (await redis.get(id)) as any | null;
}

export async function updateRegistration(id: string, data: Record<string, any>) {
  const existing = await redis.get(id);
  if (!existing) return null;
  const updated = { ...(existing as any), ...data };
  await redis.set(id, updated);
  return updated;
}
