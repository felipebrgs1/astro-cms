import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    runtime: {
      mode: "local",
      type: "pages",
    },
  }),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["@astroweb/db", "@astroweb/mdx", "@astroweb/ui"],
    },
  },
});
