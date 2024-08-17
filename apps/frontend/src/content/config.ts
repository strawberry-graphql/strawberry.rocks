import { fetchDocPage } from "../utils/fetch-doc-page";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import type { Loader } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const docs = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});

const events = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      event: z.object({
        name: z.string(),
        image: image(),
        location: z.string(),
      }),
      date: z.date(),
      speakers: z.array(z.object({ name: z.string(), link: z.string() })),
      link: z.string(),
    }),
});

function gitHubPageLoader(): Loader {
  return {
    name: "GitHubPageLoader",
    load: async ({ settings, store }) => {
      const pages = ["CHANGELOG.md"];

      // @ts-ignore
      const processor = await createMarkdownProcessor(settings.config.markdown);

      store.clear();

      for (const page of pages) {
        const pageData = await fetchDocPage({ filename: page });

        const result = await processor.render(pageData.content, {
          frontmatter: {},
        });

        store.set({
          id: page,
          rendered: { html: result.code },
          data: {},
        });
      }
    },
  };
}

const pages = defineCollection({
  loader: gitHubPageLoader(),
});

export const collections = { events, docs, pages };
