import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import type { D1Database } from "@cloudflare/workers-types";
import * as schema from "./schema";

export type Database = ReturnType<typeof drizzleD1<typeof schema>>;

export function createDb(d1: D1Database): Database {
  return drizzleD1(d1, { schema });
}

export { schema };
