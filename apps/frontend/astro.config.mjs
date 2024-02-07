import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import astroMetaTags from "astro-meta-tags";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
  output: "server",
  site: "https://strawberry.rocks",
  integrations: [sitemap(), astroMetaTags()],
  adapter: vercel({
    includeFiles: ["./social-cards/version-background.png", "./social-cards/background.png"],
  }),
  vite: {
    ssr: {
      external: ['@resvg/resvg-js']
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"]
    }
  }
});
