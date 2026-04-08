import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(), // for Clerk sync
    imageUrl: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  cvs: defineTable({
    name: v.string(),
    storageId: v.id("_storage"),
    userId: v.string(), // tokenIdentifier
    tags: v.array(v.string()),
    role: v.optional(v.string()),
    size: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  jobs: defineTable({
    company: v.string(),
    role: v.string(),
    url: v.optional(v.string()),
    status: v.string(), // Pending, Applied, Interviewing, Offered, Rejected
    jd: v.optional(v.string()),
    notes: v.optional(v.string()),
    cvId: v.optional(v.string()), // Can be a CV ID or "custom"
    cvStorageId: v.optional(v.id("_storage")), // If it was a one-off upload
    userId: v.string(), // tokenIdentifier
  }).index("by_user", ["userId"]),
});
