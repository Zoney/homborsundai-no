import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("summitRegistrations").collect();
  },
});

export const getForSummit = query({
  args: { summit: v.string() },
  handler: async (ctx, { summit }) => {
    return await ctx
      .db
      .query("summitRegistrations")
      .withIndex("by_summit", (q) => q.eq("summit", summit))
      .collect();
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const doc = await ctx
      .db
      .query("summitRegistrations")
      .withIndex("by_external_id", (q) => q.eq("id", id))
      .first();
    return doc ?? null;
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("summitRegistrations").collect();
    return all.length;
  },
});

export const create = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    comment: v.optional(v.string()),
    summit: v.string(),
    timestamp: v.string(),
    ip: v.string(),
    userAgent: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx
      .db
      .query("summitRegistrations")
      .withIndex("by_external_id", (q) => q.eq("id", args.id))
      .first();
    if (existing) {
      return existing.id;
    }
    await ctx.db.insert("summitRegistrations", args);
    return args.id;
  },
});

export const update = mutation({
  args: {
    id: v.string(),
    data: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      comment: v.optional(v.string()),
      summit: v.optional(v.string()),
      timestamp: v.optional(v.string()),
      ip: v.optional(v.string()),
      userAgent: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { id, data }) => {
    const doc = await ctx
      .db
      .query("summitRegistrations")
      .withIndex("by_external_id", (q) => q.eq("id", id))
      .first();
    if (!doc) return null;
    await ctx.db.patch(doc._id, data);
    const updated = await ctx.db.get(doc._id);
    return updated;
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const doc = await ctx
      .db
      .query("summitRegistrations")
      .withIndex("by_external_id", (q) => q.eq("id", id))
      .first();
    if (!doc) return false;
    await ctx.db.delete(doc._id);
    return true;
  },
});
