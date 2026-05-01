import type { D1Database } from "@cloudflare/workers-types";
import { createDb, createLocalDb } from "@astroweb/db";

export async function getDb(runtime?: { env: { DB: D1Database } }) {
  if (!import.meta.env.DEV && runtime?.env?.DB) {
    return createDb(runtime.env.DB);
  }
  return await createLocalDb();
}
