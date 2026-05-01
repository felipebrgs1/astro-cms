export { schema, createDb } from "./client";
export type { Database } from "./client";

export type { LocalDatabase } from "./types-local";

export { posts, pages, media, settings } from "./schema";
export type { Post, Page, Media, Setting } from "./types";

export * from "./queries/posts";
export * from "./queries/pages";
export * from "./queries/settings";
