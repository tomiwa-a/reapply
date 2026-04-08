import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createJob = mutation({
  args: {
    company: v.string(),
    role: v.string(),
    status: v.string(),
    url: v.optional(v.string()),
    jd: v.optional(v.string()),
    notes: v.optional(v.string()),
    cvId: v.optional(v.string()),
    cvStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("jobs", {
      ...args,
      userId: identity.tokenIdentifier,
    });
  },
});

export const updateJob = mutation({
  args: {
    id: v.id("jobs"),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    status: v.optional(v.string()),
    url: v.optional(v.string()),
    jd: v.optional(v.string()),
    notes: v.optional(v.string()),
    cvId: v.optional(v.string()),
    cvStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const { id, ...rest } = args;
    const existing = await ctx.db.get(id);
    if (!existing || existing.userId !== identity.tokenIdentifier) {
      throw new Error("Job not found or access denied");
    }

    return await ctx.db.patch(id, rest);
  },
});

export const listJobs = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("jobs")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();
  },
});

export const removeJob = mutation({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== identity.tokenIdentifier) {
      throw new Error("Job not found or access denied");
    }

    await ctx.db.delete(args.id);
  },
});
