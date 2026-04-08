import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveCv = mutation({
  args: {
    name: v.string(),
    storageId: v.id("_storage"),
    tags: v.array(v.string()),
    role: v.optional(v.string()),
    size: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("cvs", {
      name: args.name,
      storageId: args.storageId,
      userId: identity.tokenIdentifier,
      tags: args.tags,
      role: args.role,
      size: args.size,
    });
  },
});

export const listCvs = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const cvs = await ctx.db
      .query("cvs")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();

    return await Promise.all(
      cvs.map(async (cv) => ({
        ...cv,
        url: await ctx.storage.getUrl(cv.storageId),
      }))
    );
  },
});

export const getCvUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const removeCv = mutation({
  args: { id: v.id("cvs"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
    await ctx.storage.delete(args.storageId);
  },
});
