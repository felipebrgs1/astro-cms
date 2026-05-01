import { eq, desc, and } from "drizzle-orm";
import { pages } from "../schema";
import type { Database } from "../client";
import type { LocalDatabase } from "../types-local";

type Db = Database | LocalDatabase;

export async function getPublishedPages(db: Db) {
  return db
    .select()
    .from(pages)
    .where(eq(pages.status, "published"))
    .orderBy(desc(pages.createdAt));
}

export async function getPageBySlug(db: Db, slug: string) {
  return db
    .select()
    .from(pages)
    .where(and(eq(pages.slug, slug), eq(pages.status, "published")))
    .get();
}

export async function getAllPages(db: Db) {
  return db.select().from(pages).orderBy(desc(pages.updatedAt));
}

export async function getPageById(db: Db, id: number) {
  return db.select().from(pages).where(eq(pages.id, id)).get();
}

export async function createPage(
  db: Db,
  data: typeof pages.$inferInsert
) {
  return db.insert(pages).values(data).returning().get();
}

export async function updatePage(
  db: Db,
  id: number,
  data: Partial<typeof pages.$inferInsert>
) {
  return db
    .update(pages)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(pages.id, id))
    .returning()
    .get();
}

export async function deletePage(db: Db, id: number) {
  return db.delete(pages).where(eq(pages.id, id));
}
