import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const hasMigrated = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const rec = await ctx
      .db
      .query("migrations")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    return !!rec;
  },
});

export const markDone = mutation({
  args: { key: v.string(), count: v.optional(v.number()) },
  handler: async (ctx, { key, count }) => {
    const existing = await ctx
      .db
      .query("migrations")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    if (existing) return true;
    await ctx.db.insert("migrations", {
      key,
      doneAt: new Date().toISOString(),
      count,
    });
    return true;
  },
});

