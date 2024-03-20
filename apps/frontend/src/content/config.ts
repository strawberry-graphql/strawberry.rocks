import { z, defineCollection } from "astro:content";

const docs = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
  }),
});

export const collections = { docs };
