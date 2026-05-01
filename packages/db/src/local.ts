import initSqlJs, { type Database as SqlJsDatabase } from "sql.js";
import { drizzle } from "drizzle-orm/sql-js";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as schema from "./schema";

function findWorkspaceRoot(): string {
  const selfDir = dirname(fileURLToPath(import.meta.url));
  let dir = selfDir;
  for (let i = 0; i < 10; i++) {
    const pkgPath = resolve(dir, "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      if (pkg.workspaces) return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  dir = process.cwd();
  for (let i = 0; i < 10; i++) {
    const pkgPath = resolve(dir, "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      if (pkg.workspaces) return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

const ROOT = findWorkspaceRoot();
const DB_PATH = resolve(ROOT, ".local.db");
const MIGRATIONS_DIR = resolve(ROOT, "packages/db/migrations");

export type LocalDatabase = ReturnType<typeof drizzle<typeof schema, SqlJsDatabase>>;

let SQL: Awaited<ReturnType<typeof initSqlJs>> | null = null;
let localDb: LocalDatabase | null = null;
let sqlJsDb: SqlJsDatabase | null = null;

async function getSQL() {
  if (!SQL) SQL = await initSqlJs();
  return SQL;
}

function saveDb() {
  if (!sqlJsDb) return;
  writeFileSync(DB_PATH, Buffer.from(sqlJsDb.export()));
}

function applyMigrations(db: SqlJsDatabase) {
  db.run(
    "CREATE TABLE IF NOT EXISTS __drizzle_migrations (name TEXT PRIMARY KEY, applied_at TEXT)"
  );

  if (!existsSync(MIGRATIONS_DIR)) return;

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const applied = db.exec(
      `SELECT name FROM __drizzle_migrations WHERE name = '${file}'`
    );
    if (applied.length > 0) continue;

    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");
    const statements = sql.split("--> statement-breakpoint");

    for (const stmt of statements) {
      const trimmed = stmt.trim();
      if (trimmed) db.run(trimmed);
    }

    db.run("INSERT INTO __drizzle_migrations (name, applied_at) VALUES (?, ?)", [
      file,
      new Date().toISOString(),
    ]);
  }
}

export async function createLocalDb(): Promise<LocalDatabase> {
  if (localDb) return localDb;

  const sql = await getSQL();

  if (existsSync(DB_PATH)) {
    sqlJsDb = new sql.Database(readFileSync(DB_PATH));
  } else {
    sqlJsDb = new sql.Database();
  }

  applyMigrations(sqlJsDb);
  saveDb();

  // Patch prepare() to auto-save on write queries
  const origPrepare = sqlJsDb.prepare.bind(sqlJsDb);
  sqlJsDb.prepare = function (...args: any[]) {
    const stmt = origPrepare(...args);
    const origStmtRun = stmt.run.bind(stmt);
    stmt.run = function (...runArgs: any[]) {
      const result = origStmtRun(...runArgs);
      const isWrite =
        typeof args[0] === "string" &&
        /^(INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|PRAGMA)/i.test(
          args[0].trim()
        );
      if (isWrite) saveDb();
      return result;
    };
    return stmt;
  };

  const db = drizzle(sqlJsDb, { schema });
  localDb = db;
  return db;
}
