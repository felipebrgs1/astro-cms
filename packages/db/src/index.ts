export { schema, createDb, createLocalDb } from "./client";
export type { Database, LocalDatabase } from "./client";

export { posts, pages, media, settings } from "./schema";
export type { Post, Page, Media, Setting } from "./types";

export * from "./queries/posts";
export * from "./queries/pages";
export * from "./queries/settings";
