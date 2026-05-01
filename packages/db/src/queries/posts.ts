import { eq, desc, and } from "drizzle-orm";
import { posts } from "../schema";
import type { Database } from "../client";
import type { LocalDatabase } from "../types-local";

type Db = Database | LocalDatabase;

export async function getPublishedPosts(db: Db) {
  return db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.createdAt));
}

export async function getPostBySlug(db: Db, slug: string) {
  return db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .get();
}

export async function getAllPosts(db: Db) {
  return db.select().from(posts).orderBy(desc(posts.updatedAt));
}

export async function getPostById(db: Db, id: number) {
  return db.select().from(posts).where(eq(posts.id, id)).get();
}

export async function createPost(
  db: Db,
  data: typeof posts.$inferInsert
) {
  return db.insert(posts).values(data).returning().get();
}

export async function updatePost(
  db: Db,
  id: number,
  data: Partial<typeof posts.$inferInsert>
) {
  return db
    .update(posts)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(posts.id, id))
    .returning()
    .get();
}

export async function deletePost(db: Db, id: number) {
  return db.delete(posts).where(eq(posts.id, id));
}

export async function publishPost(db: Db, id: number) {
  return db
    .update(posts)
    .set({ status: "published", updatedAt: new Date().toISOString() })
    .where(eq(posts.id, id))
    .returning()
    .get();
}

export async function unpublishPost(db: Db, id: number) {
  return db
    .update(posts)
    .set({ status: "draft", updatedAt: new Date().toISOString() })
    .where(eq(posts.id, id))
    .returning()
    .get();
}
