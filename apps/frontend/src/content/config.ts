import { z, defineCollection } from "astro:content";

const docs = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
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

export const collections = { events, docs };
