import { getDb } from "../../lib/db";
import { setSetting } from "@astroweb/db";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (Astro) => {
  const runtime = Astro.locals.runtime;
  const db = await getDb(runtime);

  await setSetting(db, "needs_rebuild", "true");
  await setSetting(db, "last_publish_request", new Date().toISOString());

  return new Response(JSON.stringify({ ok: true, message: "Rebuild scheduled" }), {
    headers: { "Content-Type": "application/json" },
  });
};
