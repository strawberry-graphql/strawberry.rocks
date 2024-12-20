import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import astroMetaTags from "astro-meta-tags";
import vercel from "@astrojs/vercel/serverless";
import mdx from "@astrojs/mdx";
import remarkComment from "remark-comment";
import expressiveCode from "astro-expressive-code";
import remarkGithubAlerts from "remark-github-alerts";
import { mermaid } from "./src/utils/plugins/mermaid";

// https://astro.build/config
export default defineConfig({
  experimental: { contentLayer: true },
  trailingSlash: "never",
  output: "hybrid",
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
        codePaddingBlock: "20px",
        frames: {
          shadowColor: "transparent",
        },
      },
    }),
    mdx({
      remarkPlugins: [remarkComment, remarkGithubAlerts, mermaid],
    }),
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
});
