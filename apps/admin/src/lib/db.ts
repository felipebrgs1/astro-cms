import type { D1Database } from "@cloudflare/workers-types";
import { createDb } from "@astroweb/db";
import { createLocalDb } from "@astroweb/db/local";

export async function getDb(runtime?: { env: { DB: D1Database } }) {
  if (!import.meta.env.DEV && runtime?.env?.DB) {
    return createDb(runtime.env.DB);
  }
  return await createLocalDb();
}
