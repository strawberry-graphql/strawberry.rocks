import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import astroMetaTags from "astro-meta-tags";
import vercel from "@astrojs/vercel/serverless";
import mdx from "@astrojs/mdx";
import remarkComment from "remark-comment";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "never",
  output: "server",
  site: "https://strawberry.rocks",
  integrations: [
    sitemap(),
    astroMetaTags(),
    expressiveCode({
      themes: ["dark-plus"],
      useStyleReset: false,
      styleOverrides: {
        codeFontSize: "1em",
        borderRadius: "16px",
        frames: {
          shadowColor: "transparent",
        },
      },
    }),
    mdx({
      remarkPlugins: [remarkComment],
    }),
  ],
  apter: vercel({
    includeFiles: [
      "./social-cards/version-background.png",
      "./social-cards/background.png",
      "./public/fonts/Satoshi-Bold.otf",
      "./public/fonts/Ranade-Bold.otf",
      "./public/fonts/JetBrainsMono-Regular.ttf",
    ],
  }),
  te: {
    r: {
      external: ["@resvg/resvg-js"],
    },
    timizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
