// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { sidebar } from "./sidebar.config.js";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Strawberry GraphQL",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/strawberry-graphql/strawberry",
        },
      ],
      sidebar,
      components: {
        // Override Starlight components here
        // Example: Header: './src/components/overrides/Header.astro',
      },
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
