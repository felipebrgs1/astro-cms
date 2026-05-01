import { createLocalDb } from "./src/local";
import { createPost, getPublishedPosts } from "./src/queries/posts";
import { readFileSync, existsSync, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const db = await createLocalDb();
console.log("created");

await createPost(db, {
  title: "X", slug: "x", content: "# X", status: "published",
});

const posts = await getPublishedPosts(db);
console.log("posts after:", posts.length);

// Check file
const selfDir = dirname(fileURLToPath(import.meta.url));
let dir = selfDir;
let root = "";
for (let i = 0; i < 10; i++) {
  const p = resolve(dir, "package.json");
  if (existsSync(p)) {
    const pkg = JSON.parse(readFileSync(p, "utf-8"));
    if (pkg.workspaces) { root = dir; break; }
  }
  const pp = dirname(dir);
  if (pp === dir) break;
  dir = pp;
}
const dbPath = resolve(root, ".local.db");
console.log("DB file:", dbPath, "exists:", existsSync(dbPath));

import initSqlJs from "sql.js";
const SQL2 = await initSqlJs();
const db2 = new SQL2.Database(readFileSync(dbPath));
const r = db2.exec("SELECT COUNT(*) as c FROM posts");
console.log("Raw count:", JSON.stringify(r?.[0]?.values));
