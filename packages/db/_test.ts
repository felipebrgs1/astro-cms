import { createLocalDb } from "./src/local";
import { getPublishedPosts } from "./src/queries/posts";

const db = await createLocalDb();
const posts = await getPublishedPosts(db);
console.log("Posts:", posts.length);
posts.forEach(p => console.log(" -", p.title, p.status));
