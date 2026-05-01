---
import { renderMdx } from "@astroweb/mdx";

if (Astro.request.method !== "POST") {
  return new Response("Method not allowed", { status: 405 });
}

const body = await Astro.request.json();
const { content } = body;

if (!content || typeof content !== "string") {
  return new Response(JSON.stringify({ error: "Content is required" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

const html = await renderMdx(content);

return new Response(JSON.stringify({ html }), {
  headers: { "Content-Type": "application/json" },
});
