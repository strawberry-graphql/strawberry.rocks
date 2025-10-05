// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

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
      sidebar: [
        {
          label: "General",
          autogenerate: { directory: "docs/general" },
        },
        {
          label: "Types",
          autogenerate: { directory: "docs/types" },
        },
        {
          label: "Codegen",
          autogenerate: { directory: "docs/codegen" },
        },
        {
          label: "Guides",
          autogenerate: { directory: "docs/guides" },
        },
        {
          label: "Extensions",
          autogenerate: { directory: "docs/extensions" },
        },
        {
          label: "Editor integration",
          autogenerate: { directory: "docs/editors" },
        },
        {
          label: "Concepts",
          autogenerate: { directory: "docs/concepts" },
        },
        {
          label: "Integrations",
          autogenerate: { directory: "docs/integrations" },
        },
        {
          label: "Federation",
          autogenerate: { directory: "docs/federation" },
        },
        {
          label: "Operations",
          autogenerate: { directory: "docs/operations" },
        },
      ],
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
