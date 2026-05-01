import { renderMdx } from "@astroweb/mdx";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
  const body = await context.request.json();
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
};
