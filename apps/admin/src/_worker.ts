import type { ExecutionContext, ScheduledEvent } from "@cloudflare/workers-types";

interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
}

const PAGES_DEPLOY_HOOK = "https://api.cloudflare.com/client/v4/pages/webhooks/YOUR_DEPLOY_HOOK";

async function triggerRebuild(env: Env): Promise<void> {
  console.log("Cron: triggering site rebuild");

  if (env.CLOUDFLARE_API_TOKEN && env.CLOUDFLARE_ACCOUNT_ID) {
    try {
      const response = await fetch(PAGES_DEPLOY_HOOK, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Rebuild triggered:", response.status);
    } catch (e) {
      console.error("Rebuild failed:", e);
    }
  } else {
    console.log(
      "Configure CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID env vars to enable auto-rebuild"
    );
  }
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
    console.log("Cron: weekly rebuild check");
    await triggerRebuild(env);
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const { default: handler } = await import(
      "@astrojs/cloudflare/entrypoints/server"
    );
    return handler.fetch(request, env, ctx);
  },
};
