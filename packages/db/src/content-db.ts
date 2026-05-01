import initSqlJs from "sql.js";
import { drizzle } from "drizzle-orm/sql-js";
import { resolve, dirname, join } from "node:path";
import { readFileSync, readdirSync, existsSync } from "node:fs";
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
  return process.cwd();
}

const ROOT = findWorkspaceRoot();
const DB_PATH = resolve(ROOT, ".local.db");
const MIGRATIONS_DIR = resolve(ROOT, "packages/db/migrations");

export async function createContentDb() {
  const SQL = await initSqlJs();

  if (!existsSync(DB_PATH)) {
    throw new Error(`DB não encontrado em ${DB_PATH}. Rode 'bun run db:generate' e 'bun run seed' primeiro.`);
  }

  const buffer = readFileSync(DB_PATH);
  const sqlDb = new SQL.Database(buffer);

  return drizzle(sqlDb, { schema });
}
