import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import type * as schema from "./schema";

export type LocalDatabase = BaseSQLiteDatabase<"sync", any, typeof schema>;
