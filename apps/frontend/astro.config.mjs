// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightUtils from "@lorenzo_lewis/starlight-utils";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightUtils({
          multiSidebar: {
            switcherStyle: "dropdown",
          },
        }),
      ],
      title: "Strawberry GraphQL",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/strawberry-graphql/strawberry",
        },
      ],
      sidebar: [
        {
          label: "🍓 Strawberry",
          autogenerate: { directory: "strawberry" },
        },
        {
          label: "🦄 Strawberry Django",
          autogenerate: { directory: "django" },
        },
      ],
      components: {
        // Header: './src/components/Header.astro',
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
