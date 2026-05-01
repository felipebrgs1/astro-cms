import type { D1Database } from "@cloudflare/workers-types";
import { createDb, createLocalDb } from "@astroweb/db";

export function getDb(runtime?: { env: { DB: D1Database } }) {
  if (runtime?.env?.DB) {
    return createDb(runtime.env.DB);
  }
  return createLocalDb();
}
