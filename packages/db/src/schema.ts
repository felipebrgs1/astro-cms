import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  author: text("author"),
  createdAt: text("created_at").notNull().default("(datetime('now'))"),
  updatedAt: text("updated_at").notNull().default("(datetime('now'))"),
});

export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  createdAt: text("created_at").notNull().default("(datetime('now'))"),
  updatedAt: text("updated_at").notNull().default("(datetime('now'))"),
});

export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  mimeType: text("mime_type"),
  createdAt: text("created_at").notNull().default("(datetime('now'))"),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value"),
});
