import { createLocalDb } from "@astroweb/db/local";
import { getPublishedPosts } from "@astroweb/db";

async function main() {
  console.log("Starting...");
  const db = await createLocalDb();
  console.log("DB created");
  const posts = await getPublishedPosts(db);
  console.log("Posts:", posts.length);
  posts.forEach(p => console.log(" -", p.title, p.status));
}

main().catch(e => console.error("FAILED:", e.message));
