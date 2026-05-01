import { createLocalDb } from "./src/local";
import { createPost, getPublishedPosts } from "./src/queries/posts";

const db = await createLocalDb();

await createPost(db, {
  title: "Teste",
  slug: "teste",
  content: "# Hello",
  status: "published",
});

const posts = await getPublishedPosts(db);
console.log("After insert, posts:", posts.length);
posts.forEach(p => console.log(" -", p.title, p.status));
// Check save
import { readFileSync, existsSync, resolve } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const selfDir = dirname(fileURLToPath(import.meta.url));
let dir = selfDir;
let root = "";
for (let i = 0; i < 10; i++) {
  const pkgPath = resolve(dir, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    if (pkg.workspaces) { root = dir; break; }
  }
  const parent = dirname(dir);
  if (parent === dir) break;
  dir = parent;
}
const dbPath = resolve(root, ".local.db");
console.log("DB_PATH:", dbPath);
console.log("File exists:", existsSync(dbPath));
console.log("File size:", existsSync(dbPath) ? readFileSync(dbPath).length : 0);
