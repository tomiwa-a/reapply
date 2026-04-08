import { mutation, query } from "./_generated/server";

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication");
    }

    // Check if we already have this user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      // If we do, check if any details changed
      if (user.name !== identity.name || user.email !== identity.email || user.imageUrl !== identity.pictureUrl) {
        await ctx.db.patch(user._id, {
          name: identity.name ?? "Anonymous",
          email: identity.email ?? "no-email@clerk.user",
          imageUrl: identity.pictureUrl,
        });
      }
      return user._id;
    }

    // If we don't, create a new user
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      email: identity.email ?? "no-email@clerk.user",
      tokenIdentifier: identity.tokenIdentifier,
      imageUrl: identity.pictureUrl,
    });
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
  },
});
