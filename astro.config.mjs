import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import tailwind from "@astrojs/tailwind";

import { remarkShiki } from "./lib/remark-shiki.js";

export default defineConfig({
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [
    tailwind(),
    mdx({
      remarkPlugins: [remarkShiki],
    }),
  ],
});
