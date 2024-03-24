import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import astroMetaTags from "astro-meta-tags";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "never",
  output: "server",
  site: "https://strawberry.rocks",
  integrations: [sitemap(), astroMetaTags()],
  adapter: vercel({
    isr: {
      // caches all pages on first request and saves for 10 minutes
      expiration: 60 * 60 * 10,
      exclude: ["/docs/pr"],
    },
    includeFiles: [
      "./social-cards/version-background.png",
      "./social-cards/background.png",
      "./public/fonts/Satoshi-Bold.otf",
      "./public/fonts/Ranade-Bold.otf",
      "./public/fonts/JetBrainsMono-Regular.ttf",
    ],
  }),
  vite: {
    ssr: {
      external: ["@resvg/resvg-js"],
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
