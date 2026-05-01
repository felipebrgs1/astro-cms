import initSqlJs, { type Database as SqlJsDatabase } from "sql.js";
import { drizzle } from "drizzle-orm/sql-js";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import * as schema from "./schema";

export type LocalDatabase = ReturnType<typeof drizzle<typeof schema, SqlJsDatabase>>;

let localDb: LocalDatabase | null = null;

const TABLES_SQL = `
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  author TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  mime_type TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
`;

async function initDb(): Promise<SqlJsDatabase> {
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  db.run(TABLES_SQL);
  return db;
}

async function loadDb(path: string): Promise<SqlJsDatabase> {
  const SQL = await initSqlJs();
  const buffer = readFileSync(path);
  const db = new SQL.Database(buffer);
  db.run(TABLES_SQL);
  return db;
}

function saveDb(sqlDb: SqlJsDatabase, path: string) {
  const data = sqlDb.export();
  writeFileSync(path, Buffer.from(data));
}

export async function createLocalDb(dbPath?: string): Promise<LocalDatabase> {
  if (localDb) return localDb;

  const path = dbPath ?? ".local.db";

  let sqlDb: SqlJsDatabase;
  if (existsSync(path)) {
    sqlDb = await loadDb(path);
  } else {
    sqlDb = await initDb();
  }

  const db = drizzle(sqlDb, { schema });

  // Auto-save on writes by patching run()
  const origRun = sqlDb.run.bind(sqlDb);
  sqlDb.run = function (sql: string, ...args: any[]) {
    const result = origRun(sql, ...args);
    saveDb(sqlDb, path);
    return result;
  };

  localDb = db;
  return db;
}
