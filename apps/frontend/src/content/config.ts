import { z, defineCollection } from "astro:content";

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

export const collections = { events };
