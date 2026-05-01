import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleSqlite, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import type { D1Database } from "@cloudflare/workers-types";
import * as schema from "./schema";

export type Database = ReturnType<typeof drizzleD1<typeof schema>>;
export type LocalDatabase = BetterSQLite3Database<typeof schema>;

let localDb: LocalDatabase | null = null;

export function createDb(d1: D1Database): Database {
  return drizzleD1(d1, { schema });
}

export function createLocalDb(dbPath?: string): LocalDatabase {
  if (!localDb) {
    const sqlite = new Database(dbPath ?? ".local.db");
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    localDb = drizzleSqlite(sqlite, { schema });
  }
  return localDb;
}

export { schema };
