import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
  output: "hybrid",
  site: "https://strawberry.rocks",
  integrations: [sitemap()],
  adapter: vercel()
});