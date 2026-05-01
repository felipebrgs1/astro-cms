import type { InferSelectModel } from "drizzle-orm";
import { posts, pages, media, settings } from "./schema";

export type Post = InferSelectModel<typeof posts>;
export type Page = InferSelectModel<typeof pages>;
export type Media = InferSelectModel<typeof media>;
export type Setting = InferSelectModel<typeof settings>;
