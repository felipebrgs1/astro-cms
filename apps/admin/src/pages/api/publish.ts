---
import { getDb } from "../../lib/db";
import { setSetting } from "@astroweb/db";

if (Astro.request.method !== "POST") {
  return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}

const runtime = Astro.locals.runtime;
const db = getDb(runtime);

await setSetting(db, "needs_rebuild", "true");
await setSetting(db, "last_publish_request", new Date().toISOString());

return new Response(JSON.stringify({ ok: true, message: "Rebuild scheduled" }), {
  headers: { "Content-Type": "application/json" },
});
