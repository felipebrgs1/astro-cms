import { eq } from "drizzle-orm";
import { settings } from "../schema";
import type { Database } from "../client";
import type { LocalDatabase } from "../local";

type Db = Database | LocalDatabase;

export async function getSetting(db: Db, key: string) {
  return db.select().from(settings).where(eq(settings.key, key)).get();
}

export async function setSetting(db: Db, key: string, value: string) {
  return db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value },
    })
    .returning()
    .get();
}

export async function getAllSettings(db: Db) {
  return db.select().from(settings);
}
