import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  summitRegistrations: defineTable({
    id: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    comment: v.optional(v.string()),
    summit: v.string(),
    timestamp: v.string(),
    ip: v.string(),
    userAgent: v.string(),
  })
    .index("by_external_id", ["id"]) // query by external registration id
    .index("by_summit", ["summit"]), // query by summit code

  migrations: defineTable({
    key: v.string(),
    doneAt: v.string(),
    count: v.optional(v.number()),
  }).index("by_key", ["key"]),
});
