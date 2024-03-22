import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import astroMetaTags from "astro-meta-tags";
import vercel from "@astrojs/vercel/serverless";

import sentry from "@sentry/astro";
import { captureConsoleIntegration } from "@sentry/integrations";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "never",
  output: "server",
  site: "https://strawberry.rocks",
  integrations: [
    sitemap(),
    astroMetaTags(),
    sentry({
      integrations: [captureConsoleIntegration()],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      dsn: "https://0018fa3f24b795d1bdf9d79f014db518@o4504582464208896.ingest.us.sentry.io/4506706724388864",
      sourceMapsUploadOptions: {
        project: "strawberryrocks",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
    mdx(),
  ],
  adapter: vercel({
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
